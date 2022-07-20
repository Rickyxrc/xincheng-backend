const db = require("../../database/conn");
const badrequest = require("../../common/badrequest");
const success = require("../../common/success");
const error = require("../../common/error");
const denied = require("../../common/denied");

module.exports = (req, res) => {
  if (req.query.session) {
    db.query(
      'SELECT user from sessions WHERE session=' +
      db.escape(req.query.session) +
      ';',
      (err, data) => {
        if (err) {
          console.log(err);
          return error(res);
        }
        else if (data.length == 0) {
          return denied(res);
        }
        else {
          db.query('SELECT username,mail,permission,tag,color FROM users WHERE id=' + db.escape(data[0].user), (err, data) => {
            if (err || data.length == 0) {
              console.log(err);
              return error(res);
            }
            return success(res, data[0]);
          })
        }
      });
  } else
    return badrequest(res);
};