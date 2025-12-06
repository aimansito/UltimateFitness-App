-- Arreglar fecha_actualizacion para tener valor por defecto
-- Usamos MODIFY para cambiar la definición y añadir el DEFAULT

-- Para suscripciones
SET @exist_s := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_NAME = 'suscripciones' AND COLUMN_NAME = 'fecha_actualizacion' AND TABLE_SCHEMA = DATABASE());
SET @sql_s := IF(@exist_s > 0, 'ALTER TABLE suscripciones MODIFY COLUMN fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP', 'SELECT "Column not found in suscripciones"');
PREPARE stmt_s FROM @sql_s;
EXECUTE stmt_s;
DEALLOCATE PREPARE stmt_s;

-- Para historial_pagos
SET @exist_h := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_NAME = 'historial_pagos' AND COLUMN_NAME = 'fecha_actualizacion' AND TABLE_SCHEMA = DATABASE());
SET @sql_h := IF(@exist_h > 0, 'ALTER TABLE historial_pagos MODIFY COLUMN fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP', 'SELECT "Column not found in historial_pagos"');
PREPARE stmt_h FROM @sql_h;
EXECUTE stmt_h;
DEALLOCATE PREPARE stmt_h;
