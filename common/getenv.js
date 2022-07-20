process.env['MYSQL_HOST'] = 'sh-cynosdbmysql-grp-5hkhuwxc.sql.tencentcdb.com'
process.env['MYSQL_PORT'] = '28315'
process.env['MYSQL_USER'] = 'xcoj'
process.env['MYSQL_DATABASE'] = 'xcoj'
process.env['MYSQL_PASSWORD'] = '17#C$%^3g_45&6$C^N&^bc9_8*2316_54'
module.exports = (env_name, required, default_value) => {
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