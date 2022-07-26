let permission = require("../../common/permission");
let denied = require("../../common/denied");
let badrequest = require("../../common/badrequest");
let success = require("../../common/success");
let db = require("../../database/conn");
let notfound = require("../../common/notfound");
let error = require("../../common/error");

module.exports = (req, res) => {
  permission(req.query.session, 0)
    .then((level) => {
      if (req.query.rid && req.query.status) {
        db.query(
          `UPDATE records SET judgeinfo = ${db.escape(req.query.status)},judgestat=1 WHERE id=${db.escape(req.query.rid)}`,
          (err, data) => {
            if (err) {
              console.log(err);
              return error(res);
            } else return success(res);
          }
        );
      } else return badrequest(res);
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        return error(res);
      } else return denied(res);
    });
};
