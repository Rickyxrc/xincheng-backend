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