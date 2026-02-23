SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

--
-- Table structure for table `alimentos`
--

DROP TABLE IF EXISTS `alimentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `alimentos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `calorias` int(11) NOT NULL,
  `proteinas` double NOT NULL,
  `carbohidratos` double NOT NULL,
  `grasas` double NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alimentos`
--

LOCK TABLES `alimentos` WRITE;
/*!40000 ALTER TABLE `alimentos` DISABLE KEYS */;
INSERT INTO `alimentos` VALUES 
(1,'Pechuga de pollo',165,31,0,3.6),
(2,'Arroz integral',111,2.6,23,0.9),
(3,'Salmón',208,20,0,13),
(4,'Huevos',155,13,1.1,11),
(5,'Avena',389,16.9,66,6.9),
(6,'Plátano',89,1.1,22.8,0.3),
(7,'Espinacas',23,2.9,3.6,0.4),
(8,'Brócoli',34,2.8,7,0.4),
(9,'Ternera magra',250,26,0,15),
(10,'Batata',86,1.6,20,0.1),
(11,'Almendras',579,21,22,49),
(12,'Yogur griego',59,10,3.6,0.4),
(13,'Atún en agua',116,26,0,1),
(14,'Quinoa',120,4.4,21.3,1.9),
(15,'Aguacate',160,2,8.5,15),
(16,'Lentejas',116,9,20,0.4),
(17,'Pavo',189,29,0,7),
(18,'Manzana',52,0.3,14,0.2),
(19,'Queso cottage',98,11,3.4,4.3),
(20,'Aceite de oliva',884,0,0,100);
/*!40000 ALTER TABLE `alimentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dias_entrenamiento`
--

DROP TABLE IF EXISTS `dias_entrenamiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dias_entrenamiento` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `entrenamiento_id` int(11) DEFAULT NULL,
  `dia_semana` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orden` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_3A32185D95C3C376` (`entrenamiento_id`),
  CONSTRAINT `FK_3A32185D95C3C376` FOREIGN KEY (`entrenamiento_id`) REFERENCES `entrenamiento` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dias_entrenamiento`
--

LOCK TABLES `dias_entrenamiento` WRITE;
/*!40000 ALTER TABLE `dias_entrenamiento` DISABLE KEYS */;
INSERT INTO `dias_entrenamiento` VALUES 
(1,1,'Lunes','Pecho y Tríceps',1),
(2,1,'Miércoles','Espalda y Bíceps',2),
(3,1,'Viernes','Piernas y Hombros',3),
(4,2,'Lunes','Cuerpo Completo A',1),
(5,2,'Miércoles','Cardio y Abdominales',2),
(6,2,'Viernes','Cuerpo Completo B',3);
/*!40000 ALTER TABLE `dias_entrenamiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ejercicios`
--

DROP TABLE IF EXISTS `ejercicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ejercicios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `grupo_muscular` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `video_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` longtext COLLATE utf8mb4_unicode_ci,
  `equipo_necesario` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ejercicios`
--

LOCK TABLES `ejercicios` WRITE;
/*!40000 ALTER TABLE `ejercicios` DISABLE KEYS */;
INSERT INTO `ejercicios` VALUES 
(1,'Press de Banca','Pecho','https://www.youtube.com/watch?v=rT7DgCr-3pg','Ejercicio fundamental para el desarrollo del pecho.','Barra, Banco'),
(2,'Sentadilla','Piernas','https://www.youtube.com/watch?v=ultWZbGWL5c','El rey de los ejercicios de pierna.','Barra, Rack'),
(3,'Peso Muerto','Espalda','https://www.youtube.com/watch?v=op9kVnSso6Q','Trabaja toda la cadena posterior.','Barra'),
(4,'Press Militar','Hombros','https://www.youtube.com/watch?v=2yjwXTZQDDI','Desarrollo de hombros y tríceps.','Barra'),
(5,'Dominadas','Espalda','https://www.youtube.com/watch?v=eGo4IYlbE5g','Excelente para la amplitud de espalda.','Barra de dominadas'),
(6,'Remo con Barra','Espalda','https://www.youtube.com/watch?v=G8l_8chR5BE','Densidad de espalda.','Barra'),
(7,'Fondos en Paralelas','Tríceps','https://www.youtube.com/watch?v=2z8JmcrW-As','Gran ejercicio para tríceps y pecho inferior.','Barras paralelas'),
(8,'Curl con Barra','Bíceps','https://www.youtube.com/watch?v=kwG2ipFRgfo','Constructor de masa para bíceps.','Barra'),
(9,'Prensa de Piernas','Piernas','https://www.youtube.com/watch?v=IZxyjW7MPJQ','Trabajo pesado de piernas sin cargar la espalda.','Máquina de prensa'),
(10,'Extensiones de Cuádriceps','Piernas','https://www.youtube.com/watch?v=YyvSfVjQeL0','Aislamiento de cuádriceps.','Máquina de extensiones'),
(11,'Curl Femoral','Piernas','https://www.youtube.com/watch?v=1Tq3QdYUuHs','Aislamiento de isquiosurales.','Máquina de curl femoral'),
(12,'Elevaciones Laterales','Hombros','https://www.youtube.com/watch?v=3VcKaXpzqRo','Para la cabeza lateral del deltoides.','Mancuernas'),
(13,'Face Pull','Hombros','https://www.youtube.com/watch?v=rep-qVOkqgk','Salud del hombro y deltoides posterior.','Polea, Cuerda'),
(14,'Plancha Abdominal','Abdominales','https://www.youtube.com/watch?v=ASdvN_XEl_c','Estabilidad del core.','Ninguno'),
(15,'Burpees','Cardio','https://www.youtube.com/watch?v=auBLPXO8Fww','Ejercicio metabólico de cuerpo completo.','Ninguno');
/*!40000 ALTER TABLE `ejercicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dieta`
--

DROP TABLE IF EXISTS `dieta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dieta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) DEFAULT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` longtext COLLATE utf8mb4_unicode_ci,
  `calorias_objetivo` int(11) NOT NULL,
  `fecha_creacion` datetime NOT NULL,
  `es_publica` tinyint(1) DEFAULT NULL,
  `imagen_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entrenador_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_35447C1CDB38439E` (`usuario_id`),
  KEY `IDX_35447C1C9F5A440D` (`entrenador_id`),
  CONSTRAINT `FK_35447C1C9F5A440D` FOREIGN KEY (`entrenador_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `FK_35447C1CDB38439E` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dieta`
--

LOCK TABLES `dieta` WRITE;
/*!40000 ALTER TABLE `dieta` DISABLE KEYS */;
INSERT INTO `dieta` VALUES 
(1,NULL,'Dieta de Volumen','Dieta hipercalórica para ganancia muscular limpia.',2800,'2025-01-15 08:00:00',1,'/images/dieta-volumen.jpg','Volumen',NULL),
(2,NULL,'Dieta de Definición','Déficit calórico moderado para perder grasa manteniendo músculo.',2000,'2025-01-16 09:00:00',1,'/images/dieta-definicion.jpg','Definición',NULL),
(3,NULL,'Dieta Keto','Dieta baja en carbohidratos y alta en grasas.',1800,'2025-01-17 10:00:00',1,'/images/dieta-keto.jpg','Keto',NULL);
/*!40000 ALTER TABLE `dieta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plato`
--

DROP TABLE IF EXISTS `plato`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plato` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` longtext COLLATE utf8mb4_unicode_ci,
  `instrucciones` longtext COLLATE utf8mb4_unicode_ci,
  `tiempo_preparacion` int(11) DEFAULT NULL,
  `imagen_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_comida` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_91456D37DB38439E` (`usuario_id`),
  CONSTRAINT `FK_91456D37DB38439E` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plato`
--

LOCK TABLES `plato` WRITE;
/*!40000 ALTER TABLE `plato` DISABLE KEYS */;
INSERT INTO `plato` VALUES 
(1,'Pollo con Arroz y Brócoli','Clásico culturista.','Hervir arroz. Cocinar pollo a la plancha. Cocer brócoli.',20,'/images/pollo-arroz.jpg','Almuerzo',NULL),
(2,'Tortilla de Claras y Avena','Desayuno proteico.','Mezclar claras y avena. Cocinar en sartén como pancake.',10,'/images/tortilla-avena.jpg','Desayuno',NULL),
(3,'Salmón al Horno con Patatas','Rico en Omega 3.','Hornear salmón y patatas con especias.',35,'/images/salmon-horno.jpg','Cena',NULL),
(4,'Ensalada de Atún','Rápido y ligero.','Mezclar atún, lechuga, tomate y huevo duro.',10,'/images/ensalada-atun.jpg','Cena',NULL),
(5,'Batido de Proteínas y Plátano','Post-entreno ideal.','Licuar proteína en polvo, agua/leche y plátano.',5,'/images/batido-platano.jpg','Merienda',NULL),
(6,'Ternera con Quinoa','Alto valor biológico.','Cocinar ternera a la parrilla. Servir con quinoa cocida.',25,'/images/ternera-quinoa.jpg','Almuerzo',NULL);
/*!40000 ALTER TABLE `plato` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roles` json NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `nivel_actividad` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objetivo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `peso` double DEFAULT NULL,
  `altura` double DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `sexo` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reset_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `especialidad` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `biografia` longtext COLLATE utf8mb4_unicode_ci,
  `experiencia` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `certificaciones` longtext COLLATE utf8mb4_unicode_ci,
  `tarifa_mensual` double DEFAULT NULL,
  `entrenador_id` int(11) DEFAULT NULL,
  `solicitud_pendiente` tinyint(1) DEFAULT NULL,
  `stripe_customer_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subscription_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cliente_stripe_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_2265B05DE7927C74` (`email`),
  KEY `IDX_2265B05D9F5A440D` (`entrenador_id`),
  CONSTRAINT `FK_2265B05D9F5A440D` FOREIGN KEY (`entrenador_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES 
(1,'admin@ultimatefitness.com','[\"ROLE_ADMIN\"]','$2y$13$j/K5WkFgZ.XwZ.XwZ.XwZ.XwZ.XwZ.XwZ.XwZ.XwZ.XwZ.XwZ.Xw','Admin','User',1,'2025-01-01 00:00:00','Sedentario','Mantenimiento',70,175,30,'Masculino',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL),
(2,'user@ultimatefitness.com','[\"ROLE_USER\"]','$2y$13$j/K5WkFgZ.XwZ.XwZ.XwZ.XwZ.XwZ.XwZ.XwZ.XwZ.XwZ.XwZ.Xw','Test','User',1,'2025-01-01 00:00:00','Activo','Ganancia Muscular',80,180,25,'Masculino',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entrenamiento`
--

DROP TABLE IF EXISTS `entrenamiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `entrenamiento` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) DEFAULT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` longtext COLLATE utf8mb4_unicode_ci,
  `nivel_dificultad` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duracion_estimada_minutos` int(11) NOT NULL,
  `fecha_creacion` datetime NOT NULL,
  `es_publico` tinyint(1) DEFAULT NULL,
  `imagen_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objetivo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entrenador_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_88691515DB38439E` (`usuario_id`),
  KEY `IDX_886915159F5A440D` (`entrenador_id`),
  CONSTRAINT `FK_886915159F5A440D` FOREIGN KEY (`entrenador_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `FK_88691515DB38439E` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entrenamiento`
--

LOCK TABLES `entrenamiento` WRITE;
/*!40000 ALTER TABLE `entrenamiento` DISABLE KEYS */;
INSERT INTO `entrenamiento` VALUES 
(1,NULL,'Rutina Full Body','Entrenamiento de cuerpo completo para principiantes.','Principiante',45,'2025-01-10 10:00:00',1,'/images/fullbody.jpg','Fuerza General',NULL),
(2,NULL,'Rutina Push-Pull-Legs','División avanzada de 3 días.','Avanzado',60,'2025-01-12 11:00:00',1,'/images/ppl.jpg','Hipertrofia',NULL);
/*!40000 ALTER TABLE `entrenamiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_suscripcion`
--
-- (Si existe en el dump original, añadir aquí. Si no, omitir)
--

SET FOREIGN_KEY_CHECKS=1;
-- Nuevos usuarios desde TiDB
-- Estructura: id, email, roles, password, nombre, apellido, is_active, created_at, nivel_actividad, objetivo, peso, altura, edad, sexo, telefono, entrenador_id, solicitud_pendiente

INSERT INTO `usuario` (id, email, roles, password_hash, nombre, apellido, is_active, created_at, nivel_actividad, objetivo, peso, altura, edad, sexo, telefono, entrenador_id, solicitud_pendiente) VALUES
(3, 'pepe@example.com', '["ROLE_USER"]', '$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy4LjGr3gkEW', 'Pepe', 'Martín', 0, '2025-12-06 20:26:51', 'activo', 'ganar_musculo', NULL, NULL, NULL, 'cliente', '655777888', 4, 0),
(4, 'elena@example.com', '["ROLE_USER"]', '$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy4LjGr3gkEW', 'Elena', 'Díaz', 0, '2025-12-06 20:26:51', 'ligero', 'cuidar_alimentacion', NULL, NULL, NULL, 'cliente', '655999000', 3, 0),
(5, 'marco@example.com', '["ROLE_USER"]', '$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy4LjGr3gkEW', 'Marco', 'Rivas', 1, '2025-12-06 20:26:51', 'ligero', 'perder_grasa', NULL, NULL, NULL, 'cliente', '655444111', 4, 0),
(6, 'lucia@example.com', '["ROLE_USER"]', '$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy4LjGr3gkEW', 'Lucía', 'Navas', 0, '2025-12-06 20:26:51', 'moderado', 'ganar_musculo', NULL, NULL, NULL, 'cliente', '655444222', 2, 0),
(7, 'pablo@example.com', '["ROLE_USER"]', '$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy4LjGr3gkEW', 'Pablo', 'Rey', 0, '2025-12-06 20:26:51', 'ligero', 'ganar_musculo', NULL, NULL, NULL, 'cliente', '655444333', 3, 0),
(8, 'rosa@example.com', '["ROLE_USER"]', '$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy4LjGr3gkEW', 'Rosa', 'Gil', 0, '2025-12-06 20:26:51', 'ligero', 'perder_grasa', NULL, NULL, NULL, 'cliente', '655444444', 4, 0),
(9, 'hugo@example.com', '["ROLE_USER"]', '$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy4LjGr3gkEW', 'Hugo', 'Serrano', 1, '2025-12-06 20:26:51', 'moderado', 'cuidar_alimentacion', NULL, NULL, NULL, 'cliente', '655444555', 1, 0),
(10, 'aimaninstituto2020@gmail.com', '["ROLE_USER"]', '$2y$13$TjQ0zAMMGktPjvrSm9Pl4Ox7fh5ae/OCYonQJf2zrbwSc2NbnHRWa', 'Aiman', 'Harrar Daoud', 1, '2025-12-06 20:51:10', 'moderado', 'ganancia_muscular', 90.00, 185, 21, 'masculino', '633714372', 4, 1),
(11, 'admin@email.com', '["ROLE_ADMIN"]', '$2y$13$iA1wYIPbHpGfsRundt0pzufiSQg3KNxqevYy1UZPLZO7JnkZ/G.v6', 'Admin', 'Principal', 1, '2025-12-07 01:02:13', 'ligero', 'cuidar_alimentacion', NULL, NULL, NULL, 'admin', NULL, NULL, 0),
(12, 'admin2@email.com', '["ROLE_ADMIN"]', '$2y$10$FZIoIUkt3B/h5vF.NXU80uPkPsxSqtgZ04zCkNcbROXTyKEjOgU66', 'Admin2', 'Nator', 1, '2025-12-07 02:57:55', 'ligero', 'perdida_peso', 89.00, 186, 21, 'masculino', '633772311', NULL, 0),
(14, 'ahardao1001@g.educaand.es', '["ROLE_USER"]', '$2y$13$PpPZNOU1IccJWbBODNewoOmepxSoS//BcU0L7V.PJKA1nZRqAopNe', 'Ahardao', '1001', 1, '2025-12-08 10:52:53', 'ligero', 'cuidar_alimentacion', 90.00, 185, 21, 'masculino', '7337373373', 8, 1),
(30015, 'messi@email.com', '["ROLE_USER"]', '$2y$13$ZvtLPujoNYyRFKwmjikFDu0z9dvn3aWuPbgmO8RbI8Hi81eYnlH.6', 'Lionel', 'Messi', 1, '2026-02-04 13:27:10', 'ligero', 'cuidar_alimentacion', 80.00, 180, 22, 'masculino', '644644464', 10, 1),
(30016, 'o.alessandragomezm@gmail.com', '["ROLE_USER"]', '$2y$13$NN4LMjWGZT6qpK4LiDVgS.nRuN02kYBVRjc5YGJ5kxhIh8wjZsVae', 'Alessandra', 'Gómez Mary', 1, '2026-02-04 13:32:01', 'moderado', 'ganancia_muscular', 66.00, 160, 20, 'femenino', '663427018', 8, 1),
(60015, 'supermoises777@gmail.com', '["ROLE_USER"]', '$2y$13$lxgcyGASNYnZJ.SZOoE/2OiFFd7HbCXIjgVznLmdMrgjWbNSeoN92', 'Moises', 'Puerta Diaz', 1, '2026-02-05 20:38:56', 'intenso', 'ganancia_muscular', 67.50, 178, 21, 'masculino', '681296505', 9, 1),
(90015, 'mirisudu@gmail.com', '["ROLE_USER"]', '$2y$13$SqGBBHC0rsA9QWd2iUsFoeTb9Nqu2C8BOabnqPbGIhLAUOn7mhrxK', 'Miriam', 'Suárez Durán', 1, '2026-02-07 12:52:50', 'intenso', 'mantenimiento', 57.00, 165, 21, 'femenino', '644382078', NULL, 1);
