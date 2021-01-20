// reset.js - Initialize database for local testing and development
// Allows us to import credentials from the .env file
const dotenv = require("dotenv")
dotenv.config()

const mysql = require("promise-mysql")
const fs = require("fs")
const { argv } = require("process")
const { connect } = require("http2")

mysql
	.createConnection({
		multipleStatements: true,
		host: process.env.DB_ADDRESS,
		user: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		port: 3306,
	})
	.then((con) => {
		console.log("Connected!")
		if (argv.length === 2 || argv[2] === "reset") {
			console.log("Resetting database state...")
			fs.readFile("database/tuples.sql", "utf8", (err, data) => {
				if (err) throw err

				data = data.replace(/\r?\n|\r/g, "")
				con.query(data, (err, result) => {
					if (err) throw err

					console.log("Success!")
					con.destroy()
				})
			})
		} else if (argv[2] === "clear") {
			console.log("Clearing database...")
			fs.readFile("database/clear.sql", "utf8", (err, data) => {
				if (err) throw err

				data = data.replace(/\r?\n|\r/g, "")
				con.query(data, (err, result) => {
					if (err) throw err

					console.log("Success!")
					con.destroy()
				})
			})
		}
	})
