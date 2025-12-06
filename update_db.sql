-- ================================================
-- SCRIPT DE ACTUALIZACIÓN DE BASE DE DATOS
-- Actualiza la BD del 2 dic a las entidades actuales
-- ================================================

USE ultimatefitness_db;

-- ================================================
-- 1. ACTUALIZAR TABLA usuarios
-- ================================================
-- Eliminar el índice idx_sexo si existe
SET @exist := (SELECT COUNT(*) FROM information_schema.statistics WHERE table_name = 'usuarios' AND index_name = 'idx_sexo' AND table_schema = DATABASE());
SET @sql := IF(@exist > 0, 'DROP INDEX idx_sexo ON usuarios', 'SELECT "Index idx_sexo does not exist"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Eliminar la columna sexo si existe
SET @exist := (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'sexo' AND table_schema = DATABASE());
SET @sql := IF(@exist > 0, 'ALTER TABLE usuarios DROP COLUMN sexo', 'SELECT "Column sexo does not exist"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ================================================
-- 2. ACTUALIZAR TABLA suscripciones (SIMPLIFICACIÓN)
-- ================================================

-- Eliminar foreign key de servicio_id primero si existe
SET @exist := (SELECT COUNT(*) FROM information_schema.table_constraints WHERE table_name = 'suscripciones' AND constraint_name = 'suscripciones_ibfk_2' AND table_schema = DATABASE());
SET @sql := IF(@exist > 0, 'ALTER TABLE suscripciones DROP FOREIGN KEY suscripciones_ibfk_2', 'SELECT "FK suscripciones_ibfk_2 does not exist"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Eliminar columnas obsoletas
ALTER TABLE suscripciones 
    DROP COLUMN servicio_id,
    DROP COLUMN entrenamiento_presencial,
    DROP COLUMN fecha_proximo_pago,
    DROP COLUMN notas,
    DROP COLUMN metodo_pago,
    DROP COLUMN id_transaccion_externa,
    DROP COLUMN ultimos4_digitos;

-- Añadir nueva columna activa si no existe
SET @exist := (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'suscripciones' AND column_name = 'activa' AND table_schema = DATABASE());
SET @sql := IF(@exist = 0, 'ALTER TABLE suscripciones ADD COLUMN activa TINYINT(1) NOT NULL DEFAULT 1 AFTER auto_renovacion', 'SELECT "Column activa already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Crear índice para activa si no existe
SET @exist := (SELECT COUNT(*) FROM information_schema.statistics WHERE table_name = 'suscripciones' AND index_name = 'idx_activa' AND table_schema = DATABASE());
SET @sql := IF(@exist = 0, 'CREATE INDEX idx_activa ON suscripciones(activa)', 'SELECT "Index idx_activa already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ================================================
-- 3. ACTUALIZAR TABLA entrenamientos
-- ================================================

-- Primero verificar si existe foreign key y eliminarla
SET @exist := (SELECT COUNT(*) FROM information_schema.table_constraints WHERE table_name = 'entrenamientos' AND constraint_name = 'FK_24DCB62B6B62C1A2' AND table_schema = DATABASE());
SET @sql := IF(@exist > 0, 'ALTER TABLE entrenamientos DROP FOREIGN KEY FK_24DCB62B6B62C1A2', 'SELECT "FK FK_24DCB62B6B62C1A2 does not exist"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Renombrar la columna si existe con typo
SET @exist := (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'entrenamientos' AND column_name = 'asignado_ausuario_id' AND table_schema = DATABASE());
SET @sql := IF(@exist > 0, 'ALTER TABLE entrenamientos CHANGE COLUMN asignado_ausuario_id asignado_a_usuario_id INT DEFAULT NULL', 'SELECT "Column asignado_ausuario_id does not exist"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Recrear foreign key con el nombre correcto
ALTER TABLE entrenamientos 
    ADD CONSTRAINT FK_entrenamientos_asignado_usuario 
    FOREIGN KEY (asignado_a_usuario_id) 
    REFERENCES usuarios(id) ON DELETE CASCADE;
