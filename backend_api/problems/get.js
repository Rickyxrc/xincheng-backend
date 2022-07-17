let permission = require('../../common/permission');
let denied = require('../../common/denied');
let badrequest = require("../../common/badrequest");
let success = require('../../common/success');
let db = require("../../database/conn");

module.exports = (req, res) => {
    if (req.query.pid != undefined) {
      db.query(
        "SELECT active FROM problems WHERE pid=" + db.escape(req.query.pid),
        (err, data) => {
          var nperms;
          if (data[0].active)
            nperms = 0;
          else
            nperms = 1;
          permission(req.query.session, nperms)
            .then((level) => {
              db.query("SELECT title,context,difficulty FROM problems WHERE pid=" +
                db.escape(req.query.pid) +
                ";"
                  , (err, data) => {
                      if (data != [])
                          success(res, data[0]);
                      else
                          badrequest(res);
                });
            })
            .catch((err) => {
              console.log(err);
              return denied(res);
            });
        });
  
    }
    else
      return badrequest(res);
  };