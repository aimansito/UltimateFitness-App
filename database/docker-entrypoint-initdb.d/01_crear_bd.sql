-- ============================================
-- ULTIMATE FITNESS - BASE DE DATOS OPTIMIZADA
-- ============================================

USE ultimatefitness_db;

-- TABLA 1: ENTRENADORES
CREATE TABLE IF NOT EXISTS entrenadores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    especialidad ENUM('nutricion', 'entrenamiento', 'ambos') NOT NULL DEFAULT 'ambos',
    biografia TEXT,
    valoracion_promedio DECIMAL(3,2) DEFAULT 0.00,
    total_valoraciones INT DEFAULT 0,
    precio_sesion_presencial DECIMAL(6,2) DEFAULT 35.00,
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_activo (activo),
    INDEX idx_valoracion (valoracion_promedio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA 2: USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    observaciones TEXT,
    objetivo ENUM('ganar_masa', 'perder_peso', 'resistencia', 'cuidar_alimentacion', 'tonificar') DEFAULT 'cuidar_alimentacion',
    es_premium BOOLEAN DEFAULT FALSE,
    entrenador_id INT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultima_conexion DATETIME,
    
    FOREIGN KEY (entrenador_id) REFERENCES entrenadores(id) ON DELETE SET NULL,
    
    INDEX idx_email (email),
    INDEX idx_premium (es_premium),
    INDEX idx_entrenador (entrenador_id),
    INDEX idx_objetivo (objetivo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA 3: SERVICIOS
CREATE TABLE IF NOT EXISTS servicios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    tipo ENUM('gratuito', 'suscripcion', 'extra') NOT NULL,
    duracion_dias INT NULL,
    incluye_entrenador BOOLEAN DEFAULT FALSE,
    incluye_dieta_personalizada BOOLEAN DEFAULT FALSE,
    incluye_entreno_personalizado BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    
    INDEX idx_tipo (tipo),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA 4: SUSCRIPCIONES
CREATE TABLE IF NOT EXISTS suscripciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    servicio_id INT NOT NULL,
    entrenador_asignado_id INT NULL,
    entrenamiento_presencial BOOLEAN DEFAULT FALSE,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NULL,
    precio_mensual DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    estado ENUM('activo', 'cancelado', 'expirado') DEFAULT 'activo',
    metodo_pago VARCHAR(50),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE RESTRICT,
    FOREIGN KEY (entrenador_asignado_id) REFERENCES entrenadores(id) ON DELETE SET NULL,
    
    INDEX idx_estado (estado),
    INDEX idx_usuario (usuario_id),
    INDEX idx_servicio (servicio_id),
    INDEX idx_entrenador (entrenador_asignado_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA 5: ALIMENTOS
CREATE TABLE IF NOT EXISTS alimentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    tipo_alimento ENUM('proteina', 'carbohidrato', 'grasa', 'verdura', 'fruta', 'lacteo', 'bebida', 'complemento') NOT NULL,
    descripcion TEXT,
    calorias DECIMAL(8,2) NOT NULL,
    proteinas DECIMAL(6,2) NOT NULL,
    carbohidratos DECIMAL(6,2) NOT NULL,
    grasas DECIMAL(6,2) NOT NULL,
    precio_kg DECIMAL(6,2) NOT NULL,
    imagen_url VARCHAR(500),
    
    INDEX idx_nombre (nombre),
    INDEX idx_tipo (tipo_alimento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA 6: DIETAS
CREATE TABLE IF NOT EXISTS dietas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    creador_id INT NOT NULL,
    calorias_totales INT,
    es_publica BOOLEAN DEFAULT TRUE,
    valoracion_promedio DECIMAL(3,2) DEFAULT 0.00,
    total_valoraciones INT DEFAULT 0,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (creador_id) REFERENCES entrenadores(id) ON DELETE CASCADE,
    
    INDEX idx_creador (creador_id),
    INDEX idx_publica (es_publica),
    INDEX idx_valoracion (valoracion_promedio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA 7: DIETA_ALIMENTOS
CREATE TABLE IF NOT EXISTS dieta_alimentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    dieta_id INT NOT NULL,
    alimento_id INT NOT NULL,
    dia_semana ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo') NOT NULL,
    tipo_comida ENUM('desayuno', 'media_manana', 'almuerzo', 'merienda', 'cena', 'post_entreno') NOT NULL,
    nombre_plato VARCHAR(150) NOT NULL,
    cantidad_gramos INT NOT NULL,
    valoracion_promedio DECIMAL(3,2) DEFAULT 0.00,
    total_valoraciones INT DEFAULT 0,
    orden INT DEFAULT 1,
    
    FOREIGN KEY (dieta_id) REFERENCES dietas(id) ON DELETE CASCADE,
    FOREIGN KEY (alimento_id) REFERENCES alimentos(id) ON DELETE CASCADE,
    
    INDEX idx_dieta (dieta_id),
    INDEX idx_alimento (alimento_id),
    INDEX idx_dia_tipo (dia_semana, tipo_comida),
    INDEX idx_valoracion (valoracion_promedio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA 8: EJERCICIOS
CREATE TABLE IF NOT EXISTS ejercicios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    tipo ENUM('gym', 'workout', 'cardio', 'funcional', 'movilidad') NOT NULL,
    grupo_muscular VARCHAR(100),
    descripcion TEXT,
    video_url VARCHAR(500),
    nivel_dificultad ENUM('principiante', 'intermedio', 'avanzado') DEFAULT 'intermedio',
    valoracion_promedio DECIMAL(3,2) DEFAULT 0.00,
    total_valoraciones INT DEFAULT 0,
    
    INDEX idx_tipo (tipo),
    INDEX idx_nivel (nivel_dificultad),
    INDEX idx_grupo (grupo_muscular)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA 9: ENTRENAMIENTOS
CREATE TABLE IF NOT EXISTS entrenamientos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    tipo ENUM('gym', 'workout', 'hiit', 'cardio', 'funcional') NOT NULL,
    creador_id INT NOT NULL,
    duracion_minutos INT,
    nivel_dificultad ENUM('principiante', 'intermedio', 'avanzado') DEFAULT 'intermedio',
    es_publico BOOLEAN DEFAULT TRUE,
    valoracion_promedio DECIMAL(3,2) DEFAULT 0.00,
    total_valoraciones INT DEFAULT 0,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (creador_id) REFERENCES entrenadores(id) ON DELETE CASCADE,
    
    INDEX idx_creador (creador_id),
    INDEX idx_tipo (tipo),
    INDEX idx_publico (es_publico),
    INDEX idx_nivel (nivel_dificultad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA 10: ENTRENAMIENTO_EJERCICIOS
CREATE TABLE IF NOT EXISTS entrenamiento_ejercicios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    entrenamiento_id INT NOT NULL,
    ejercicio_id INT NOT NULL,
    orden INT NOT NULL,
    series INT,
    repeticiones VARCHAR(20),
    descanso_segundos INT,
    notas TEXT,
    
    FOREIGN KEY (entrenamiento_id) REFERENCES entrenamientos(id) ON DELETE CASCADE,
    FOREIGN KEY (ejercicio_id) REFERENCES ejercicios(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_entreno_ejercicio_orden (entrenamiento_id, orden),
    INDEX idx_entrenamiento (entrenamiento_id),
    INDEX idx_ejercicio (ejercicio_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA 11: CALENDARIO_USUARIO
CREATE TABLE IF NOT EXISTS calendario_usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    dieta_id INT NULL,
    entrenamiento_id INT NULL,
    dia_semana ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo') NOT NULL,
    completado BOOLEAN DEFAULT FALSE,
    fecha_asignacion DATE NOT NULL,
    notas TEXT,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (dieta_id) REFERENCES dietas(id) ON DELETE SET NULL,
    FOREIGN KEY (entrenamiento_id) REFERENCES entrenamientos(id) ON DELETE SET NULL,
    
    UNIQUE KEY unique_usuario_dia (usuario_id, dia_semana),
    INDEX idx_usuario (usuario_id),
    INDEX idx_dieta (dieta_id),
    INDEX idx_entrenamiento (entrenamiento_id),
    INDEX idx_dia (dia_semana)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA 12: VALORACIONES_ENTRENADOR
CREATE TABLE IF NOT EXISTS valoraciones_entrenador (
    id INT PRIMARY KEY AUTO_INCREMENT,
    entrenador_id INT NOT NULL,
    cliente_id INT NOT NULL,
    estrellas INT NOT NULL CHECK (estrellas BETWEEN 1 AND 5),
    comentario TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (entrenador_id) REFERENCES entrenadores(id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_entrenador_cliente (entrenador_id, cliente_id),
    INDEX idx_entrenador (entrenador_id),
    INDEX idx_cliente (cliente_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA 13: VALORACIONES_PLATO
CREATE TABLE IF NOT EXISTS valoraciones_plato (
    id INT PRIMARY KEY AUTO_INCREMENT,
    dieta_alimento_id INT NOT NULL,
    usuario_id INT NOT NULL,
    estrellas INT NOT NULL CHECK (estrellas BETWEEN 1 AND 5),
    comentario TEXT,
    facilidad_preparacion INT CHECK (facilidad_preparacion BETWEEN 1 AND 5),
    sabor INT CHECK (sabor BETWEEN 1 AND 5),
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (dieta_alimento_id) REFERENCES dieta_alimentos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_plato_usuario (dieta_alimento_id, usuario_id),
    INDEX idx_plato (dieta_alimento_id),
    INDEX idx_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TRIGGERS
DELIMITER //

CREATE TRIGGER after_valoracion_entrenador_insert
AFTER INSERT ON valoraciones_entrenador
FOR EACH ROW
BEGIN
    UPDATE entrenadores 
    SET valoracion_promedio = (
        SELECT AVG(estrellas) FROM valoraciones_entrenador WHERE entrenador_id = NEW.entrenador_id
    ),
    total_valoraciones = (
        SELECT COUNT(*) FROM valoraciones_entrenador WHERE entrenador_id = NEW.entrenador_id
    )
    WHERE id = NEW.entrenador_id;
END//

CREATE TRIGGER after_valoracion_plato_insert
AFTER INSERT ON valoraciones_plato
FOR EACH ROW
BEGIN
    UPDATE dieta_alimentos 
    SET valoracion_promedio = (
        SELECT AVG(estrellas) FROM valoraciones_plato WHERE dieta_alimento_id = NEW.dieta_alimento_id
    ),
    total_valoraciones = (
        SELECT COUNT(*) FROM valoraciones_plato WHERE dieta_alimento_id = NEW.dieta_alimento_id
    )
    WHERE id = NEW.dieta_alimento_id;
END//

DELIMITER ;

SELECT '✅ Tablas creadas exitosamente' AS Status;