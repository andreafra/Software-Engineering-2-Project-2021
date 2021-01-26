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
				"remove from token where user_id = ?",
				phoneNum
			)

			const userToken = uuid.v4()

			await mysqlConnection.query(
				"insert into token (user_id, token, timestamp) values (?, ?, 2038-01-19 03:14:07)",
				[phoneNum, userToken]
			)

			return userToken
		},

		validateToken: async (token) => {
			return await mysqlConnection.query(
				"select id from token where token = ?",
				token
			)[0].id
		},

		getQueueData: async (storeID) => {
			return await mysqlConnection.query(
				"select count(*) as count from ticket where type = 'queue' and status = 'valid' and store_id = ?",
				storeID
			)[0].count
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

		globalEnd: async () => {
			const toEnd = mysqlConnection
			mysqlConnection = null
			await toEnd.end()
		},
	}
}
