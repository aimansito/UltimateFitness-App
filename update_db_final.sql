USE ultimatefitness_db;

START TRANSACTION;

  -- 0) Eliminar tablas ya no usadas
  DROP TABLE IF EXISTS planes;
  DROP TABLE IF EXISTS servicios;

  -- 1) Suscripciones: dejar solo los campos de la entidad
  ALTER TABLE suscripciones
    DROP FOREIGN KEY IF EXISTS suscripciones_ibfk_2,
    DROP INDEX IF EXISTS IDX_FEE27D9671CAA3E7,
    DROP COLUMN IF EXISTS servicio_id,
    DROP COLUMN IF EXISTS entrenamiento_presencial,
    DROP COLUMN IF EXISTS fecha_proximo_pago,
    DROP COLUMN IF EXISTS notas,
    DROP COLUMN IF EXISTS metodo_pago,
    DROP COLUMN IF EXISTS id_transaccion_externa,
    DROP COLUMN IF EXISTS ultimos4_digitos,
    ADD COLUMN IF NOT EXISTS activa TINYINT(1) NOT NULL DEFAULT 1 AFTER auto_renovacion,
    MODIFY usuario_id INT NOT NULL,
    MODIFY entrenador_asignado_id INT NULL,
    MODIFY fecha_inicio DATE NOT NULL,
    MODIFY fecha_fin DATE NULL,
    MODIFY precio_mensual DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    MODIFY estado VARCHAR(20) NOT NULL DEFAULT 'activo',
    MODIFY auto_renovacion TINYINT(1) NOT NULL DEFAULT 1,
    MODIFY fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

  ALTER TABLE suscripciones DROP FOREIGN KEY IF EXISTS suscripciones_ibfk_3;
  ALTER TABLE suscripciones
    ADD CONSTRAINT fk_suscripciones_entrenador
      FOREIGN KEY (entrenador_asignado_id) REFERENCES entrenadores(id)
      ON DELETE SET NULL;

  -- Check if index exists before creating (MySQL doesn't support IF NOT EXISTS for CREATE INDEX directly in all contexts, but let's try or use a safe approach if it fails. 
  -- Actually, the user script had CREATE INDEX IF NOT EXISTS which is valid in MySQL 8.0)
  -- However, to be safe against syntax errors if the version is slightly older or strict, I will assume 8.0 supports it as per user input.
  -- Wait, CREATE INDEX IF NOT EXISTS is NOT standard MySQL 8.0 syntax (it was added in 8.0.x? No, usually it's not there).
  -- Better to use the procedure approach or just ignore error if it exists?
  -- The user provided the script, I should try to run it as is, but `CREATE INDEX IF NOT EXISTS` might fail.
  -- Let's check MySQL version. It is 8.0.44. 
  -- MySQL 8.0 does NOT support `CREATE INDEX IF NOT EXISTS`. It supports `DROP INDEX IF EXISTS`.
  -- I will modify the script slightly to be safe: catch the error or use a procedure?
  -- I'll stick to the user's logic but fix the syntax if I know it's wrong.
  -- Actually, let's try to run it. If it fails, I'll fix it.
  -- But to be more proactive, I will replace `CREATE INDEX IF NOT EXISTS` with a safe alternative or just `CREATE INDEX` and ignore "Duplicate key name" error?
  -- No, I'll use the robust procedure I already have for indices if needed, OR just try to create it.
  -- Let's try to stick to the user's script but correct the known syntax issue `CREATE INDEX IF NOT EXISTS`.
  -- I will change it to:
  -- DROP INDEX IF EXISTS idx_suscripciones_activa ON suscripciones;
  -- CREATE INDEX idx_suscripciones_activa ON suscripciones (activa);
  
  DROP INDEX IF EXISTS idx_suscripciones_activa ON suscripciones;
  CREATE INDEX idx_suscripciones_activa ON suscripciones (activa);

  -- 2) Entrenamientos: corregir columna mal escrita y FK
  ALTER TABLE entrenamientos
    DROP FOREIGN KEY IF EXISTS FK_24DCB62B6B62C1A2,
    DROP INDEX IF EXISTS IDX_24DCB62B6B62C1A2;

  ALTER TABLE entrenamientos
    CHANGE COLUMN asignado_ausuario_id asignado_a_usuario_id INT DEFAULT NULL;

  CREATE INDEX IDX_24DCB62B6B62C1A2 ON entrenamientos (asignado_a_usuario_id);
  ALTER TABLE entrenamientos
    ADD CONSTRAINT FK_24DCB62B6B62C1A2
      FOREIGN KEY (asignado_a_usuario_id) REFERENCES usuarios(id)
      ON DELETE CASCADE;

  -- 3) Historial de pagos: limpiar columnas extra y ajustar defaults
  ALTER TABLE historial_pagos
    DROP FOREIGN KEY IF EXISTS historial_pagos_ibfk_2,
    DROP COLUMN IF EXISTS metodo,
    DROP COLUMN IF EXISTS referencia_externa,
    DROP COLUMN IF EXISTS ultimos_4_digitos,
    DROP COLUMN IF EXISTS notas,
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

  ALTER TABLE historial_pagos
    ADD CONSTRAINT fk_historial_pagos_suscripcion
      FOREIGN KEY (suscripcion_id) REFERENCES suscripciones(id)
      ON DELETE SET NULL;

  COMMIT;
