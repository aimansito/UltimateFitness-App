USE ultimatefitness_db;

-- 1. Limpieza de tablas antiguas
DROP TABLE IF EXISTS planes;
DROP TABLE IF EXISTS servicios;

-- 2. Ajuste de FK en entrenamientos para coincidir con el nombre solicitado
-- Borrar FKs existentes en esa columna que no sean la correcta
SET @fk_name := (
    SELECT CONSTRAINT_NAME 
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
    WHERE TABLE_NAME = 'entrenamientos' 
    AND COLUMN_NAME = 'asignado_a_usuario_id' 
    AND TABLE_SCHEMA = DATABASE() 
    AND CONSTRAINT_NAME != 'FK_24DCB62B6B62C1A2' 
    AND REFERENCED_TABLE_NAME IS NOT NULL
    LIMIT 1
);

SET @sql := IF(@fk_name IS NOT NULL, CONCAT('ALTER TABLE entrenamientos DROP FOREIGN KEY ', @fk_name), 'SELECT "No incorrect FK found"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Borrar índice si tiene nombre incorrecto (opcional, pero limpio)
SET @idx_name := (
    SELECT INDEX_NAME 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_NAME = 'entrenamientos' 
    AND COLUMN_NAME = 'asignado_a_usuario_id' 
    AND TABLE_SCHEMA = DATABASE() 
    AND INDEX_NAME != 'IDX_24DCB62B6B62C1A2' 
    LIMIT 1
);
-- Nota: A veces el índice se llama igual que la FK o la columna. Si es PRIMARY no borrar.
-- Mejor solo asegurar que existe el índice correcto.

-- Crear FK correcta si no existe
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_NAME = 'entrenamientos' AND CONSTRAINT_NAME = 'FK_24DCB62B6B62C1A2' AND TABLE_SCHEMA = DATABASE());
SET @sql := IF(@exist = 0, 'ALTER TABLE entrenamientos ADD CONSTRAINT FK_24DCB62B6B62C1A2 FOREIGN KEY (asignado_a_usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE', 'SELECT "FK already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Crear índice correcto si no existe
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_NAME = 'entrenamientos' AND INDEX_NAME = 'IDX_24DCB62B6B62C1A2' AND TABLE_SCHEMA = DATABASE());
SET @sql := IF(@exist = 0, 'CREATE INDEX IDX_24DCB62B6B62C1A2 ON entrenamientos (asignado_a_usuario_id)', 'SELECT "Index already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
