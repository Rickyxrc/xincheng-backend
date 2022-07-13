var db = require("../../database/conn");
var permission = require("../../common/permission");
var denied = require("../../common/denied");
var error = require("../../common/error");
var success = require("../../common/success");

module.exports = (req, res) => {
  permission(req.query["session"], 1)
    .then((level) => {
      if (req.query["data"] == undefined) req.query["data"] = "";
      req.query["data"].replace("+", "[+]");

      sql =
        "SELECT pid,title,difficulty,active FROM problems WHERE title LIKE '%" +
        req.query["data"] +
        "%';";
      if (req.query["data"] == undefined) req.query["data"] = "";
      db.query(sql, (err, data) => {
        if (err) {
          console.log(err);
          return error(res, err.message);
        }
        return success(res, data);
      });
    })
    .catch(() => {
      permission(req.query["session"], 0).then((level) => {
        if (req.query["data"] == undefined) req.query["data"] = "";
        req.query["data"].replace("+", "[+]");

        sql =
          "SELECT pid,title,difficulty,active FROM problems WHERE active=1 AND title LIKE '%" +
          req.query["data"] +
          "%';";
        if (req.query["data"] == undefined) req.query["data"] = "";
        db.query(sql, (err, data) => {
          if (err) {
            console.log(err);
            return error(res, err.message);
          }
          return success(res, data);
        });
      }).catch( () => {
        return denied(res);
      })
    });
};
