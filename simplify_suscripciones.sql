-- ==============================================
-- SIMPLIFICACIÓN SISTEMA SUSCRIPCIONES
-- Ejecutar en orden: backup -> cleanup -> procedure
-- ==============================================

-- ===============================
-- PASO 1: BACKUP DE TABLAS
-- ===============================
CREATE TABLE IF NOT EXISTS _backup_planes AS SELECT * FROM planes;
CREATE TABLE IF NOT EXISTS _backup_servicios AS SELECT * FROM servicios;
CREATE TABLE IF NOT EXISTS _backup_suscripciones_old AS SELECT * FROM suscripciones;
CREATE TABLE IF NOT EXISTS _backup_historial_pagos_old AS SELECT * FROM historial_pagos;

SELECT 'Backups creados' AS status;

-- ===============================
-- PASO 2: VER ESTRUCTURA ACTUAL
-- ===============================
-- Ejecutar primero para ver nombres reales de FKs
-- SHOW CREATE TABLE suscripciones;
-- SHOW CREATE TABLE historial_pagos;

-- ===============================
-- PASO 3: LIMPIAR FKs y COLUMNAS
-- ===============================
-- Nota: Los nombres de FK pueden variar, usar los del SHOW CREATE TABLE

-- Eliminar columna servicio_id si existe en suscripciones
SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'suscripciones' 
               AND COLUMN_NAME = 'servicio_id');
SET @query := IF(@exist > 0, 'ALTER TABLE suscripciones DROP COLUMN servicio_id', 'SELECT "servicio_id no existe" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Eliminar columna plan_id si existe en suscripciones
SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'suscripciones' 
               AND COLUMN_NAME = 'plan_id');
SET @query := IF(@exist > 0, 'ALTER TABLE suscripciones DROP COLUMN plan_id', 'SELECT "plan_id no existe en suscripciones" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Eliminar columna plan_id si existe en historial_pagos
SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'historial_pagos' 
               AND COLUMN_NAME = 'plan_id');
SET @query := IF(@exist > 0, 'ALTER TABLE historial_pagos DROP COLUMN plan_id', 'SELECT "plan_id no existe en historial_pagos" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT 'Columnas obsoletas eliminadas' AS status;

-- ===============================
-- PASO 4: DROP TABLAS PLANES/SERVICIOS
-- ===============================
DROP TABLE IF EXISTS planes;
DROP TABLE IF EXISTS servicios;

SELECT 'Tablas planes y servicios eliminadas' AS status;

-- ===============================
-- PASO 5: PROCEDIMIENTO activarPremium
-- ===============================
DROP PROCEDURE IF EXISTS activarPremium;

DELIMITER //
CREATE PROCEDURE activarPremium(
    IN p_usuario_id INT,
    IN p_cantidad DECIMAL(10,2),
    IN p_metodo VARCHAR(50),
    IN p_referencia VARCHAR(255)
)
BEGIN
    DECLARE v_suscripcion_id INT;
    DECLARE v_fecha_fin DATETIME;
    DECLARE v_entrenador_id INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SET v_fecha_fin = DATE_ADD(NOW(), INTERVAL 1 MONTH);

    -- Crear suscripción
    INSERT INTO suscripciones (
        usuario_id, 
        entrenador_asignado_id, 
        fecha_inicio, 
        fecha_fin,
        precio_mensual, 
        estado, 
        auto_renovacion, 
        activa,
        fecha_creacion
    )
    VALUES (
        p_usuario_id, 
        NULL, 
        NOW(), 
        v_fecha_fin, 
        p_cantidad, 
        'activa', 
        1, 
        1,
        NOW()
    );

    SET v_suscripcion_id = LAST_INSERT_ID();

    -- Registrar pago en historial_pagos
    INSERT INTO historial_pagos (
        usuario_id, 
        suscripcion_id, 
        monto, 
        moneda,
        metodo_pago, 
        id_transaccion_externa,
        estado,
        descripcion,
        fecha_pago,
        fecha_actualizacion
    )
    VALUES (
        p_usuario_id, 
        v_suscripcion_id, 
        p_cantidad, 
        'EUR',
        p_metodo, 
        p_referencia, 
        'completado',
        'Activación Premium',
        NOW(),
        NOW()
    );

    -- Buscar entrenador actual del usuario
    SELECT entrenador_id INTO v_entrenador_id 
    FROM usuarios 
    WHERE id = p_usuario_id;

    -- Si no tiene entrenador, asignar uno con menos clientes
    IF v_entrenador_id IS NULL THEN
        SELECT e.id INTO v_entrenador_id
        FROM entrenadores e
        LEFT JOIN usuarios u ON u.entrenador_id = e.id AND u.es_premium = 1
        GROUP BY e.id
        ORDER BY COUNT(u.id) ASC, RAND()
        LIMIT 1;

        UPDATE usuarios 
        SET entrenador_id = v_entrenador_id 
        WHERE id = p_usuario_id;
        
        -- Actualizar suscripción con entrenador
        UPDATE suscripciones 
        SET entrenador_asignado_id = v_entrenador_id 
        WHERE id = v_suscripcion_id;
    END IF;

    -- Marcar usuario como premium
    UPDATE usuarios 
    SET es_premium = 1, fecha_premium = NOW() 
    WHERE id = p_usuario_id;

    COMMIT;
END //
DELIMITER ;

SELECT 'Procedimiento activarPremium creado' AS status;

-- ===============================
-- VERIFICACIÓN FINAL
-- ===============================
SHOW PROCEDURE STATUS WHERE Name = 'activarPremium';
SHOW TABLES LIKE 'planes';
SHOW TABLES LIKE 'servicios';
