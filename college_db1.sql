CREATE DATABASE  IF NOT EXISTS `college_db1` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `college_db1`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: college_db
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `AttendanceID` int NOT NULL AUTO_INCREMENT,
  `StudentID` int NOT NULL,
  `ClassID` int NOT NULL,
  `Date` date NOT NULL,
  `Status` enum('P','A') NOT NULL,
  PRIMARY KEY (`AttendanceID`),
  UNIQUE KEY `uniq_attendance` (`StudentID`,`ClassID`,`Date`),
  KEY `ClassID` (`ClassID`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `student` (`StudentID`),
  CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`ClassID`) REFERENCES `class` (`ClassID`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (3,49,54,'2025-11-11','P'),(4,50,54,'2025-11-11','P'),(5,51,54,'2025-11-11','P'),(8,49,51,'2025-11-11','P'),(9,50,51,'2025-11-11','P'),(10,51,51,'2025-11-11','P'),(13,49,51,'2025-11-12','P'),(14,50,51,'2025-11-12','P'),(15,51,51,'2025-11-12','P'),(18,49,51,'2025-11-18','A'),(19,50,51,'2025-11-18','P'),(20,51,51,'2025-11-18','P'),(23,1,1,'2025-11-11','P'),(24,2,1,'2025-11-11','P'),(25,3,1,'2025-11-11','P'),(28,1,1,'2025-11-12','P'),(29,2,1,'2025-11-12','P'),(30,3,1,'2025-11-12','P'),(31,1,1,'2025-12-17','P'),(32,2,1,'2025-12-17','P'),(33,3,1,'2025-12-17','P'),(34,65,1,'2025-12-17','P'),(35,49,51,'2025-11-30','A'),(36,50,51,'2025-11-30','P'),(37,51,51,'2025-11-30','P'),(38,49,51,'2025-11-27','A'),(39,50,51,'2025-11-27','P'),(40,51,51,'2025-11-27','P'),(44,49,51,'2025-12-06','P'),(45,50,51,'2025-12-06','P'),(46,51,51,'2025-12-06','P'),(47,4,4,'2025-11-30','A'),(48,5,4,'2025-11-30','A'),(49,6,4,'2025-11-30','A'),(50,49,51,'2025-11-29','A'),(51,50,51,'2025-11-29','A'),(52,51,51,'2025-11-29','P'),(53,4,4,'2025-11-29','A'),(54,5,4,'2025-11-29','P'),(55,6,4,'2025-11-29','P'),(56,49,51,'2026-01-02','P'),(57,50,51,'2026-01-02','P'),(58,51,51,'2026-01-02','P'),(59,49,51,'2025-12-26','P'),(60,50,51,'2025-12-26','P'),(61,51,51,'2025-12-26','P'),(62,49,51,'2025-10-09','A'),(63,50,51,'2025-10-09','P'),(64,51,51,'2025-10-09','P');
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branch`
--

DROP TABLE IF EXISTS `branch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branch` (
  `BranchCode` varchar(10) NOT NULL,
  `BranchName` varchar(100) NOT NULL,
  PRIMARY KEY (`BranchCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branch`
--

LOCK TABLES `branch` WRITE;
/*!40000 ALTER TABLE `branch` DISABLE KEYS */;
INSERT INTO `branch` VALUES ('CIVIL','Civil Engineering'),('CSE','Computer Science and Engineering'),('ECE','Electronics and Communication Engineering'),('EEE','Electrical and Electronics Engineering'),('ME','Mechanical Engineering');
/*!40000 ALTER TABLE `branch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class`
--

DROP TABLE IF EXISTS `class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class` (
  `ClassID` int NOT NULL AUTO_INCREMENT,
  `CourseID` int DEFAULT NULL,
  `CalendarYear` int DEFAULT NULL,
  `YearLevel` int DEFAULT NULL,
  PRIMARY KEY (`ClassID`),
  KEY `CourseID` (`CourseID`),
  CONSTRAINT `class_ibfk_1` FOREIGN KEY (`CourseID`) REFERENCES `course` (`CourseID`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class`
--

LOCK TABLES `class` WRITE;
/*!40000 ALTER TABLE `class` DISABLE KEYS */;
INSERT INTO `class` VALUES (1,1,2025,1),(2,2,2025,1),(3,3,2025,1),(4,4,2025,2),(5,5,2025,2),(6,6,2025,2),(7,7,2025,3),(8,8,2025,3),(9,9,2025,3),(10,10,2025,4),(11,11,2025,4),(12,12,2025,4),(13,13,2025,1),(14,14,2025,1),(15,15,2025,1),(16,16,2025,2),(17,17,2025,2),(18,18,2025,2),(19,19,2025,3),(20,20,2025,3),(21,21,2025,3),(22,22,2025,4),(23,23,2025,4),(24,24,2025,4),(25,25,2025,1),(26,26,2025,1),(27,27,2025,1),(28,28,2025,2),(29,29,2025,2),(30,30,2025,2),(31,31,2025,3),(32,32,2025,3),(33,33,2025,3),(34,34,2025,4),(35,35,2025,4),(36,36,2025,4),(37,37,2025,1),(38,38,2025,1),(39,39,2025,1),(40,40,2025,2),(41,41,2025,2),(42,42,2025,2),(43,43,2025,3),(44,44,2025,3),(45,45,2025,3),(46,46,2025,4),(47,47,2025,4),(48,48,2025,4),(49,49,2025,1),(50,50,2025,1),(51,51,2025,1),(52,52,2025,2),(53,53,2025,2),(54,54,2025,2),(55,55,2025,3),(56,56,2025,3),(57,57,2025,3),(58,58,2025,4),(59,59,2025,4),(60,60,2025,4);
/*!40000 ALTER TABLE `class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `CourseID` int NOT NULL AUTO_INCREMENT,
  `CourseName` varchar(100) NOT NULL,
  `BranchCode` varchar(10) NOT NULL,
  `Year` int NOT NULL,
  PRIMARY KEY (`CourseID`),
  KEY `BranchCode` (`BranchCode`),
  CONSTRAINT `course_ibfk_1` FOREIGN KEY (`BranchCode`) REFERENCES `branch` (`BranchCode`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (1,'Programming Fundamentals','CSE',1),(2,'Mathematics I','CSE',1),(3,'Digital Logic','CSE',1),(4,'Data Structures','CSE',2),(5,'DBMS','CSE',2),(6,'OOP with Java','CSE',2),(7,'Operating Systems','CSE',3),(8,'Computer Networks','CSE',3),(9,'Software Engineering','CSE',3),(10,'Machine Learning','CSE',4),(11,'Web Technology','CSE',4),(12,'Cloud Computing','CSE',4),(13,'Basic Electronics','ECE',1),(14,'Engineering Physics','ECE',1),(15,'Circuits Lab','ECE',1),(16,'Digital Circuits','ECE',2),(17,'Signals and Systems','ECE',2),(18,'Microprocessors','ECE',2),(19,'Analog Communication','ECE',3),(20,'Electromagnetics','ECE',3),(21,'Control Systems','ECE',3),(22,'VLSI Design','ECE',4),(23,'Wireless Networks','ECE',4),(24,'Embedded Systems','ECE',4),(25,'Basic Electrical Engineering','EEE',1),(26,'Engineering Mathematics','EEE',1),(27,'Physics for EEE','EEE',1),(28,'Network Theory','EEE',2),(29,'Electromagnetics','EEE',2),(30,'Digital Electronics','EEE',2),(31,'Power Systems','EEE',3),(32,'Machines-I','EEE',3),(33,'Control Systems','EEE',3),(34,'Power Electronics','EEE',4),(35,'Renewable Energy','EEE',4),(36,'Smart Grids','EEE',4),(37,'Engineering Drawing','ME',1),(38,'Workshop Practice','ME',1),(39,'Applied Physics','ME',1),(40,'Thermodynamics','ME',2),(41,'Mechanics of Solids','ME',2),(42,'Material Science','ME',2),(43,'Machine Design','ME',3),(44,'Fluid Mechanics','ME',3),(45,'Heat Transfer','ME',3),(46,'Production Engineering','ME',4),(47,'Industrial Management','ME',4),(48,'Robotics','ME',4),(49,'Engineering Mechanics','CIVIL',1),(50,'Basic Surveying','CIVIL',1),(51,'Building Materials','CIVIL',1),(52,'Fluid Mechanics','CIVIL',2),(53,'Structural Analysis','CIVIL',2),(54,'Concrete Technology','CIVIL',2),(55,'Geotechnical Engineering','CIVIL',3),(56,'Transportation Engineering','CIVIL',3),(57,'Environmental Engineering','CIVIL',3),(58,'Hydrology','CIVIL',4),(59,'Design of Structures','CIVIL',4),(60,'Construction Management','CIVIL',4);
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `StudentID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) DEFAULT NULL,
  `RollNo` varchar(20) DEFAULT NULL,
  `BranchCode` varchar(10) DEFAULT NULL,
  `Year` int DEFAULT NULL,
  PRIMARY KEY (`StudentID`),
  UNIQUE KEY `RollNo` (`RollNo`),
  KEY `BranchCode` (`BranchCode`),
  CONSTRAINT `student_ibfk_1` FOREIGN KEY (`BranchCode`) REFERENCES `branch` (`BranchCode`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES (1,'Aarav Kumar','CSE101','CSE',1),(2,'Diya Mehta','CSE102','CSE',1),(3,'Ishan Rao','CSE103','CSE',1),(4,'Sneha Patel','CSE201','CSE',2),(5,'Rohit Sharma','CSE202','CSE',2),(6,'Ananya Das','CSE203','CSE',2),(7,'Kiran Gupta','CSE301','CSE',3),(8,'Meera Jain','CSE302','CSE',3),(9,'Tanish Verma','CSE303','CSE',3),(10,'Rahul Singh','CSE401','CSE',4),(11,'Aditi Nair','CSE402','CSE',4),(12,'Vikram Joshi','CSE403','CSE',4),(13,'Riya Patel','ECE101','ECE',1),(14,'Aditya Rao','ECE102','ECE',1),(15,'Pooja Mehta','ECE103','ECE',1),(16,'Harsha Nair','ECE201','ECE',2),(17,'Gaurav Singh','ECE202','ECE',2),(18,'Kavya Das','ECE203','ECE',2),(19,'Rohini Kumar','ECE301','ECE',3),(20,'Vivek Reddy','ECE302','ECE',3),(21,'Sneha Shetty','ECE303','ECE',3),(22,'Deepak Sharma','ECE401','ECE',4),(23,'Anjali Verma','ECE402','ECE',4),(24,'Ramesh Iyer','ECE403','ECE',4),(25,'Manish Nair','EEE101','EEE',1),(26,'Lakshmi Patel','EEE102','EEE',1),(27,'Gokul Rao','EEE103','EEE',1),(28,'Divya Menon','EEE201','EEE',2),(29,'Prateek Singh','EEE202','EEE',2),(30,'Shivani Das','EEE203','EEE',2),(31,'Karthik Iyer','EEE301','EEE',3),(32,'Monica Sharma','EEE302','EEE',3),(33,'Anand Gupta','EEE303','EEE',3),(34,'Asha Kumar','EEE401','EEE',4),(35,'Rajesh Nair','EEE402','EEE',4),(36,'Priya Shetty','EEE403','EEE',4),(37,'Vivek Yadav','ME101','ME',1),(38,'Neha Reddy','ME102','ME',1),(39,'Aman Tiwari','ME103','ME',1),(40,'Rohit Menon','ME201','ME',2),(41,'Kiran Patel','ME202','ME',2),(42,'Meghana Rao','ME203','ME',2),(43,'Arjun Das','ME301','ME',3),(44,'Sneha Kumar','ME302','ME',3),(45,'Vikas Jain','ME303','ME',3),(46,'Pavitra G','ME401','ME',4),(47,'Tarun Nair','ME402','ME',4),(48,'Anil Mehta','ME403','ME',4),(49,'Akash Rao','CIV101','CIVIL',1),(50,'Meena Iyer','CIV102','CIVIL',1),(51,'Chirag Patel','CIV103','CIVIL',1),(52,'Nisha Verma','CIV201','CIVIL',2),(53,'Raj Kumar','CIV202','CIVIL',2),(54,'Anu Sharma','CIV203','CIVIL',2),(55,'Suraj Singh','CIV301','CIVIL',3),(56,'Kavitha Nair','CIV302','CIVIL',3),(57,'Arvind Menon','CIV303','CIVIL',3),(58,'Rekha Das','CIV401','CIVIL',4),(59,'Vijay Kumar','CIV402','CIVIL',4),(60,'Devika Rao','CIV403','CIVIL',4),(65,'Aniruddh','CSE104','CSE',1);
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher`
--

DROP TABLE IF EXISTS `teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher` (
  `TeacherID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) DEFAULT NULL,
  `Department` varchar(10) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`TeacherID`),
  KEY `Department` (`Department`),
  CONSTRAINT `teacher_ibfk_1` FOREIGN KEY (`Department`) REFERENCES `branch` (`BranchCode`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher`
--

LOCK TABLES `teacher` WRITE;
/*!40000 ALTER TABLE `teacher` DISABLE KEYS */;
INSERT INTO `teacher` VALUES (1,'Dr. S. Rao','CSE','srao@college.edu'),(2,'Prof. Kavitha','CSE','kavitha@college.edu'),(3,'Mr. Arjun Menon','CSE','arjunmenon@college.edu'),(4,'Ms. N. Iyer','ECE','niyer@college.edu'),(5,'Dr. R. Varma','ECE','rvarma@college.edu'),(6,'Prof. Divya Mohan','ECE','divyamohan@college.edu'),(7,'Mr. R. Kumar','ME','rkumar@college.edu'),(8,'Dr. Meera Krishnan','ME','meerakrishnan@college.edu'),(9,'Prof. S. Rajesh','ME','srajesh@college.edu'),(10,'Dr. Ramesh B','CIVIL','rameshb@college.edu'),(11,'Prof. Sahana','CIVIL','sahana@college.edu'),(12,'Dr. Arvind G','CIVIL','arvindg@college.edu'),(13,'Prof. Anjali P','EEE','anjalip@college.edu'),(14,'Dr. Prakash K','EEE','prakashk@college.edu'),(15,'Prof. R. Nair','EEE','rnair@college.edu');
/*!40000 ALTER TABLE `teacher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `teacher_load`
--

DROP TABLE IF EXISTS `teacher_load`;
/*!50001 DROP VIEW IF EXISTS `teacher_load`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `teacher_load` AS SELECT 
 1 AS `TeacherID`,
 1 AS `Name`,
 1 AS `Department`,
 1 AS `Subject`,
 1 AS `BranchCode`,
 1 AS `Year`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `teaches`
--

DROP TABLE IF EXISTS `teaches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teaches` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `TeacherID` int DEFAULT NULL,
  `ClassID` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `TeacherID` (`TeacherID`),
  KEY `ClassID` (`ClassID`),
  CONSTRAINT `teaches_ibfk_1` FOREIGN KEY (`TeacherID`) REFERENCES `teacher` (`TeacherID`),
  CONSTRAINT `teaches_ibfk_2` FOREIGN KEY (`ClassID`) REFERENCES `class` (`ClassID`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teaches`
--

LOCK TABLES `teaches` WRITE;
/*!40000 ALTER TABLE `teaches` DISABLE KEYS */;
INSERT INTO `teaches` VALUES (1,10,49),(2,11,50),(3,12,51),(4,10,52),(5,11,53),(6,12,54),(7,10,55),(8,11,56),(9,12,57),(10,10,58),(11,11,59),(12,12,60),(13,1,1),(14,2,2),(15,3,3),(16,1,4),(17,2,5),(18,3,6),(19,1,7),(20,2,8),(21,3,9),(22,1,10),(23,2,11),(24,3,12),(25,4,13),(26,5,14),(27,6,15),(28,4,16),(29,5,17),(30,6,18),(31,4,19),(32,5,20),(33,6,21),(34,4,22),(35,5,23),(36,6,24),(37,13,25),(38,14,26),(39,15,27),(40,13,28),(41,14,29),(42,15,30),(43,13,31),(44,14,32),(45,15,33),(46,13,34),(47,14,35),(48,15,36),(49,7,37),(50,8,38),(51,9,39),(52,7,40),(53,8,41),(54,9,42),(55,7,43),(56,8,44),(57,9,45),(58,7,46),(59,8,47),(60,9,48);
/*!40000 ALTER TABLE `teaches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `v_branch_course_count`
--

DROP TABLE IF EXISTS `v_branch_course_count`;
/*!50001 DROP VIEW IF EXISTS `v_branch_course_count`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_branch_course_count` AS SELECT 
 1 AS `BranchCode`,
 1 AS `Year`,
 1 AS `Subjects`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_teacher_course_map`
--

DROP TABLE IF EXISTS `v_teacher_course_map`;
/*!50001 DROP VIEW IF EXISTS `v_teacher_course_map`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_teacher_course_map` AS SELECT 
 1 AS `TeacherName`,
 1 AS `Department`,
 1 AS `CourseName`,
 1 AS `Year`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_teacher_load`
--

DROP TABLE IF EXISTS `v_teacher_load`;
/*!50001 DROP VIEW IF EXISTS `v_teacher_load`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_teacher_load` AS SELECT 
 1 AS `Teacher`,
 1 AS `Department`,
 1 AS `ClassesHandled`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping events for database 'college_db'
--

--
-- Dumping routines for database 'college_db'
--

--
-- Final view structure for view `teacher_load`
--

/*!50001 DROP VIEW IF EXISTS `teacher_load`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `teacher_load` AS select `t`.`TeacherID` AS `TeacherID`,`t`.`Name` AS `Name`,`t`.`Department` AS `Department`,`c`.`CourseName` AS `Subject`,`c`.`BranchCode` AS `BranchCode`,`c`.`Year` AS `Year` from (((`teaches` `th` join `teacher` `t` on((`th`.`TeacherID` = `t`.`TeacherID`))) join `class` `cl` on((`th`.`ClassID` = `cl`.`ClassID`))) join `course` `c` on((`cl`.`CourseID` = `c`.`CourseID`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_branch_course_count`
--

/*!50001 DROP VIEW IF EXISTS `v_branch_course_count`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_branch_course_count` AS select `course`.`BranchCode` AS `BranchCode`,`course`.`Year` AS `Year`,count(0) AS `Subjects` from `course` group by `course`.`BranchCode`,`course`.`Year` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_teacher_course_map`
--

/*!50001 DROP VIEW IF EXISTS `v_teacher_course_map`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_teacher_course_map` AS select `t`.`Name` AS `TeacherName`,`t`.`Department` AS `Department`,`cr`.`CourseName` AS `CourseName`,`cr`.`Year` AS `Year` from (((`teacher` `t` join `teaches` `te` on((`t`.`TeacherID` = `te`.`TeacherID`))) join `class` `c` on((`te`.`ClassID` = `c`.`ClassID`))) join `course` `cr` on((`cr`.`CourseID` = `c`.`CourseID`))) order by `t`.`Department`,`cr`.`Year` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_teacher_load`
--

/*!50001 DROP VIEW IF EXISTS `v_teacher_load`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_teacher_load` AS select `t`.`Name` AS `Teacher`,`t`.`Department` AS `Department`,count(`te`.`ClassID`) AS `ClassesHandled` from (`teacher` `t` left join `teaches` `te` on((`t`.`TeacherID` = `te`.`TeacherID`))) group by `t`.`TeacherID` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-11 23:04:44
