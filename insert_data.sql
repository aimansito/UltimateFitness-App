USE ultimatefitness_db;

-- 1. Insertar Entrenador (ID 1)
INSERT INTO entrenadores (
    nombre, apellidos, email, password_hash, especialidad, precio_sesion_presencial, activo
) VALUES (
    'Laura', 'García', 'laura@gym.com', 
    '$2y$13$P4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', -- Dummy hash
    'musculacion', 35.00, 1
);

-- 2. Insertar Usuario Premium (ID 1)
INSERT INTO usuarios (
    nombre, apellidos, email, password_hash, rol, es_premium, objetivo
) VALUES (
    'Teresa', 'Sánchez', 'teresa@email.com', 
    '$2y$13$P4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', -- Dummy hash
    'cliente', 1, 'ganar_masa'
);

-- 3. Insertar Entrenamiento Asignado
-- Usamos LAST_INSERT_ID() o subconsultas para ser seguros, o asumimos ID 1 si está vacía.
-- Para ser robustos en un script:
SET @entrenador_id = (SELECT id FROM entrenadores WHERE email = 'laura@gym.com' LIMIT 1);
SET @usuario_id = (SELECT id FROM usuarios WHERE email = 'teresa@email.com' LIMIT 1);

INSERT INTO entrenamientos (
    nombre, descripcion, tipo, creador_id, duracion_minutos, 
    nivel_dificultad, es_publico, fecha_creacion, asignado_a_usuario_id,
    valoracion_promedio, total_valoraciones
) VALUES (
    'Rutina Personalizada - Teresa', 
    'Rutina de fuerza y tonificación personalizada', 
    'gym', 
    @entrenador_id, 
    60, 
    'intermedio', 
    0, -- Privado
    NOW(), 
    @usuario_id,
    0.00,
    0
);
