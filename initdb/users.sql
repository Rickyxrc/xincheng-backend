CREATE TABLE IF NOT EXISTS `users` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(128) NOT NULL,
    `mail` VARCHAR(64) NOT NULL,
    `password` VARCHAR(64) NOT NULL,
    `permission` TINYINT(10) NOT NULL,
    `tag` VARCHAR(16),
    `color` INT NOT NULL
);

CREATE TABLE IF NOT EXISTS `problems` (
    `pid` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(32) NOT NULL,
    `active` BOOLEAN NOT NULL,
    `content` TEXT NOT NULL,
    `difficulty` INT NOT NULL
);

CREATE TABLE IF NOT EXISTS `records` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `problem` INT NOT NULL,
    FOREIGN key(`problem`) REFERENCES `problems`(`pid`) ON UPDATE CASCADE,
    `user` INT NOT NULL,
    FOREIGN key(`user`) REFERENCES `users`(`id`) ON UPDATE CASCADE,
    `code` TEXT NOT NULL,
    `score` TINYINT(10),
    `judgestat` TINYINT(10) NOT NULL,
    `judgeinfo` VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS `sessions` (
    `user` INT NOT NULL,
    FOREIGN key(`user`) REFERENCES `users`(`id`) ON UPDATE CASCADE,
    `session` VARCHAR(128) NOT NULL,
    `expries` INT(64) NOT NULL
);