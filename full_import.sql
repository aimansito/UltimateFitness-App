SET FOREIGN_KEY_CHECKS=0;
CREATE DATABASE IF NOT EXISTS ultimatefitness_db;
USE ultimatefitness_db;

-- MySQL dump 10.13  Distrib 8.4.8, for Linux (x86_64)
--
-- Host: localhost    Database: ultimatefitness_db
-- ------------------------------------------------------
-- Server version	8.4.8

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alimentos`
--

DROP TABLE IF EXISTS `alimentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alimentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_alimento` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` longtext COLLATE utf8mb4_unicode_ci,
  `calorias` decimal(8,2) NOT NULL,
  `proteinas` decimal(6,2) NOT NULL,
  `carbohidratos` decimal(6,2) NOT NULL,
  `grasas` decimal(6,2) NOT NULL,
  `precio_kg` decimal(6,2) NOT NULL,
  `imagen_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_nombre` (`nombre`),
  KEY `idx_tipo` (`tipo_alimento`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alimentos`
--

LOCK TABLES `alimentos` WRITE;
/*!40000 ALTER TABLE `alimentos` DISABLE KEYS */;
INSERT INTO `alimentos` VALUES (1,'Pechuga de pollo','proteina','Magro y alto en prote+°nas.',165.00,31.00,0.00,3.60,8.50,NULL),(2,'Arroz integral','carbohidrato','Carbo complejo.',365.00,7.00,76.00,3.00,1.20,NULL),(3,'Salm+¶n','proteina','Pescado graso saludable.',208.00,20.00,0.00,13.00,12.00,NULL),(4,'Avena','carbohidrato','Cereal integral rico en fibra.',389.00,16.00,66.00,7.00,1.00,NULL),(5,'Huevo','proteina','Prote+°na completa.',155.00,13.00,1.00,11.00,2.00,NULL),(6,'Quinoa','carbohidrato','Pseudo cereal rico en prote+°na.',368.00,14.00,64.00,6.00,4.50,NULL),(7,'Pechuga de pavo','proteina','Carne blanca muy magra.',135.00,30.00,0.00,1.00,9.00,NULL),(8,'Merluza','proteina','Pescado blanco bajo en grasa.',82.00,18.00,0.00,1.00,7.50,NULL),(9,'Arroz blanco','carbohidrato','Carbohidrato r+Ìpido.',360.00,6.00,80.00,1.00,1.00,NULL),(10,'Miel','carbohidrato','Endulzante natural.',304.00,0.00,82.00,0.00,5.00,NULL),(11,'Leche desnatada','lacteo','Baja en grasa.',35.00,3.00,5.00,0.00,0.90,NULL),(12,'Reques+¶n light','lacteo','Queso bajo en grasa y alto en prote+°na.',90.00,12.00,4.00,3.00,4.00,NULL),(13,'Anacardos','fruto_seco','Frutos secos cal+¶ricos.',553.00,18.00,30.00,44.00,13.00,NULL),(14,'Nueces','fruto_seco','Omega 3 vegetal.',654.00,15.00,14.00,65.00,12.50,NULL),(15,'Tomate','verdura','Muy bajo en calor+°as.',18.00,1.00,4.00,0.00,1.50,NULL),(16,'Lechuga','verdura','Base para ensaladas.',15.00,1.00,3.00,0.00,1.20,NULL),(17,'Zanahoria','verdura','Fuente de beta-carotenos.',41.00,1.00,10.00,0.00,1.30,NULL),(18,'Pimiento rojo','verdura','Rico en vitamina C.',31.00,1.00,6.00,0.00,2.00,NULL),(19,'Calabac+°n','verdura','Verdura ligera.',17.00,1.00,3.00,0.00,1.80,NULL),(20,'Guisantes','legumbre','Buena mezcla de carbos y prote+°na.',81.00,5.00,14.00,1.00,2.10,NULL),(21,'Pan de centeno','carbohidrato','Pan integral m+Ìs denso.',259.00,9.00,48.00,3.00,3.50,NULL),(22,'Prote+°na whey vainilla','proteina','Suplemento de prote+°na.',400.00,80.00,10.00,6.00,15.00,NULL),(23,'Fresas','fruta','Fruta ligera.',32.00,1.00,8.00,0.00,4.00,NULL),(24,'Naranja','fruta','Vitamina C.',47.00,1.00,12.00,0.00,2.20,NULL),(25,'Agua con gas','bebida','Sin calor+°as.',0.00,0.00,0.00,0.00,0.50,NULL),(26,'Pechuga de Pavo','proteina','Carne magra ideal para dietas.',115.00,24.00,1.00,1.00,9.90,NULL),(27,'Merluza','proteina','Pescado blanco suave y bajo en grasa.',82.00,18.00,0.00,1.00,12.00,NULL),(28,'Lomo de Cerdo','proteina','Corte magro de cerdo, rico en prote+°na.',165.00,30.00,0.00,4.00,7.50,NULL),(29,'Queso Cottage','lacteo','Queso fresco alto en prote+°na.',98.00,11.00,3.00,4.00,6.80,NULL),(30,'Claras de Huevo','proteina','Fuente pura de prote+°na.',52.00,11.00,0.00,0.00,5.00,NULL),(31,'Tilapia','proteina','Pescado blanco suave y vers+Ìtil.',96.00,20.00,0.00,2.00,11.00,NULL),(32,'Garbanzos Cocidos','legumbre','Legumbre rica en carbohidratos y fibra.',164.00,9.00,27.00,3.00,2.20,NULL),(33,'Lentejas Cocidas','legumbre','Rica en prote+°na vegetal y fibra.',116.00,9.00,20.00,0.00,1.90,NULL),(34,'Edamame','legumbre','Soja tierna rica en prote+°na.',120.00,12.00,10.00,5.00,4.50,NULL),(35,'Tofu Firme','proteina','Fuente vegetal alta en prote+°na.',121.00,14.00,3.00,7.00,6.00,NULL),(36,'Seit+Ìn','proteina','Prote+°na vegetal a base de gluten.',143.00,25.00,8.00,2.00,7.50,NULL),(37,'Pan Integral','cereal','Pan rico en fibra.',247.00,11.00,41.00,4.00,3.50,NULL),(38,'Pasta Integral','cereal','Pasta de trigo integral.',348.00,13.00,72.00,2.00,2.00,NULL),(39,'Arroz Basmati','cereal','Arroz arom+Ìtico de grano largo.',365.00,7.00,78.00,1.00,1.80,NULL),(40,'Cusc+¶s Integral','cereal','S+Æmola de trigo integral.',376.00,13.00,72.00,2.00,2.20,NULL),(41,'Bulgur','cereal','Trigo partido muy nutritivo.',342.00,12.00,76.00,1.00,2.10,NULL),(42,'Copos de Ma+°z','cereal','Cereal de desayuno.',357.00,8.00,84.00,1.00,3.00,NULL),(43,'Avena Instant+Ìnea','cereal','Avena de cocci+¶n r+Ìpida.',389.00,17.00,66.00,7.00,2.60,NULL),(44,'Yogur Griego Light','lacteo','Yogur alto en prote+°na y bajo en grasa.',59.00,10.00,3.00,0.00,4.00,NULL),(45,'Queso Fresco Batido 0%','lacteo','Muy alto en prote+°na y sin grasa.',47.00,9.00,3.00,0.00,4.50,NULL),(46,'Salm+¶n Ahumado','proteina','Pescado rico en omega-3.',180.00,25.00,0.00,10.00,18.00,NULL),(47,'At+¶n en Agua','proteina','Pescado magro alto en prote+°na.',116.00,26.00,1.00,1.00,12.00,NULL),(48,'Sardinas','proteina','Ricas en calcio y omega-3.',208.00,25.00,0.00,11.00,7.00,NULL),(49,'Mejillones','proteina','Marisco rico en minerales.',172.00,24.00,6.00,4.00,6.50,NULL),(50,'Quinoa Cocida','cereal','Pseudo cereal rico en prote+°na.',120.00,4.00,21.00,2.00,7.00,NULL),(51,'Patata Cocida','vegetal','Tub+Ærculo rico en carbohidratos.',87.00,2.00,20.00,0.00,1.20,NULL),(52,'Boniato','vegetal','Alto en vitaminas y carbohidratos complejos.',86.00,1.60,20.00,0.10,1.80,NULL),(53,'Pl+Ìtano','fruta','Alto en potasio y energ+°a.',89.00,1.00,23.00,0.00,1.40,NULL),(54,'Manzana','fruta','Fruta baja en calor+°as.',52.00,0.00,14.00,0.00,1.20,NULL),(55,'Ar+Ìndanos','fruta','Ricos en antioxidantes.',57.00,0.00,14.00,0.00,8.00,NULL),(56,'Nueces','fruto_seco','Altas en grasas saludables.',654.00,15.00,14.00,65.00,12.00,NULL),(57,'Almendras','fruto_seco','Fuente de grasas saludables.',579.00,21.00,22.00,50.00,10.00,NULL),(58,'Anacardos','fruto_seco','Grasa saludable y buen sabor.',553.00,18.00,30.00,44.00,9.00,NULL),(59,'Pistachos','fruto_seco','Ricos en prote+°na y fibra.',560.00,20.00,28.00,45.00,14.00,NULL),(60,'Miel','azucar','Endulzante natural.',304.00,0.00,82.00,0.00,6.00,NULL),(61,'Aceite de Oliva','grasa','Grasa saludable ideal para cocinar.',884.00,0.00,0.00,100.00,7.00,NULL),(62,'Cacahuetes Tostados','fruto_seco','Fuente de grasas y prote+°na.',567.00,26.00,16.00,49.00,6.00,NULL),(63,'Tortitas de Arroz','cereal','Snack ligero.',387.00,8.00,81.00,3.00,3.00,NULL),(64,'Crema de Cacahuete','grasa','Alta en prote+°na y grasas saludables.',588.00,25.00,20.00,50.00,7.00,NULL),(65,'Leche Entera','lacteo','Bebida rica en calcio.',61.00,3.00,5.00,3.00,1.00,NULL),(66,'Leche Semidesnatada','lacteo','Menos grasa que la entera.',47.00,3.00,5.00,1.00,1.00,NULL),(67,'Leche de Avena','bebida','Bebida vegetal.',43.00,1.00,7.00,1.00,2.20,NULL),(68,'Leche de Almendra','bebida','Baja en calor+°as.',15.00,0.60,0.30,1.20,2.50,NULL),(69,'Espinacas','vegetal','Hojas verdes ricas en hierro.',23.00,2.90,3.60,0.40,1.50,NULL),(70,'Br+¶coli','vegetal','Alto en fibra y vitaminas.',34.00,3.00,7.00,0.00,1.80,NULL),(71,'Zanahoria','vegetal','Rica en vitamina A.',41.00,1.00,10.00,0.00,1.20,NULL),(72,'Calabac+°n','vegetal','Muy bajo en calor+°as.',17.00,1.20,3.10,0.30,1.30,NULL),(73,'Pimiento Rojo','vegetal','Muy rico en vitamina C.',31.00,1.00,6.00,0.00,1.80,NULL),(74,'Cebolla','vegetal','Base arom+Ìtica para cocinar.',40.00,1.00,9.00,0.00,1.50,NULL),(75,'Ajo','vegetal','Potente antioxidante.',149.00,6.00,33.00,0.00,4.00,NULL),(76,'Champi+¶ones','vegetal','Bajos en calor+°as y ricos en minerales.',22.00,3.00,3.00,0.00,3.00,NULL);
/*!40000 ALTER TABLE `alimentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_posts`
--

DROP TABLE IF EXISTS `blog_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog_posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `extracto` longtext COLLATE utf8mb4_unicode_ci,
  `contenido` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `imagen_portada` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categoria` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'noticias',
  `es_premium` tinyint(1) NOT NULL DEFAULT '0',
  `destacado` tinyint(1) NOT NULL DEFAULT '0',
  `fecha_publicacion` datetime DEFAULT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_78B2F932989D9B62` (`slug`),
  KEY `idx_categoria` (`categoria`),
  KEY `idx_premium` (`es_premium`),
  KEY `idx_destacado` (`destacado`),
  KEY `idx_fecha_publicacion` (`fecha_publicacion`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_posts`
--

LOCK TABLES `blog_posts` WRITE;
/*!40000 ALTER TABLE `blog_posts` DISABLE KEYS */;
INSERT INTO `blog_posts` VALUES (1,'C+¶mo empezar en el gym','empezar-gym','Gu+°a b+Ìsica.','Empezar en el gimnasio puede parecer abrumador, pero todo se resume en tres pilares: constancia, t+Æcnica y progresi+¶n. Durante las primeras semanas evita cargar demasiado peso y c+Æntrate en aprender los movimientos b+Ìsicos: sentadilla, press de pecho, remo y peso muerto. Entrena tres d+°as por semana con un d+°a de descanso entre sesiones. Prioriza una buena postura, realiza siempre un calentamiento de 5‘«Ù10 minutos y finaliza con estiramientos suaves. Lo m+Ìs importante es crear el h+Ìbito: aunque sea una sesi+¶n corta, cumple tus d+°as marcados. Cuando te sientas c+¶modo, empieza a aumentar cargas poco a poco y lleva un registro de tu progreso.','https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D','noticias',0,1,'2025-12-06 20:28:42','2025-12-06 20:28:42','2025-12-07 11:49:55'),(2,'HIIT para perder grasa','hiit-grasa','Entrena HIIT.','El entrenamiento HIIT (High Intensity Interval Training) se basa en alternar periodos cortos de esfuerzo m+Ìximo con descansos breves. Su eficacia para perder grasa se debe al efecto EPOC, que provoca que el cuerpo siga quemando calor+°as incluso horas despu+Æs de terminar. Un ejemplo de rutina HIIT para principiantes ser+°a: 30 segundos de sprint + 30 segundos de descanso durante 10 rondas. Tambi+Æn puedes hacerlo con ejercicios como burpees, jumping jacks o mountain climbers. Realiza HIIT un m+Ìximo de 2‘«Ù3 veces por semana para evitar el sobreentrenamiento y comb+°nalo con entrenamiento de fuerza para mejores resultados.','https://images.unsplash.com/flagged/photo-1556746834-1cb5b8fabd54?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D','entrenamiento',1,0,'2025-12-06 20:28:42','2025-12-06 20:28:42','2025-12-07 11:50:08'),(6,'Rutina de fuerza para principiantes','fuerza-principiantes','Empieza a ganar fuerza.','Una rutina de fuerza para principiantes debe ser simple, progresiva y segura. Lo ideal es usar un programa full-body tres veces por semana. Los ejercicios b+Ìsicos son: sentadilla, press de pecho, remo con barra, peso muerto rumano, press militar y zancadas. Realiza 3 series de 8‘«Ù12 repeticiones con un peso que te permita mantener buena t+Æcnica. Enf+¶cate en aprender el patr+¶n de movimiento antes de aumentar cargas. Descansa de 1 a 2 minutos entre series. El objetivo inicial no es levantar pesado, sino construir una base s+¶lida que te permita progresar de manera constante sin lesiones.','https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D','entrenamiento',0,0,'2025-12-06 20:28:42','2025-12-07 10:42:08','2025-12-07 11:50:17'),(7,'Alimentos para aumentar masa muscular','alimentos-masa-muscular','Qu+Æ comer para crecer.','Para ganar masa muscular necesitas un super+Ìvit cal+¶rico moderado y una ingesta adecuada de prote+°na. Prioriza alimentos densos nutricionalmente: pollo, pavo, salm+¶n, huevos, quinoa, avena, arroz, legumbres y frutos secos. Incluye entre 1,6 y 2,2 gramos de prote+°na por kilo de peso corporal al d+°a. A+¶ade carbohidratos complejos como batata, pasta integral o arroz para tener energ+°a durante los entrenamientos. No olvides las grasas saludables procedentes de aguacate, aceite de oliva, nueces y semillas. Realiza 4‘«Ù5 comidas al d+°a y acomp+Ì+¶alas con agua suficiente para optimizar la digesti+¶n y el rendimiento.','https://plus.unsplash.com/premium_photo-1723377627996-1003fa5152cb?q=80&w=921&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D','nutricion',1,1,'2025-12-06 20:28:42','2025-12-07 10:42:08','2025-12-07 11:50:25'),(8,'Cardio inteligente: cu+Ìnto necesitas','cardio-inteligente','Evita el sobreentrenamiento.','El cardio inteligente consiste en ajustar la cantidad y el tipo de cardio seg+¶n tu objetivo. Para perder grasa, se recomiendan 120‘«Ù180 minutos semanales de cardio moderado o 2‘«Ù3 sesiones de HIIT. Para mantenimiento, 90 minutos son suficientes. Para mejorar la salud cardiovascular, alterna entrenamientos suaves (caminar r+Ìpido, bici) con sesiones m+Ìs intensas. Evita hacer cardio excesivo si tu meta es ganar masa muscular, ya que puede afectar al super+Ìvit cal+¶rico. Lo importante es elegir un tipo de cardio que disfrutes para garantizar la constancia.','https://images.unsplash.com/photo-1607962837359-5e7e89f86776?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D','noticias',0,0,'2025-12-06 20:28:42','2025-12-07 10:42:08','2025-12-07 11:50:33'),(9,'Entrenamiento en casa sin material','entrenar-en-casa','Rutina completa sin equipo.','Entrenar en casa sin material es totalmente viable si usas ejercicios multiarticulares que trabajen todo el cuerpo. Una rutina recomendada ser+°a: sentadillas, zancadas, flexiones, fondos en silla, plancha, mountain climbers y burpees. Realiza 3 rondas de 12‘«Ù20 repeticiones cada una. Para aumentar intensidad, prueba variaciones como flexiones inclinadas, sentadillas a una pierna asistidas o planchas con elevaci+¶n de piernas. Entrenar en casa requiere disciplina: fija un horario, elimina distracciones y crea un espacio de entrenamiento c+¶modo.','https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D','entrenamiento',0,1,'2025-12-06 20:28:42','2025-12-07 10:42:08','2025-12-07 11:50:48'),(10,'C+¶mo mejorar tu movilidad','mejorar-movilidad','Movilidad para todos.','La movilidad es clave para prevenir lesiones y mejorar el rendimiento deportivo. Dedica 10 minutos al d+°a a trabajar movimientos articulares controlados (CARs) en cadera, hombro y columna. A+¶ade estiramientos din+Ìmicos antes de entrenar, como balanceos de pierna, rotaciones tor+Ìcicas y movilidad de tobillo. Apr+øs de entrenar, utiliza estiramientos est+Ìticos suaves de 20‘«Ù30 segundos. Para progresar, combina movilidad con fortalecimiento: por ejemplo, sentadillas profundas, peso muerto rumano ligero y ejercicios de gl+¶teo medio. La constancia es m+Ìs importante que la intensidad.','https://plus.unsplash.com/premium_photo-1726826450313-bf8c427941e1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D','salud',0,0,'2025-12-06 20:28:42','2025-12-07 10:42:08','2025-12-07 11:51:05'),(11,'Suplementos que s+° funcionan','suplementos-efectivos','Lo que realmente sirve.','Los suplementos no sustituyen una buena alimentaci+¶n, pero pueden ayudar en el rendimiento y la recuperaci+¶n. Los que realmente funcionan seg+¶n la evidencia cient+°fica son: prote+°na whey (mejora la recuperaci+¶n), creatina monohidrato (aumenta fuerza y masa muscular), cafe+°na (mejora el rendimiento y la concentraci+¶n), omega-3 (salud cardiovascular) y vitamina D si tienes niveles bajos. Evita productos milagro o quemadores de grasa sin respaldo cient+°fico. La clave es tomar dosis adecuadas: creatina 3‘«Ù5 g diarios, cafe+°na 2‘«Ù3 mg/kg antes de entrenar.','https://images.unsplash.com/photo-1709976142774-ce1ef41a8378?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D','nutricion',1,0,'2025-12-06 20:28:42','2025-12-07 10:42:08','2025-12-07 11:51:13'),(12,'Errores comunes en el gimnasio','errores-gimnasio','Evita estos fallos.','Los errores m+Ìs comunes en el gimnasio incluyen: usar demasiada carga, realizar mala t+Æcnica, entrenar sin un plan, no descansar lo suficiente y copiar rutinas avanzadas sin tener la base. Otro error habitual es no llevar registro del progreso: si no controlas series, pesos y repeticiones, es dif+°cil mejorar. Muchos principiantes tambi+Æn descuidan el calentamiento y la movilidad, aumentando el riesgo de lesi+¶n. Recuerda que el progreso llega con constancia, t+Æcnica correcta y una programaci+¶n bien estructurada.','http://plus.unsplash.com/premium_photo-1726826450313-bf8c427941e1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D','noticias',0,1,'2025-12-06 20:28:42','2025-12-07 10:42:08','2025-12-07 11:51:20'),(13,'C+¶mo mantener la motivaci+¶n','mantener-motivacion','Mot+°vate cada d+°a.','Mantener la motivaci+¶n no depende solo de la fuerza de voluntad; necesitas un sistema. Define objetivos realistas, medibles y divididos en metas semanales. Lleva un registro visual del progreso, ya sea en fotos, cargas o medidas corporales. Entrena con m+¶sica que te active y, si es posible, con un compa+¶ero. Cambia la rutina cada 6‘«Ù8 semanas para evitar la monoton+°a. Recuerda que la motivaci+¶n fluct+¶a; por eso es fundamental crear disciplina: incluso en los d+°as malos, haz aunque sea una sesi+¶n corta.','https://images.unsplash.com/photo-1494959764136-6be9eb3c261e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D','salud',0,0,'2025-12-06 20:28:42','2025-12-07 10:42:08','2025-12-07 11:51:29');
/*!40000 ALTER TABLE `blog_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calendario_usuario`
--

DROP TABLE IF EXISTS `calendario_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calendario_usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `dieta_id` int DEFAULT NULL,
  `entrenamiento_id` int DEFAULT NULL,
  `dia_semana` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `completado` tinyint(1) NOT NULL DEFAULT '0',
  `fecha_asignacion` date NOT NULL,
  `notas` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `idx_usuario` (`usuario_id`),
  KEY `idx_dia` (`dia_semana`),
  KEY `IDX_705DADA7615C2CBC` (`dieta_id`),
  KEY `IDX_705DADA7DA1C17D8` (`entrenamiento_id`),
  CONSTRAINT `fk_cal_dieta` FOREIGN KEY (`dieta_id`) REFERENCES `dietas` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_cal_entrenamiento` FOREIGN KEY (`entrenamiento_id`) REFERENCES `entrenamientos` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_cal_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calendario_usuario`
--

LOCK TABLES `calendario_usuario` WRITE;
/*!40000 ALTER TABLE `calendario_usuario` DISABLE KEYS */;
INSERT INTO `calendario_usuario` VALUES (1,1,1,NULL,'lunes',0,'2025-01-06','Inicio programa'),(2,3,1,NULL,'martes',0,'2025-01-07','D+°a de pierna'),(3,3,2,4,'martes',0,'2025-01-07','Hombros y core'),(4,3,2,8,'viernes',0,'2025-01-10','Lower body strength'),(5,6,5,6,'lunes',0,'2025-01-13','Upper push'),(6,6,5,7,'miercoles',0,'2025-01-15','Upper pull'),(7,6,5,8,'viernes',0,'2025-01-17','Lower strength'),(8,8,6,9,'lunes',0,'2025-01-13','Hipertrofia pecho'),(9,8,6,2,'miercoles',0,'2025-01-15','Espalda y b+°ceps'),(10,8,6,3,'viernes',0,'2025-01-17','Piernas'),(11,10,4,10,'martes',0,'2025-01-14','CrossFit funcional'),(12,10,4,11,'jueves',0,'2025-01-16','Movilidad'),(13,11,3,1,'lunes',0,'2025-12-06','Pecho y tr+°ceps'),(14,11,3,2,'martes',0,'2025-12-07','Espalda y b+°ceps'),(15,11,3,3,'miercoles',0,'2025-12-08','Piernas completo'),(16,11,3,4,'jueves',0,'2025-12-09','Hombros y core'),(17,11,3,5,'viernes',0,'2025-12-10','Full body');
/*!40000 ALTER TABLE `calendario_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dias_ejercicios`
--

DROP TABLE IF EXISTS `dias_ejercicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dias_ejercicios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dia_entrenamiento_id` int NOT NULL,
  `ejercicio_id` int NOT NULL,
  `series` int NOT NULL DEFAULT '3',
  `repeticiones` int NOT NULL DEFAULT '12',
  `descanso_segundos` int NOT NULL DEFAULT '60',
  `notas` longtext COLLATE utf8mb4_unicode_ci,
  `orden` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_dia_entrenamiento` (`dia_entrenamiento_id`),
  KEY `idx_ejercicio` (`ejercicio_id`),
  CONSTRAINT `fk_dia_ejercicio_dia` FOREIGN KEY (`dia_entrenamiento_id`) REFERENCES `dias_entrenamiento` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_dia_ejercicio_ejercicio` FOREIGN KEY (`ejercicio_id`) REFERENCES `ejercicios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dias_ejercicios`
--

LOCK TABLES `dias_ejercicios` WRITE;
/*!40000 ALTER TABLE `dias_ejercicios` DISABLE KEYS */;
INSERT INTO `dias_ejercicios` VALUES (8,8,1,4,12,90,'Bajar controlado',1),(9,8,2,3,10,60,'Pecho y triceps',2),(10,8,9,3,12,60,'Espalda recta',3),(11,8,16,3,0,45,'30-45 seg por lado',4),(12,10,3,3,10,90,'Cuidado con la lumbar',1),(13,10,13,3,12,60,'Hombros completos',2),(14,10,21,3,12,60,'No bloquear rodillas',3),(15,12,17,4,20,45,'Ritmo alto',1),(16,12,4,3,8,90,'Usar asistencia si es necesario',2),(17,12,18,3,30,45,'Cardio intenso',3),(18,12,5,3,15,45,'Congestin final',4),(19,15,49,3,12,60,'',1),(20,15,50,3,12,60,'',2),(21,16,57,3,12,60,'',1),(22,16,8,3,12,60,'',2),(23,17,4,3,12,60,'',1),(24,17,9,3,12,60,'',2),(25,18,5,3,12,60,'',1),(26,18,14,3,12,60,'',2),(27,19,42,3,12,60,'',1),(28,19,62,3,12,60,'',2);
/*!40000 ALTER TABLE `dias_ejercicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dias_entrenamiento`
--

DROP TABLE IF EXISTS `dias_entrenamiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dias_entrenamiento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entrenamiento_id` int NOT NULL,
  `dia_semana` int NOT NULL,
  `concepto` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `es_descanso` tinyint(1) NOT NULL DEFAULT '0',
  `orden` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_entrenamiento` (`entrenamiento_id`),
  KEY `idx_dia_semana` (`dia_semana`),
  CONSTRAINT `fk_dia_entrenamiento_entrenamiento` FOREIGN KEY (`entrenamiento_id`) REFERENCES `entrenamientos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dias_entrenamiento`
--

LOCK TABLES `dias_entrenamiento` WRITE;
/*!40000 ALTER TABLE `dias_entrenamiento` DISABLE KEYS */;
INSERT INTO `dias_entrenamiento` VALUES (1,9,1,'Fullbody - nfasis Pierna',0,1),(2,9,2,'Caminata ligera o Descanso',1,2),(3,9,3,'Fullbody - nfasis Empuje',0,3),(4,9,4,'Descanso Total',1,4),(5,9,5,'Fullbody - Metablico',0,5),(6,9,6,'Actividad libre',1,6),(7,9,7,'Descanso',1,7),(8,10,1,'Fullbody - nfasis Pierna',0,1),(9,10,2,'Descanso Activo',1,2),(10,10,3,'Fullbody - nfasis Empuje',0,3),(11,10,4,'Descanso Total',1,4),(12,10,5,'Fullbody - Metablico',0,5),(13,10,6,'Actividad libre',1,6),(14,10,7,'Descanso',1,7),(15,11,1,'Piernas',0,1),(16,11,2,'Empuje',0,2),(17,11,3,'Tir+¶n',0,3),(18,11,4,'Brazos',0,4),(19,11,5,'Full Body',0,5),(20,11,6,'',1,6),(21,11,7,'',1,7);
/*!40000 ALTER TABLE `dias_entrenamiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dieta_platos`
--

DROP TABLE IF EXISTS `dieta_platos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dieta_platos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dieta_id` int NOT NULL,
  `plato_id` int NOT NULL,
  `dia_semana` enum('lunes','martes','miercoles','jueves','viernes','sabado','domingo') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_comida` enum('desayuno','media_manana','almuerzo','merienda','cena','post_entreno') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `orden` int NOT NULL DEFAULT '1',
  `notas` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_dieta_dia_comida_orden` (`dieta_id`,`dia_semana`,`tipo_comida`,`orden`),
  KEY `idx_dieta` (`dieta_id`),
  KEY `idx_plato` (`plato_id`),
  KEY `idx_dia_tipo` (`dia_semana`,`tipo_comida`),
  CONSTRAINT `fk_dieta_plato_dieta` FOREIGN KEY (`dieta_id`) REFERENCES `dietas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_dieta_plato_plato` FOREIGN KEY (`plato_id`) REFERENCES `platos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dieta_platos`
--

LOCK TABLES `dieta_platos` WRITE;
/*!40000 ALTER TABLE `dieta_platos` DISABLE KEYS */;
INSERT INTO `dieta_platos` VALUES (1,1,1,'lunes','almuerzo',1,NULL),(2,1,2,'lunes','desayuno',2,NULL),(3,2,3,'martes','cena',1,NULL),(4,3,5,'lunes','desayuno',1,'Bol de avena con frutas.'),(5,3,6,'lunes','media_manana',2,'Yogur con frutos secos.'),(6,3,8,'lunes','almuerzo',3,'Ensalada de pollo y quinoa.'),(7,3,7,'lunes','merienda',4,'Fruta variada.'),(8,3,9,'lunes','cena',5,'Bowl de salm+¶n y arroz integral.'),(9,3,4,'martes','desayuno',1,'Tostadas aguacate y huevo.'),(10,3,7,'martes','media_manana',2,'Fruta variada.'),(11,3,14,'martes','almuerzo',3,'Wrap integral de pollo y verduras.'),(12,3,6,'martes','merienda',4,'Yogur con frutos secos.'),(13,3,10,'martes','cena',5,'Merluza al horno con verduras.'),(14,3,5,'miercoles','desayuno',1,'Bol de avena.'),(15,3,6,'miercoles','media_manana',2,'Yogur con frutos secos.'),(16,3,15,'miercoles','almuerzo',3,'Ensalada de garbanzos y at+¶n.'),(17,3,7,'miercoles','merienda',4,'Fruta variada.'),(18,3,11,'miercoles','cena',5,'Tortilla + ensalada.'),(19,3,4,'jueves','desayuno',1,'Tostadas aguacate y huevo.'),(20,3,7,'jueves','media_manana',2,'Fruta variada.'),(21,3,1,'jueves','almuerzo',3,'Pollo con arroz (plato base).'),(22,3,6,'jueves','merienda',4,'Yogur con frutos secos.'),(23,3,3,'jueves','cena',5,'Salm+¶n al horno.'),(24,3,5,'viernes','desayuno',1,'Bol de avena.'),(25,3,6,'viernes','media_manana',2,'Yogur con frutos secos.'),(26,3,8,'viernes','almuerzo',3,'Ensalada de pollo y quinoa.'),(27,3,7,'viernes','merienda',4,'Fruta variada.'),(28,3,9,'viernes','cena',5,'Bowl de salm+¶n.'),(29,3,4,'sabado','desayuno',1,'Tostadas aguacate y huevo.'),(30,3,7,'sabado','media_manana',2,'Fruta variada.'),(31,3,14,'sabado','almuerzo',3,'Wrap integral de pollo.'),(32,3,6,'sabado','merienda',4,'Yogur con frutos secos.'),(33,3,10,'sabado','cena',5,'Merluza con verduras.'),(34,3,5,'domingo','desayuno',1,'Bol de avena.'),(35,3,6,'domingo','media_manana',2,'Yogur con frutos secos.'),(36,3,15,'domingo','almuerzo',3,'Ensalada de garbanzos y at+¶n.'),(37,3,7,'domingo','merienda',4,'Fruta variada.'),(38,3,11,'domingo','cena',5,'Tortilla + ensalada.'),(39,4,14,'lunes','desayuno',1,NULL),(40,4,15,'lunes','media_manana',1,NULL),(41,4,16,'lunes','almuerzo',1,NULL),(42,4,19,'lunes','post_entreno',1,NULL),(43,4,18,'lunes','cena',1,NULL),(44,4,14,'martes','desayuno',1,NULL),(45,4,16,'martes','almuerzo',1,NULL),(46,4,18,'martes','cena',1,NULL),(47,4,14,'miercoles','desayuno',1,NULL),(48,4,16,'miercoles','almuerzo',1,NULL),(49,4,18,'miercoles','cena',1,NULL),(50,4,14,'jueves','desayuno',1,NULL),(51,4,16,'jueves','almuerzo',1,NULL),(52,4,18,'jueves','cena',1,NULL),(53,4,14,'viernes','desayuno',1,NULL),(54,4,16,'viernes','almuerzo',1,NULL),(55,4,19,'viernes','post_entreno',1,NULL),(56,4,18,'viernes','cena',1,NULL),(57,4,14,'sabado','desayuno',1,NULL),(58,4,16,'sabado','almuerzo',1,NULL),(59,4,18,'sabado','cena',1,NULL),(60,4,14,'domingo','desayuno',1,NULL),(61,4,16,'domingo','almuerzo',1,NULL),(62,4,18,'domingo','cena',1,NULL);
/*!40000 ALTER TABLE `dieta_platos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dietas`
--

DROP TABLE IF EXISTS `dietas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dietas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `creador_id` int DEFAULT NULL,
  `asignado_a_usuario_id` int DEFAULT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` longtext COLLATE utf8mb4_unicode_ci,
  `calorias_totales` int DEFAULT NULL,
  `proteinas_totales` decimal(6,2) DEFAULT NULL,
  `carbohidratos_totales` decimal(6,2) DEFAULT NULL,
  `grasas_totales` decimal(6,2) DEFAULT NULL,
  `es_publica` tinyint(1) NOT NULL DEFAULT '1',
  `valoracion_promedio` decimal(3,2) NOT NULL DEFAULT '0.00',
  `total_valoraciones` int NOT NULL DEFAULT '0',
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_creador` (`creador_id`),
  KEY `idx_publica` (`es_publica`),
  KEY `idx_dieta_asignado` (`asignado_a_usuario_id`),
  CONSTRAINT `fk_dieta_asignado_usuario` FOREIGN KEY (`asignado_a_usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_dieta_creador` FOREIGN KEY (`creador_id`) REFERENCES `entrenadores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dietas`
--

LOCK TABLES `dietas` WRITE;
/*!40000 ALTER TABLE `dietas` DISABLE KEYS */;
INSERT INTO `dietas` VALUES (1,2,1,'Definici+¶n','Dieta para perder grasa.',1800,NULL,NULL,NULL,1,0.00,0,'2025-12-06 20:28:04'),(2,3,3,'Volumen','Dieta para ganar masa.',2600,180.00,320.00,70.00,1,0.00,0,'2025-12-06 20:28:04'),(3,1,1,'Dieta Ana - Definici+¶n Semana 1','Dieta semanal para definici+¶n suave con 5 comidas/d+°a.',1900,NULL,NULL,NULL,1,0.00,0,'2025-12-06 21:09:41'),(4,1,10,'Dieta Volumen Hugo','Plan personalizado',2600,195.00,255.00,77.00,0,0.00,0,'2025-12-06 22:39:57'),(5,2,1,'Definici+¶n','Dieta para perder grasa.',1800,NULL,NULL,NULL,1,0.00,0,'2025-12-06 20:28:04'),(6,3,3,'Volumen','Dieta para ganar masa.',2600,180.00,320.00,70.00,1,0.00,0,'2025-12-06 20:28:04'),(7,1,1,'Dieta Ana - Definici+¶n Semana 1','Dieta semanal para definici+¶n suave con 5 comidas/d+°a',1900,NULL,NULL,NULL,1,0.00,0,'2025-12-06 21:09:41'),(8,1,10,'Dieta Volumen Hugo','Plan personalizado',2600,195.00,255.00,77.00,0,0.00,0,'2025-12-06 22:39:57'),(9,4,6,'Dieta Equilibrada - Mantenimiento','Plan balanceado para mantener peso y salud +¶ptima',2200,140.00,270.00,75.00,1,0.00,0,'2025-12-07 10:00:00'),(10,5,8,'Dieta Alta en Prote+°na - Deportistas','Plan rico en prote+°nas para deportistas activos',2800,210.00,300.00,85.00,1,0.00,0,'2025-12-07 10:30:00');
/*!40000 ALTER TABLE `dietas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctrine_migration_versions`
--

DROP TABLE IF EXISTS `doctrine_migration_versions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctrine_migration_versions` (
  `version` varchar(191) COLLATE utf8mb3_unicode_ci NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctrine_migration_versions`
--

LOCK TABLES `doctrine_migration_versions` WRITE;
/*!40000 ALTER TABLE `doctrine_migration_versions` DISABLE KEYS */;
/*!40000 ALTER TABLE `doctrine_migration_versions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ejercicios`
--

DROP TABLE IF EXISTS `ejercicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ejercicios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `grupo_muscular` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` longtext COLLATE utf8mb4_unicode_ci,
  `video_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nivel_dificultad` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'intermedio',
  `valoracion_promedio` decimal(3,2) NOT NULL DEFAULT '0.00',
  `total_valoraciones` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_tipo` (`tipo`),
  KEY `idx_nivel` (`nivel_dificultad`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ejercicios`
--

LOCK TABLES `ejercicios` WRITE;
/*!40000 ALTER TABLE `ejercicios` DISABLE KEYS */;
INSERT INTO `ejercicios` VALUES (1,'Sentadilla','fuerza','piernas','B+Ìsico de pierna.',NULL,'intermedio',0.00,0),(2,'Press banca','fuerza','pecho','Empuje horizontal.',NULL,'intermedio',0.00,0),(3,'Peso muerto','fuerza','espalda','Cadena posterior.',NULL,'avanzado',0.00,0),(4,'Dominadas','fuerza','espalda','Tracci+¶n vertical.',NULL,'avanzado',0.00,0),(5,'Curl b+°ceps','fuerza','brazos','Aislamiento b+°ceps.',NULL,'facil',0.00,0),(6,'Press mancuerna plano','fuerza','pecho','Press con mancuernas en banco plano.',NULL,'intermedio',0.00,0),(7,'Press mancuerna inclinado','fuerza','pecho','Enfoque en pecho superior.',NULL,'intermedio',0.00,0),(8,'Aperturas con mancuernas','fuerza','pecho','A+°sla el pecho.',NULL,'intermedio',0.00,0),(9,'Remo con mancuerna','fuerza','espalda','Remo unilateral.',NULL,'intermedio',0.00,0),(10,'Jal+¶n al pecho','fuerza','espalda','Tracci+¶n guiada en polea.',NULL,'facil',0.00,0),(11,'Face pull en polea','fuerza','hombros','Parte posterior del hombro.',NULL,'facil',0.00,0),(12,'Elevaciones laterales','fuerza','hombros','Trabajo del deltoides lateral.',NULL,'facil',0.00,0),(13,'Press Arnold','fuerza','hombros','Variaci+¶n de press hombro.',NULL,'intermedio',0.00,0),(14,'Curl martillo','fuerza','brazos','B+°ceps y braquial.',NULL,'facil',0.00,0),(15,'Press franc+Æs','fuerza','brazos','Tr+°ceps en banco.',NULL,'intermedio',0.00,0),(16,'Plancha lateral','core','core','Core y oblicuos.',NULL,'facil',0.00,0),(17,'Mountain climbers','cardio','fullbody','Ejercicio din+Ìmico de core.',NULL,'intermedio',0.00,0),(18,'Jumping jacks','cardio','fullbody','Cardio b+Ìsico.',NULL,'facil',0.00,0),(19,'Sprints en cinta','cardio','piernas','Intervalos de carrera.',NULL,'avanzado',0.00,0),(20,'Peso muerto rumano','fuerza','piernas','Isquios y gl+¶teos.',NULL,'intermedio',0.00,0),(21,'Prensa de pierna','fuerza','piernas','M+Ìquina de pierna.',NULL,'facil',0.00,0),(22,'Abductor en m+Ìquina','fuerza','gluteos','Gl+¶teo medio en m+Ìquina.',NULL,'facil',0.00,0),(23,'Crunch en polea','core','core','Abdomen con carga.',NULL,'intermedio',0.00,0),(24,'Plancha con apoyo en fitball','core','core','Mayor inestabilidad.',NULL,'avanzado',0.00,0),(25,'Remo invertido','fuerza','espalda','Remo con peso corporal.',NULL,'intermedio',0.00,0),(26,'Burpees','workout','Full Body','Ejercicio explosivo que combina salto, flexi+¶n y sentadilla.',NULL,'intermedio',0.00,0),(27,'Burpee Box Jump','workout','Full Body','Burpee seguido de salto sobre caja.',NULL,'avanzado',0.00,0),(28,'Mountain Climbers','workout','Core','Ejercicio r+Ìpido que simula escalada.',NULL,'intermedio',0.00,0),(29,'High Knees','workout','Piernas','Elevaci+¶n r+Ìpida de rodillas en el sitio.',NULL,'f+Ìcil',0.00,0),(30,'Jumping Jacks','workout','Full Body','Ejercicio aer+¶bico cl+Ìsico de saltos coordinados.',NULL,'f+Ìcil',0.00,0),(31,'Sprint 50m','workout','Piernas','Carrera explosiva a m+Ìxima velocidad.',NULL,'avanzado',0.00,0),(32,'Sprint Intervalos','workout','Piernas','Ciclos de sprint y descanso.',NULL,'intermedio',0.00,0),(33,'Skips Running Drill','workout','Piernas','T+Æcnica de carrera con elevaciones.',NULL,'intermedio',0.00,0),(34,'Running T+Æcnico (Pose Method)','workout','Piernas','Ejercicio para mejorar t+Æcnica de carrera.',NULL,'intermedio',0.00,0),(35,'Zancadas Saltando','workout','Piernas','Lunges explosivos con salto.',NULL,'avanzado',0.00,0),(36,'Squat Jumps','workout','Piernas','Sentadilla con salto vertical potente.',NULL,'intermedio',0.00,0),(37,'Box Jump','workout','Piernas','Salto pliom+Ætrico sobre caja.',NULL,'intermedio',0.00,0),(38,'Kettlebell Swing','workout','Cadera','Movimiento bal+°stico con pesa rusa.',NULL,'intermedio',0.00,0),(39,'Kettlebell Clean','workout','Full Body','Movimiento t+Æcnico con kettlebell hasta el rack.',NULL,'avanzado',0.00,0),(40,'Kettlebell Snatch','workout','Full Body','Movimiento explosivo encima de la cabeza.',NULL,'avanzado',0.00,0),(41,'Wall Ball Shots','workout','Full Body','Lanzamiento de bal+¶n medicinal a la pared.',NULL,'intermedio',0.00,0),(42,'Double Unders','workout','Full Body','Saltos con cuerda pasando dos veces por salto.',NULL,'avanzado',0.00,0),(43,'Single Unders','workout','Full Body','Saltos b+Ìsicos con cuerda.',NULL,'f+Ìcil',0.00,0),(44,'Bear Crawl','workout','Full Body','Desplazamiento en cuadrupedia.',NULL,'intermedio',0.00,0),(45,'Crab Walk','workout','Full Body','Desplazamiento hacia atr+Ìs apoyado en manos y pies.',NULL,'intermedio',0.00,0),(46,'Handstand Hold','workout','Hombros','Mantener equilibrio en posici+¶n invertida.',NULL,'avanzado',0.00,0),(47,'Handstand Walk','workout','Hombros','Caminar haciendo el pino.',NULL,'avanzado',0.00,0),(48,'Capoeira Ginga','workout','Full Body','Movimiento b+Ìsico de capoeira de balanceo.',NULL,'f+Ìcil',0.00,0),(49,'Capoeira Meia Lua','workout','Piernas','Patada circular de capoeira.',NULL,'intermedio',0.00,0),(50,'Capoeira Armada','workout','Piernas','Patada giratoria de alto impacto.',NULL,'avanzado',0.00,0),(51,'Capoeira Au (Rueda Lateral)','workout','Full Body','Acrobacia lateral t+°pica de capoeira.',NULL,'intermedio',0.00,0),(52,'Zumba Salsa Step','workout','Cardio','Movimiento r+°tmico inspirado en salsa.',NULL,'f+Ìcil',0.00,0),(53,'Zumba Reggaeton Step','workout','Cardio','Pasos explosivos con ritmo urbano.',NULL,'intermedio',0.00,0),(54,'Zumba Merengue March','workout','Cardio','Movimiento r+Ìpido de marchado.',NULL,'f+Ìcil',0.00,0),(55,'Zumba Cadera Twist','workout','Cadera','Movimientos circulares r+Ìpidos de cadera.',NULL,'f+Ìcil',0.00,0),(56,'Battle Ropes - Ondas','workout','Full Body','Ondas con cuerdas de batalla.',NULL,'intermedio',0.00,0),(57,'Battle Ropes - Slams','workout','Hombros','Golpes explosivos hacia el suelo.',NULL,'avanzado',0.00,0),(58,'Farmer Walk','workout','Agarre','Caminata cargando peso a los lados.',NULL,'intermedio',0.00,0),(59,'Sled Push','workout','Piernas','Empuje de trineo con peso.',NULL,'avanzado',0.00,0),(60,'Sled Pull','workout','Piernas','Arrastre de trineo hacia atr+Ìs.',NULL,'intermedio',0.00,0),(61,'Medicine Ball Slam','workout','Full Body','Golpe explosivo del bal+¶n contra el suelo.',NULL,'intermedio',0.00,0),(62,'Turkish Get Up','workout','Full Body','Movimiento t+Æcnico con peso desde el suelo.',NULL,'avanzado',0.00,0),(63,'Side Shuffle','workout','Piernas','Desplazamiento r+Ìpido lateral.',NULL,'f+Ìcil',0.00,0),(64,'Ladder Drills (Agility)','workout','Piernas','Ejercicios de agilidad en escalera.',NULL,'intermedio',0.00,0);
/*!40000 ALTER TABLE `ejercicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entrenadores`
--

DROP TABLE IF EXISTS `entrenadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entrenadores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellidos` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `especialidad` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ambos',
  `certificacion` longtext COLLATE utf8mb4_unicode_ci,
  `anos_experiencia` int NOT NULL DEFAULT '0',
  `biografia` longtext COLLATE utf8mb4_unicode_ci,
  `cv_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `foto_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `valoracion_promedio` decimal(3,2) NOT NULL DEFAULT '0.00',
  `total_valoraciones` int NOT NULL DEFAULT '0',
  `precio_sesion_presencial` decimal(6,2) NOT NULL DEFAULT '35.00',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `estado_aplicacion` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'aprobado',
  `motivo_rechazo` longtext COLLATE utf8mb4_unicode_ci,
  `fecha_aplicacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_E15FDEE2E7927C74` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_activo` (`activo`),
  KEY `idx_estado_aplicacion` (`estado_aplicacion`),
  KEY `idx_anos_experiencia` (`anos_experiencia`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entrenadores`
--

LOCK TABLES `entrenadores` WRITE;
/*!40000 ALTER TABLE `entrenadores` DISABLE KEYS */;
INSERT INTO `entrenadores` VALUES (1,'Carlos','Mart+°nez','carlos.entrenador@example.com','$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy4LjGr3gkEW','600123111','ambos',NULL,5,'Entrenador especializado en fuerza.',NULL,NULL,0.00,0,35.00,1,'aprobado',NULL,NULL),(2,'Laura','G+¶mez','laura.entrenadora@example.com','$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy4LjGr3gkEW','611234222','alimentacion',NULL,7,'Dietista enfocada en recomposici+¶n corporal.',NULL,NULL,0.00,0,35.00,1,'aprobado',NULL,NULL),(3,'David','Ruiz','druiz@example.com','$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy4LjGr3gkEW','622345333','entrenamiento',NULL,3,'Entrenador joven experto en hipertrofia.',NULL,NULL,0.00,0,35.00,1,'aprobado',NULL,NULL),(4,'Marta','Santos','msantos@example.com','$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy4LjGr3gkEW','633456444','ambos',NULL,10,'Especialista en p+Ærdida de grasa.',NULL,NULL,0.00,0,35.00,1,'aprobado',NULL,NULL),(5,'Jorge','L+¶pez','jlopez@example.com','$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy4LjGr3gkEW','644567555','entrenamiento',NULL,8,'Preparador f+°sico general.',NULL,NULL,0.00,0,35.00,1,'aprobado',NULL,NULL),(6,'Elena','Fern+Ìndez','elena.f@example.com','$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy...','655678666','ambos',NULL,6,'Entrenadora especializada en fitness y nutrici+¶n deportiva.',NULL,NULL,0.00,0,40.00,1,'aprobado',NULL,NULL),(7,'Ra+¶l','Jim+Ænez','raul.j@example.com','$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy...','666789777','entrenamiento',NULL,12,'Coach deportivo con experiencia en atletas de +Ælite.',NULL,NULL,0.00,0,50.00,1,'aprobado',NULL,NULL),(8,'Patricia','Morales','patricia.m@example.com','$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy...','677890888','alimentacion',NULL,9,'Nutricionista deportiva especializada en dietas personalizadas.',NULL,NULL,0.00,0,38.00,1,'aprobado',NULL,NULL),(9,'Alberto','Navarro','alberto.n@example.com','$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy...','688901999','entrenamiento',NULL,4,'Entrenador funcional y de CrossFit.',NULL,NULL,0.00,0,35.00,1,'aprobado',NULL,NULL),(10,'Cristina','Vega','cristina.v@example.com','$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy...','699012000','ambos',NULL,11,'Experta en rehabilitaci+¶n y entrenamiento personalizado.',NULL,NULL,0.00,0,45.00,1,'aprobado',NULL,NULL);
/*!40000 ALTER TABLE `entrenadores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entrenamiento_ejercicios`
--

DROP TABLE IF EXISTS `entrenamiento_ejercicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entrenamiento_ejercicios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entrenamiento_id` int NOT NULL,
  `ejercicio_id` int NOT NULL,
  `orden` int NOT NULL,
  `series` int DEFAULT NULL,
  `repeticiones` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descanso_segundos` int DEFAULT NULL,
  `notas` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `idx_entrenamiento` (`entrenamiento_id`),
  KEY `idx_ejercicio` (`ejercicio_id`),
  CONSTRAINT `fk_entren_ejercicio_ejercicio` FOREIGN KEY (`ejercicio_id`) REFERENCES `ejercicios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_entren_ejercicio_entrenamiento` FOREIGN KEY (`entrenamiento_id`) REFERENCES `entrenamientos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entrenamiento_ejercicios`
--

LOCK TABLES `entrenamiento_ejercicios` WRITE;
/*!40000 ALTER TABLE `entrenamiento_ejercicios` DISABLE KEYS */;
INSERT INTO `entrenamiento_ejercicios` VALUES (6,1,1,1,4,'12',90,'Press banca - Mantener buenos +Ìngulos'),(7,1,5,2,3,'15',60,'Press inclinado - Contracci+¶n m+Ìxima'),(8,1,8,3,3,'12',60,'Fondos en paralelas - Control del movimiento'),(9,1,12,4,3,'15',45,'Tr+°ceps en polea - Mantener tensi+¶n'),(10,1,16,5,3,'20',45,'Extensiones tr+°ceps - Forma perfecta'),(11,2,3,1,4,'10',90,'Dominadas - Retracci+¶n escapular completa'),(12,2,4,2,4,'12',75,'Remo con barra - Espalda recta'),(13,2,7,3,3,'12',60,'Peso muerto - T+Æcnica impecable'),(14,2,10,4,3,'12',60,'Curl de b+°ceps - Sin balanceo'),(15,2,14,5,3,'15',45,'Curl martillo - Control exc+Æntrico'),(16,3,6,1,4,'15',120,'Sentadillas - Profundidad completa'),(17,3,9,2,4,'12',90,'Prensa de piernas - ROM completo'),(18,3,18,3,3,'20',60,'Zancadas - Paso largo'),(19,3,22,4,4,'15',75,'Peso muerto rumano - Isquios'),(20,3,25,5,3,'20',45,'Elevaci+¶n gemelos - Pausa arriba'),(21,4,13,1,4,'12',75,'Press militar - Trayectoria vertical'),(22,4,15,2,3,'15',60,'Elevaciones laterales - Control'),(23,4,19,3,3,'12',60,'Remo al ment+¶n - Codos altos'),(24,4,28,4,3,'20',45,'Plancha abdominal - 60 segundos'),(25,4,32,5,3,'20',45,'Crunch abdominal - Contracci+¶n completa'),(26,5,1,1,3,'12',75,'Press banca - Calentamiento'),(27,5,6,2,3,'15',90,'Sentadillas - T+Æcnica perfecta'),(28,5,3,3,3,'10',75,'Dominadas - M+Ìxima intensidad'),(29,5,13,4,3,'12',60,'Press militar - Fuerza'),(30,5,28,5,3,'60',45,'Plancha - Core finalizador'),(31,6,1,1,4,'10',90,'Press banca pesado'),(32,6,5,2,3,'12',75,'Press inclinado'),(33,6,13,3,4,'10',75,'Press militar'),(34,6,15,4,3,'15',60,'Elevaciones laterales'),(35,6,12,5,3,'12',45,'Tr+°ceps finalizador'),(36,7,3,1,4,'8',90,'Dominadas lastradas'),(37,7,4,2,4,'10',75,'Remo con barra'),(38,7,20,3,3,'12',60,'Remo en m+Ìquina'),(39,7,10,4,3,'12',60,'Curl de b+°ceps'),(40,7,14,5,3,'15',45,'Curl martillo'),(41,8,6,1,5,'5',180,'Sentadillas pesadas'),(42,8,7,2,4,'6',150,'Peso muerto'),(43,8,9,3,3,'10',90,'Prensa de piernas'),(44,8,22,4,3,'12',75,'Peso muerto rumano'),(45,8,25,5,4,'15',60,'Gemelos'),(46,9,1,1,4,'12',75,'Press banca'),(47,9,5,2,4,'12',75,'Press inclinado'),(48,9,11,3,3,'15',60,'Aperturas con mancuernas'),(49,9,8,4,3,'12',60,'Fondos'),(50,9,17,5,3,'15',45,'Cruces en polea'),(51,10,30,1,5,'20',60,'Burpees - M+Ìxima intensidad'),(52,10,35,2,4,'30',45,'Mountain Climbers'),(53,10,38,3,3,'15',60,'Box Jumps'),(54,10,42,4,4,'20',45,'Kettlebell Swings'),(55,10,45,5,3,'60',30,'Battle Ropes'),(56,11,28,1,3,'60',30,'Plancha frontal'),(57,11,33,2,3,'20',45,'Plancha lateral'),(58,11,40,3,3,'15',60,'Bird Dog'),(59,11,48,4,3,'12',60,'Puente gl+¶teo'),(60,11,52,5,3,'45',45,'Dead Bug');
/*!40000 ALTER TABLE `entrenamiento_ejercicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entrenamientos`
--

DROP TABLE IF EXISTS `entrenamientos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entrenamientos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `creador_id` int DEFAULT NULL,
  `creador_usuario_id` int DEFAULT NULL,
  `asignado_ausuario_id` int DEFAULT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` longtext COLLATE utf8mb4_unicode_ci,
  `tipo` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duracion_minutos` int DEFAULT NULL,
  `nivel_dificultad` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'intermedio',
  `es_publico` tinyint(1) NOT NULL DEFAULT '1',
  `valoracion_promedio` decimal(3,2) NOT NULL DEFAULT '0.00',
  `total_valoraciones` int NOT NULL DEFAULT '0',
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_creador` (`creador_id`),
  KEY `idx_tipo` (`tipo`),
  KEY `idx_publico` (`es_publico`),
  KEY `IDX_24DCB62BC5745869` (`creador_usuario_id`),
  KEY `IDX_24DCB62B6B62C1A2` (`asignado_ausuario_id`),
  CONSTRAINT `FK_24DCB62B6B62C1A2` FOREIGN KEY (`asignado_ausuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_entrenamiento_creador` FOREIGN KEY (`creador_id`) REFERENCES `entrenadores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_entrenamiento_creador_usuario` FOREIGN KEY (`creador_usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entrenamientos`
--

LOCK TABLES `entrenamientos` WRITE;
/*!40000 ALTER TABLE `entrenamientos` DISABLE KEYS */;
INSERT INTO `entrenamientos` VALUES (1,1,NULL,1,'Ana - Fullbody 3 d+°as','Rutina fullbody para definici+¶n','fuerza',60,'intermedio',0,0.00,0,'2025-12-06 21:22:05'),(2,1,NULL,1,'Ana - Torso/Pierna 4 d+°as','Programa torso / pierna','fuerza',60,'intermedio',0,0.00,0,'2025-12-06 21:22:05'),(3,1,NULL,1,'Ana - Gl+¶teos & Core 3 d+°as','Enfoque en gl+¶teos y abdomen','fuerza',45,'intermedio',0,0.00,0,'2025-12-06 21:22:05'),(4,1,NULL,1,'Ana - HIIT 2 d+°as','Sesiones cortas de alta intensidad','cardio',25,'intermedio',0,0.00,0,'2025-12-06 21:22:05'),(5,1,NULL,1,'Ana - Fullbody 3 d+°as','Rutina fullbody para definici+¶n','fuerza',60,'intermedio',0,0.00,0,'2025-12-06 21:22:15'),(6,1,NULL,1,'Ana - Torso/Pierna 4 d+°as','Programa torso / pierna','fuerza',60,'intermedio',0,0.00,0,'2025-12-06 21:22:15'),(7,1,NULL,1,'Ana - Gl+¶teos & Core 3 d+°as','Enfoque en gl+¶teos y abdomen','fuerza',45,'intermedio',0,0.00,0,'2025-12-06 21:22:15'),(8,1,NULL,1,'Ana - HIIT 2 d+°as','Sesiones cortas de alta intensidad','cardio',25,'intermedio',0,0.00,0,'2025-12-06 21:22:15'),(9,1,NULL,NULL,'Ana - Fullbody 3 das','Rutina de cuerpo completo enfocada en tonificacin y fuerza general. Realizar das alternos.','fuerza',60,'intermedio',0,0.00,0,'2025-12-06 23:25:04'),(10,1,NULL,1,'Ana - Fullbody 3 das','Rutina de cuerpo completo enfocada en tonificacin y fuerza general. Realizar das alternos.','fuerza',60,'intermedio',0,0.00,0,'2025-12-06 23:27:57'),(11,NULL,1,NULL,'Plan Entrenamiento Ana','mi primer entrenamiento','gym',60,'intermedio',0,0.00,0,'2025-12-07 00:44:48');
/*!40000 ALTER TABLE `entrenamientos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_pagos`
--

DROP TABLE IF EXISTS `historial_pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_pagos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `suscripcion_id` int DEFAULT NULL,
  `monto` decimal(10,2) NOT NULL,
  `moneda` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EUR',
  `metodo_pago` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_transaccion_externa` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `fecha_pago` datetime NOT NULL,
  `fecha_actualizacion` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_usuario` (`usuario_id`),
  KEY `IDX_28FB96FB189E045D` (`suscripcion_id`),
  KEY `idx_transaccion` (`id_transaccion_externa`),
  KEY `idx_estado` (`estado`),
  KEY `idx_fecha` (`fecha_pago`),
  CONSTRAINT `fk_historial_pago_suscripcion` FOREIGN KEY (`suscripcion_id`) REFERENCES `suscripciones` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_historial_pago_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_pagos`
--

LOCK TABLES `historial_pagos` WRITE;
/*!40000 ALTER TABLE `historial_pagos` DISABLE KEYS */;
INSERT INTO `historial_pagos` VALUES (1,1,1,29.99,'EUR','tarjeta','TXN-ANA','completado','Primer pago',NULL,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(2,3,2,39.99,'EUR','tarjeta','TXN-SARA','completado','Pago mensual',NULL,'2025-01-05 00:00:00','2025-01-05 00:00:00'),(3,11,NULL,19.99,'EUR','tarjeta','TARJETA-4242-1765054309113','completado','Upgrade premium',NULL,'2025-12-06 20:51:53','2025-12-06 20:51:53'),(4,2,NULL,19.99,'EUR','tarjeta','TARJETA-4224-1765054577040','completado','Upgrade premium',NULL,'2025-12-06 20:56:22','2025-12-06 20:56:22'),(5,1,1,19.99,'EUR','tarjeta','TXN-ANA-001','completado','Pago mensual premium',NULL,'2025-01-01 10:00:00','2025-01-01 10:00:00'),(6,2,2,19.99,'EUR','tarjeta','TXN-LUIS-001','completado','Upgrade premium',NULL,'2025-01-02 11:30:00','2025-01-02 11:30:00'),(7,3,3,19.99,'EUR','tarjeta','TXN-SARA-001','completado','Pago mensual premium',NULL,'2025-01-05 09:15:00','2025-01-05 09:15:00'),(8,6,4,19.99,'EUR','tarjeta','TXN-MARCO-001','completado','Pago mensual premium',NULL,'2025-01-10 14:20:00','2025-01-10 14:20:00'),(9,8,5,19.99,'EUR','tarjeta','TXN-PABLO-001','completado','Pago mensual premium',NULL,'2025-01-15 16:45:00','2025-01-15 16:45:00'),(10,10,6,19.99,'EUR','tarjeta','TXN-HUGO-001','completado','Pago mensual premium',NULL,'2025-01-20 12:30:00','2025-01-20 12:30:00'),(11,11,7,19.99,'EUR','tarjeta','TARJETA-4242-1765054309113','completado','Upgrade premium',NULL,'2025-12-06 20:51:53','2025-12-06 20:51:53'),(12,14,NULL,19.99,'EUR','tarjeta','TARJETA-3232-1765191272510','completado','Upgrade premium',NULL,'2025-12-08 10:54:37','2025-12-08 10:54:37');
/*!40000 ALTER TABLE `historial_pagos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plato_alimentos`
--

DROP TABLE IF EXISTS `plato_alimentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plato_alimentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `plato_id` int NOT NULL,
  `alimento_id` int NOT NULL,
  `cantidad_gramos` decimal(8,2) NOT NULL,
  `orden` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `idx_plato` (`plato_id`),
  KEY `idx_alimento` (`alimento_id`),
  CONSTRAINT `fk_plato_alimento_alimento` FOREIGN KEY (`alimento_id`) REFERENCES `alimentos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_plato_alimento_plato` FOREIGN KEY (`plato_id`) REFERENCES `platos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plato_alimentos`
--

LOCK TABLES `plato_alimentos` WRITE;
/*!40000 ALTER TABLE `plato_alimentos` DISABLE KEYS */;
INSERT INTO `plato_alimentos` VALUES (1,1,1,200.00,1),(2,1,2,150.00,2),(3,2,4,60.00,1),(4,2,5,100.00,2),(5,3,3,200.00,1),(6,4,18,60.00,1),(7,4,11,50.00,2),(8,4,5,60.00,3),(9,5,4,50.00,1),(10,5,6,80.00,2),(11,5,18,30.00,3),(12,6,12,150.00,1),(13,6,13,20.00,2),(14,6,9,15.00,3),(15,7,7,120.00,1),(16,7,19,120.00,2),(17,8,1,120.00,1),(18,8,1,0.00,2),(19,8,10,80.00,3),(20,8,11,40.00,4),(21,9,3,150.00,1),(22,9,2,120.00,2),(23,9,8,50.00,3),(24,10,3,0.00,1),(25,10,8,80.00,2),(26,10,12,60.00,3),(27,11,5,120.00,1),(28,11,16,50.00,2),(29,11,10,30.00,3),(30,12,6,100.00,1),(31,12,17,30.00,2),(32,13,17,100.00,1),(33,13,5,10.00,2),(34,13,9,15.00,3),(35,14,1,100.00,1),(36,14,18,50.00,2),(37,14,10,40.00,3),(38,15,19,120.00,1),(39,15,15,80.00,2),(40,15,10,40.00,3),(41,16,1,100.00,1),(42,16,2,100.00,2),(43,16,15,100.00,3),(44,16,23,100.00,4),(45,16,11,100.00,5),(46,17,5,100.00,1),(47,17,21,100.00,2),(48,17,15,100.00,3),(49,17,11,100.00,4),(50,18,1,100.00,1),(51,18,2,100.00,2),(52,25,3,100.00,1),(53,25,6,100.00,2),(54,25,16,100.00,3),(55,25,15,100.00,4),(56,25,11,100.00,5);
/*!40000 ALTER TABLE `plato_alimentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platos`
--

DROP TABLE IF EXISTS `platos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `platos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `creador_id` int DEFAULT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` longtext COLLATE utf8mb4_unicode_ci,
  `instrucciones` longtext COLLATE utf8mb4_unicode_ci,
  `imagen_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_comida` enum('desayuno','media_manana','almuerzo','merienda','cena','post_entreno') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tiempo_preparacion` int DEFAULT NULL,
  `dificultad` enum('facil','media','dificil') COLLATE utf8mb4_unicode_ci DEFAULT 'media',
  `calorias_totales` decimal(8,2) DEFAULT NULL,
  `proteinas_totales` decimal(8,2) DEFAULT NULL,
  `carbohidratos_totales` decimal(8,2) DEFAULT NULL,
  `grasas_totales` decimal(8,2) DEFAULT NULL,
  `es_publico` tinyint(1) NOT NULL DEFAULT '1',
  `valoracion_promedio` decimal(3,2) NOT NULL DEFAULT '0.00',
  `total_valoraciones` int NOT NULL DEFAULT '0',
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tipo` (`tipo_comida`),
  KEY `idx_publico` (`es_publico`),
  KEY `idx_valoracion` (`valoracion_promedio`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platos`
--

LOCK TABLES `platos` WRITE;
/*!40000 ALTER TABLE `platos` DISABLE KEYS */;
INSERT INTO `platos` VALUES (1,1,'Pollo con arroz','Equilibrado','Cocinar y mezclar.',NULL,'almuerzo',NULL,'facil',NULL,NULL,NULL,NULL,1,0.00,0,'2025-12-06 20:27:30'),(2,2,'Avena con pl+Ìtano','Desayuno energ+Ætico','Mezclar.',NULL,'desayuno',NULL,'facil',NULL,NULL,NULL,NULL,1,0.00,0,'2025-12-06 20:27:30'),(3,3,'Salm+¶n al horno','Rico en omega 3','Hornear 20m.',NULL,'cena',NULL,'media',NULL,NULL,NULL,NULL,1,0.00,0,'2025-12-06 20:27:30'),(4,1,'Tostadas integrales con aguacate y huevo','Desayuno saciante.','Tostar pan, a+¶adir aguacate y huevo a la plancha.',NULL,'desayuno',NULL,'facil',NULL,NULL,NULL,NULL,1,0.00,0,'2025-12-06 21:09:41'),(5,1,'Bol de avena con frutas y miel','Desayuno dulce.','Cocer avena y a+¶adir pl+Ìtano y fresas.',NULL,'desayuno',NULL,'facil',NULL,NULL,NULL,NULL,1,0.00,0,'2025-12-06 21:09:41'),(6,2,'Yogur griego con frutos secos','Snack proteico.','Mezclar yogur, almendras y nueces.',NULL,'media_manana',NULL,'facil',NULL,NULL,NULL,NULL,1,0.00,0,'2025-12-06 21:09:41'),(7,2,'Fruta variada (manzana y naranja)','Snack ligero.','Cortar fruta y servir.',NULL,'media_manana',NULL,'facil',NULL,NULL,NULL,NULL,1,0.00,0,'2025-12-06 21:09:41'),(8,3,'Ensalada de pollo y quinoa','Almuerzo completo.','Cocer quinoa, mezclar con pollo, tomate y lechuga.',NULL,'almuerzo',NULL,'media',NULL,NULL,NULL,NULL,1,0.00,0,'2025-12-06 21:09:41'),(9,3,'Bowl de salm+¶n y arroz integral','Almuerzo alto en prote+°na.','Cocer arroz integral y a+¶adir salm+¶n a la plancha.',NULL,'almuerzo',NULL,'media',NULL,NULL,NULL,NULL,1,0.00,0,'2025-12-06 21:09:41'),(10,4,'Merluza al horno con verduras','Cena ligera.','Hornear merluza con br+¶coli y zanahoria.',NULL,'cena',NULL,'media',NULL,NULL,NULL,NULL,1,0.00,0,'2025-12-06 21:09:41'),(11,4,'Tortilla francesa con ensalada','Cena sencilla.','Hacer tortilla de huevo y acompa+¶ar con ensalada.',NULL,'cena',NULL,'facil',NULL,NULL,NULL,NULL,1,0.00,0,'2025-12-06 21:09:41'),(12,5,'Smoothie post-entreno de pl+Ìtano y whey','Recuperaci+¶n r+Ìpida.','Batir leche desnatada, pl+Ìtano y prote+°na whey.',NULL,'post_entreno',NULL,'facil',NULL,NULL,NULL,NULL,1,0.00,0,'2025-12-06 21:09:41'),(13,5,'Reques+¶n con miel y nueces','Post-entreno suave.','Mezclar reques+¶n, miel y nueces.',NULL,'post_entreno',NULL,'facil',NULL,NULL,NULL,NULL,1,0.00,0,'2025-12-06 21:09:41'),(14,1,'Wrap integral de pollo y verduras','Almuerzo/ cena r+Ìpida.','Rellenar tortilla integral con pollo y verduras.',NULL,'almuerzo',NULL,'facil',NULL,NULL,NULL,NULL,1,0.00,0,'2025-12-06 21:09:41'),(15,2,'Ensalada de garbanzos y at+¶n','Almuerzo fr+°o.','Mezclar garbanzos cocidos, at+¶n, tomate y pimiento.',NULL,'almuerzo',NULL,'facil',NULL,NULL,NULL,NULL,1,0.00,0,'2025-12-06 21:09:41'),(16,NULL,'Surtido de platos','Plato personalizado',NULL,NULL,'desayuno',NULL,'media',615.00,43.00,93.00,6.60,1,0.00,0,'2025-12-06 22:23:19'),(17,NULL,'Huevos revueltos con pan centeno','Plato personalizado',NULL,NULL,'desayuno',NULL,'media',467.00,26.00,58.00,14.00,1,0.00,0,'2025-12-06 22:30:29'),(18,NULL,'Arroz con Pollo ','Plato personalizado',NULL,NULL,'almuerzo',NULL,'media',530.00,38.00,76.00,6.60,1,0.00,0,'2025-12-06 22:31:52'),(19,1,'Desayuno Campe+¶n Hugo','Avena, huevos y fruta',NULL,NULL,'desayuno',NULL,'media',550.00,35.00,65.00,15.00,1,0.00,0,'2025-12-06 22:39:57'),(20,1,'Media Ma+¶ana Proteica','Batido y nueces',NULL,NULL,'media_manana',NULL,'media',300.00,25.00,10.00,15.00,1,0.00,0,'2025-12-06 22:39:57'),(21,1,'Almuerzo Pollo y Arroz','Cl+Ìsico arroz con pollo',NULL,NULL,'almuerzo',NULL,'media',700.00,50.00,80.00,20.00,1,0.00,0,'2025-12-06 22:39:57'),(22,1,'Merienda Yogur','Yogur griego',NULL,NULL,'merienda',NULL,'media',250.00,15.00,30.00,5.00,1,0.00,0,'2025-12-06 22:39:57'),(23,1,'Cena Pescado','Merluza y verdura',NULL,NULL,'cena',NULL,'media',450.00,40.00,20.00,20.00,1,0.00,0,'2025-12-06 22:39:57'),(24,1,'Post-Entreno','Recuperador',NULL,NULL,'post_entreno',NULL,'media',350.00,30.00,50.00,2.00,1,0.00,0,'2025-12-06 22:39:57'),(25,1,'Salmon Especial ','Plato creado por entrenador',NULL,NULL,'almuerzo',12,'dificil',644.00,39.00,76.00,19.00,1,0.00,0,'2025-12-06 23:04:21');
/*!40000 ALTER TABLE `platos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suscripciones`
--

DROP TABLE IF EXISTS `suscripciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suscripciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `entrenador_asignado_id` int DEFAULT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date DEFAULT NULL,
  `precio_mensual` decimal(8,2) NOT NULL DEFAULT '0.00',
  `estado` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'activo',
  `auto_renovacion` tinyint(1) NOT NULL DEFAULT '1',
  `activa` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_usuario` (`usuario_id`),
  KEY `idx_estado` (`estado`),
  KEY `idx_activa` (`activa`),
  KEY `IDX_FEE27D96944BA14C` (`entrenador_asignado_id`),
  CONSTRAINT `fk_suscripcion_entrenador` FOREIGN KEY (`entrenador_asignado_id`) REFERENCES `entrenadores` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_suscripcion_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suscripciones`
--

LOCK TABLES `suscripciones` WRITE;
/*!40000 ALTER TABLE `suscripciones` DISABLE KEYS */;
INSERT INTO `suscripciones` VALUES (1,1,1,'2025-01-01','2025-02-01',29.99,'activo',1,1,'2025-12-06 20:27:01'),(2,3,2,'2025-01-05','2025-02-05',39.99,'activo',0,0,'2025-12-06 20:27:01'),(3,6,5,'2025-01-10','2025-02-10',29.99,'activo',1,1,'2025-12-06 20:27:01'),(4,8,3,'2025-01-15','2025-02-15',49.99,'activo',0,0,'2025-12-06 20:27:01'),(5,10,1,'2025-01-20','2025-02-20',29.99,'activo',1,1,'2025-12-06 20:27:01'),(6,1,1,'2025-01-01','2025-02-01',19.99,'activo',1,1,'2025-12-06 20:27:01'),(7,2,1,'2025-01-02','2025-02-02',19.99,'activo',1,1,'2025-12-06 20:27:01'),(8,3,2,'2025-01-05','2025-02-05',19.99,'activo',0,0,'2025-12-06 20:27:01'),(9,6,5,'2025-01-10','2025-02-10',19.99,'activo',1,1,'2025-12-06 20:27:01'),(10,8,3,'2025-01-15','2025-02-15',19.99,'activo',0,0,'2025-12-06 20:27:01'),(11,10,1,'2025-01-20','2025-02-20',19.99,'activo',1,1,'2025-12-06 20:27:01'),(12,11,4,'2025-12-06','2026-01-06',19.99,'activo',1,1,'2025-12-06 20:51:10');
/*!40000 ALTER TABLE `suscripciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entrenador_id` int DEFAULT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellidos` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observaciones` longtext COLLATE utf8mb4_unicode_ci,
  `objetivo` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cuidar_alimentacion',
  `fecha_nacimiento` date DEFAULT NULL,
  `edad` int DEFAULT NULL,
  `peso_actual` decimal(5,2) DEFAULT NULL,
  `altura` int DEFAULT NULL,
  `peso_objetivo` decimal(5,2) DEFAULT NULL,
  `porcentaje_grasa` decimal(4,2) DEFAULT NULL,
  `imc` decimal(4,2) DEFAULT NULL,
  `nivel_actividad` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ligero',
  `calorias_diarias` int DEFAULT NULL,
  `notas_salud` longtext COLLATE utf8mb4_unicode_ci,
  `es_premium` tinyint(1) NOT NULL DEFAULT '0',
  `fecha_premium` date DEFAULT NULL,
  `rol` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cliente',
  `fecha_registro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ultima_conexion` datetime DEFAULT NULL,
  `sexo` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reset_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_EF687F2E7927C74` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_premium` (`es_premium`),
  KEY `idx_objetivo` (`objetivo`),
  KEY `idx_rol` (`rol`),
  KEY `idx_edad` (`edad`),
  KEY `idx_nivel_actividad` (`nivel_actividad`),
  KEY `IDX_EF687F24FE90CDB` (`entrenador_id`),
  CONSTRAINT `fk_usuario_entrenador` FOREIGN KEY (`entrenador_id`) REFERENCES `entrenadores` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,1,'Ana','P+Ærez','ana@example.com','$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy4LjGr3gkEW','655111222',NULL,'cuidar_alimentacion',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ligero',NULL,NULL,1,NULL,'cliente','2025-12-06 20:26:51',NULL,NULL,NULL,NULL),(2,1,'Luis','Torres','luis@example.com','$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy4LjGr3gkEW','655333444',NULL,'ganar_musculo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'moderado',NULL,NULL,1,'2025-12-06','cliente','2025-12-06 20:26:51',NULL,NULL,NULL,NULL),(3,2,'Sara','Morales','sara@example.com','$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy4LjGr3gkEW','655555666',NULL,'perder_grasa',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ligero',NULL,NULL,0,NULL,'cliente','2025-12-06 20:26:51',NULL,NULL,NULL,NULL),(4,3,'Pepe','Mart+°n','pepe@example.com','$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy4LjGr3gkEW','655777888',NULL,'ganar_musculo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'activo',NULL,NULL,0,NULL,'cliente','2025-12-06 20:26:51',NULL,NULL,NULL,NULL),(5,4,'Elena','D+°az','elena@example.com','$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy4LjGr3gkEW','655999000',NULL,'cuidar_alimentacion',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ligero',NULL,NULL,0,NULL,'cliente','2025-12-06 20:26:51',NULL,NULL,NULL,NULL),(6,5,'Marco','Rivas','marco@example.com','$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy4LjGr3gkEW','655444111',NULL,'perder_grasa',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ligero',NULL,NULL,1,NULL,'cliente','2025-12-06 20:26:51',NULL,NULL,NULL,NULL),(7,2,'Luc+°a','Navas','lucia@example.com','$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy4LjGr3gkEW','655444222',NULL,'ganar_musculo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'moderado',NULL,NULL,0,NULL,'cliente','2025-12-06 20:26:51',NULL,NULL,NULL,NULL),(8,3,'Pablo','Rey','pablo@example.com','$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy4LjGr3gkEW','655444333',NULL,'ganar_musculo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ligero',NULL,NULL,0,NULL,'cliente','2025-12-06 20:26:51',NULL,NULL,NULL,NULL),(9,4,'Rosa','Gil','rosa@example.com','$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy4LjGr3gkEW','655444444',NULL,'perder_grasa',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ligero',NULL,NULL,0,NULL,'cliente','2025-12-06 20:26:51',NULL,NULL,NULL,NULL),(10,1,'Hugo','Serrano','hugo@example.com','$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy4LjGr3gkEW','655444555',NULL,'cuidar_alimentacion',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'moderado',NULL,NULL,1,NULL,'cliente','2025-12-06 20:26:51',NULL,NULL,NULL,NULL),(11,4,'Aiman','Harrar Daoud','aimaninstituto2020@gmail.com','$2y$13$TjQ0zAMMGktPjvrSm9Pl4Ox7fh5ae/OCYonQJf2zrbwSc2NbnHRWa','633714372',NULL,'ganancia_muscular',NULL,21,90.00,185,100.00,NULL,26.30,'moderado',2731,'No me gusta el pimiento',1,'2025-12-06','cliente','2025-12-06 20:51:10',NULL,'masculino',NULL,NULL),(12,NULL,'Admin','Principal','admin@email.com','$2y$13$iA1wYIPbHpGfsRundt0pzufiSQg3KNxqevYy1UZPLZO7JnkZ/G.v6',NULL,NULL,'cuidar_alimentacion',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ligero',NULL,NULL,0,NULL,'admin','2025-12-07 01:02:13','2025-12-07 01:02:13',NULL,NULL,NULL),(13,NULL,'Admin2','Nator','admin2@email.com','$2y$10$FZIoIUkt3B/h5vF.NXU80uPkPsxSqtgZ04zCkNcbROXTyKEjOgU66','633772311',NULL,'perdida_peso',NULL,21,89.00,186,NULL,NULL,NULL,'ligero',NULL,NULL,0,NULL,'admin','2025-12-07 02:57:55',NULL,'masculino',NULL,NULL),(14,8,'Ahardao','1001','ahardao1001@g.educaand.es','$2y$13$PpPZNOU1IccJWbBODNewoOmepxSoS//BcU0L7V.PJKA1nZRqAopNe','7337373373',NULL,'cuidar_alimentacion',NULL,21,90.00,185,94.00,NULL,26.30,'ligero',2423,NULL,1,'2025-12-08','cliente','2025-12-08 10:52:53',NULL,'masculino',NULL,NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-03 20:46:56
