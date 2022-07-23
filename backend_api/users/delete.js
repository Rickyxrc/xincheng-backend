let permission = require("../../common/permission");
let denied = require("../../common/denied");
let badrequest = require("../../common/badrequest");
let success = require("../../common/success");
let db = require("../../database/conn");
let notfound = require("../../common/notfound");
let error = require("../../common/error");

module.exports = (req, res) => {
  if (req.query["username"]) {
    permission(req.query["session"], 1)
      .then(() => {
        //* 获取User的id
        var userId;
        db.query(
          "SELECT id FROM users WHERE username=" +
            db.escape(req.query["username"]) +
            ";",
          (err, data) => {
            if (err) {
              console.log(err);
              return error(err);
            } else {
              if (data != []) {
                userId = data[0].id;
                db.query(
                  "DELETE FROM sessions WHERE user=" + db.escape(userId) + ";",
                  (err, data) => {
                    if (err) {
                      console.log(err);
                      return error(err);
                    } else {
                      db.query(
                        "DELETE FROM users WHERE id=" + db.escape(userId) + ";",
                        (err, data) => {
                          if (err) {
                            console.log(err);
                            return error(err);
                          } else {
                            return success(res);
                          }
                        }
                      );
                    }
                  }
                );
              } else {
                return notfound(res);
              }
            }
          }
        );
      })
      .catch((err) => {
        if (err) {
          console.log(err);
          return error(err);
        } else {
          return denied(res);
        }
      });
  }
};
