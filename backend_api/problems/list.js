var db = require('../../database/conn');

module.exports = (req, res) => {
    if (req.query['data'] == undefined)
        req.query['data'] = ''
    req.query['data'].replace('+', '[+]')
    var sql = 'SELECT pid,title,difficulty FROM problems WHERE active=1 AND title LIKE \'%' + req.query['data'] + '%\';'
    db.query(sql, (err, data) => {
        if (err) {
            return res.send('error:' + err.message);
        }
        res.send(data)
    })
}