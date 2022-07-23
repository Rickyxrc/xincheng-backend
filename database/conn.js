let mysql = require("mysql");
let getenv = require("../common/getenv");

var db = mysql.createPool({
  host: getenv("MYSQL_HOST", true, ""),
  port: getenv("MYSQL_PORT", false, "3306"),
  user: getenv("MYSQL_USER", true, ""),
  password: getenv("MYSQL_PASSWORD", false, ""),
  database: getenv("MYSQL_DATABASE", true, ""),
});

module.exports = db;
