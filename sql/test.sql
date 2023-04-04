CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `api_token` varchar(64) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `api_token_UNIQUE` (`api_token`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

CREATE TABLE `subscription` (
  `subscription_id` int NOT NULL AUTO_INCREMENT,
  `subscription_type` enum('1','2','3') NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`subscription_id`),
  KEY `fk_subscription_user_id` (`user_id`),
  CONSTRAINT `fk_subscription_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

CREATE TABLE `subscription_station` (
  `subscription_station_id` int NOT NULL AUTO_INCREMENT,
  `subscription_id` int NOT NULL,
  `station_name` varchar(10) NOT NULL,
  PRIMARY KEY (`subscription_station_id`),
  KEY `fk_subscription_station_subscription_id` (`subscription_id`),
  KEY `fk_subscription_station_station_name` (`station_name`),
  CONSTRAINT `fk_subscription_station_subscription_id` FOREIGN KEY (`subscription_id`) REFERENCES `subscription` (`subscription_id`),
  CONSTRAINT `fk_subscription_station_station_name` FOREIGN KEY (`station_name`) REFERENCES `station` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

CREATE TABLE `contract` (
  `contract_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  PRIMARY KEY (`contract_id`),
  KEY `fk_contract_user_id` (`user_id`),
  CONSTRAINT `fk_contract_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

CREATE TABLE `contract_station` (
  `contract_station_id` int NOT NULL AUTO_INCREMENT,
  `contract_id` int NOT NULL,
  `station_name` varchar(10) NOT NULL,
  PRIMARY KEY (`contract_station_id`),
  KEY `fk_contract_station_contract_id` (`contract_id`),
  KEY `fk_contract_station_station_name` (`station_name`),
  CONSTRAINT `fk_contract_station_contract_id` FOREIGN KEY (`contract_id`) REFERENCES `contract` (`contract_id`),
  CONSTRAINT `fk_contract_station_station_name` FOREIGN KEY (`station_name`) REFERENCES `station` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;
