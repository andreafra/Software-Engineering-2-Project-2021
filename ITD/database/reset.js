// reset.js - Initialize database for local testing and development
// Allows us to import credentials from the .env file
const dotenv = require("dotenv")
dotenv.config()

const mysql = require("mysql")
const fs = require("fs")

const con = mysql.createConnection({
	multipleStatements: true,
	host: process.env.DB_ADDRESS,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
})

con.connect(function (err) {
	if (err) throw err
	console.log("Connected!")
	console.log("Starting insertions...")
	fs.readFile("database/tuples.sql", "utf8", (err, data) => {
		if (err) throw err

		data = data.replace(/\r?\n|\r/g, "")
		con.query(data, (err, result) => {
			if (err) throw err

			console.log("Database successfully populated!")

			con.destroy()
		})
	})
})
