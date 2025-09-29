require("dotenv").config({ path: ".env" });
const mysql = require("mysql2/promise");


const mysql_LOCAL = mysql.createPool({
  host: process.env.DB_HOST_LOCAL,
  user: process.env.DB_USER_LOCAL,
  password: process.env.DB_PASS_LOCAL,
  database: process.env.DB_NAME_LOCAL,
  waitForConnections: true,
  connectionLimit: 10,
});


module.exports = {
  mysqlCon_LOCAL: mysql_LOCAL,
};

