const mysql = require("mysql2");

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "Pi@31416",
    database: "hotelmanagementsystem",
});

module.exports = db;
