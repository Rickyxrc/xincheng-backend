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
      if (req.query.rid) {
        db.query(
          `SELECT problem,user,(SELECT username FROM users WHERE id=user)"username",(SELECT color FROM users WHERE id=user)"usercol",(SELECT tag FROM users WHERE id=user)"usertag",code,judgestat,judgeinfo FROM records WHERE id=${db.escape(
            req.query.rid
          )};`,
          (err, data) => {
            if (err) {
              console.log(err);
              return error(res);
            } else {
              db.query(
                `SELECT user FROM sessions WHERE session=${db.escape(
                  req.query.session
                )}`,
                (err, data_tmp) => {
                  db.query(
                    `SELECT permission FROM users WHERE id=${db.escape(
                      data_tmp[0].user
                    )}`,
                    (err, data_tmpp) => {
                      if (err) {
                        console.log(err);
                        return error(res);
                      } else {
                        // console.log(data);
                        // console.log(data_tmp);
                        // console.log(data_tmpp);
                        if (
                          data_tmpp[0].permission == 2 ||
                          data[0].user == data_tmp[0].user
                        )
                          if (data != []) return success(res, data);
                          else return notfound(res);
                        else return denied(res);
                      }
                    }
                  );
                }
              );
            }
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
