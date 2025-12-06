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
    END IF;
END //

DELIMITER ;

-- ================================================
-- 0) Eliminar tablas ya no usadas
-- ================================================
DROP TABLE IF EXISTS planes;
DROP TABLE IF EXISTS servicios;

-- ================================================
-- 1) Suscripciones
-- ================================================
CALL SafeDropForeignKey('suscripciones', 'suscripciones_ibfk_2');
CALL SafeDropIndex('suscripciones', 'IDX_FEE27D9671CAA3E7');

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

-- Modificar columnas existentes
ALTER TABLE suscripciones
    MODIFY usuario_id INT NOT NULL,
    MODIFY entrenador_asignado_id INT NULL,
    MODIFY fecha_inicio DATE NOT NULL,
    MODIFY fecha_fin DATE NULL,
    MODIFY precio_mensual DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    MODIFY estado VARCHAR(20) NOT NULL DEFAULT 'activo',
    MODIFY auto_renovacion TINYINT(1) NOT NULL DEFAULT 1,
    MODIFY fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

CALL SafeDropForeignKey('suscripciones', 'suscripciones_ibfk_3');

-- Añadir FK si no existe (primero borrarla para asegurar)
CALL SafeDropForeignKey('suscripciones', 'fk_suscripciones_entrenador');
ALTER TABLE suscripciones
    ADD CONSTRAINT fk_suscripciones_entrenador
      FOREIGN KEY (entrenador_asignado_id) REFERENCES entrenadores(id)
      ON DELETE SET NULL;

CALL SafeDropIndex('suscripciones', 'idx_suscripciones_activa');
CREATE INDEX idx_suscripciones_activa ON suscripciones (activa);

-- ================================================
-- 2) Entrenamientos
-- ================================================
CALL SafeDropForeignKey('entrenamientos', 'FK_24DCB62B6B62C1A2');
CALL SafeDropIndex('entrenamientos', 'IDX_24DCB62B6B62C1A2');

-- Corregir columna mal escrita
SET @exist := (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'entrenamientos' AND column_name = 'asignado_ausuario_id' AND table_schema = DATABASE());
SET @sql := IF(@exist > 0, 'ALTER TABLE entrenamientos CHANGE COLUMN asignado_ausuario_id asignado_a_usuario_id INT DEFAULT NULL', 'SELECT "Column asignado_ausuario_id does not exist"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CREATE INDEX IDX_24DCB62B6B62C1A2 ON entrenamientos (asignado_a_usuario_id);

CALL SafeDropForeignKey('entrenamientos', 'FK_24DCB62B6B62C1A2');
ALTER TABLE entrenamientos
    ADD CONSTRAINT FK_24DCB62B6B62C1A2
      FOREIGN KEY (asignado_a_usuario_id) REFERENCES usuarios(id)
      ON DELETE CASCADE;

-- ================================================
-- 3) Historial de pagos
-- ================================================
CALL SafeDropForeignKey('historial_pagos', 'historial_pagos_ibfk_2');
CALL SafeDropColumn('historial_pagos', 'metodo');
CALL SafeDropColumn('historial_pagos', 'referencia_externa');
CALL SafeDropColumn('historial_pagos', 'ultimos_4_digitos');
CALL SafeDropColumn('historial_pagos', 'notas');

ALTER TABLE historial_pagos
    MODIFY usuario_id INT NOT NULL,
    MODIFY suscripcion_id INT NULL,
    MODIFY monto DECIMAL(10,2) NOT NULL,
    MODIFY moneda VARCHAR(3) NOT NULL DEFAULT 'EUR',
    MODIFY metodo_pago VARCHAR(50) NOT NULL,
    MODIFY id_transaccion_externa VARCHAR(255) NOT NULL,
    MODIFY estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    MODIFY descripcion VARCHAR(255) NULL,
    MODIFY metadata JSON NULL,
    MODIFY fecha_pago DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY fecha_actualizacion DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

CALL SafeDropForeignKey('historial_pagos', 'fk_historial_pagos_suscripcion');
ALTER TABLE historial_pagos
    ADD CONSTRAINT fk_historial_pagos_suscripcion
      FOREIGN KEY (suscripcion_id) REFERENCES suscripciones(id)
      ON DELETE SET NULL;

-- ================================================
-- 4) Usuarios (Asegurar eliminación de sexo)
-- ================================================
CALL SafeDropIndex('usuarios', 'idx_sexo');
CALL SafeDropColumn('usuarios', 'sexo');

-- Limpieza
DROP PROCEDURE SafeDropColumn;
DROP PROCEDURE SafeDropIndex;
DROP PROCEDURE SafeDropForeignKey;
