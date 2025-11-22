-- Limpiar datos anteriores de dieta_alimento si es necesario
-- DELETE FROM dieta_alimento WHERE dieta_id = 1;

-- Insertar dieta de ejemplo (si no existe)
INSERT INTO dietas (nombre, descripcion, es_publica, valoracion_promedio, total_valoraciones, fecha_creacion) 
VALUES ('Dieta Ganancia Muscular Pro', 'Plan completo diseñado para aumentar masa muscular con enfoque en proteínas y carbohidratos complejos. Ideal para personas que entrenan 4-5 veces por semana.', 1, 4.8, 156, NOW())
ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id);

SET @dieta_id = LAST_INSERT_ID();

-- DESAYUNO (650 kcal)
INSERT INTO dieta_alimento (dieta_id, alimento_id, cantidad, momento_dia) VALUES
(@dieta_id, 1, 150, 'desayuno'),  -- Asumiendo IDs de alimentos existentes
(@dieta_id, 2, 80, 'desayuno'),
(@dieta_id, 3, 120, 'desayuno');

-- MEDIA MAÑANA (350 kcal)
INSERT INTO dieta_alimento (dieta_id, alimento_id, cantidad, momento_dia) VALUES
(@dieta_id, 4, 30, 'media_mañana'),
(@dieta_id, 5, 40, 'media_mañana');

-- COMIDA (800 kcal)
INSERT INTO dieta_alimento (dieta_id, alimento_id, cantidad, momento_dia) VALUES
(@dieta_id, 6, 200, 'comida'),
(@dieta_id, 7, 150, 'comida'),
(@dieta_id, 8, 100, 'comida');

-- MERIENDA (300 kcal)
INSERT INTO dieta_alimento (dieta_id, alimento_id, cantidad, momento_dia) VALUES
(@dieta_id, 9, 150, 'merienda'),
(@dieta_id, 10, 30, 'merienda');

-- CENA (700 kcal)
INSERT INTO dieta_alimento (dieta_id, alimento_id, cantidad, momento_dia) VALUES
(@dieta_id, 11, 180, 'cena'),
(@dieta_id, 12, 150, 'cena'),
(@dieta_id, 13, 100, 'cena');