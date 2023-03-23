CREATE TABLE `station_data`(
    `station_data_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `stn` INT NOT NULL,
    `datetime` DATETIME NOT NULL,
    `temp` DECIMAL(5, 2) NOT NULL,
    `dewp` DECIMAL(5, 2) NOT NULL,
    `stp` DECIMAL(5, 2) NOT NULL,
    `slp` DECIMAL(5, 2) NOT NULL,
    `visib` DECIMAL(5, 2) NOT NULL,
    `wdsp` DECIMAL(5, 2) NOT NULL,
    `prcp` DECIMAL(5, 2) NOT NULL,
    `sndp` DECIMAL(5, 2) NOT NULL,
    `frshtt` CHAR(6) NOT NULL,
    `cldc` DECIMAL(5, 2) NOT NULL,
    `wnddir` SMALLINT NOT NULL
);
ALTER TABLE
    `station_data` ADD PRIMARY KEY `station_data_station_data_id_primary`(`station_data_id`);
CREATE TABLE `timezone`(
    `timezone_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `gmt_offset` INT NOT NULL,
    `dst` TINYINT(1) NOT NULL
);
ALTER TABLE
    `timezone` ADD PRIMARY KEY `timezone_timezone_id_primary`(`timezone_id`);
CREATE TABLE `station`(
    `stn` INT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `country` VARCHAR(3) NOT NULL,
    `timezone_id` INT NOT NULL
);
ALTER TABLE
    `station` ADD PRIMARY KEY `station_stn_primary`(`stn`);
ALTER TABLE
    `station` ADD CONSTRAINT `station_timezone_id_foreign` FOREIGN KEY(`timezone_id`) REFERENCES `timezone`(`timezone_id`);
ALTER TABLE
    `station_data` ADD CONSTRAINT `station_data_stn_foreign` FOREIGN KEY(`stn`) REFERENCES `station`(`stn`);