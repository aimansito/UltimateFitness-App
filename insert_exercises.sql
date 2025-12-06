USE ultimatefitness_db;

-- 1. Insertar Ejercicios en el Catálogo
INSERT INTO ejercicios (nombre, tipo, grupo_muscular, descripcion, nivel_dificultad) VALUES 
('Sentadilla', 'fuerza', 'piernas', 'Sentadilla clásica con peso corporal o barra', 'basico'),
('Flexiones', 'fuerza', 'pecho', 'Flexiones de brazos en el suelo', 'basico'),
('Plancha', 'cardio', 'core', 'Plancha isométrica abdominal', 'basico');

-- 2. Crear "Día 1" para el Entrenamiento
SET @entrenamiento_id = (SELECT id FROM entrenamientos WHERE nombre = 'Rutina Personalizada - Teresa' LIMIT 1);

INSERT INTO dias_entrenamiento (entrenamiento_id, dia_semana, concepto, es_descanso, orden) VALUES 
(@entrenamiento_id, 1, 'Cuerpo Completo', 0, 1);

SET @dia_id = LAST_INSERT_ID();

-- 3. Asignar Ejercicios al Día 1
SET @ejercicio1 = (SELECT id FROM ejercicios WHERE nombre = 'Sentadilla' LIMIT 1);
SET @ejercicio2 = (SELECT id FROM ejercicios WHERE nombre = 'Flexiones' LIMIT 1);
SET @ejercicio3 = (SELECT id FROM ejercicios WHERE nombre = 'Plancha' LIMIT 1);

INSERT INTO dias_ejercicios (dia_entrenamiento_id, ejercicio_id, series, repeticiones, descanso_segundos, orden) VALUES 
(@dia_id, @ejercicio1, 3, 12, 60, 1),
(@dia_id, @ejercicio2, 3, 10, 60, 2),
(@dia_id, @ejercicio3, 3, 1, 60, 3);
