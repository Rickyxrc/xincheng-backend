var db = require('../../database/conn');
var unixdate = require('../../common/unixdate');
const { createHash } = require('node:crypto');

module.exports = (req, res) => {
    var hash = createHash('sha256');
    if (req.query['username'] && req.query['password']) {
        hash.update(req.query['password']);
        hash_res = hash.digest('hex');
        db.query('SELECT id FROM users WHERE (username = ' + db.escape(req.query['username']) + ' OR mail = ' + db.escape(req.query['username']) + ') AND password = ' + db.escape(hash_res) + ';', (err, data) => {
            if (err) {
                console.log(err);
                error(res);
            }
            else if (data.length == 0)
                res.json({ success:false,msg:"invalid username or email." });
            else {
                var hash = createHash('sha256');
                hash.update(unixdate() + 'XinchengAUth' + req.query['username']);
                session = hash.digest('hex');
                db.query('INSERT INTO sessions VALUES (' + db.escape(data[0]['id']) + ',' + db.escape(session) + ',' + db.escape(unixdate() + 86400) +');', (err, data) => {
                    res.json({ success:true,session:session })
                });
            }
        });
    }
    else
        res.json({success:true,msg:'invalid request.'});
        
}