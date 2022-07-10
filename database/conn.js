let mysql = require('mysql')

function getenv(env_name,required,default_value) {
    if (process.env[env_name] == undefined) {
        if (required) {
            console.log('environment',env_name,'is required for this program.');
            process.exit()
        }
        else {
            return default_value;
        }
    }
    else {
        return process.env[env_name];
    }

}

var db = mysql.createPool({
    host: getenv('MYSQL_HOST', true, ''),
    port: getenv('MYSQL_PORT', false, '3306'),
    user: getenv('MYSQL_USER', true, ''),
    password: getenv('MYSQL_PASSWORD', false, ''),
    database: getenv('MYSQL_DATABASE', true, '')
})

module.exports = db