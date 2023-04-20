-- CreateTable
CREATE TABLE `contract` (
    `contract_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`contract_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contract_station` (
    `contract_station_id` INTEGER NOT NULL AUTO_INCREMENT,
    `contract_id` INTEGER NOT NULL,
    `station_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`contract_station_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `country` (
    `country_code` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`country_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `geolocation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `station_name` VARCHAR(191) NOT NULL,
    `country_code` VARCHAR(191) NOT NULL,
    `island` VARCHAR(191) NOT NULL,
    `county` VARCHAR(191) NOT NULL,
    `place` VARCHAR(191) NOT NULL,
    `hamlet` VARCHAR(191) NOT NULL,
    `town` VARCHAR(191) NOT NULL,
    `municipality` VARCHAR(191) NOT NULL,
    `state_district` VARCHAR(191) NOT NULL,
    `administrative` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `village` VARCHAR(191) NOT NULL,
    `region` VARCHAR(191) NOT NULL,
    `province` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `locality` VARCHAR(191) NOT NULL,
    `postcode` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `missing_data` (
    `missing_data_id` INTEGER NOT NULL AUTO_INCREMENT,
    `station_name` VARCHAR(191) NOT NULL,
    `datetime` VARCHAR(191) NOT NULL,
    `temp` DOUBLE NULL,
    `dewp` DOUBLE NULL,
    `stp` DOUBLE NULL,
    `slp` DOUBLE NULL,
    `visib` DOUBLE NULL,
    `wdsp` DOUBLE NULL,
    `prcp` DOUBLE NULL,
    `sndp` DOUBLE NULL,
    `frshtt` VARCHAR(191) NULL,
    `cldc` DOUBLE NULL,
    `wnddir` INTEGER NULL,
    `column_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`missing_data_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nearestlocation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `station_name` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `administrative_region1` VARCHAR(191) NULL,
    `administrative_region2` VARCHAR(191) NULL,
    `country_code` VARCHAR(191) NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `latitude` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `station` (
    `name` VARCHAR(191) NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `elevation` DOUBLE NOT NULL,

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `station_data` (
    `station_data_id` INTEGER NOT NULL AUTO_INCREMENT,
    `station_name` VARCHAR(191) NOT NULL,
    `datetime` VARCHAR(191) NOT NULL,
    `temp` DOUBLE NULL,
    `dewp` DOUBLE NULL,
    `stp` DOUBLE NULL,
    `slp` DOUBLE NULL,
    `visib` DOUBLE NULL,
    `wdsp` DOUBLE NULL,
    `prcp` DOUBLE NULL,
    `sndp` DOUBLE NULL,
    `frshtt` VARCHAR(191) NULL,
    `cldc` DOUBLE NULL,
    `wnddir` INTEGER NULL,

    PRIMARY KEY (`station_data_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `station_status` (
    `station_name` VARCHAR(191) NOT NULL,
    `last_response` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`station_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscription` (
    `subscription_id` INTEGER NOT NULL AUTO_INCREMENT,
    `subscription_type` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`subscription_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscription_station` (
    `subscription_station_id` INTEGER NOT NULL AUTO_INCREMENT,
    `subscription_id` INTEGER NOT NULL,
    `station_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`subscription_station_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `api_token` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    UNIQUE INDEX `user_api_token_key`(`api_token`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
