DROP PROCEDURE IF EXISTS activarPremium;

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

    SELECT entrenador_id INTO v_entrenador_id 
    FROM usuarios 
    WHERE id = p_usuario_id;

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
        
        UPDATE suscripciones 
        SET entrenador_asignado_id = v_entrenador_id 
        WHERE id = v_suscripcion_id;
    END IF;

    UPDATE usuarios 
    SET es_premium = 1, fecha_premium = NOW() 
    WHERE id = p_usuario_id;

    COMMIT;
END;
