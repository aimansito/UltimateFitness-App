-- ============================================
-- ACTUALIZAR TABLA USUARIOS - DATOS FÍSICOS
-- ============================================

USE ultimatefitness_db;

-- Añadir columnas de datos físicos
ALTER TABLE usuarios 
ADD COLUMN sexo ENUM('masculino', 'femenino', 'otro') DEFAULT NULL AFTER objetivo,
ADD COLUMN fecha_nacimiento DATE DEFAULT NULL AFTER sexo,
ADD COLUMN edad INT DEFAULT NULL AFTER fecha_nacimiento,
ADD COLUMN peso_actual DECIMAL(5,2) DEFAULT NULL COMMENT 'Peso en kg' AFTER edad,
ADD COLUMN altura INT DEFAULT NULL COMMENT 'Altura en cm' AFTER peso_actual,
ADD COLUMN peso_objetivo DECIMAL(5,2) DEFAULT NULL COMMENT 'Peso deseado en kg' AFTER altura,
ADD COLUMN porcentaje_grasa DECIMAL(4,2) DEFAULT NULL COMMENT 'Porcentaje de grasa corporal' AFTER peso_objetivo,
ADD COLUMN imc DECIMAL(4,2) DEFAULT NULL COMMENT 'Índice de masa corporal calculado' AFTER porcentaje_grasa,
ADD COLUMN nivel_actividad ENUM('sedentario', 'ligero', 'moderado', 'activo', 'muy_activo') DEFAULT 'ligero' AFTER imc,
ADD COLUMN calorias_diarias INT DEFAULT NULL COMMENT 'Calorías recomendadas' AFTER nivel_actividad,
ADD COLUMN notas_salud TEXT DEFAULT NULL COMMENT 'Alergias, lesiones, condiciones médicas' AFTER calorias_diarias;

-- Añadir índices para búsquedas eficientes
ALTER TABLE usuarios
ADD INDEX idx_sexo (sexo),
ADD INDEX idx_edad (edad),
ADD INDEX idx_nivel_actividad (nivel_actividad);

-- Verificar cambios
DESCRIBE usuarios;

SELECT '============================================' as '';
SELECT '✅ TABLA USUARIOS ACTUALIZADA CON ÉXITO' as '';
SELECT '============================================' as '';