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
      db.query('SELECT count(id)"len" FROM records;', (err, data) => {
        if (err) {
          console.log("at /records/sum:");
          console.log(err);
          return error(res);
        }
        return success(res,data[0]);
      });
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        return error(res);
      } else return denied(res);
    });
};
