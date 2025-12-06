-- Trigger para activar Premium automáticamente al insertar pago completado
-- Ejecutar en MySQL Workbench o consola

USE ultimatefitness_db;

DROP TRIGGER IF EXISTS tg_historial_pagos_after_insert;

DELIMITER $$

CREATE TRIGGER tg_historial_pagos_after_insert
AFTER INSERT ON historial_pagos
FOR EACH ROW
BEGIN
    DECLARE v_entrenador_id INT;
    DECLARE v_es_premium TINYINT;

    -- Solo actuar si el pago quedó como completado
    IF NEW.estado = 'completado' THEN
        
        -- Verificar si ya es premium
        SELECT es_premium, entrenador_id INTO v_es_premium, v_entrenador_id
        FROM usuarios
        WHERE id = NEW.usuario_id
        LIMIT 1;

        -- Si ya es premium, no hacer nada
        IF v_es_premium = 1 THEN
            -- No hacer nada, ya es premium
            SET @dummy = 1;
        ELSE
            -- Si no tiene entrenador, asignar uno con menos clientes premium
            IF v_entrenador_id IS NULL THEN
                SELECT e.id INTO v_entrenador_id
                FROM entrenadores e
                LEFT JOIN usuarios u ON u.entrenador_id = e.id AND u.es_premium = 1
                WHERE e.activo = 1
                GROUP BY e.id
                ORDER BY COUNT(u.id) ASC, RAND()
                LIMIT 1;
            END IF;

            -- Marcar usuario como premium y asignar entrenador
            UPDATE usuarios
            SET es_premium = 1,
                fecha_premium = NOW(),
                entrenador_id = COALESCE(entrenador_id, v_entrenador_id)
            WHERE id = NEW.usuario_id;
        END IF;
    END IF;
END$$

DELIMITER ;

-- Verificación: mostrar que el trigger existe
SHOW TRIGGERS LIKE 'historial_pagos';
