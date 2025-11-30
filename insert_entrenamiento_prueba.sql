-- ============================================
-- SCRIPT PARA CREAR ENTRENAMIENTO DE PRUEBA
-- Cliente ID: 12
-- Entrenador ID: 2
-- ============================================

-- Paso 1: Crear el entrenamiento
INSERT INTO entrenamientos (
    nombre, 
    descripcion, 
    tipo, 
    creador_id, 
    creador_usuario_id,
    asignado_a_usuario_id,
    duracion_minutos, 
    nivel_dificultad, 
    es_publico, 
    valoracion_promedio, 
    total_valoraciones, 
    fecha_creacion
) VALUES (
    'Rutina de Fuerza - Cliente 12',
    'Rutina de cuerpo completo para ganar fuerza base. Asignada por tu entrenador.',
    'fuerza',
    2,    -- Creado por Entrenador ID 2
    NULL, -- No creado por usuario
    12,   -- Asignado al Cliente ID 12
    60,
    'intermedio',
    0,    -- Privado
    0.00,
    0,
    NOW()
);

-- Obtener el ID del entrenamiento recién creado
SET @entrenamiento_id = LAST_INSERT_ID();

-- Paso 2: Añadir ejercicios
-- Asumimos que existen ejercicios con IDs 1, 2, 3, 4. 
-- Si no existen, estos inserts fallarán por FK.
-- Ajustar IDs según la base de datos real.

INSERT INTO entrenamiento_ejercicios (
    entrenamiento_id, 
    ejercicio_id, 
    series, 
    repeticiones, 
    descanso_segundos, 
    notas
) VALUES 
(@entrenamiento_id, 1, 4, 10, 90, 'Mantener técnica estricta'),
(@entrenamiento_id, 2, 4, 12, 60, 'Bajar controlado'),
(@entrenamiento_id, 3, 3, 15, 45, 'Enfocar en la contracción'),
(@entrenamiento_id, 4, 3, 20, 30, 'Al fallo si es posible');

-- Verificar creación
SELECT 
    e.id, 
    e.nombre, 
    e.asignado_a_usuario_id, 
    COUNT(ee.id) as total_ejercicios
FROM entrenamientos e
LEFT JOIN entrenamiento_ejercicios ee ON e.id = ee.entrenamiento_id
WHERE e.id = @entrenamiento_id
GROUP BY e.id;
