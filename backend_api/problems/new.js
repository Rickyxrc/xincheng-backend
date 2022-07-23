let permission = require("../../common/permission");
let denied = require("../../common/denied");
let error = require("../../common/error");
let success = require("../../common/success");
let badrequest = require("../../common/badrequest");
let db = require("../../database/conn");

module.exports = (req, res) => {
  permission(req.query.session, 1)
    .then(() => {
      if (
        req.query.title &&
        req.query.content &&
        req.query.pid &&
        req.query.difficulty
      )
        db.query(
          "REPLACE INTO problems VALUES(" +
            req.query.pid +
            "," +
            db.escape(req.query.title) +
            "," +
            db.escape(req.query.active) +
            "," +
            db.escape(req.query.content) +
            "," +
            db.escape(req.query.difficulty) +
            ");",
          (err, data) => {
            if (err) {
              console.log(err);
              return error(res);
            }
            return success(res, undefined);
          }
        );
      else return badrequest(res);
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        return error(res);
      }
      return denied(res);
    });
};
