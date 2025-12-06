-- Añadir columna faltante entrenador_asignado_id
ALTER TABLE suscripciones ADD COLUMN entrenador_asignado_id INT NULL;
ALTER TABLE suscripciones ADD CONSTRAINT fk_suscripciones_entrenador FOREIGN KEY (entrenador_asignado_id) REFERENCES entrenadores(id) ON DELETE SET NULL;

-- Verificar otras columnas por si acaso (aunque el script anterior debió añadirlas)
-- ALTER TABLE suscripciones ADD COLUMN IF NOT EXISTS activa TINYINT(1) NOT NULL DEFAULT 1;
