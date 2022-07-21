let permission = require("../../common/permission");
let denied = require("../../common/denied");
let error = require("../../common/error");
let success = require("../../common/success");
let badrequest = require("../../common/badrequest");
let db = require("../../database/conn");

module.exports = (req, res) => {
    permission(req.query.session, 2)
    .then((level) => {
        if (req.query.pid) {
            db.query("DELETE FROM problems WHERE pid=" + db.escape(req.query.pid) + ';', (err, data) => {
                if (err) {
                    console.log(err);
                    error(res);
                } else {
                    success(res);
                }
            });
        } else {
            badrequest(res);
        }
    })
    .catch((err) => {
        if (err) {
            err(res);
        } else {
            denied(res);
        }
    })
}