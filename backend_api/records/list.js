let permission = require("../../common/permission");
let denied = require("../../common/denied");
let badrequest = require("../../common/badrequest");
let success = require("../../common/success");
let db = require("../../database/conn");
let notfound = require("../../common/notfound");
let error = require("../../common/error");

module.exports = (req, res) => {
  permission(req.query.session, 0)
    .then(() => {
      if (req.query.page == undefined) {
        req.query.page = 1;
      }
      if (req.query.limit == undefined || req.query.limit > 20) {
        req.query.limit = 20;
      }

      var skipNum =
        (Number(req.query["page"]) - 1) * Number(req.query["limit"]);
      if (req.query.pid == undefined) {
        sql =
          'SELECT id"rid",(SELECT username FROM users WHERE id=user)"username", (SELECT color FROM users WHERE id=user)"usercol", (SELECT tag FROM users WHERE id=user)"usertag", problem, judgeinfo FROM records LIMIT ' +
          Number(skipNum) +
          "," +
          Number(req.query["limit"]) +
          ";";
      } else {
        sql =
          'SELECT id"rid",(SELECT username FROM users WHERE id=user)"username", (SELECT color FROM users WHERE id=user)"usercol", (SELECT tag FROM users WHERE id=user)"usertag", problem, judgeinfo FROM records WHERE problem=' +
          db.escape(req.query.pid) +
          " LIMIT " +
          Number(skipNum) +
          "," +
          Number(req.query["limit"]) +
          ";";
      }
      db.query(sql, (err, data) => {
        if (err) {
          console.log(err);
          return error(res);
        } else {
          return success(res, data);
        }
      });
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        return error(res);
      } else {
        return denied(res);
      }
    });
};
