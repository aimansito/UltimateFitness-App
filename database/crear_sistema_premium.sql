-- ============================================
-- SISTEMA PREMIUM SIMPLIFICADO
-- Sin tablas de planes/servicios - Plan único
-- ============================================

-- ============================================
-- PASO 1: CREAR TABLAS NECESARIAS
-- ============================================

-- Tabla: suscripciones (simplificada)
CREATE TABLE IF NOT EXISTS suscripciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  fecha_inicio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_fin DATETIME DEFAULT NULL,
  precio_mensual DECIMAL(10,2) NOT NULL DEFAULT 19.99,
  estado ENUM('activa', 'cancelada', 'expirada') DEFAULT 'activa',
  activa TINYINT(1) DEFAULT 1,
  auto_renovacion TINYINT(1) DEFAULT 0,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_usuario (usuario_id),
  INDEX idx_estado (estado),
  INDEX idx_activa (activa),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: pagos (historial de pagos)
CREATE TABLE IF NOT EXISTS pagos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  suscripcion_id INT DEFAULT NULL,
  cantidad DECIMAL(10,2) NOT NULL,
  moneda VARCHAR(10) DEFAULT 'EUR',
  metodo VARCHAR(50) NOT NULL,
  referencia_externa VARCHAR(255) DEFAULT NULL,
  ultimos_4_digitos VARCHAR(4) DEFAULT NULL,
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('completado', 'fallido', 'pendiente', 'reembolsado') DEFAULT 'completado',
  notas TEXT,
  INDEX idx_usuario (usuario_id),
  INDEX idx_suscripcion (suscripcion_id),
  INDEX idx_estado (estado),
  INDEX idx_fecha (fecha),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (suscripcion_id) REFERENCES suscripciones(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- PASO 2: PROCEDIMIENTO ALMACENADO SIMPLIFICADO
-- ============================================

DELIMITER $$

DROP PROCEDURE IF EXISTS activarPremium$$

CREATE PROCEDURE activarPremium(
    IN p_usuario_id INT,
    IN p_cantidad DECIMAL(10,2),
    IN p_metodo VARCHAR(50),
    IN p_referencia_externa VARCHAR(255)
)
BEGIN
    DECLARE v_suscripcion_id INT;
    DECLARE v_entrenador_id INT;
    DECLARE v_fecha_fin DATETIME;
    DECLARE v_ultimos_4 VARCHAR(4);

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al activar premium';
    END;

    START TRANSACTION;

    -- Calcular fecha de fin (1 mes desde ahora)
    SET v_fecha_fin = DATE_ADD(NOW(), INTERVAL 1 MONTH);

    -- Extraer últimos 4 dígitos de la referencia si es tarjeta
    IF p_referencia_externa LIKE 'TARJETA-%' THEN
        SET v_ultimos_4 = SUBSTRING_INDEX(SUBSTRING_INDEX(p_referencia_externa, '-', 2), '-', -1);
    END IF;

    -- 1. Crear suscripción (sin plan_id)
    INSERT INTO suscripciones (
        usuario_id,
        fecha_inicio,
        fecha_fin,
        precio_mensual,
        estado,
        activa,
        auto_renovacion
    )
    VALUES (
        p_usuario_id,
        NOW(),
        v_fecha_fin,
        p_cantidad,
        'activa',
        1,
        1
    );

    SET v_suscripcion_id = LAST_INSERT_ID();

    -- 2. Registrar pago
    INSERT INTO pagos (
        usuario_id,
        suscripcion_id,
        cantidad,
        metodo,
        referencia_externa,
        ultimos_4_digitos,
        estado
    )
    VALUES (
        p_usuario_id,
        v_suscripcion_id,
        p_cantidad,
        p_metodo,
        p_referencia_externa,
        v_ultimos_4,
        'completado'
    );

    -- 3. Asignar entrenador aleatorio (solo si no tiene)
    SELECT entrenador_id INTO v_entrenador_id
    FROM usuarios
    WHERE id = p_usuario_id;

    IF v_entrenador_id IS NULL THEN
        -- Seleccionar entrenador con menos clientes premium
        SELECT e.id INTO v_entrenador_id
        FROM entrenadores e
        LEFT JOIN usuarios u ON u.entrenador_id = e.id AND u.es_premium = 1
        WHERE e.activo = 1
        GROUP BY e.id
        ORDER BY COUNT(u.id) ASC, RAND()
        LIMIT 1;

        -- Si no hay entrenadores en tabla entrenadores, buscar usuarios con rol entrenador
        IF v_entrenador_id IS NULL THEN
            SELECT id INTO v_entrenador_id
            FROM usuarios
            WHERE rol = 'entrenador'
            ORDER BY RAND()
            LIMIT 1;
        END IF;
    END IF;

    -- 4. Actualizar usuario a premium
    UPDATE usuarios
    SET
        es_premium = 1,
        fecha_premium = NOW(),
        entrenador_id = COALESCE(v_entrenador_id, entrenador_id)
    WHERE id = p_usuario_id;

    COMMIT;

    -- Devolver resultado
    SELECT
        v_suscripcion_id AS suscripcion_id,
        v_entrenador_id AS entrenador_id,
        'Premium activado correctamente' AS mensaje;
END$$

DELIMITER ;

-- ============================================
-- PASO 3: LIMPIAR TABLAS ANTIGUAS (OPCIONAL)
-- ============================================
-- Descomenta si quieres eliminar las tablas antiguas:
-- DROP TABLE IF EXISTS servicios;
-- DROP TABLE IF EXISTS planes;

-- ============================================
-- PASO 4: VERIFICACIÓN
-- ============================================

-- Ver las tablas creadas
SHOW TABLES LIKE '%pagos%';
SHOW TABLES LIKE '%suscripciones%';

-- Ver el procedimiento
SHOW PROCEDURE STATUS WHERE Name = 'activarPremium';

-- Descripción del procedimiento
SHOW CREATE PROCEDURE activarPremium;
