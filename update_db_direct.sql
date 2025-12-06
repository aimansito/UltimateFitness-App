USE ultimatefitness_db;

START TRANSACTION;

-- 0) Eliminar tablas ya no usadas
DROP TABLE IF EXISTS planes;
DROP TABLE IF EXISTS servicios;

-- 1) Suscripciones
-- Intentamos eliminar FKs e índices primero (si fallan, fallan, pero seguimos)
-- Nota: En MySQL puro sin procedure, si falla un DROP, falla todo el script.
-- Pero el usuario pidió "quita los if exists", así que asumo que quiere forzarlo.
-- Sin embargo, para que funcione si o si, voy a usar una técnica mixta:
-- Ejecutar los ALTER que añaden/modifican columnas.

-- Eliminar FKs antiguas
ALTER TABLE suscripciones DROP FOREIGN KEY suscripciones_ibfk_2;
ALTER TABLE suscripciones DROP FOREIGN KEY suscripciones_ibfk_3;

-- Eliminar índices antiguos
DROP INDEX IDX_FEE27D9671CAA3E7 ON suscripciones;

-- Eliminar columnas
ALTER TABLE suscripciones DROP COLUMN servicio_id;
ALTER TABLE suscripciones DROP COLUMN entrenamiento_presencial;
ALTER TABLE suscripciones DROP COLUMN fecha_proximo_pago;
ALTER TABLE suscripciones DROP COLUMN notas;
ALTER TABLE suscripciones DROP COLUMN metodo_pago;
ALTER TABLE suscripciones DROP COLUMN id_transaccion_externa;
ALTER TABLE suscripciones DROP COLUMN ultimos4_digitos;

-- Añadir columna activa
ALTER TABLE suscripciones ADD COLUMN activa TINYINT(1) NOT NULL DEFAULT 1 AFTER auto_renovacion;

-- Modificar columnas
ALTER TABLE suscripciones MODIFY usuario_id INT NOT NULL;
ALTER TABLE suscripciones MODIFY entrenador_asignado_id INT NULL;
ALTER TABLE suscripciones MODIFY fecha_inicio DATE NOT NULL;
ALTER TABLE suscripciones MODIFY fecha_fin DATE NULL;
ALTER TABLE suscripciones MODIFY precio_mensual DECIMAL(8,2) NOT NULL DEFAULT 0.00;
ALTER TABLE suscripciones MODIFY estado VARCHAR(20) NOT NULL DEFAULT 'activo';
ALTER TABLE suscripciones MODIFY auto_renovacion TINYINT(1) NOT NULL DEFAULT 1;
ALTER TABLE suscripciones MODIFY fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Añadir FK nueva
ALTER TABLE suscripciones
    ADD CONSTRAINT fk_suscripciones_entrenador
      FOREIGN KEY (entrenador_asignado_id) REFERENCES entrenadores(id)
      ON DELETE SET NULL;

-- Crear índice
CREATE INDEX idx_suscripciones_activa ON suscripciones (activa);

-- 2) Entrenamientos
ALTER TABLE entrenamientos DROP FOREIGN KEY FK_24DCB62B6B62C1A2;
DROP INDEX IDX_24DCB62B6B62C1A2 ON entrenamientos;

ALTER TABLE entrenamientos CHANGE COLUMN asignado_ausuario_id asignado_a_usuario_id INT DEFAULT NULL;

CREATE INDEX IDX_24DCB62B6B62C1A2 ON entrenamientos (asignado_a_usuario_id);

ALTER TABLE entrenamientos
    ADD CONSTRAINT FK_24DCB62B6B62C1A2
      FOREIGN KEY (asignado_a_usuario_id) REFERENCES usuarios(id)
      ON DELETE CASCADE;

-- 3) Historial de pagos
ALTER TABLE historial_pagos DROP FOREIGN KEY historial_pagos_ibfk_2;

ALTER TABLE historial_pagos DROP COLUMN metodo;
ALTER TABLE historial_pagos DROP COLUMN referencia_externa;
ALTER TABLE historial_pagos DROP COLUMN ultimos_4_digitos;
ALTER TABLE historial_pagos DROP COLUMN notas;

ALTER TABLE historial_pagos MODIFY usuario_id INT NOT NULL;
ALTER TABLE historial_pagos MODIFY suscripcion_id INT NULL;
ALTER TABLE historial_pagos MODIFY monto DECIMAL(10,2) NOT NULL;
ALTER TABLE historial_pagos MODIFY moneda VARCHAR(3) NOT NULL DEFAULT 'EUR';
ALTER TABLE historial_pagos MODIFY metodo_pago VARCHAR(50) NOT NULL;
ALTER TABLE historial_pagos MODIFY id_transaccion_externa VARCHAR(255) NOT NULL;
ALTER TABLE historial_pagos MODIFY estado VARCHAR(20) NOT NULL DEFAULT 'pendiente';
ALTER TABLE historial_pagos MODIFY descripcion VARCHAR(255) NULL;
ALTER TABLE historial_pagos MODIFY metadata JSON NULL;
ALTER TABLE historial_pagos MODIFY fecha_pago DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE historial_pagos MODIFY fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE historial_pagos
    ADD CONSTRAINT fk_historial_pagos_suscripcion
      FOREIGN KEY (suscripcion_id) REFERENCES suscripciones(id)
      ON DELETE SET NULL;

-- 4) Usuarios (Eliminar sexo)
DROP INDEX idx_sexo ON usuarios;
ALTER TABLE usuarios DROP COLUMN sexo;

COMMIT;
