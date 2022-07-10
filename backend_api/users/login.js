var db = require('../../database/conn');
const { createHash } = require('node:crypto');

module.exports = (req, res) => {
    var hash = createHash('sha256');
    if (req.query['username'] && req.query['password']) {
        hash.update(req.query['password']);
        hash_res = hash.digest('hex');
        db.query('SELECT id FROM users WHERE (username = ' + db.escape(req.query['username']) + ' OR mail = ' + db.escape(req.query['username']) + ') AND password = ' + db.escape(hash_res) + ';', (err, data) => {
            if (data.length == 0)
                res.json({ stat: -1 });
            else {
                var hash = createHash('sha256');
                hash.update((Math.round(new Date().getTime() / 1000) + 86400) + 'XinchengAUth' + req.query['username']);
                session = hash.digest('hex');
                db.query('INSERT INTO sessions VALUES (' + db.escape(data[0]['id']) + ',' + db.escape(session) + ',' + db.escape(Math.round(new Date().getTime() / 1000) + 86400) +');', (err, data) => {
                    res.json({ stat:0,session:session })
                });
            }
        });
    }
    else
        res.send('invalid request.');
        
}