-- ============================================
-- VERIFICACIÓN DE DIETA GUARDADA
-- ============================================

-- 1. Ver la última dieta creada
SELECT 
    id,
    nombre,
    descripcion,
    creador_id,
    asignado_a_usuario_id,
    calorias_totales,
    proteinas_totales,
    carbohidratos_totales,
    grasas_totales,
    es_publica,
    fecha_creacion
FROM dietas 
ORDER BY id DESC 
LIMIT 1;

-- 2. Ver el plan semanal de esa dieta
SELECT 
    dp.dia_semana,
    dp.tipo_comida,
    p.nombre as plato_nombre,
    p.calorias_totales,
    p.proteinas_totales,
    p.carbohidratos_totales,
    p.grasas_totales,
    dp.orden
FROM dieta_platos dp
INNER JOIN platos p ON dp.plato_id = p.id
WHERE dp.dieta_id = (SELECT MAX(id) FROM dietas)
ORDER BY 
    FIELD(dp.dia_semana, 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'),
    FIELD(dp.tipo_comida, 'desayuno', 'media_manana', 'almuerzo', 'merienda', 'cena', 'post_entreno'),
    dp.orden;

-- 3. Contar cuántos platos tiene por día
SELECT 
    dp.dia_semana,
    COUNT(*) as total_platos,
    SUM(p.calorias_totales) as calorias_dia
FROM dieta_platos dp
INNER JOIN platos p ON dp.plato_id = p.id
WHERE dp.dieta_id = (SELECT MAX(id) FROM dietas)
GROUP BY dp.dia_semana
ORDER BY FIELD(dp.dia_semana, 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo');

-- 4. Ver si está asignada a un usuario
SELECT 
    d.id as dieta_id,
    d.nombre as dieta_nombre,
    u.id as usuario_id,
    u.nombre as usuario_nombre,
    u.email as usuario_email,
    e.nombre as entrenador_nombre
FROM dietas d
LEFT JOIN usuarios u ON d.asignado_a_usuario_id = u.id
LEFT JOIN entrenadores e ON d.creador_id = e.id
WHERE d.id = (SELECT MAX(id) FROM dietas);
