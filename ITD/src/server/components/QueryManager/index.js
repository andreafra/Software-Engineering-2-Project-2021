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
			await callback()
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
			)
		},

		globalEnd: async () => {
			await mysqlConnection.end()
		},
	}
}
