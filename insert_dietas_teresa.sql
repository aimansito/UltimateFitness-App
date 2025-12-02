-- ============================================
-- DIETAS COMPLETAS PARA TERESA SÁNCHEZ ORTIZ
-- Usuario ID: 12 (Premium)
-- Entrenador ID: 2 (Laura García Sánchez - Nutrición)
-- Objetivo: Cuidar alimentación
-- NOTA: Todas las dietas son SIN GLUTEN (alérgica)
-- ============================================

USE ultimatefitness_db;

-- ============================================
-- DIETA 1: PLAN MEDITERRÁNEO SALUDABLE 2200 KCAL
-- ============================================

INSERT INTO dietas (
    nombre, 
    descripcion, 
    creador_id, 
    asignado_a_usuario_id,
    es_publica, 
    calorias_totales,
    valoracion_promedio,
    total_valoraciones,
    fecha_creacion
) VALUES (
    'Plan Mediterráneo Saludable - Teresa',
    'Dieta equilibrada mediterránea 2200 kcal, 100% SIN GLUTEN. Rica en pescados, verduras y grasas saludables.',
    2,  -- Entrenador Laura García
    12, -- Teresa Sánchez
    0,  -- Privada
    2200,
    0.00,
    0,
    NOW()
);

SET @dieta_mediterranea = LAST_INSERT_ID();

-- Platos semanales para Dieta Mediterránea
-- LUNES
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_mediterranea, 2, 'lunes', 'desayuno', 1, 'Avena sin gluten con frutas'),
(@dieta_mediterranea, 6, 'lunes', 'media_manana', 2, 'Snack proteico'),
(@dieta_mediterranea, 5, 'lunes', 'almuerzo', 3, 'Salmón al horno - Rico en Omega-3'),
(@dieta_mediterranea, 6, 'lunes', 'merienda', 4, 'Yogur con almendras'),
(@dieta_mediterranea, 4, 'lunes', 'cena', 5, 'Ensalada de atún mediterránea'),
(@dieta_mediterranea, 6, 'lunes', 'post_entreno', 6, 'Recuperación');

-- MARTES
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_mediterranea, 1, 'martes', 'desayuno', 1, 'Tortilla con vegetales'),
(@dieta_mediterranea, 6, 'martes', 'media_manana', 2, NULL),
(@dieta_mediterranea, 3, 'martes', 'almuerzo', 3, 'Bowl proteico de pollo'),
(@dieta_mediterranea, 6, 'martes', 'merienda', 4, NULL),
(@dieta_mediterranea, 5, 'martes', 'cena', 5, 'Salmón mediterráneo'),
(@dieta_mediterranea, 6, 'martes', 'post_entreno', 6, NULL);

-- MIÉRCOLES
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_mediterranea, 2, 'miercoles', 'desayuno', 1, NULL),
(@dieta_mediterranea, 6, 'miercoles', 'media_manana', 2, NULL),
(@dieta_mediterranea, 10, 'miercoles', 'almuerzo', 3, 'Arroz basmati con vegetales'),
(@dieta_mediterranea, 6, 'miercoles', 'merienda', 4, NULL),
(@dieta_mediterranea, 4, 'miercoles', 'cena', 5, NULL),
(@dieta_mediterranea, 6, 'miercoles', 'post_entreno', 6, NULL);

-- JUEVES
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_mediterranea, 1, 'jueves', 'desayuno', 1, NULL),
(@dieta_mediterranea, 6, 'jueves', 'media_manana', 2, NULL),
(@dieta_mediterranea, 5, 'jueves', 'almuerzo', 3, 'Pescado al horno'),
(@dieta_mediterranea, 6, 'jueves', 'merienda', 4, NULL),
(@dieta_mediterranea, 3, 'jueves', 'cena', 5, NULL),
(@dieta_mediterranea, 6, 'jueves', 'post_entreno', 6, NULL);

-- VIERNES
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_mediterranea, 2, 'viernes', 'desayuno', 1, NULL),
(@dieta_mediterranea, 6, 'viernes', 'media_manana', 2, NULL),
(@dieta_mediterranea, 4, 'viernes', 'almuerzo', 3, 'Ensalada completa'),
(@dieta_mediterranea, 6, 'viernes', 'merienda', 4, NULL),
(@dieta_mediterranea, 5, 'viernes', 'cena', 5, NULL),
(@dieta_mediterranea, 6, 'viernes', 'post_entreno', 6, NULL);

-- SÁBADO
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_mediterranea, 1, 'sabado', 'desayuno', 1, NULL),
(@dieta_mediterranea, 6, 'sabado', 'media_manana', 2, NULL),
(@dieta_mediterranea, 10, 'sabado', 'almuerzo', 3, NULL),
(@dieta_mediterranea, 6, 'sabado', 'merienda', 4, NULL),
(@dieta_mediterranea, 4, 'sabado', 'cena', 5, NULL),
(@dieta_mediterranea, 6, 'sabado', 'post_entreno', 6, NULL);

-- DOMINGO
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_mediterranea, 2, 'domingo', 'desayuno', 1, NULL),
(@dieta_mediterranea, 6, 'domingo', 'media_manana', 2, NULL),
(@dieta_mediterranea, 3, 'domingo', 'almuerzo', 3, NULL),
(@dieta_mediterranea, 6, 'domingo', 'merienda', 4, NULL),
(@dieta_mediterranea, 5, 'domingo', 'cena', 5, NULL),
(@dieta_mediterranea, 6, 'domingo', 'post_entreno', 6, NULL);


-- ============================================
-- DIETA 2: PLAN DETOX LIGERO 1800 KCAL
-- ============================================

INSERT INTO dietas (
    nombre, 
    descripcion, 
    creador_id, 
    asignado_a_usuario_id,
    es_publica, 
    calorias_totales,
    valoracion_promedio,
    total_valoraciones,
    fecha_creacion
) VALUES (
    'Plan Detox Ligero - Teresa',
    'Dieta depurativa 1800 kcal, SIN GLUTEN. Énfasis en verduras, proteínas magras y antioxidantes.',
    2,  -- Entrenador Laura García
    12, -- Teresa Sánchez
    0,  -- Privada
    1800,
    0.00,
    0,
    NOW()
);

SET @dieta_detox = LAST_INSERT_ID();

-- Platos semanales para Dieta Detox
-- LUNES
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_detox, 2, 'lunes', 'desayuno', 1, 'Avena con frutos rojos'),
(@dieta_detox, 6, 'lunes', 'media_manana', 2, 'Snack ligero'),
(@dieta_detox, 4, 'lunes', 'almuerzo', 3, 'Ensalada de atún rica en fibra'),
(@dieta_detox, 6, 'lunes', 'merienda', 4, NULL),
(@dieta_detox, 4, 'lunes', 'cena', 5, 'Ensalada con vegetales frescos'),
(@dieta_detox, 6, 'lunes', 'post_entreno', 6, NULL);

-- MARTES
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_detox, 1, 'martes', 'desayuno', 1, 'Tortilla con espinacas'),
(@dieta_detox, 6, 'martes', 'media_manana', 2, NULL),
(@dieta_detox, 5, 'martes', 'almuerzo', 3, 'Salmón con verduras al vapor'),
(@dieta_detox, 6, 'martes', 'merienda', 4, NULL),
(@dieta_detox, 4, 'martes', 'cena', 5, NULL),
(@dieta_detox, 6, 'martes', 'post_entreno', 6, NULL);

-- MIÉRCOLES
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_detox, 2, 'miercoles', 'desayuno', 1, NULL),
(@dieta_detox, 6, 'miercoles', 'media_manana', 2, NULL),
(@dieta_detox, 4, 'miercoles', 'almuerzo', 3, 'Ensalada verde completa'),
(@dieta_detox, 6, 'miercoles', 'merienda', 4, NULL),
(@dieta_detox, 5, 'miercoles', 'cena', 5, 'Pescado ligero'),
(@dieta_detox, 6, 'miercoles', 'post_entreno', 6, NULL);

-- JUEVES
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_detox, 1, 'jueves', 'desayuno', 1, NULL),
(@dieta_detox, 6, 'jueves', 'media_manana', 2, NULL),
(@dieta_detox, 3, 'jueves', 'almuerzo', 3, 'Bowl de pollo con vegetales'),
(@dieta_detox, 6, 'jueves', 'merienda', 4, NULL),
(@dieta_detox, 4, 'jueves', 'cena', 5, NULL),
(@dieta_detox, 6, 'jueves', 'post_entreno', 6, NULL);

-- VIERNES
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_detox, 2, 'viernes', 'desayuno', 1, NULL),
(@dieta_detox, 6, 'viernes', 'media_manana', 2, NULL),
(@dieta_detox, 5, 'viernes', 'almuerzo', 3, NULL),
(@dieta_detox, 6, 'viernes', 'merienda', 4, NULL),
(@dieta_detox, 4, 'viernes', 'cena', 5, NULL),
(@dieta_detox, 6, 'viernes', 'post_entreno', 6, NULL);

-- SÁBADO
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_detox, 1, 'sabado', 'desayuno', 1, NULL),
(@dieta_detox, 6, 'sabado', 'media_manana', 2, NULL),
(@dieta_detox, 3, 'sabado', 'almuerzo', 3, NULL),
(@dieta_detox, 6, 'sabado', 'merienda', 4, NULL),
(@dieta_detox, 5, 'sabado', 'cena', 5, NULL),
(@dieta_detox, 6, 'sabado', 'post_entreno', 6, NULL);

-- DOMINGO
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_detox, 2, 'domingo', 'desayuno', 1, 'Día de descanso digestivo'),
(@dieta_detox, 6, 'domingo', 'media_manana', 2, NULL),
(@dieta_detox, 4, 'domingo', 'almuerzo', 3, 'Ensalada detox'),
(@dieta_detox, 6, 'domingo', 'merienda', 4, NULL),
(@dieta_detox, 4, 'domingo', 'cena', 5, NULL),
(@dieta_detox, 6, 'domingo', 'post_entreno', 6, NULL);


-- ============================================
-- DIETA 3: PLAN ENERGÉTICO BALANCEADO 2400 KCAL
-- ============================================

INSERT INTO dietas (
    nombre, 
    descripcion, 
    creador_id, 
    asignado_a_usuario_id,
    es_publica, 
    calorias_totales,
    valoracion_promedio,
    total_valoraciones,
    fecha_creacion
) VALUES (
    'Plan Energético Balanceado - Teresa',
    'Dieta equilibrada 2400 kcal, SIN GLUTEN. Ideal para actividad física moderada con carbohidratos complejos.',
    2,  -- Entrenador Laura García
    12, -- Teresa Sánchez
    0,  -- Privada
    2400,
    0.00,
    0,
    NOW()
);

SET @dieta_energetica = LAST_INSERT_ID();

-- Platos semanales para Dieta Energética
-- LUNES
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_energetica, 2, 'lunes', 'desayuno', 1, 'Avena energética con plátano'),
(@dieta_energetica, 6, 'lunes', 'media_manana', 2, 'Snack pre-entreno'),
(@dieta_energetica, 3, 'lunes', 'almuerzo', 3, 'Bowl completo pollo y arroz'),
(@dieta_energetica, 6, 'lunes', 'merienda', 4, 'Frutos secos'),
(@dieta_energetica, 5, 'lunes', 'cena', 5, 'Salmón con batata'),
(@dieta_energetica, 6, 'lunes', 'post_entreno', 6, 'Recuperación muscular');

-- MARTES
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_energetica, 1, 'martes', 'desayuno', 1, 'Tortilla completa'),
(@dieta_energetica, 6, 'martes', 'media_manana', 2, NULL),
(@dieta_energetica, 10, 'martes', 'almuerzo', 3, 'Arroz basmati proteico'),
(@dieta_energetica, 6, 'martes', 'merienda', 4, NULL),
(@dieta_energetica, 3, 'martes', 'cena', 5, NULL),
(@dieta_energetica, 6, 'martes', 'post_entreno', 6, NULL);

-- MIÉRCOLES
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_energetica, 2, 'miercoles', 'desayuno', 1, NULL),
(@dieta_energetica, 6, 'miercoles', 'media_manana', 2, NULL),
(@dieta_energetica, 3, 'miercoles', 'almuerzo', 3, 'Bowl energético'),
(@dieta_energetica, 6, 'miercoles', 'merienda', 4, NULL),
(@dieta_energetica, 5, 'miercoles', 'cena', 5, NULL),
(@dieta_energetica, 6, 'miercoles', 'post_entreno', 6, NULL);

-- JUEVES
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_energetica, 1, 'jueves', 'desayuno', 1, NULL),
(@dieta_energetica, 6, 'jueves', 'media_manana', 2, NULL),
(@dieta_energetica, 10, 'jueves', 'almuerzo', 3, NULL),
(@dieta_energetica, 6, 'jueves', 'merienda', 4, NULL),
(@dieta_energetica, 4, 'jueves', 'cena', 5, NULL),
(@dieta_energetica, 6, 'jueves', 'post_entreno', 6, NULL);

-- VIERNES
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_energetica, 2, 'viernes', 'desayuno', 1, NULL),
(@dieta_energetica, 6, 'viernes', 'media_manana', 2, NULL),
(@dieta_energetica, 3, 'viernes', 'almuerzo', 3, NULL),
(@dieta_energetica, 6, 'viernes', 'merienda', 4, NULL),
(@dieta_energetica, 5, 'viernes', 'cena', 5, NULL),
(@dieta_energetica, 6, 'viernes', 'post_entreno', 6, NULL);

-- SÁBADO
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_energetica, 1, 'sabado', 'desayuno', 1, NULL),
(@dieta_energetica, 6, 'sabado', 'media_manana', 2, NULL),
(@dieta_energetica, 10, 'sabado', 'almuerzo', 3, 'Día de carga carbohidratos'),
(@dieta_energetica, 6, 'sabado', 'merienda', 4, NULL),
(@dieta_energetica, 3, 'sabado', 'cena', 5, NULL),
(@dieta_energetica, 6, 'sabado', 'post_entreno', 6, NULL);

-- DOMINGO
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas) VALUES
(@dieta_energetica, 2, 'domingo', 'desayuno', 1, NULL),
(@dieta_energetica, 6, 'domingo', 'media_manana', 2, NULL),
(@dieta_energetica, 5, 'domingo', 'almuerzo', 3, 'Comida más ligera'),
(@dieta_energetica, 6, 'domingo', 'merienda', 4, NULL),
(@dieta_energetica, 4, 'domingo', 'cena', 5, NULL),
(@dieta_energetica, 6, 'domingo', 'post_entreno', 6, NULL);


-- ============================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- ============================================

-- Ver todas las dietas de Teresa
SELECT 
    d.id,
    d.nombre,
    d.descripcion,
    d.calorias_totales,
    d.asignado_a_usuario_id,
    COUNT(dp.id) as total_platos_asignados,
    d.fecha_creacion
FROM dietas d
LEFT JOIN dieta_platos dp ON d.id = dp.dieta_id
WHERE d.asignado_a_usuario_id = 12
GROUP BY d.id
ORDER BY d.fecha_creacion DESC;

-- Ver detalle de Plan Mediterráneo
SELECT 
    '=== PLAN MEDITERRÁNEO SALUDABLE ===' AS titulo;
    
SELECT 
    dp.dia_semana,
    dp.tipo_comida,
    p.nombre as plato_nombre,
    dp.notas,
    p.calorias_totales
FROM dieta_platos dp
INNER JOIN platos p ON dp.plato_id = p.id
WHERE dp.dieta_id = @dieta_mediterranea
ORDER BY 
    FIELD(dp.dia_semana, 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'),
    FIELD(dp.tipo_comida, 'desayuno', 'media_manana', 'almuerzo', 'merienda', 'cena', 'post_entreno');

-- Ver detalle de Plan Detox
SELECT 
    '=== PLAN DETOX LIGERO ===' AS titulo;
    
SELECT 
    dp.dia_semana,
    dp.tipo_comida,
    p.nombre as plato_nombre,
    dp.notas
FROM dieta_platos dp
INNER JOIN platos p ON dp.plato_id = p.id
WHERE dp.dieta_id = @dieta_detox
ORDER BY 
    FIELD(dp.dia_semana, 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'),
    FIELD(dp.tipo_comida, 'desayuno', 'media_manana', 'almuerzo', 'merienda', 'cena', 'post_entreno');

-- Ver detalle de Plan Energético
SELECT 
    '=== PLAN ENERGÉTICO BALANCEADO ===' AS titulo;
    
SELECT 
    dp.dia_semana,
    dp.tipo_comida,
    p.nombre as plato_nombre,
    dp.notas
FROM dieta_platos dp
INNER JOIN platos p ON dp.plato_id = p.id
WHERE dp.dieta_id = @dieta_energetica
ORDER BY 
    FIELD(dp.dia_semana, 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'),
    FIELD(dp.tipo_comida, 'desayuno', 'media_manana', 'almuerzo', 'merienda', 'cena', 'post_entreno');

SELECT '✅ DIETAS CREADAS EXITOSAMENTE PARA TERESA' AS resultado;
SELECT 'Total de dietas nuevas: 3' AS info;
SELECT 'Todas las dietas son 100% SIN GLUTEN' AS importante;
