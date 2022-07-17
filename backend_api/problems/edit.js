let permission = require('../../common/permission');
let denied = require('../../common/denied');
let error = require('../../common/error');
let success = require('../../common/success');
let db = require('../../database/conn')

module.exports = (req, res) => {
    permission(req.query.session, 1)
        .then(() => {
            db.query('UPDATE problems SET context = ' + db.escape(req.query.content) + ' WHERE pid=' + db.escape(req.query.pid) + ';', (err, data) => {
                if (err) {
                    console.log(err);
                    error(res);
                }
                else
                    success(res);
            });
        })
}