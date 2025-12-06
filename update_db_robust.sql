-- ================================================
-- SCRIPT DE ACTUALIZACIÓN DE BASE DE DATOS (ROBUSTO)
-- ================================================

USE ultimatefitness_db;

DELIMITER //

DROP PROCEDURE IF EXISTS SafeDropColumn;
DROP PROCEDURE IF EXISTS SafeDropIndex;
DROP PROCEDURE IF EXISTS SafeDropForeignKey;

CREATE PROCEDURE SafeDropColumn(IN tableName VARCHAR(255), IN columnName VARCHAR(255))
BEGIN
    IF EXISTS (
        SELECT * FROM information_schema.columns 
        WHERE table_name = tableName AND column_name = columnName AND table_schema = DATABASE()
    ) THEN
        SET @s = CONCAT('ALTER TABLE ', tableName, ' DROP COLUMN ', columnName);
        PREPARE stmt FROM @s;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        SELECT CONCAT('Dropped column ', columnName, ' from ', tableName) AS result;
    ELSE
        SELECT CONCAT('Column ', columnName, ' does not exist in ', tableName) AS result;
    END IF;
END //

CREATE PROCEDURE SafeDropIndex(IN tableName VARCHAR(255), IN indexName VARCHAR(255))
BEGIN
    IF EXISTS (
        SELECT * FROM information_schema.statistics 
        WHERE table_name = tableName AND index_name = indexName AND table_schema = DATABASE()
    ) THEN
        SET @s = CONCAT('DROP INDEX ', indexName, ' ON ', tableName);
        PREPARE stmt FROM @s;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        SELECT CONCAT('Dropped index ', indexName, ' on ', tableName) AS result;
    ELSE
        SELECT CONCAT('Index ', indexName, ' does not exist on ', tableName) AS result;
    END IF;
END //

CREATE PROCEDURE SafeDropForeignKey(IN tableName VARCHAR(255), IN constraintName VARCHAR(255))
BEGIN
    IF EXISTS (
        SELECT * FROM information_schema.table_constraints 
        WHERE table_name = tableName AND constraint_name = constraintName AND table_schema = DATABASE()
    ) THEN
        SET @s = CONCAT('ALTER TABLE ', tableName, ' DROP FOREIGN KEY ', constraintName);
        PREPARE stmt FROM @s;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        SELECT CONCAT('Dropped FK ', constraintName, ' on ', tableName) AS result;
    ELSE
        SELECT CONCAT('FK ', constraintName, ' does not exist on ', tableName) AS result;
    END IF;
END //

DELIMITER ;

-- ================================================
-- 1. ACTUALIZAR TABLA usuarios
-- ================================================
CALL SafeDropIndex('usuarios', 'idx_sexo');
CALL SafeDropColumn('usuarios', 'sexo');

-- ================================================
-- 2. ACTUALIZAR TABLA suscripciones
-- ================================================
CALL SafeDropForeignKey('suscripciones', 'suscripciones_ibfk_2');

CALL SafeDropColumn('suscripciones', 'servicio_id');
CALL SafeDropColumn('suscripciones', 'entrenamiento_presencial');
CALL SafeDropColumn('suscripciones', 'fecha_proximo_pago');
CALL SafeDropColumn('suscripciones', 'notas');
CALL SafeDropColumn('suscripciones', 'metodo_pago');
CALL SafeDropColumn('suscripciones', 'id_transaccion_externa');
CALL SafeDropColumn('suscripciones', 'ultimos4_digitos');

-- Añadir columna activa si no existe
SET @exist := (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'suscripciones' AND column_name = 'activa' AND table_schema = DATABASE());
SET @sql := IF(@exist = 0, 'ALTER TABLE suscripciones ADD COLUMN activa TINYINT(1) NOT NULL DEFAULT 1', 'SELECT "Column activa already exists"');
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
CALL SafeDropForeignKey('entrenamientos', 'FK_24DCB62B6B62C1A2');

-- Renombrar columna si existe (esto es más difícil de hacer en procedure genérico, lo dejo manual con check)
SET @exist := (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'entrenamientos' AND column_name = 'asignado_ausuario_id' AND table_schema = DATABASE());
SET @sql := IF(@exist > 0, 'ALTER TABLE entrenamientos CHANGE COLUMN asignado_ausuario_id asignado_a_usuario_id INT DEFAULT NULL', 'SELECT "Column asignado_ausuario_id does not exist"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Recrear FK
-- Primero borrarla si ya existe con el nombre nuevo para evitar error
CALL SafeDropForeignKey('entrenamientos', 'FK_entrenamientos_asignado_usuario');

ALTER TABLE entrenamientos 
    ADD CONSTRAINT FK_entrenamientos_asignado_usuario 
    FOREIGN KEY (asignado_a_usuario_id) 
    REFERENCES usuarios(id) ON DELETE CASCADE;

-- ================================================
-- LIMPIEZA
-- ================================================
DROP PROCEDURE SafeDropColumn;
DROP PROCEDURE SafeDropIndex;
DROP PROCEDURE SafeDropForeignKey;
