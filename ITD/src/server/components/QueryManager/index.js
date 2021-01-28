const dotenv = require("dotenv")
dotenv.config()

const mysql = require("promise-mysql")
const fs = require("fs")
const uuid = require("uuid")

var mysqlConnection

exports.getQueryInterface = async () => {
	if (mysqlConnection === undefined) {
		mysqlConnection = await mysql.createConnection({
			multipleStatements: true,
			host: process.env.DB_ADDRESS,
			user: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
		})
	}

	return {
		executeAndRollback: async (callback) => {
			await mysqlConnection.beginTransaction()
			try {
				await callback()
			} catch (err) {
				await mysqlConnection.rollback()
				throw err
			}
			await mysqlConnection.rollback()
		},

		checkIfPhoneNumberIsPresent: async (phoneNum) => {
			return (
				(
					await mysqlConnection.query(
						"select count(*) as count from user where id = ?",
						phoneNum
					)
				)[0].count === 1
			)
		},

		createUser: async (phoneNum, name, surname) => {
			return await mysqlConnection.query(
				"insert into user (id, name, surname) values (?,?,?)",
				[phoneNum, name, surname]
			)
		},

		createUserToken: async (phoneNum) => {
			await mysqlConnection.query(
				"delete from token where user_id = ?",
				phoneNum
			)

			const userToken = uuid.v4()

			await mysqlConnection.query(
				"insert into token (user_id, token, end_timestamp) values (?, ?, TIMESTAMP('2025-01-01'))",
				[phoneNum, userToken]
			)

			return userToken
		},

		validateToken: async (token) => {
			const res = await mysqlConnection.query(
				"select id from token where token = ?",
				token
			)

			if (res.length === 0) {
				throw "Token not found"
			}

			return res[0].id
		},

		getQueueData: async (storeID) => {
			return await mysqlConnection.query(
				"select count(*) as count from ticket where type = 'queue' and status = 'valid' and store_id = ?",
				storeID
			)[0].count
		},

		getStoreFillLevel: async (storeID) => {
			return await mysqlConnection.query(
				"select max_capacity, curr_number from store where id = ?",
				storeID
			)[0]
		},

		getStoreNextReservations: async (storeID) => {
			const d = new Date()
			return await mysqlConnection.query(
				"select sum(max_people_allowed) as sum from reservation where store_id = ? and weekday = ? and start_time >= getdate() and start_time <= dateadd(HOUR, 2, getdate())",
				[storeID, d.getDay()]
			)[0].sum
		},

		getReservationData: async (storeID) => {
			return await mysqlConnection.query("")
		},

		addUserToQueue: async (userID, storeID) => {
			return (
				await mysqlConnection.query(
					"insert into ticket (type, status, creation_date, store_id, user_id) values ('queue', 'valid', CURDATE(), ?, ?); select last_insert_id() as id;",
					[storeID, userID]
				)
			)[1][0].id
		},

		createStore: async (name, address, capacity) => {
			return (
				await mysqlConnection.query(
					"insert into store (name, address, max_capacity) values (?, ?, ?); select last_insert_id() as id;",
					[name, address, capacity]
				)
			)[1][0].id
		},

		addVerificationCode: async (phoneNum, code) => {
			await mysqlConnection.query(
				"insert into verification_code values (?, ?)",
				[phoneNum, code]
			)
		},

		checkVerificationCode: async (phoneNum, code) => {
			let res = await mysqlConnection.query(
				"select count(*) as count from verification_code where number = ? and code = ?",
				[phoneNum, code]
			)

			res = res[0].count > 0

			if (res) {
				await mysqlConnection.query(
					"delete from verification_code where number = ? and code = ?",
					[phoneNum, code]
				)
			}

			return res
		},

		getStoreIds: async (lat, long, range) => {
			return await mysqlConnection.query(
				"select * from store where latitude between ? and ? and longitude between ? and ?",
				[lat - range, lat + range, long - range, long + range]
			)
		},

		joinQueue: async (storeID, customerID) => {
			return await mysqlConnection.query(
				"insert into ticket (type, status, creation_date, store_id, user_id) values (queue, valid, CURDATE(), ?, ?); select last_insert_id() as id;",
				[storeID, customerID]
			)[1][0].id
		},

		getFirstQueueTicket: async (storeID) => {
			return await mysqlConnection.query(
				"select count(*) as count from ticket as t where t.type = 'queue' and t.store_id = ? and t.status = 'valid' order by creation_date asc limit 1",
				[storeID]
			)
		},

		cancelTicket: async (storeID, ticketID, userID) => {
			return await mysqlConnection.query(
				"alter table ticket set status = 'cancelled' where status = 'valid' and id = ? and store_id = ? and user_id = ?",
				[ticketID, storeID, userID]
			)
		},

		createUserReservation: async (storeId, reservationId, userId) => {
			return await mysqlConnection.query(
				"insert into ticket (type, status, creation_date, store_id, user_id, reservation_id) values (reservation, valid, CURDATE(), ?, ?, ?); select last_insert_id() as id;",
				[storeId, userId, reservationId]
			)[1][0].id
		},

		globalEnd: async () => {
			const toEnd = mysqlConnection
			mysqlConnection = null
			await toEnd.end()
		},
	}
}
