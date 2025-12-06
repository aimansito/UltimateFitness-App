-- Añadir columnas faltantes a historial_pagos
-- Usamos sentencias individuales para evitar fallos en bloque si alguna ya existe (aunque sabemos que metodo falta)

ALTER TABLE historial_pagos ADD COLUMN metodo VARCHAR(50) NOT NULL DEFAULT 'tarjeta';
ALTER TABLE historial_pagos ADD COLUMN referencia_externa VARCHAR(255) DEFAULT NULL;
ALTER TABLE historial_pagos ADD COLUMN ultimos_4_digitos CHAR(4) DEFAULT NULL;
ALTER TABLE historial_pagos ADD COLUMN moneda VARCHAR(10) NOT NULL DEFAULT 'EUR';
ALTER TABLE historial_pagos ADD COLUMN notas TEXT;
ALTER TABLE historial_pagos ADD COLUMN suscripcion_id INT DEFAULT NULL;

-- FK (si falla no importa tanto ahora, pero es bueno tenerla)
-- ALTER TABLE historial_pagos ADD CONSTRAINT fk_pagos_suscripcion FOREIGN KEY (suscripcion_id) REFERENCES suscripciones(id) ON DELETE SET NULL;
