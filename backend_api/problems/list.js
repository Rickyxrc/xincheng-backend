var db = require("../../database/conn");
var permission = require("../../common/permission");
var denied = require("../../common/denied");
var error = require("../../common/error");
var success = require("../../common/success");

module.exports = (req, res) => {
  if (req.query.data == undefined) req.query.data = "";
  if (req.query.limit == undefined || req.query.limit > 50) req.query.limit = 50;
  if (req.query.page == undefined) req.query.page = 1;
  permission(req.query["session"], 1)
    .then((level) => {
      sql =
        "SELECT pid,title,difficulty,active FROM problems WHERE title LIKE '%" +
        db.escape(req.query.data) +
        "%' LIMIT " +
        db.escape(req.query.limit) +
        ";";
      if (req.query.data == undefined) req.query.data = "";
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
        //该程序依托于这个注释运行，千万不要删！
        db.query("SELECT pid,title,difficulty,active FROM problems WHERE active=1 AND (title LIKE '%" +
          req.query.data +
          "%') LIMIT " + db.escape(Number(req.query.limit)) +
          " OFFSET "+db.escape(Number(req.query.page))+";"
          , (err, data) => {
          if (err) {
            console.log(err);
            return error(res);
        }
          return success(res, data);
        });
      }).catch( () => {
        return denied(res);
      })
    });
};
