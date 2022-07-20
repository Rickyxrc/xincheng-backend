let permission = require('../../common/permission');
let denied = require('../../common/denied');
let badrequest = require("../../common/badrequest");
let success = require('../../common/success');
let db = require("../../database/conn");
let notfound = require('../../common/notfound');
let error = require("../../common/error");

module.exports = (req, res) => {
    permission(req.query["session"], 1)
        .then(() => {
            db.query("SELECT username FROM users", (err, data) => {
                if (err) {
                    console.log(err);
                    return error(err);
                } else {
                    return success(res, data);
                }
            })
        })
        .catch((err) => {
            if (err) {
                console.log(err);
                return error(err);
            } else {
                return denied(res);
            }
        })
}