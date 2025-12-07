-- 1. LIMPIEZA PREVIA (Borrar lo que haya fallado o se haya quedado a medias)
-- Borramos el entrenamiento por nombre para asegurarnos de que no se duplique
DELETE FROM entrenamientos WHERE nombre = 'Ana - Fullbody 3 días' AND asignado_ausuario_id = 1;

-- 2. VARIABLES
SET @ana_id = 1;
SET @entrenador_id = 1; -- Asumimos Carlos (ID 1)

-- 3. INSERTAR EL ENTRENAMIENTO
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

INSERT INTO dias_ejercicios (dia_entrenamiento_id, ejercicio_id, series, repeticiones, descanso_segundos, notas, orden)
VALUES 
-- Sentadilla (ID 1)
(@dia1_id, 1, 4, 12, 90, 'Bajar controlado', 1),
-- Press banca (ID 2)
(@dia1_id, 2, 3, 10, 60, 'Pecho y triceps', 2),
-- Remo con mancuerna (ID 9)
(@dia1_id, 9, 3, 12, 60, 'Espalda recta', 3),
-- Plancha lateral (ID 16)
(@dia1_id, 16, 3, 0, 45, '30-45 seg por lado', 4);


-- ==================================================================
-- DÍA 2: Martes - Descanso
-- ==================================================================
INSERT INTO dias_entrenamiento (entrenamiento_id, dia_semana, concepto, es_descanso, orden)
VALUES (@entrenamiento_id, 2, 'Descanso Activo', 1, 2);


-- ==================================================================
-- DÍA 3: Miércoles - Fullbody B
-- ==================================================================
INSERT INTO dias_entrenamiento (entrenamiento_id, dia_semana, concepto, es_descanso, orden)
VALUES (@entrenamiento_id, 3, 'Fullbody - Énfasis Empuje', 0, 3);

SET @dia3_id = LAST_INSERT_ID();

INSERT INTO dias_ejercicios (dia_entrenamiento_id, ejercicio_id, series, repeticiones, descanso_segundos, notas, orden)
VALUES 
-- Peso muerto (ID 3)
(@dia3_id, 3, 3, 10, 90, 'Cuidado con la lumbar', 1),
-- Press Arnold (ID 13)
(@dia3_id, 13, 3, 12, 60, 'Hombros completos', 2),
-- Prensa de pierna (ID 21)
(@dia3_id, 21, 3, 12, 60, 'No bloquear rodillas', 3);


-- ==================================================================
-- DÍA 4: Jueves - Descanso
-- ==================================================================
INSERT INTO dias_entrenamiento (entrenamiento_id, dia_semana, concepto, es_descanso, orden)
VALUES (@entrenamiento_id, 4, 'Descanso Total', 1, 4);


-- ==================================================================
-- DÍA 5: Viernes - Fullbody C (Metabólico)
-- ==================================================================
INSERT INTO dias_entrenamiento (entrenamiento_id, dia_semana, concepto, es_descanso, orden)
VALUES (@entrenamiento_id, 5, 'Fullbody - Metabólico', 0, 5);

SET @dia5_id = LAST_INSERT_ID();

INSERT INTO dias_ejercicios (dia_entrenamiento_id, ejercicio_id, series, repeticiones, descanso_segundos, notas, orden)
VALUES 
-- Mountain climbers (ID 17)
(@dia5_id, 17, 4, 20, 45, 'Ritmo alto', 1),
-- Dominadas (ID 4)
(@dia5_id, 4, 3, 8, 90, 'Usar asistencia si es necesario', 2),
-- Jumping jacks (ID 18)
(@dia5_id, 18, 3, 30, 45, 'Cardio intenso', 3),
-- Curl bíceps (ID 5)
(@dia5_id, 5, 3, 15, 45, 'Congestión final', 4);


-- ==================================================================
-- DÍA 6 y 7: Fin de semana
-- ==================================================================
INSERT INTO dias_entrenamiento (entrenamiento_id, dia_semana, concepto, es_descanso, orden) VALUES 
(@entrenamiento_id, 6, 'Actividad libre', 1, 6),
(@entrenamiento_id, 7, 'Descanso', 1, 7);
