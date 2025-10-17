-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: royalchess
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_name` varchar(15) DEFAULT NULL,
  `user_id` varchar(15) NOT NULL,
  `user_email` varchar(254) DEFAULT NULL,
  `user_password` varchar(72) DEFAULT NULL,
  `user_signup_date` datetime DEFAULT NULL,
  `user_verification_code` varchar(6) DEFAULT NULL,
  `user_activated` tinyint(1) DEFAULT NULL,
  `code_tries` int DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('Hanni','RC-0QJK247C1QCH','j@p@web.de','4813494d137e1631bba301d5acab6e7bb7aa74ce1185d456565ef51d737677b2','2025-09-12 22:18:47','147599',1,0),('kai1','RC-6M2EFJW4X0HV','kai@nowhere.com','f249bf1d2d38490a721c1af483fe048974c4a90eeca83f84bbb872b05b5e2902','2025-09-06 18:37:44',NULL,1,0),('ggHannesGamer10','RC-FO2MNMUNLYVO','letsgogermany.pack@gmail.com','4813494d137e1631bba301d5acab6e7bb7aa74ce1185d456565ef51d737677b2','2025-06-22 00:21:49',NULL,1,0),('LetsGoGermany','RC-OZNK5V8DMJ36','jakob.pollermann@icloud.com','4813494d137e1631bba301d5acab6e7bb7aa74ce1185d456565ef51d737677b2','2025-06-15 12:50:14',NULL,1,0),('Peter_Pane','RC-X7MR23V65E06','perter_pane@schach.de','4813494d137e1631bba301d5acab6e7bb7aa74ce1185d456565ef51d737677b2','2025-07-15 18:55:59',NULL,1,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-18  1:06:08
