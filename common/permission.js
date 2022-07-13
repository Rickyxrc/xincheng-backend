const db = require("../database/conn");
const unixdate = require("./unixdate");
module.exports = (session, level) => {
  return new Promise((resolve, reject) => {
    if (session == undefined) reject();
    else
      db.query(
        "SELECT (SELECT permission from users WHERE id=user)'permission' FROM sessions WHERE expries>" +
          db.escape(unixdate()) +
          " AND session=" +
          db.escape(session) +
          ";",
        (err,data) => {
          if(data.length == 0) reject();
          else if (data[0]["permission"] >= level) resolve(data[0]["permission"]);
          else reject();
        }
      );
  });
};