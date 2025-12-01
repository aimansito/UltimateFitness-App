-- ============================================
-- SCRIPT PARA CREAR ENTRENAMIENTO COMPLETO
-- Cliente ID: 12
-- Entrenador ID: 2
-- IDs de ejercicios corregidos según tu base de datos
-- ============================================

-- Paso 1: Crear el entrenamiento principal
INSERT INTO entrenamientos (
    nombre, 
    descripcion, 
    tipo, 
    creador_id, 
    creador_usuario_id,
    asignado_ausuario_id,
    duracion_minutos, 
    nivel_dificultad, 
    es_publico, 
    valoracion_promedio, 
    total_valoraciones, 
    fecha_creacion
) VALUES (
    'Plan Semanal Completo - Cliente 12',
    'Rutina de cuerpo completo 5 días a la semana. Combina fuerza, hipertrofia y trabajo funcional. Asignada por tu entrenador personal.',
    'gym',
    2,    -- Creado por Entrenador ID 2
    NULL, -- No creado por usuario
    12,   -- Asignado al Cliente ID 12
    75,   -- Duración promedio por sesión
    'intermedio',
    0,    -- Privado
    0.00,
    0,
    NOW()
);

-- Obtener el ID del entrenamiento recién creado
SET @entrenamiento_id = LAST_INSERT_ID();

-- ============================================
-- PASO 2: LUNES (Pecho + Tríceps)
-- ============================================
INSERT INTO entrenamiento_ejercicios (
    entrenamiento_id,
    ejercicio_id,
    orden,
    series,
    repeticiones,
    descanso_segundos,
    notas
) VALUES
(@entrenamiento_id, 2, 1, 4, '10', 90, 'Press Banca - Ejercicio principal, incrementar peso progresivamente'),
(@entrenamiento_id, 16, 2, 3, '12', 75, 'Press Inclinado - Pectoral superior, control en fase excéntrica'),
(@entrenamiento_id, 7, 3, 3, '15', 60, 'Flexiones - Hasta el fallo, mantener core apretado'),
(@entrenamiento_id, 14, 4, 3, '10', 75, 'Fondos Paralelas - Enfoque en tríceps, ligera inclinación adelante'),
(@entrenamiento_id, 22, 5, 3, '12', 60, 'Extensión Tríceps - Aislamiento, movimiento controlado');

-- ============================================
-- PASO 3: MARTES (Piernas)
-- ============================================
INSERT INTO entrenamiento_ejercicios (
    entrenamiento_id,
    ejercicio_id,
    orden,
    series,
    repeticiones,
    descanso_segundos,
    notas
) VALUES
(@entrenamiento_id, 1, 6, 4, '10', 120, 'Sentadilla con Barra - Profundidad completa, control total'),
(@entrenamiento_id, 21, 7, 4, '12', 90, 'Peso Muerto Rumano - Isquiotibiales, espalda recta'),
(@entrenamiento_id, 27, 8, 3, '15', 75, 'Prensa Piernas - Rango completo de movimiento'),
(@entrenamiento_id, 9, 9, 3, '12', 60, 'Sentadilla Búlgara - Alternar piernas, enfoque en equilibrio'),
(@entrenamiento_id, 25, 10, 3, '15', 60, 'Hip Thrust - Contracción máxima de glúteos');

-- ============================================
-- PASO 4: MIÉRCOLES (Espalda + Bíceps)
-- ============================================
INSERT INTO entrenamiento_ejercicios (
    entrenamiento_id,
    ejercicio_id,
    orden,
    series,
    repeticiones,
    descanso_segundos,
    notas
) VALUES
(@entrenamiento_id, 4, 11, 4, '8', 90, 'Dominadas - Asistidas si es necesario'),
(@entrenamiento_id, 10, 12, 4, '10', 75, 'Remo con Barra - Dorsal activado, postura horizontal'),
(@entrenamiento_id, 17, 13, 3, '12', 60, 'Remo Mancuerna - Unilateral, máximo estiramiento'),
(@entrenamiento_id, 28, 14, 3, '12', 60, 'Pull Over - Expansión torácica'),
(@entrenamiento_id, 13, 15, 3, '12', 60, 'Curl Bíceps - Estricto, sin balanceo');

-- ============================================
-- PASO 5: JUEVES (Cardio + Core)
-- ============================================
INSERT INTO entrenamiento_ejercicios (
    entrenamiento_id,
    ejercicio_id,
    orden,
    series,
    repeticiones,
    descanso_segundos,
    notas
) VALUES
(@entrenamiento_id, 6, 16, 3, '15', 60, 'Burpees - Alta intensidad, ritmo constante'),
(@entrenamiento_id, 8, 17, 3, '20', 45, 'Mountain Climbers - Rápido pero controlado'),
(@entrenamiento_id, 12, 18, 3, '60', 45, 'Plancha Abdominal - Segundos de aguante, core tenso'),
(@entrenamiento_id, 19, 19, 3, '20', 45, 'Abdominales Bicicleta - Por lado, enfoque en oblicuos'),
(@entrenamiento_id, 20, 20, 3, '60', 60, 'Saltos Cuerda - Trabajo cardiovascular');

-- ============================================
-- PASO 6: VIERNES (Hombros + Full Body)
-- ============================================
INSERT INTO entrenamiento_ejercicios (
    entrenamiento_id,
    ejercicio_id,
    orden,
    series,
    repeticiones,
    descanso_segundos,
    notas
) VALUES
(@entrenamiento_id, 5, 21, 4, '10', 90, 'Press Militar - Deltoides, barra por delante'),
(@entrenamiento_id, 18, 22, 4, '15', 60, 'Elevaciones Laterales - Sin impulso'),
(@entrenamiento_id, 23, 23, 3, '15', 60, 'Face Pulls - Deltoides posterior, separar bien al final'),
(@entrenamiento_id, 3, 24, 3, '8', 120, 'Peso Muerto - Ejercicio compuesto, técnica perfecta'),
(@entrenamiento_id, 30, 25, 3, '30', 60, 'Farmer Walk - Agarre fuerte, caminata controlada');

-- ============================================
-- VERIFICACIONES
-- ============================================

-- 1. Ver el entrenamiento creado
SELECT 
    e.id,
    e.nombre,
    e.descripcion,
    e.tipo,
    e.duracion_minutos,
    e.nivel_dificultad,
    e.asignado_ausuario_id,
    COUNT(ee.id) as total_ejercicios
FROM entrenamientos e
LEFT JOIN entrenamiento_ejercicios ee ON e.id = ee.entrenamiento_id
WHERE e.id = @entrenamiento_id
GROUP BY e.id;

-- 2. Ver detalles de los ejercicios del entrenamiento
SELECT 
    ee.orden,
    ej.nombre as ejercicio,
    ej.grupo_muscular,
    ee.series,
    ee.repeticiones,
    ee.descanso_segundos,
    ee.notas
FROM entrenamiento_ejercicios ee
INNER JOIN ejercicios ej ON ee.ejercicio_id = ej.id
WHERE ee.entrenamiento_id = @entrenamiento_id
ORDER BY ee.orden;

-- 3. Resumen por grupo muscular
SELECT 
    ej.grupo_muscular,
    COUNT(*) as cantidad_ejercicios,
    SUM(ee.series) as total_series
FROM entrenamiento_ejercicios ee
INNER JOIN ejercicios ej ON ee.ejercicio_id = ej.id
WHERE ee.entrenamiento_id = @entrenamiento_id
GROUP BY ej.grupo_muscular
ORDER BY total_series DESC;

-- 4. Contar total de ejercicios insertados
SELECT COUNT(*) as total_ejercicios_insertados
FROM entrenamiento_ejercicios 
WHERE entrenamiento_id = @entrenamiento_id;
