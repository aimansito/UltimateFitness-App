-- Eliminar columnas obsoletas que causan errores
ALTER TABLE historial_pagos DROP COLUMN metodo_pago;
ALTER TABLE historial_pagos DROP COLUMN id_transaccion_externa; -- Si existe

-- Asegurar que las nuevas existen (ya lo hicimos, pero por si acaso)
-- ALTER TABLE historial_pagos ADD COLUMN metodo VARCHAR(50) NOT NULL DEFAULT 'tarjeta';
