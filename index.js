let express = require('express')
let app = express()
let cors = require('cors')
let bodyParser = require('body-parser')
let sqlinit = require('./database/init')
let path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

if (sqlinit() != 0) {
    console.log('error:sql init failed.');
    process.exit()
}

app.all('/users/new',require('./backend-api/users/new'))
app.all('/users/login', require('./backend-api/users/login'))

app.all('/problems/list', require('./backend-api/problems/list'))


app.listen(80, () => {
    console.log('server started.');
});