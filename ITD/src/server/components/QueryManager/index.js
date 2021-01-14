const dotenv = require("dotenv")
dotenv.config()

const mysql = require("mysql")
const fs = require("fs")
const uuid = require("uuid")

const mysqlConection = mysql.createConnection({
	multipleStatements: true,
	host: process.env.DB_ADDRESS,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

mysqlConection.connect(function (err) {
    if (err) throw err
})

exports.close = () => mysqlConection.end((err) => { if (err) throw err })
  
exports.executeAndRollback = (callback) => {
    mysqlConection.beginTransaction((err) => {
        if (err) throw err

        callback()

        mysqlConnection.rollback();
    })
}

exports.checkIfPhoneNumberIsPresent = (phoneNum) => {
    var isPresent

    mysqlConection.query("select count(*) from user where id = ?", phoneNum, (err, result) => {
        if (err) throw err
        isPresent = result
    })

    return isPresent
}

exports.createUser = (phoneNum, name, surname) => {
    mysqlConection.query("insert into user (id, name, surname) values (?,?,?)", [phoneNum, name, surname], (err) => {
        if (err) throw err
    })
}

exports.createUserToken = (phoneNum) => {
    mysqlConection.query("remove from token where user_id = ?", phoneNum, (err) => {
        if (err) throw err
    })

    const userToken = uuid.v4()

    mysqlConection.query("insert into token (user_id, token, timestamp) values (?, ?, 2038-01-19 03:14:07)", [phoneNum, userToken], (err) => {
        if (err) throw err
    })

    return userToken
}

exports.validateToken = (token) => {
    var userId

    mysqlConection.query("select id from token where token = ?", token, (err, result) => {
        if (err) throw err
        userId = result
    })

    return userId
}