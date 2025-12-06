USE ultimatefitness_db;

SET FOREIGN_KEY_CHECKS=0;

-- Limpiar tablas (Orden inverso de dependencias)
TRUNCATE TABLE historial_pagos;
TRUNCATE TABLE calendario_usuario;
TRUNCATE TABLE dias_ejercicios;
TRUNCATE TABLE dias_entrenamiento;
TRUNCATE TABLE entrenamiento_ejercicios;
TRUNCATE TABLE dieta_platos;
TRUNCATE TABLE plato_alimentos;
TRUNCATE TABLE suscripciones;
TRUNCATE TABLE entrenamientos;
TRUNCATE TABLE dietas;
TRUNCATE TABLE platos;
TRUNCATE TABLE blog_posts;
TRUNCATE TABLE usuarios;
TRUNCATE TABLE entrenadores;
TRUNCATE TABLE ejercicios;
TRUNCATE TABLE alimentos;

SET FOREIGN_KEY_CHECKS=1;

-- ========================================================
-- 1. ENTRENADORES
-- ========================================================
INSERT INTO entrenadores (id, nombre, apellidos, email, password_hash, especialidad, precio_sesion_presencial, activo, biografia) VALUES 
(1, 'Laura', 'García', 'laura@gym.com', '$2y$13$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'musculacion', 35.00, 1, 'Especialista en hipertrofia y fuerza.'),
(2, 'Carlos', 'Rodríguez', 'carlos@gym.com', '$2y$13$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'crossfit', 40.00, 1, 'Entrenador de alta intensidad.');

-- ========================================================
-- 2. USUARIOS
-- ========================================================
-- Usuario Premium (Teresa)
INSERT INTO usuarios (id, nombre, apellidos, email, password_hash, rol, es_premium, objetivo, entrenador_id, fecha_registro) VALUES 
(1, 'Teresa', 'Sánchez', 'teresa@email.com', '$2y$13$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'cliente', 1, 'ganar_masa', 1, NOW());

-- Usuario Free (Juan)
INSERT INTO usuarios (id, nombre, apellidos, email, password_hash, rol, es_premium, objetivo, fecha_registro) VALUES 
(2, 'Juan', 'Pérez', 'juan.perez@email.com', '$2y$13$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'cliente', 0, 'perder_peso', NOW());

-- ========================================================
-- 3. SUSCRIPCIONES (Para Teresa)
-- ========================================================
INSERT INTO suscripciones (usuario_id, entrenador_asignado_id, fecha_inicio, fecha_fin, precio_mensual, estado, auto_renovacion, activa, fecha_creacion) VALUES 
(1, 1, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_ADD(NOW(), INTERVAL 20 DAY), 29.99, 'activo', 1, 1, NOW());

-- ========================================================
-- 4. EJERCICIOS
-- ========================================================
INSERT INTO ejercicios (id, nombre, tipo, grupo_muscular, descripcion, nivel_dificultad) VALUES 
(1, 'Sentadilla', 'fuerza', 'piernas', 'Sentadilla clásica con peso corporal o barra', 'basico'),
(2, 'Flexiones', 'fuerza', 'pecho', 'Flexiones de brazos en el suelo', 'basico'),
(3, 'Plancha', 'cardio', 'core', 'Plancha isométrica abdominal', 'basico'),
(4, 'Dominadas', 'fuerza', 'espalda', 'Elevación del cuerpo colgado de una barra', 'avanzado'),
(5, 'Zancadas', 'fuerza', 'piernas', 'Paso largo hacia adelante flexionando rodillas', 'basico');

-- ========================================================
-- 5. ENTRENAMIENTOS
-- ========================================================
-- Entrenamiento asignado a Teresa por Laura
INSERT INTO entrenamientos (id, nombre, descripcion, tipo, creador_id, duracion_minutos, nivel_dificultad, es_publico, fecha_creacion, asignado_a_usuario_id, valoracion_promedio, total_valoraciones) VALUES 
(1, 'Rutina Personalizada - Teresa', 'Rutina de fuerza y tonificación personalizada', 'gym', 1, 60, 'intermedio', 0, NOW(), 1, 0.00, 0);

-- Entrenamiento público de ejemplo
INSERT INTO entrenamientos (id, nombre, descripcion, tipo, creador_id, duracion_minutos, nivel_dificultad, es_publico, fecha_creacion, valoracion_promedio, total_valoraciones) VALUES 
(2, 'Cardio HIIT 20 Min', 'Entrenamiento de alta intensidad para quemar grasa', 'cardio', 2, 20, 'avanzado', 1, NOW(), 4.50, 10);

-- ========================================================
-- 6. DETALLE ENTRENAMIENTO (DÍAS Y EJERCICIOS)
-- ========================================================
-- Día 1 para Rutina Teresa
INSERT INTO dias_entrenamiento (id, entrenamiento_id, dia_semana, concepto, es_descanso, orden) VALUES 
(1, 1, 1, 'Cuerpo Completo', 0, 1);

-- Ejercicios para Día 1
INSERT INTO dias_ejercicios (dia_entrenamiento_id, ejercicio_id, series, repeticiones, descanso_segundos, orden) VALUES 
(1, 1, 3, 12, 60, 1), -- Sentadilla
(1, 2, 3, 10, 60, 2), -- Flexiones
(1, 3, 3, 1, 60, 3);  -- Plancha

-- Día 2 para Rutina Teresa (Descanso)
INSERT INTO dias_entrenamiento (id, entrenamiento_id, dia_semana, concepto, es_descanso, orden) VALUES 
(2, 1, 2, 'Descanso Activo', 1, 2);
