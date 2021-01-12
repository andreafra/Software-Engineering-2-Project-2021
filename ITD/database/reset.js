const mysql = require('mysql');
const fs = require('fs');

const con = mysql.createConnection({
  multipleStatements: true,
  host: "localhost",
  user: "clup_admin",
  password: "password",
  database: "db_clup"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  console.log("Starting insertions...");
  fs.readFile("database/tuples.sql", "utf8", (err, data) => {
    if (err) throw err;

    data = data.replace(/\r?\n|\r/g, '');
    con.query(data, (err, result) => {
      if (err) throw err;

      console.log("Database successfully populated!");

      con.destroy();
    })
  })
});