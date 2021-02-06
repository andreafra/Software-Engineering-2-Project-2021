const dotenv = require("dotenv")
dotenv.config()

const mysql = require("promise-mysql")
const uuid = require("uuid")

/**
 * Query Manageris a component that handles the interactions with the database,
 * acting as a mediator betweenthe business and data layer.  It sends to and
 * retrieves data from the database exposing a limited and higherlevel set of
 * functionalities compared to a database query language.
 *
 * @module QueryManager
 */

var mysqlConnection

/**
 * Call this method to obtain the only instance of QueryManager.
 * QueryManager handles the connection with the database.
 * @returns {object} containing the methods
 */
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
		/**
		 * This method is intended to be used mostly for testing.
		 * It allows to perform a series of database operations,
		 * passed in the callback, and then rolls back any change.
		 *
		 * @param {Function} callback
		 */
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

		/**
		 * This method takes as an input the phone numberof the user (phoneNum)
		 * and contacts the database to check if the phone number is already
		 * present in the system.
		 *
		 * @param {string} phoneNum
		 * @returns {boolean} whether the phoneNum is present
		 */
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

		/**
		 * This method takes as an input the phone number (phoneNum) of the
		 * user to be created and adds it to the database.
		 *
		 * @param {string} phoneNum the user's phone number
		 * @param {string} name the user's name
		 * @param {string} surname the user's surname
		 */
		createUser: async (phoneNum, name, surname) => {
			await mysqlConnection.query(
				"insert into user (id, name, surname) values (?,?,?)",
				[phoneNum, name, surname]
			)
		},

		/**
		 * This method takes as an input the phone number (phoneNum) of the
		 * user that is trying to login into the system and it generates the
		 * token associated with itssession. Saving those information in the
		 * database.
		 *
		 * @param {string} phoneNum
		 * @returns the authentication token
		 */
		createUserToken: async (phoneNum) => {
			await mysqlConnection.query(
				"delete from token where user_id = ?",
				phoneNum
			)

			let userToken = uuid.v4()

			// checks if already exists
			while (
				(
					await mysqlConnection.query(
						"select count(*) as count from token where token = ?",
						[userToken]
					)
				)[0].count > 0
			) {
				userToken = uuid.v4()
			}

			await mysqlConnection.query(
				"insert into token (user_id, token, end_timestamp) values (?, ?, TIMESTAMP('2025-01-01'))",
				[phoneNum, userToken]
			)

			return userToken
		},

		/**
		 * This method takes as an input the token passed by the user in every
		 * request and checks if it is valid and corresponds to an active
		 * session, if it's successful, return the userId if found.
		 *
		 * @param {string} token the user's authentication token
		 * @returns the userId if found
		 */
		validateToken: async (token) => {
			// console.log("Validating token: " + token)
			const res = await mysqlConnection.query(
				"select user_id from token where token = ?",
				token
			)

			if (res.length === 0) {
				throw "Token not found"
			}

			return res[0].user_id
		},

		/**
		 * This method takes as input the store identification number.
		 * TheQueryManager will acquire from the database the informations
		 * regarding the queue overall status ofthe given storeID.
		 *
		 * @param {string} storeID the id of a store
		 * @returns the number of customers present in the queue
		 */
		getQueueData: async (storeID) => {
			let customersInQueue = (
				await mysqlConnection.query(
					"select count(*) as count from ticket where type = 'queue' and status = 'valid' and store_id = ?",
					storeID
				)
			)[0].count

			// STUB
			// duration of the average visit in seconds
			let averageVisitTime = 30 * 60

			return {
				queueLength: customersInQueue,
				// TODO: Calculate wait time
				queueWaitTime: customersInQueue * averageVisitTime,
			}
		},

		/**
		 * This method returns the maximum capacity of a store and the current
		 * number of people inside it.
		 *
		 * @param {string} storeID
		 * @returns max_capacity, curr_number
		 */
		getStoreFillLevel: async (storeID) => {
			return (
				await mysqlConnection.query(
					"select max_capacity, curr_number from store where id = ?",
					storeID
				)
			)[0]
		},

		/**
		 * Returns the number of possible reservation remaining in the next
		 * specified hours from the moment this method is called.
		 *
		 * For example, if you call this method with `hours = 2`, you'll get
		 * the number of reservations available in the next two hours.
		 *
		 * @param {string} storeID
		 * @param {number} hours the time span
		 * @returns the number of
		 */
		getStoreNextReservations: async (storeID, hours) => {
			const currentDate = new Date()
			return (
				await mysqlConnection.query(
					"select sum(max_people_allowed) as sum from reservation where store_id = ? and weekday = ? and start_time >= ? and start_time <= DATE_ADD(?, INTERVAL ? HOUR)",
					[
						storeID,
						currentDate.getDay(),
						currentDate,
						currentDate,
						hours,
					]
				)
			)[0].sum
		},

		/**
		 * This method takes as input the store id.
		 * The QueryManager will acquire from the database the informations
		 * regarding the reservation overall status of the given storeID.
		 *
		 * @param {string} storeID
		 * @returns
		 */
		getReservationData: async (storeID) => {
			return await mysqlConnection.query(
				"select r.id, r.weekday, r.start_time, r.max_people_allowed, (select count(*) from ticket as t where t.reservation_id = r.id) as count from reservation as r where r.is_active = TRUE and r.store_id = ?",
				[storeID]
			)
		},

		/**
		 * This method takes as input the id of the user and
		 * the store. It adds those values to the dedicated
		 * table in the database. Returns the receiptId.
		 *
		 * @param {string} userID
		 * @param {*} storeID
		 * @returns {number} storeId
		 */
		addUserToQueue: async (userID, storeID) => {
			const res = await mysqlConnection.query(
				"insert into ticket (type, status, creation_date, store_id, user_id) values ('queue', 'valid', ?, ?, ?); select last_insert_id() as id;",
				[new Date(), storeID, userID]
			)

			return res[1][0].id
		},

		/**
		 * This method creates a new store entry in the database
		 * and returns its id.
		 *
		 * @param {string} name
		 * @param {string} address
		 * @param {number} capacity the initial maximum capacity of the store
		 * @param {number} latitude
		 * @param {number} longitude
		 *
		 * @returns the id of the store
		 */
		createStore: async (name, address, capacity, latitude, longitude) => {
			return (
				await mysqlConnection.query(
					"insert into store (name, address, max_capacity, latitude, longitude, curr_number) values (?, ?, ?, ?, ?, 0); select last_insert_id() as id;",
					[name, address, capacity, latitude, longitude]
				)
			)[1][0].id
		},

		createReservationSlot: async (
			storeId,
			weekday,
			startTime,
			maxPeopleAllowed
		) => {
			return (
				await mysqlConnection.query(
					"insert into reservation (weekday, start_time, max_people_allowed, is_active, store_id) values (?, ?, ?, TRUE, ?); select last_insert_id() as id;",
					[weekday, startTime, maxPeopleAllowed, storeId]
				)
			)[1][0].id
		},

		/**
		 * This method adds a verification code associated to a user to
		 * the database.
		 *
		 * @param {string} phoneNum
		 * @param {code} code
		 */
		addVerificationCode: async (phoneNum, code) => {
			await mysqlConnection.query(
				"delete from verification_code where number = ?",
				[phoneNum]
			)
			await mysqlConnection.query(
				"insert into verification_code values (?, ?)",
				[phoneNum, code]
			)
		},

		/**
		 * Check whether a verification code is present for a user phone number
		 * in the database. If it's present, it removes such code from the
		 * database.
		 *
		 * @param {string} phoneNum
		 * @param {string} code
		 * @returns {boolean}
		 */
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

		/**
		 * Get stores inside a range from a certain location
		 * @param {number} lat
		 * @param {number} long
		 * @param {number} range
		 * @returns a list of stores
		 */
		getStoresInRange: async (lat, long, range) => {
			return await mysqlConnection.query(
				"select * from store where latitude between ? and ? and longitude between ? and ?",
				[lat - range, lat + range, long - range, long + range]
			)
		},

		/**
		 * This method retrieves from the database the first queue ticket of a
		 * given store.
		 *
		 * @param {string} storeID
		 * @returns the first ticket
		 */
		getFirstQueueTicket: async (storeID) => {
			return (
				await mysqlConnection.query(
					"select * from ticket as t where t.type = 'queue' and t.store_id = ? and t.status = 'valid' order by creation_date asc limit 1",
					[storeID]
				)
			)[0]
		},

		/**
		 * This method marks a ticket as cancelled.
		 *
		 * @param {string} storeID
		 * @param {string} ticketID
		 * @param {string} userID
		 * @returns
		 */
		cancelTicket: async (storeID, ticketID, userID) => {
			await mysqlConnection.query(
				"update ticket set status = 'cancelled' where status = 'valid' and id = ? and store_id = ? and user_id = ?",
				[ticketID, storeID, userID]
			)
		},

		/**
		 * This method takes as input the identificaton number of the user,
		 * the store and the selected timeslotId.
		 * It adds those values to the dedicated table in the database.
		 *
		 * @param {string} storeId
		 * @param {string} reservationId
		 * @param {string} userId
		 * @returns the `receiptId`
		 */
		createUserReservation: async (
			storeId,
			reservationId,
			userId,
			resDay
		) => {
			const num_tickets = (
				await mysqlConnection.query(
					"select count(*) as count from ticket where status = 'valid' and type = 'reservation' and reservation_id = ?",
					[reservationId]
				)
			)[0].count

			const max_tickets = (
				await mysqlConnection.query(
					"select max_people_allowed from reservation where id = ?",
					[reservationId]
				)
			)[0].max_people_allowed

			if (num_tickets < max_tickets) {
				return (
					await mysqlConnection.query(
						"insert into ticket (type, status, creation_date, store_id, user_id, reservation_id, first_timestamp) values ('reservation', 'valid', ?, ?, ?, ?, ?); select last_insert_id() as id;",
						[new Date(), storeId, userId, reservationId, resDay]
					)
				)[1][0].id
			}

			throw "Too many reservations!"
		},

		getTicket: async (ticketId) => {
			return (
				await mysqlConnection.query(
					"select * from ticket where id = ?",
					[ticketId]
				)
			)[0]
		},

		getReservation: async (reservationId) => {
			return (
				await mysqlConnection.query(
					"select * from reservation where id = ?",
					[reservationId]
				)
			)[0]
		},

		useTicket: async (storeId, ticketId) => {
			await mysqlConnection.query(
				"update ticket set status = 'used' where id = ? and store_id = ?; update store set curr_number = curr_number + 1;",
				[ticketId, storeId]
			)
		},

		getStore: async (storeId) => {
			return (
				await mysqlConnection.query(
					"select * from store where id = ?",
					[storeId]
				)
			)[0]
		},

		/**
		 * Retrives a the most recent active ticket associated with a user.
		 *
		 * @param {string} userId
		 * @returns the ticket object
		 */
		getActiveTicketFromUser: async (userId) => {
			let res = await mysqlConnection.query(
				"select * from ticket where user_id = ? and status = 'valid' order by creation_date asc limit 1",
				[userId]
			)
			return res[0]
		},

		updateFirst: async (storeId) => {
			const first = (
				await mysqlConnection.query(
					"select * from ticket as t1 where t1.type = 'queue' and t1.store_id = ? and t1.status = 'valid' order by t1.creation_date asc limit 1",
					[storeId]
				)
			)[0]

			if (first !== undefined && first.first_timestamp === null) {
				await mysqlConnection.query(
					"update ticket as t set t.first_timestamp = ? where t.id = ?",
					[new Date(), first.id]
				)
			}
		},

		clearOldTickets: async () => {
			return await mysqlConnection.query(
				"update ticket set status = 'cancelled' where type = 'queue' and first_timestamp < DATE_SUB(?, INTERVAL ? MINUTE)",
				[new Date(), 1]
			)
		},

		clearOldReservations: async () => {
			return await mysqlConnection.query(
				"update ticket set status = 'cancelled' where type = 'reservation' and first_timestamp is not null and first_timestamp < DATE_SUB(?, INTERVAL ? MINUTE)",
				[new Date(), 5]
			)
		},

		hasReservation: async (userId) => {
			let res = await mysqlConnection.query(
				"select * from ticket where user_id = ? and status = 'valid' order by creation_date asc limit 1",
				[userId]
			)
			return res[0]
		},

		getUser: async (userId) => {
			return (
				await mysqlConnection.query("select * from user where id = ?", [
					userId,
				])
			)[0]
		},

		getVerificationCode: async (userId) => {
			return (
				await mysqlConnection.query(
					"select code from verification_code where number = ?",
					[userId]
				)
			)[0].code
		},

		/**
		 * Destroy the instance of the MySQL connection in a safe way.
		 */
		globalEnd: async () => {
			const toEnd = mysqlConnection
			mysqlConnection = null
			await toEnd.end()
		},
	}
}
