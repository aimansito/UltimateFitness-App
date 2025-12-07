USE ultimatefitness_db;

-- ==========================================
-- 1. OBTENER IDs DE USUARIO Y ENTRENADOR
-- ==========================================
SET @usuario_nombre = 'Hugo';
SET @usuario_apellido = 'Serrano';
SET @entrenador_nombre = 'Carlos';

-- Buscar ID del usuario Hugo Serrano
SET @usuario_id = (SELECT id FROM usuarios WHERE nombre LIKE CONCAT('%', @usuario_nombre, '%') AND apellidos LIKE CONCAT('%', @usuario_apellido, '%') LIMIT 1);

-- Buscar ID del entrenador Carlos
SET @entrenador_id = (SELECT id FROM entrenadores WHERE nombre LIKE CONCAT('%', @entrenador_nombre, '%') LIMIT 1);

-- Verificación básica (opcional, en consola mostraría NULL si no existen)
SELECT @usuario_id AS 'ID Usuario Encontrado', @entrenador_id AS 'ID Entrenador Encontrado';

-- ==========================================
-- 2. CREAR PLATOS DE EJEMPLO
-- ==========================================
-- Insertamos platos básicos para usarlos en la dieta
INSERT INTO platos (nombre, descripcion, tipo_comida, calorias_totales, proteinas_totales, carbohidratos_totales, grasas_totales, es_publico, creador_id, fecha_creacion) VALUES 
('Desayuno Campeón Hugo', 'Avena, huevos y fruta', 'desayuno', 550.00, 35.00, 65.00, 15.00, 1, @entrenador_id, NOW()),
('Media Mañana Proteica', 'Batido de proteínas y nueces', 'media_manana', 300.00, 25.00, 10.00, 15.00, 1, @entrenador_id, NOW()),
('Almuerzo Pollo y Arroz', 'Pechuga de pollo con arroz integral', 'almuerzo', 700.00, 50.00, 80.00, 20.00, 1, @entrenador_id, NOW()),
('Merienda Fruta y Yogur', 'Yogur griego con manzana', 'merienda', 250.00, 15.00, 30.00, 5.00, 1, @entrenador_id, NOW()),
('Cena Ligera Pescado', 'Merluza con verduras al vapor', 'cena', 450.00, 40.00, 20.00, 20.00, 1, @entrenador_id, NOW()),
('Post-Entreno Recuperador', 'Batido y plátano', 'post_entreno', 350.00, 30.00, 50.00, 2.00, 1, @entrenador_id, NOW());

-- Capturamos los IDs de los platos recién creados
SET @p_desayuno = (SELECT id FROM platos WHERE nombre = 'Desayuno Campeón Hugo' ORDER BY id DESC LIMIT 1);
SET @p_media = (SELECT id FROM platos WHERE nombre = 'Media Mañana Proteica' ORDER BY id DESC LIMIT 1);
SET @p_almuerzo = (SELECT id FROM platos WHERE nombre = 'Almuerzo Pollo y Arroz' ORDER BY id DESC LIMIT 1);
SET @p_merienda = (SELECT id FROM platos WHERE nombre = 'Merienda Fruta y Yogur' ORDER BY id DESC LIMIT 1);
SET @p_cena = (SELECT id FROM platos WHERE nombre = 'Cena Ligera Pescado' ORDER BY id DESC LIMIT 1);
SET @p_post = (SELECT id FROM platos WHERE nombre = 'Post-Entreno Recuperador' ORDER BY id DESC LIMIT 1);

-- ==========================================
-- 3. CREAR LA DIETA
-- ==========================================
INSERT INTO dietas (
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
) VALUES (
    'Dieta Volumen Hugo Serrano', 
    'Plan nutricional enfocado en ganancia muscular limpia para Hugo.', 
    @entrenador_id, 
    @usuario_id, 
    2600.00, -- Suma aprox de los platos
    195.00, 
    255.00, 
    77.00, 
    0, -- Privada
    NOW()
);

SET @dieta_id = LAST_INSERT_ID();

-- ==========================================
-- 4. ASIGNAR PLATOS A LA DIETA (SEMANA COMPLETA)
-- ==========================================

-- LUNES A DOMINGO (Repetimos el menú para simplificar, pero funciona igual)
INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden) VALUES 
-- LUNES
(@dieta_id, @p_desayuno, 'lunes', 'desayuno', 1),
(@dieta_id, @p_media, 'lunes', 'media_manana', 1),
(@dieta_id, @p_almuerzo, 'lunes', 'almuerzo', 1),
(@dieta_id, @p_merienda, 'lunes', 'merienda', 1),
(@dieta_id, @p_cena, 'lunes', 'cena', 1),

-- MARTES
(@dieta_id, @p_desayuno, 'martes', 'desayuno', 1),
(@dieta_id, @p_almuerzo, 'martes', 'almuerzo', 1),
(@dieta_id, @p_cena, 'martes', 'cena', 1),
(@dieta_id, @p_post, 'martes', 'post_entreno', 1),

-- MIÉRCOLES
(@dieta_id, @p_desayuno, 'miercoles', 'desayuno', 1),
(@dieta_id, @p_media, 'miercoles', 'media_manana', 1),
(@dieta_id, @p_almuerzo, 'miercoles', 'almuerzo', 1),
(@dieta_id, @p_cena, 'miercoles', 'cena', 1),

-- JUEVES
(@dieta_id, @p_desayuno, 'jueves', 'desayuno', 1),
(@dieta_id, @p_almuerzo, 'jueves', 'almuerzo', 1),
(@dieta_id, @p_merienda, 'jueves', 'merienda', 1),
(@dieta_id, @p_cena, 'jueves', 'cena', 1),

-- VIERNES
(@dieta_id, @p_desayuno, 'viernes', 'desayuno', 1),
(@dieta_id, @p_media, 'viernes', 'media_manana', 1),
(@dieta_id, @p_almuerzo, 'viernes', 'almuerzo', 1),
(@dieta_id, @p_post, 'viernes', 'post_entreno', 1),
(@dieta_id, @p_cena, 'viernes', 'cena', 1),

-- SÁBADO
(@dieta_id, @p_desayuno, 'sabado', 'desayuno', 1),
(@dieta_id, @p_almuerzo, 'sabado', 'almuerzo', 1),
(@dieta_id, @p_cena, 'sabado', 'cena', 1),

-- DOMINGO
(@dieta_id, @p_desayuno, 'domingo', 'desayuno', 1),
(@dieta_id, @p_almuerzo, 'domingo', 'almuerzo', 1),
(@dieta_id, @p_merienda, 'domingo', 'merienda', 1),
(@dieta_id, @p_cena, 'domingo', 'cena', 1);

SELECT CONCAT('Dieta creada exitosamente con ID: ', @dieta_id) AS Resultado;
