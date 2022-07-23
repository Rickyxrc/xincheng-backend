var db = require("../../database/conn");
var permission = require("../../common/permission");
var denied = require("../../common/denied");
var error = require("../../common/error");
var success = require("../../common/success");

module.exports = (req, res) => {
  if (req.query.limit == undefined || req.query.limit > 20)
    req.query.limit = 20;
  if (req.query.page == undefined) req.query.page = 1;
  permission(req.query["session"], 1)
    .then(() => {
      var skipNum =
        (Number(req.query["page"]) - 1) * Number(req.query["limit"]);

      if (db.query.data == undefined) db.query.data = "";

      sql =
        "SELECT pid,title,difficulty,active FROM problems WHERE title LIKE '%" +
        req.query.data +
        "%'" +
        " OR pid LIKE '%" +
        req.query.data +
        "%'" +
        "ORDER BY pid LIMIT " +
        Number(skipNum) +
        "," +
        Number(req.query["limit"]) +
        ";";

      db.query(sql, (err, data) => {
        if (err) {
          console.log(err);
          return error(res, err.message);
        }
        return success(res, data);
      });
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        return error(res);
      }
      permission(req.query["session"], 0)
        .then(() => {
          var skipNum =
            (Number(req.query["page"]) - 1) * Number(req.query["limit"]);

          if (req.query["data"] == undefined) req.query.data = "";

          sql =
            "SELECT pid,title,difficulty,active FROM problems WHERE (title LIKE '%" +
            req.query.data +
            "%'" +
            " OR pid LIKE '%" +
            req.query.data +
            "%'" +
            ") AND active=1 ORDER BY pid LIMIT " +
            Number(skipNum) +
            "," +
            Number(req.query["limit"]) +
            ";";
          console.log(sql);
          db.query(sql, (err, data) => {
            if (err) {
              console.log(err);
              return error(res);
            }
            return success(res, data);
          });
        })
        .catch((err) => {
          if (err) {
            console.log(err);
            return error(res);
          }
          return denied(res);
        });
    });
};
