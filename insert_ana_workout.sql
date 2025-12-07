-- Variable para el ID de Ana (Ya confirmaste que es el 1)
SET @ana_id = 1;

-- Variable para el ID del Entrenador (Asumimos el 1, Carlos)
SET @entrenador_id = (SELECT id FROM entrenadores LIMIT 1); 

-- 1. Insertar el Entrenamiento
INSERT INTO entrenamientos (nombre, descripcion, tipo, nivel_dificultad, duracion_minutos, es_publico, creador_id, asignado_ausuario_id, fecha_creacion)
VALUES (
    'Ana - Fullbody 3 días', 
    'Rutina de cuerpo completo enfocada en tonificación y fuerza general. Realizar días alternos.', 
    'fuerza', 
    'intermedio', 
    60, 
    0, 
    @entrenador_id, 
    @ana_id, 
    NOW()
);

SET @entrenamiento_id = LAST_INSERT_ID();

-- ==================================================================
-- DÍA 1: Lunes - Fullbody A
-- ==================================================================
INSERT INTO dias_entrenamiento (entrenamiento_id, dia_semana, concepto, es_descanso, orden)
VALUES (@entrenamiento_id, 1, 'Fullbody - Énfasis Pierna', 0, 1);

SET @dia1_id = LAST_INSERT_ID();

-- Ejercicios Día 1 (Usamos búsqueda flexible por nombre para asegurar que encuentre algo)
INSERT INTO dias_ejercicios (dia_entrenamiento_id, ejercicio_id, series, repeticiones, descanso_segundos, notas, orden)
VALUES 
-- Sentadillas (Squat)
(@dia1_id, (SELECT id FROM ejercicios WHERE nombre LIKE '%Sentadilla%' LIMIT 1), 4, 12, 90, 'Bajar controlado', 1),
-- Flexiones (Push up)
(@dia1_id, (SELECT id FROM ejercicios WHERE nombre LIKE '%Flexion%' OR nombre LIKE '%Push%' LIMIT 1), 3, 10, 60, 'Rodillas al suelo si es necesario', 2),
-- Remo (Row)
(@dia1_id, (SELECT id FROM ejercicios WHERE nombre LIKE '%Remo%' LIMIT 1), 3, 12, 60, 'Espalda recta', 3),
-- Plancha (Plank)
(@dia1_id, (SELECT id FROM ejercicios WHERE nombre LIKE '%Plancha%' LIMIT 1), 3, 0, 60, 'Aguntar 30-45 segundos', 4);


-- ==================================================================
-- DÍA 2: Martes - Descanso Activo
-- ==================================================================
INSERT INTO dias_entrenamiento (entrenamiento_id, dia_semana, concepto, es_descanso, orden)
VALUES (@entrenamiento_id, 2, 'Caminata ligera o Descanso', 1, 2);


-- ==================================================================
-- DÍA 3: Miércoles - Fullbody B
-- ==================================================================
INSERT INTO dias_entrenamiento (entrenamiento_id, dia_semana, concepto, es_descanso, orden)
VALUES (@entrenamiento_id, 3, 'Fullbody - Énfasis Empuje', 0, 3);

SET @dia3_id = LAST_INSERT_ID();

INSERT INTO dias_ejercicios (dia_entrenamiento_id, ejercicio_id, series, repeticiones, descanso_segundos, notas, orden)
VALUES 
-- Peso Muerto o similar
(@dia3_id, (SELECT id FROM ejercicios WHERE nombre LIKE '%Peso muerto%' OR nombre LIKE '%Deadlift%' LIMIT 1), 3, 10, 90, 'Cuidado con la lumbar', 1),
-- Press Militar / Hombro
(@dia3_id, (SELECT id FROM ejercicios WHERE nombre LIKE '%Militar%' OR nombre LIKE '%Hombro%' LIMIT 1), 3, 12, 60, 'De pie o sentado', 2),
-- Zancadas / Lunge
(@dia3_id, (SELECT id FROM ejercicios WHERE nombre LIKE '%Zancada%' OR nombre LIKE '%Lunge%' LIMIT 1), 3, 10, 60, '10 por pierna', 3);


-- ==================================================================
-- DÍA 4: Jueves - Descanso
-- ==================================================================
INSERT INTO dias_entrenamiento (entrenamiento_id, dia_semana, concepto, es_descanso, orden)
VALUES (@entrenamiento_id, 4, 'Descanso Total', 1, 4);


-- ==================================================================
-- DÍA 5: Viernes - Fullbody C
-- ==================================================================
INSERT INTO dias_entrenamiento (entrenamiento_id, dia_semana, concepto, es_descanso, orden)
VALUES (@entrenamiento_id, 5, 'Fullbody - Metabólico', 0, 5);

SET @dia5_id = LAST_INSERT_ID();

INSERT INTO dias_ejercicios (dia_entrenamiento_id, ejercicio_id, series, repeticiones, descanso_segundos, notas, orden)
VALUES 
-- Burpees o similar cardio
(@dia5_id, (SELECT id FROM ejercicios WHERE nombre LIKE '%Burpee%' OR nombre LIKE '%Salto%' LIMIT 1), 3, 10, 60, 'Intensidad alta', 1),
-- Dominadas o Jalón
(@dia5_id, (SELECT id FROM ejercicios WHERE nombre LIKE '%Dominada%' OR nombre LIKE '%Jalon%' OR nombre LIKE '%Lat%' LIMIT 1), 3, 8, 90, 'Rango completo', 2),
-- Biceps / Triceps (Brazos)
(@dia5_id, (SELECT id FROM ejercicios WHERE nombre LIKE '%Curl%' OR nombre LIKE '%Bicep%' LIMIT 1), 3, 15, 45, 'Bombeo final', 3);


-- ==================================================================
-- DÍA 6 y 7: Fin de semana
-- ==================================================================
INSERT INTO dias_entrenamiento (entrenamiento_id, dia_semana, concepto, es_descanso, orden) VALUES (@entrenamiento_id, 6, 'Actividad libre', 1, 6);
INSERT INTO dias_entrenamiento (entrenamiento_id, dia_semana, concepto, es_descanso, orden) VALUES (@entrenamiento_id, 7, 'Descanso', 1, 7);
