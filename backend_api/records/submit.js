let permission = require("../../common/permission");
let denied = require("../../common/denied");
let badrequest = require("../../common/badrequest");
let success = require("../../common/success");
let db = require("../../database/conn");
let error = require("../../common/error");

module.exports = (req, res) => {
  permission(req.query.session, 0)
    .then(() => {
      if (req.query.pid && req.query.code)
        db.query(
          `INSERT INTO records VALUES(NULL,${db.escape(req.query.pid)},(SELECT user FROM sessions WHERE session=${db.escape(req.query.session)}),${db.escape(req.query.code)},-1,0,'J');`,
          (err, data) => {
            if (err) {
              console.log(err);
              return error(res);
            }
            else {
              return success(res,{'rid':data.insertId});
            }
          }
        );
      else
        return badrequest(res);
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        return error(res);
      } else return denied(res);
    });
};
