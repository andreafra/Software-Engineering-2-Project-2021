-- Adminer 4.7.8 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS `db_clup`;
CREATE DATABASE `db_clup` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `db_clup`;

DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `admin` (`id`, `username`, `password`) VALUES
(1,	'admin',	'password');

DROP TABLE IF EXISTS `favorites`;
CREATE TABLE `favorites` (
  `user_id` varchar(20) NOT NULL,
  `store_id` int NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `fav_store_idx` (`store_id`),
  CONSTRAINT `fav_store` FOREIGN KEY (`store_id`) REFERENCES `store` (`id`),
  CONSTRAINT `fav_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `free_timeslot_notification`;
CREATE TABLE `free_timeslot_notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(20) NOT NULL,
  `weekday` int NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `notification_user_idx` (`user_id`),
  CONSTRAINT `notification_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `managed_store`;
CREATE TABLE `managed_store` (
  `store_id` int NOT NULL,
  `admin_id` int NOT NULL,
  PRIMARY KEY (`store_id`,`admin_id`),
  KEY `ms_admin_idx` (`admin_id`),
  CONSTRAINT `ms_admin` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`id`),
  CONSTRAINT `ms_store` FOREIGN KEY (`store_id`) REFERENCES `store` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `managed_store` (`store_id`, `admin_id`) VALUES
(1,	1),
(2,	1),
(3,	1);

DROP TABLE IF EXISTS `reservation`;
CREATE TABLE `reservation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `weekday` int NOT NULL,
  `start_time` time NOT NULL,
  `max_people_allowed` int NOT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `store_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `store_id_idx` (`store_id`),
  CONSTRAINT `` FOREIGN KEY (`store_id`) REFERENCES `store` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `reservation` (`id`, `weekday`, `start_time`, `max_people_allowed`, `is_active`, `store_id`) VALUES
(172,	1,	'08:00:00',	10,	1,	1),
(173,	1,	'10:00:00',	10,	1,	1),
(174,	1,	'13:00:00',	10,	1,	1),
(175,	1,	'16:00:00',	10,	1,	1),
(176,	1,	'17:00:00',	10,	1,	1),
(177,	1,	'18:00:00',	10,	1,	1),
(178,	2,	'08:00:00',	10,	1,	1),
(179,	2,	'10:00:00',	10,	1,	1),
(180,	2,	'16:00:00',	10,	1,	1),
(181,	2,	'17:00:00',	10,	1,	1),
(182,	2,	'18:00:00',	10,	1,	1),
(183,	3,	'08:00:00',	10,	1,	1),
(184,	3,	'10:00:00',	10,	1,	1),
(185,	3,	'16:00:00',	10,	1,	1),
(186,	3,	'18:00:00',	10,	1,	1),
(187,	4,	'08:00:00',	10,	1,	1),
(188,	4,	'10:00:00',	10,	1,	1),
(189,	4,	'16:00:00',	10,	1,	1),
(190,	4,	'17:00:00',	10,	1,	1),
(191,	4,	'18:00:00',	10,	1,	1),
(192,	1,	'08:00:00',	10,	1,	2),
(193,	1,	'10:00:00',	10,	1,	2),
(194,	1,	'13:00:00',	10,	1,	2),
(195,	1,	'16:00:00',	10,	1,	2),
(196,	1,	'17:00:00',	10,	1,	2),
(197,	1,	'18:00:00',	10,	1,	2),
(198,	2,	'08:00:00',	10,	1,	2),
(199,	2,	'10:00:00',	10,	1,	2),
(200,	2,	'16:00:00',	10,	1,	2),
(201,	2,	'17:00:00',	10,	1,	2),
(202,	2,	'18:00:00',	10,	1,	2),
(203,	3,	'08:00:00',	10,	1,	2),
(204,	3,	'10:00:00',	10,	1,	2),
(205,	3,	'16:00:00',	10,	1,	2),
(206,	3,	'18:00:00',	10,	1,	2),
(207,	4,	'08:00:00',	10,	1,	2),
(208,	4,	'10:00:00',	10,	1,	2),
(209,	4,	'16:00:00',	10,	1,	2),
(210,	4,	'17:00:00',	10,	1,	2),
(211,	4,	'18:00:00',	10,	1,	2),
(212,	1,	'08:00:00',	10,	1,	3),
(213,	1,	'10:00:00',	10,	1,	3),
(214,	1,	'13:00:00',	10,	1,	3),
(215,	1,	'16:00:00',	10,	1,	3),
(216,	1,	'17:00:00',	10,	1,	3),
(217,	1,	'18:00:00',	10,	1,	3),
(218,	2,	'08:00:00',	10,	1,	3),
(219,	2,	'10:00:00',	10,	1,	3),
(220,	2,	'16:00:00',	10,	1,	3),
(221,	2,	'17:00:00',	10,	1,	3),
(222,	2,	'18:00:00',	10,	1,	3),
(223,	3,	'08:00:00',	10,	1,	3),
(224,	3,	'10:00:00',	10,	1,	3),
(225,	3,	'16:00:00',	10,	1,	3),
(226,	3,	'18:00:00',	10,	1,	3),
(227,	4,	'08:00:00',	10,	1,	3),
(228,	4,	'10:00:00',	10,	1,	3),
(229,	4,	'16:00:00',	10,	1,	3),
(230,	4,	'17:00:00',	10,	1,	3),
(231,	4,	'18:00:00',	10,	1,	3);

DROP TABLE IF EXISTS `store`;
CREATE TABLE `store` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `address` varchar(100) NOT NULL,
  `max_capacity` int NOT NULL,
  `curr_number` int NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `address_UNIQUE` (`address`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `store` (`id`, `name`, `address`, `max_capacity`, `curr_number`, `latitude`, `longitude`) VALUES
(1,	'Store Aurora',	'Via Spinoza, 4, Milano',	100,	0,	45.4796,	9.22525),
(2,	'Store Vincenza',	'Piazza Leonardo, 26, Milano',	60,	0,	45.4769,	9.22612),
(3,	'Store Olga',	'Viale Romagna, 61, Milano ',	40,	0,	45.4786,	9.22335);

DROP TABLE IF EXISTS `ticket`;
CREATE TABLE `ticket` (
  `type` enum('reservation','queue','priority') NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `status` enum('valid','used','cancelled') NOT NULL,
  `creation_date` datetime NOT NULL,
  `usage_timestamp` timestamp NULL DEFAULT NULL,
  `reservation_id` int DEFAULT NULL,
  `store_id` int NOT NULL,
  `user_id` varchar(20) NOT NULL,
  `first_timestamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `id_idx` (`store_id`),
  KEY `id_idx1` (`reservation_id`),
  KEY `ticket_user_idx` (`user_id`),
  CONSTRAINT `ticket_reservation` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`id`),
  CONSTRAINT `ticket_store` FOREIGN KEY (`store_id`) REFERENCES `store` (`id`),
  CONSTRAINT `ticket_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `token`;
CREATE TABLE `token` (
  `user_id` varchar(20) NOT NULL,
  `token` varchar(36) NOT NULL,
  `end_timestamp` timestamp NOT NULL,
  KEY `token_user_idx` (`user_id`),
  CONSTRAINT `token_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `token` (`user_id`, `token`, `end_timestamp`) VALUES
('totem',	'totem-token',	'2025-01-01 00:00:00');

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` varchar(20) NOT NULL,
  `name` varchar(45) NOT NULL,
  `surname` varchar(45) NOT NULL,
  `is_totem` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone_number_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `user` (`id`, `name`, `surname`, `is_totem`) VALUES
('totem',	'Totemo',	'De Totemis',	1);

DROP TABLE IF EXISTS `verification_code`;
CREATE TABLE `verification_code` (
  `number` varchar(20) NOT NULL,
  `code` char(5) DEFAULT NULL,
  PRIMARY KEY (`number`),
  CONSTRAINT `code_number` FOREIGN KEY (`number`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 2021-02-06 17:56:07
