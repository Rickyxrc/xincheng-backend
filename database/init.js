let db = require("./conn");
function init() {
  console.log("initing database...");
  db.getConnection((err, conn) => {
    if (err) {
      console.log(err);
      return -1;
    } else {
      conn.query(
        "CREATE TABLE IF NOT EXISTS `users` (`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,`username` varchar(128) NOT NULL,`mail` varchar(64) NOT NULL,`password` varchar(64) NOT NULL,`permission` TINYINT(10) NOT NULL,`tag` varchar(16),`color` INT NOT NULL);",
        (err, data) => {}
      );
      conn.query(
        "CREATE TABLE IF NOT EXISTS `problems` (`pid` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,`title` VARCHAR(32) NOT NULL,`active` BOOLeAN NOT NULL,`content` TEXT NOT NULL,`difficulty` INT NOT NULL);",
        (err, data) => {}
      );
      conn.query(
        "CREATE TABLE IF NOT EXISTS `records` (`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,`problem` INT NOT NULL,FOREIGN key(`problem`) REFERENCES `problems`(`pid`),`user` INT NOT NULL,FOREIGN key(`user`) REFERENCES `users`(`id`) ON UPDATE CASCADE,`code` TEXT NOT NULL,`judgeinfo` VARCHAR(255));",
        (err, data) => {}
      );
      conn.query(
        "CREATE TABLE IF NOT EXISTS `sessions` (`user` INT NOT NULL,FOREIGN key(`user`) REFERENCES `users`(`id`) ON UPDATE CASCADE,`session` VARCHAR(128) NOT NULL,`expries` INT(64) NOT NULL);",
        (err, data) => {}
      );
    }
  });
  return 0;
}
module.exports = init;
