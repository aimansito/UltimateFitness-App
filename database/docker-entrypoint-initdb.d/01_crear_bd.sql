-- ============================================
-- ULTIMATE FITNESS - BASE DE DATOS OPTIMIZADA
-- ============================================

USE ultimatefitness_db;

    /*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
    /*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
    /*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
    /*!40101 SET NAMES utf8mb4 */;

CREATE TABLE `alimentos` (
  `id` int NOT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_alimento` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` longtext COLLATE utf8mb4_unicode_ci,
  `calorias` decimal(8,2) NOT NULL,
  `proteinas` decimal(6,2) NOT NULL,
  `carbohidratos` decimal(6,2) NOT NULL,
  `grasas` decimal(6,2) NOT NULL,
  `precio_kg` decimal(6,2) NOT NULL,
  `imagen_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `blog_posts` (
  `id` int NOT NULL,
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
  `fecha_actualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `calendario_usuario` (
  `id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `dieta_id` int DEFAULT NULL,
  `entrenamiento_id` int DEFAULT NULL,
  `dia_semana` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `completado` tinyint(1) NOT NULL DEFAULT '0',
  `fecha_asignacion` date NOT NULL,
  `notas` longtext COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `dias_ejercicios` (
  `id` int NOT NULL,
  `dia_entrenamiento_id` int NOT NULL,
  `ejercicio_id` int NOT NULL,
  `series` int NOT NULL DEFAULT '3',
  `repeticiones` int NOT NULL DEFAULT '12',
  `descanso_segundos` int NOT NULL DEFAULT '60',
  `notas` longtext COLLATE utf8mb4_unicode_ci,
  `orden` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `dias_entrenamiento` (
  `id` int NOT NULL,
  `entrenamiento_id` int NOT NULL,
  `dia_semana` int NOT NULL,
  `concepto` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `es_descanso` tinyint(1) NOT NULL DEFAULT '0',
  `orden` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `dietas` (
  `id` int NOT NULL,
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
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `dieta_platos` (
  `id` int NOT NULL,
  `dieta_id` int NOT NULL,
  `plato_id` int NOT NULL,
  `dia_semana` enum('lunes','martes','miercoles','jueves','viernes','sabado','domingo') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_comida` enum('desayuno','media_manana','almuerzo','merienda','cena','post_entreno') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `orden` int NOT NULL DEFAULT '1',
  `notas` longtext COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `ejercicios` (
  `id` int NOT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `grupo_muscular` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` longtext COLLATE utf8mb4_unicode_ci,
  `video_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nivel_dificultad` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'intermedio',
  `valoracion_promedio` decimal(3,2) NOT NULL DEFAULT '0.00',
  `total_valoraciones` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `entrenadores` (
  `id` int NOT NULL,
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
  `fecha_aplicacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `entrenamientos` (
  `id` int NOT NULL,
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
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `entrenamiento_ejercicios` (
  `id` int NOT NULL,
  `entrenamiento_id` int NOT NULL,
  `ejercicio_id` int NOT NULL,
  `orden` int NOT NULL,
  `series` int DEFAULT NULL,
  `repeticiones` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descanso_segundos` int DEFAULT NULL,
  `notas` longtext COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `historial_pagos` (
  `id` int NOT NULL,
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
  `fecha_actualizacion` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `platos` (
  `id` int NOT NULL,
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
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `plato_alimentos` (
  `id` int NOT NULL,
  `plato_id` int NOT NULL,
  `alimento_id` int NOT NULL,
  `cantidad_gramos` decimal(8,2) NOT NULL,
  `orden` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `suscripciones` (
  `id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `entrenador_asignado_id` int DEFAULT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date DEFAULT NULL,
  `precio_mensual` decimal(8,2) NOT NULL DEFAULT '0.00',
  `estado` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'activo',
  `auto_renovacion` tinyint(1) NOT NULL DEFAULT '1',
  `activa` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `usuarios` (
  `id` int NOT NULL,
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
  `sexo` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reset_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


ALTER TABLE `alimentos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_nombre` (`nombre`),
  ADD KEY `idx_tipo` (`tipo_alimento`);

--
-- Indices de la tabla `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_78B2F932989D9B62` (`slug`),
  ADD KEY `idx_categoria` (`categoria`),
  ADD KEY `idx_premium` (`es_premium`),
  ADD KEY `idx_destacado` (`destacado`),
  ADD KEY `idx_fecha_publicacion` (`fecha_publicacion`);

--
-- Indices de la tabla `calendario_usuario`
--
ALTER TABLE `calendario_usuario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_usuario` (`usuario_id`),
  ADD KEY `idx_dia` (`dia_semana`),
  ADD KEY `IDX_705DADA7615C2CBC` (`dieta_id`),
  ADD KEY `IDX_705DADA7DA1C17D8` (`entrenamiento_id`);

--
-- Indices de la tabla `dias_ejercicios`
--
ALTER TABLE `dias_ejercicios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_dia_entrenamiento` (`dia_entrenamiento_id`),
  ADD KEY `idx_ejercicio` (`ejercicio_id`);

--
-- Indices de la tabla `dias_entrenamiento`
--
ALTER TABLE `dias_entrenamiento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_entrenamiento` (`entrenamiento_id`),
  ADD KEY `idx_dia_semana` (`dia_semana`);

--
-- Indices de la tabla `dietas`
--
ALTER TABLE `dietas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_creador` (`creador_id`),
  ADD KEY `idx_publica` (`es_publica`),
  ADD KEY `idx_dieta_asignado` (`asignado_a_usuario_id`);

--
-- Indices de la tabla `dieta_platos`
--
ALTER TABLE `dieta_platos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_dieta_dia_comida_orden` (`dieta_id`,`dia_semana`,`tipo_comida`,`orden`),
  ADD KEY `idx_dieta` (`dieta_id`),
  ADD KEY `idx_plato` (`plato_id`),
  ADD KEY `idx_dia_tipo` (`dia_semana`,`tipo_comida`);

--
-- Indices de la tabla `ejercicios`
--
ALTER TABLE `ejercicios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tipo` (`tipo`),
  ADD KEY `idx_nivel` (`nivel_dificultad`);

--
-- Indices de la tabla `entrenadores`
--
ALTER TABLE `entrenadores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_E15FDEE2E7927C74` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_activo` (`activo`),
  ADD KEY `idx_estado_aplicacion` (`estado_aplicacion`),
  ADD KEY `idx_anos_experiencia` (`anos_experiencia`);

--
-- Indices de la tabla `entrenamientos`
--
ALTER TABLE `entrenamientos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_creador` (`creador_id`),
  ADD KEY `idx_tipo` (`tipo`),
  ADD KEY `idx_publico` (`es_publico`),
  ADD KEY `IDX_24DCB62BC5745869` (`creador_usuario_id`),
  ADD KEY `IDX_24DCB62B6B62C1A2` (`asignado_ausuario_id`);

--
-- Indices de la tabla `entrenamiento_ejercicios`
--
ALTER TABLE `entrenamiento_ejercicios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_entrenamiento` (`entrenamiento_id`),
  ADD KEY `idx_ejercicio` (`ejercicio_id`);

--
-- Indices de la tabla `historial_pagos`
--
ALTER TABLE `historial_pagos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_usuario` (`usuario_id`),
  ADD KEY `IDX_28FB96FB189E045D` (`suscripcion_id`),
  ADD KEY `idx_transaccion` (`id_transaccion_externa`),
  ADD KEY `idx_estado` (`estado`),
  ADD KEY `idx_fecha` (`fecha_pago`);

--
-- Indices de la tabla `platos`
--
ALTER TABLE `platos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tipo` (`tipo_comida`),
  ADD KEY `idx_publico` (`es_publico`),
  ADD KEY `idx_valoracion` (`valoracion_promedio`);

--
-- Indices de la tabla `plato_alimentos`
--
ALTER TABLE `plato_alimentos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_plato` (`plato_id`),
  ADD KEY `idx_alimento` (`alimento_id`);

--
-- Indices de la tabla `suscripciones`
--
ALTER TABLE `suscripciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_usuario` (`usuario_id`),
  ADD KEY `idx_estado` (`estado`),
  ADD KEY `idx_activa` (`activa`),
  ADD KEY `IDX_FEE27D96944BA14C` (`entrenador_asignado_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_EF687F2E7927C74` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_premium` (`es_premium`),
  ADD KEY `idx_objetivo` (`objetivo`),
  ADD KEY `idx_rol` (`rol`),
  ADD KEY `idx_edad` (`edad`),
  ADD KEY `idx_nivel_actividad` (`nivel_actividad`),
  ADD KEY `IDX_EF687F24FE90CDB` (`entrenador_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `alimentos`
--
ALTER TABLE `alimentos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT de la tabla `blog_posts`
--
ALTER TABLE `blog_posts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `calendario_usuario`
--
ALTER TABLE `calendario_usuario`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `dias_ejercicios`
--
ALTER TABLE `dias_ejercicios`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `dias_entrenamiento`
--
ALTER TABLE `dias_entrenamiento`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `dietas`
--
ALTER TABLE `dietas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `dieta_platos`
--
ALTER TABLE `dieta_platos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT de la tabla `ejercicios`
--
ALTER TABLE `ejercicios`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT de la tabla `entrenadores`
--
ALTER TABLE `entrenadores`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `entrenamientos`
--
ALTER TABLE `entrenamientos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `entrenamiento_ejercicios`
--
ALTER TABLE `entrenamiento_ejercicios`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT de la tabla `historial_pagos`
--
ALTER TABLE `historial_pagos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `platos`
--
ALTER TABLE `platos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `plato_alimentos`
--
ALTER TABLE `plato_alimentos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT de la tabla `suscripciones`
--
ALTER TABLE `suscripciones`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `calendario_usuario`
--
ALTER TABLE `calendario_usuario`
  ADD CONSTRAINT `fk_cal_dieta` FOREIGN KEY (`dieta_id`) REFERENCES `dietas` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_cal_entrenamiento` FOREIGN KEY (`entrenamiento_id`) REFERENCES `entrenamientos` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_cal_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `dias_ejercicios`
--
ALTER TABLE `dias_ejercicios`
  ADD CONSTRAINT `fk_dia_ejercicio_dia` FOREIGN KEY (`dia_entrenamiento_id`) REFERENCES `dias_entrenamiento` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_dia_ejercicio_ejercicio` FOREIGN KEY (`ejercicio_id`) REFERENCES `ejercicios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `dias_entrenamiento`
--
ALTER TABLE `dias_entrenamiento`
  ADD CONSTRAINT `fk_dia_entrenamiento_entrenamiento` FOREIGN KEY (`entrenamiento_id`) REFERENCES `entrenamientos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `dietas`
--
ALTER TABLE `dietas`
  ADD CONSTRAINT `fk_dieta_asignado_usuario` FOREIGN KEY (`asignado_a_usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_dieta_creador` FOREIGN KEY (`creador_id`) REFERENCES `entrenadores` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `dieta_platos`
--
ALTER TABLE `dieta_platos`
  ADD CONSTRAINT `fk_dieta_plato_dieta` FOREIGN KEY (`dieta_id`) REFERENCES `dietas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_dieta_plato_plato` FOREIGN KEY (`plato_id`) REFERENCES `platos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `entrenamientos`
--
ALTER TABLE `entrenamientos`
  ADD CONSTRAINT `FK_24DCB62B6B62C1A2` FOREIGN KEY (`asignado_ausuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_entrenamiento_creador` FOREIGN KEY (`creador_id`) REFERENCES `entrenadores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_entrenamiento_creador_usuario` FOREIGN KEY (`creador_usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `entrenamiento_ejercicios`
--
ALTER TABLE `entrenamiento_ejercicios`
  ADD CONSTRAINT `fk_entren_ejercicio_ejercicio` FOREIGN KEY (`ejercicio_id`) REFERENCES `ejercicios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_entren_ejercicio_entrenamiento` FOREIGN KEY (`entrenamiento_id`) REFERENCES `entrenamientos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `historial_pagos`
--
ALTER TABLE `historial_pagos`
  ADD CONSTRAINT `fk_historial_pago_suscripcion` FOREIGN KEY (`suscripcion_id`) REFERENCES `suscripciones` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_historial_pago_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `plato_alimentos`
--
ALTER TABLE `plato_alimentos`
  ADD CONSTRAINT `fk_plato_alimento_alimento` FOREIGN KEY (`alimento_id`) REFERENCES `alimentos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_plato_alimento_plato` FOREIGN KEY (`plato_id`) REFERENCES `platos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `suscripciones`
--
ALTER TABLE `suscripciones`
  ADD CONSTRAINT `fk_suscripcion_entrenador` FOREIGN KEY (`entrenador_asignado_id`) REFERENCES `entrenadores` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_suscripcion_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuario_entrenador` FOREIGN KEY (`entrenador_id`) REFERENCES `entrenadores` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
