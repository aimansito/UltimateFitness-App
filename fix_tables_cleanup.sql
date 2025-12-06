-- 1. Limpieza de Tablas Obsoletas
DROP TABLE IF EXISTS planes;
DROP TABLE IF EXISTS servicios;

-- 2. Limpieza y Ajuste de Tabla Suscripciones
-- Drops individuales
ALTER TABLE suscripciones DROP COLUMN plan_id;
ALTER TABLE suscripciones DROP COLUMN servicio_id;
ALTER TABLE suscripciones DROP COLUMN tipo;
ALTER TABLE suscripciones DROP COLUMN metodo_pago;
ALTER TABLE suscripciones DROP COLUMN id_transaccion_externa;
ALTER TABLE suscripciones DROP COLUMN ultimos4_digitos;
ALTER TABLE suscripciones DROP COLUMN ultimos_4_digitos;
ALTER TABLE suscripciones DROP COLUMN fecha_proximo_pago;
ALTER TABLE suscripciones DROP COLUMN renovacion_automatica;
ALTER TABLE suscripciones DROP COLUMN notas;

-- Adds individuales
ALTER TABLE suscripciones ADD COLUMN activa TINYINT(1) NOT NULL DEFAULT 1;
ALTER TABLE suscripciones ADD COLUMN auto_renovacion TINYINT(1) NOT NULL DEFAULT 1;
ALTER TABLE suscripciones ADD COLUMN precio_mensual DECIMAL(10,2) NOT NULL DEFAULT 19.99;
ALTER TABLE suscripciones MODIFY COLUMN estado ENUM('activa','cancelada','expirada') DEFAULT 'activa';

-- 3. Ajuste de Tabla Historial Pagos
ALTER TABLE historial_pagos DROP COLUMN plan_id;
ALTER TABLE historial_pagos DROP COLUMN servicio_id;

ALTER TABLE historial_pagos ADD COLUMN suscripcion_id INT DEFAULT NULL;
ALTER TABLE historial_pagos ADD COLUMN metodo VARCHAR(50) NOT NULL DEFAULT 'tarjeta';
ALTER TABLE historial_pagos ADD COLUMN referencia_externa VARCHAR(255) DEFAULT NULL;
ALTER TABLE historial_pagos ADD COLUMN ultimos_4_digitos CHAR(4) DEFAULT NULL;
ALTER TABLE historial_pagos ADD COLUMN moneda VARCHAR(10) NOT NULL DEFAULT 'EUR';
ALTER TABLE historial_pagos ADD COLUMN notas TEXT;
ALTER TABLE historial_pagos MODIFY COLUMN estado ENUM('completado','fallido','pendiente','reembolsado') DEFAULT 'completado';

-- FKs
ALTER TABLE historial_pagos ADD CONSTRAINT fk_pagos_suscripcion FOREIGN KEY (suscripcion_id) REFERENCES suscripciones(id) ON DELETE SET NULL;
