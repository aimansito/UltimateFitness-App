-- ============================================
-- SISTEMA DE PAGOS Y ROLES - ULTIMATE FITNESS
-- Fecha: 2024-11-24
-- ============================================

USE ultimatefitness_db;

-- ============================================
-- 1. MODIFICAR TABLA USUARIOS - AÑADIR ROL
-- ============================================

ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS rol ENUM('cliente', 'admin') DEFAULT 'cliente' AFTER es_premium,
ADD COLUMN IF NOT EXISTS fecha_premium DATE DEFAULT NULL COMMENT 'Fecha en que se hizo premium' AFTER es_premium,
ADD INDEX IF NOT EXISTS idx_rol (rol);

-- ============================================
-- 2. MODIFICAR TABLA SUSCRIPCIONES - CAMPOS DE PAGO
-- ============================================

ALTER TABLE suscripciones 
ADD COLUMN IF NOT EXISTS metodo_pago VARCHAR(50) DEFAULT NULL COMMENT 'stripe, paypal, transferencia' AFTER precio_mensual,
ADD COLUMN IF NOT EXISTS id_transaccion_externa VARCHAR(255) DEFAULT NULL COMMENT 'ID de Stripe/PayPal' AFTER metodo_pago,
ADD COLUMN IF NOT EXISTS ultimos_4_digitos CHAR(4) DEFAULT NULL COMMENT 'Últimos 4 dígitos tarjeta' AFTER id_transaccion_externa,
ADD COLUMN IF NOT EXISTS fecha_proximo_pago DATE DEFAULT NULL AFTER fecha_fin,
ADD COLUMN IF NOT EXISTS auto_renovacion BOOLEAN DEFAULT TRUE AFTER fecha_proximo_pago,
ADD COLUMN IF NOT EXISTS notas TEXT AFTER auto_renovacion,
ADD INDEX IF NOT EXISTS idx_transaccion (id_transaccion_externa),
ADD INDEX IF NOT EXISTS idx_metodo_pago (metodo_pago);

-- ============================================
-- 3. CREAR TABLA HISTORIAL_PAGOS
-- ============================================

CREATE TABLE IF NOT EXISTS historial_pagos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    suscripcion_id INT,
    monto DECIMAL(10,2) NOT NULL,
    moneda VARCHAR(3) DEFAULT 'EUR',
    metodo_pago VARCHAR(50) NOT NULL COMMENT 'stripe, paypal, transferencia',
    id_transaccion_externa VARCHAR(255) NOT NULL,
    estado ENUM('pendiente', 'completado', 'fallido', 'reembolsado') DEFAULT 'pendiente',
    descripcion VARCHAR(255),
    metadata JSON COMMENT 'Información adicional del pago',
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (suscripcion_id) REFERENCES suscripciones(id) ON DELETE SET NULL,
    
    INDEX idx_usuario (usuario_id),
    INDEX idx_suscripcion (suscripcion_id),
    INDEX idx_transaccion (id_transaccion_externa),
    INDEX idx_fecha (fecha_pago),
    INDEX idx_estado (estado),
    INDEX idx_metodo (metodo_pago)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. CREAR TABLA PLANES (Catálogo de planes)
-- ============================================

CREATE TABLE IF NOT EXISTS planes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio_mensual DECIMAL(10,2) NOT NULL,
    precio_anual DECIMAL(10,2) DEFAULT NULL,
    duracion_dias INT NOT NULL DEFAULT 30 COMMENT '30=mensual, 365=anual',
    caracteristicas JSON COMMENT 'Array de características del plan',
    activo BOOLEAN DEFAULT TRUE,
    orden INT DEFAULT 0 COMMENT 'Orden de visualización',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_activo (activo),
    INDEX idx_orden (orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. INSERTAR PLANES BÁSICOS
-- ============================================

INSERT INTO planes (nombre, descripcion, precio_mensual, precio_anual, duracion_dias, caracteristicas, activo, orden) VALUES
(
    'Premium Mensual',
    'Acceso completo a todas las funcionalidades premium por 1 mes',
    29.99,
    NULL,
    30,
    JSON_ARRAY(
        'Crear dietas personalizadas',
        'Crear entrenamientos personalizados',
        'Plan semanal completo',
        'Seguimiento de progreso',
        'Estadísticas avanzadas',
        'Acceso a contenido exclusivo',
        'Soporte prioritario'
    ),
    TRUE,
    1
),
(
    'Premium Anual',
    'Acceso completo a todas las funcionalidades premium por 1 año - ¡Ahorra 20%!',
    NULL,
    287.88,
    365,
    JSON_ARRAY(
        'Crear dietas personalizadas',
        'Crear entrenamientos personalizados',
        'Plan semanal completo',
        'Seguimiento de progreso',
        'Estadísticas avanzadas',
        'Acceso a contenido exclusivo',
        'Soporte prioritario',
        '2 meses GRATIS',
        'Asignación de entrenador (opcional)'
    ),
    TRUE,
    2
),
(
    'Premium + Entrenador',
    'Plan premium con entrenador personal asignado',
    79.99,
    863.88,
    30,
    JSON_ARRAY(
        'Todo lo de Premium',
        'Entrenador personal asignado',
        'Sesiones 1:1 online mensuales',
        'Plan personalizado mensual',
        'Seguimiento continuo',
        'Ajustes semanales'
    ),
    TRUE,
    3
);

-- ============================================
-- 6. CREAR USUARIO ADMIN DE PRUEBA
-- ============================================

-- Contraseña: Admin123! (hash bcrypt)
INSERT INTO usuarios (nombre, apellidos, email, password_hash, telefono, rol, es_premium, fecha_registro)
VALUES (
    'Admin',
    'Ultimate Fitness',
    'admin@ultimatefitness.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    '999999999',
    'admin',
    TRUE,
    NOW()
) ON DUPLICATE KEY UPDATE rol = 'admin';

-- ============================================
-- 7. VERIFICAR TODO
-- ============================================

SELECT '============================================' as '';
SELECT '✅ VERIFICACIÓN DE CAMBIOS' as '';
SELECT '============================================' as '';

-- Ver estructura usuarios
SELECT 'USUARIOS - Nuevas columnas:' as tabla;
SHOW COLUMNS FROM usuarios WHERE Field IN ('rol', 'fecha_premium');

-- Ver estructura suscripciones
SELECT 'SUSCRIPCIONES - Nuevas columnas:' as tabla;
SHOW COLUMNS FROM suscripciones WHERE Field IN ('metodo_pago', 'id_transaccion_externa', 'ultimos_4_digitos', 'fecha_proximo_pago', 'auto_renovacion');

-- Ver si existe historial_pagos
SELECT 'HISTORIAL_PAGOS - Tabla creada:' as tabla;
SELECT COUNT(*) as existe FROM information_schema.tables 
WHERE table_schema = 'ultimatefitness_db' AND table_name = 'historial_pagos';

-- Ver planes creados
SELECT 'PLANES - Planes disponibles:' as tabla;
SELECT id, nombre, precio_mensual, precio_anual, activo FROM planes;

-- Ver usuario admin
SELECT 'ADMIN - Usuario admin creado:' as tabla;
SELECT id, nombre, email, rol FROM usuarios WHERE rol = 'admin';

SELECT '============================================' as '';
SELECT '✅ MIGRACIÓN COMPLETADA' as '';
SELECT '============================================' as '';