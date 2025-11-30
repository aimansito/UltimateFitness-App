-- ============================================
-- SCRIPT PARA CREAR DIETA DE PRUEBA
-- Cliente ID: 12
-- Entrenador ID: 2
-- ============================================

-- Paso 1: Crear la dieta principal
INSERT INTO dietas (
    nombre, 
    descripcion, 
    creador_id, 
    es_publica, 
    calorias_totales, 
    proteinas_totales, 
    carbohidratos_totales, 
    grasas_totales,
    asignado_a_usuario_id,
    valoracion_promedio,
    total_valoraciones,
    fecha_creacion
) VALUES (
    'Dieta de Prueba - Cliente 12',
    'Dieta equilibrada de 2000 kcal para pruebas',
    2,  -- Entrenador ID 2
    0,  -- Privada
    2000,
    150,
    250,
    65,
    12, -- Asignada al cliente 12
    0.00,
    0,
    NOW()
);

-- Obtener el ID de la dieta recién creada
SET @dieta_id = LAST_INSERT_ID();

-- Paso 2: Añadir platos VARIADOS para toda la semana
-- Platos reales de tu base de datos:
-- ID 1: Tortilla Fitness Completa (desayuno)
-- ID 2: Bowl de Avena Proteico (desayuno)  
-- ID 3: Bowl Proteico de Pollo y Arroz (almuerzo)
-- ID 4: Ensalada de Atún Mediterránea (almuerzo)
-- ID 5: Salmón al Horno Mediterráneo (cena)
-- ID 6: Snack Proteico Rápido (merienda/snack)
-- ID 7-10: Varios almuerzos

-- LUNES
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_id, 1, 'lunes', 'desayuno', 1, 'Tortilla Fitness Completa'),
(@dieta_id, 6, 'lunes', 'media_manana', 2, 'Snack proteico'),
(@dieta_id, 3, 'lunes', 'almuerzo', 3, 'Bowl de pollo y arroz'),
(@dieta_id, 6, 'lunes', 'merienda', 4, 'Snack proteico'),
(@dieta_id, 5, 'lunes', 'cena', 5, 'Salmón al horno'),
(@dieta_id, 6, 'lunes', 'post_entreno', 6, 'Recuperación');

-- MARTES
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_id, 2, 'martes', 'desayuno', 1, 'Bowl de avena'),
(@dieta_id, 6, 'martes', 'media_manana', 2, NULL),
(@dieta_id, 4, 'martes', 'almuerzo', 3, 'Ensalada de atún'),
(@dieta_id, 6, 'martes', 'merienda', 4, NULL),
(@dieta_id, 5, 'martes', 'cena', 5, NULL),
(@dieta_id, 6, 'martes', 'post_entreno', 6, NULL);

-- MIÉRCOLES
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_id, 1, 'miercoles', 'desayuno', 1, NULL),
(@dieta_id, 6, 'miercoles', 'media_manana', 2, NULL),
(@dieta_id, 7, 'miercoles', 'almuerzo', 3, 'Pasta integral'),
(@dieta_id, 6, 'miercoles', 'merienda', 4, NULL),
(@dieta_id, 5, 'miercoles', 'cena', 5, NULL),
(@dieta_id, 6, 'miercoles', 'post_entreno', 6, NULL);

-- JUEVES
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_id, 2, 'jueves', 'desayuno', 1, NULL),
(@dieta_id, 6, 'jueves', 'media_manana', 2, NULL),
(@dieta_id, 8, 'jueves', 'almuerzo', 3, 'Arroz cremoso'),
(@dieta_id, 6, 'jueves', 'merienda', 4, NULL),
(@dieta_id, 5, 'jueves', 'cena', 5, NULL),
(@dieta_id, 6, 'jueves', 'post_entreno', 6, NULL);

-- VIERNES
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_id, 1, 'viernes', 'desayuno', 1, NULL),
(@dieta_id, 6, 'viernes', 'media_manana', 2, NULL),
(@dieta_id, 9, 'viernes', 'almuerzo', 3, 'Arroz sabroso'),
(@dieta_id, 6, 'viernes', 'merienda', 4, NULL),
(@dieta_id, 5, 'viernes', 'cena', 5, NULL),
(@dieta_id, 6, 'viernes', 'post_entreno', 6, NULL);

-- SÁBADO
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_id, 2, 'sabado', 'desayuno', 1, NULL),
(@dieta_id, 6, 'sabado', 'media_manana', 2, NULL),
(@dieta_id, 10, 'sabado', 'almuerzo', 3, 'Arroz Basmati'),
(@dieta_id, 6, 'sabado', 'merienda', 4, NULL),
(@dieta_id, 5, 'sabado', 'cena', 5, NULL),
(@dieta_id, 6, 'sabado', 'post_entreno', 6, NULL);

-- DOMINGO
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_id, 1, 'domingo', 'desayuno', 1, NULL),
(@dieta_id, 6, 'domingo', 'media_manana', 2, NULL),
(@dieta_id, 3, 'domingo', 'almuerzo', 3, NULL),
(@dieta_id, 6, 'domingo', 'merienda', 4, NULL),
(@dieta_id, 5, 'domingo', 'cena', 5, NULL),
(@dieta_id, 6, 'domingo', 'post_entreno', 6, NULL);

-- Verificar que se creó correctamente
SELECT 
    d.id,
    d.nombre,
    d.asignado_a_usuario_id,
    COUNT(dp.id) as total_platos
FROM dietas d
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
