let permission = require('../../common/permission');
let denied = require('../../common/denied');
let error = require('../../common/error');
let success = require('../../common/success');
const db = require('../../database/conn');

module.exports = (req, res) => {
    permission(req.query.session, 1)
        .then(() => {
            db.run('INSERT INTO problems VALUES (NULL,' +
                db.escape(req.query.title) +
                ',0,' +
                db.escape(req.query.content) +
                ',' +
                db.escape(req.query.pid) +
                ',' +
                db.escape(req.query.difficulty) +
                ');',
                (err, data) => {
                    if (err) {
                        console.log(err);
                        error(res);
                    }
                    else
                        success(res,[])
            })
        } )
}