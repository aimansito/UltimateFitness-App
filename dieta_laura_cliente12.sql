-- ============================================
-- DIETA DE PRUEBA - ENTRENADORA LAURA
-- Cliente: Teresa Sánchez Ortiz (ID: 12)
-- Entrenadora: Laura García Sánchez (ID: 2)
-- ============================================

-- Paso 1: Crear la dieta principal
INSERT INTO dietas (
    nombre, 
    descripcion, 
    creador_id, 
    es_publica, 
    calorias_totales, 
    asignado_a_usuario_id,
    valoracion_promedio,
    total_valoraciones,
    fecha_creacion
) VALUES (
    'Plan Nutricional Personalizado - Teresa',
    'Dieta equilibrada de 1800 kcal enfocada en pérdida de grasa y tonificación',
    2,  -- Entrenadora Laura García Sánchez
    0,  -- Privada (solo para Teresa)
    1800,
    12, -- Asignada a Teresa Sánchez Ortiz
    0.00,
    0,
    NOW()
);

-- Obtener el ID de la dieta recién creada
SET @dieta_id = LAST_INSERT_ID();

-- Paso 2: Añadir platos para la semana
-- LUNES
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_id, 2, 'lunes', 'desayuno', 1, 'Bowl de avena proteico'),
(@dieta_id, 6, 'lunes', 'media_manana', 2, 'Snack proteico'),
(@dieta_id, 3, 'lunes', 'almuerzo', 3, 'Bowl de pollo y arroz'),
(@dieta_id, 6, 'lunes', 'merienda', 4, 'Yogur griego con frutos secos'),
(@dieta_id, 5, 'lunes', 'cena', 5, 'Salmón al horno');

-- MARTES
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_id, 1, 'martes', 'desayuno', 1, 'Tortilla fitness completa'),
(@dieta_id, 6, 'martes', 'media_manana', 2, NULL),
(@dieta_id, 4, 'martes', 'almuerzo', 3, 'Ensalada de atún'),
(@dieta_id, 6, 'martes', 'merienda', 4, NULL),
(@dieta_id, 5, 'martes', 'cena', 5, 'Pescado al horno');

-- MIÉRCOLES
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_id, 2, 'miercoles', 'desayuno', 1, NULL),
(@dieta_id, 6, 'miercoles', 'media_manana', 2, NULL),
(@dieta_id, 3, 'miercoles', 'almuerzo', 3, NULL),
(@dieta_id, 6, 'miercoles', 'merienda', 4, NULL),
(@dieta_id, 5, 'miercoles', 'cena', 5, NULL);

-- JUEVES
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_id, 1, 'jueves', 'desayuno', 1, NULL),
(@dieta_id, 6, 'jueves', 'media_manana', 2, NULL),
(@dieta_id, 4, 'jueves', 'almuerzo', 3, NULL),
(@dieta_id, 6, 'jueves', 'merienda', 4, NULL),
(@dieta_id, 5, 'jueves', 'cena', 5, NULL);

-- VIERNES
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_id, 2, 'viernes', 'desayuno', 1, NULL),
(@dieta_id, 6, 'viernes', 'media_manana', 2, NULL),
(@dieta_id, 3, 'viernes', 'almuerzo', 3, NULL),
(@dieta_id, 6, 'viernes', 'merienda', 4, NULL),
(@dieta_id, 5, 'viernes', 'cena', 5, NULL);

-- SÁBADO
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_id, 1, 'sabado', 'desayuno', 1, NULL),
(@dieta_id, 6, 'sabado', 'media_manana', 2, NULL),
(@dieta_id, 4, 'sabado', 'almuerzo', 3, NULL),
(@dieta_id, 6, 'sabado', 'merienda', 4, NULL),
(@dieta_id, 5, 'sabado', 'cena', 5, NULL);

-- DOMINGO
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_id, 2, 'domingo', 'desayuno', 1, NULL),
(@dieta_id, 6, 'domingo', 'media_manana', 2, NULL),
(@dieta_id, 3, 'domingo', 'almuerzo', 3, NULL),
(@dieta_id, 6, 'domingo', 'merienda', 4, NULL),
(@dieta_id, 5, 'domingo', 'cena', 5, NULL);

-- Verificar que se creó correctamente
SELECT 
    d.id,
    d.nombre,
    d.descripcion,
    e.nombre as entrenadora_nombre,
    u.nombre as cliente_nombre,
    COUNT(dp.id) as total_platos
FROM dietas d
INNER JOIN entrenadores e ON d.creador_id = e.id
LEFT JOIN usuarios u ON d.asignado_a_usuario_id = u.id
LEFT JOIN dieta_platos dp ON d.id = dp.dieta_id
WHERE d.id = @dieta_id
GROUP BY d.id;

-- Ver los platos de la dieta
SELECT 
    dp.dia_semana,
    dp.tipo_comida,
    p.nombre as plato_nombre,
    dp.notas
FROM dieta_platos dp
INNER JOIN platos p ON dp.plato_id = p.id
WHERE dp.dieta_id = @dieta_id
ORDER BY 
    FIELD(dp.dia_semana, 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'),
    FIELD(dp.tipo_comida, 'desayuno', 'media_manana', 'almuerzo', 'merienda', 'cena', 'post_entreno');
