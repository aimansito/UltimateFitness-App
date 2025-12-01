-- =========================================
-- SCRIPT DE LIMPIEZA DE BASE DE DATOS
-- Fix cambios automáticos de Doctrine
-- =========================================

-- 1. ELIMINAR TABLAS NO DESEADAS (recreadas por Doctrine)
DROP TABLE IF EXISTS valoraciones_plato;
DROP TABLE IF EXISTS valoraciones_entrenador;
DROP TABLE IF EXISTS dieta_alimentos;

-- 2. ELIMINAR EJERCICIOS DUPLICADOS (IDs 31-60)
DELETE FROM ejercicios WHERE id BETWEEN 31 AND 60;

-- 3. RENOMBRAR CAMPO CON TYPO EN TABLA entrenamientos
-- (de "asignado_ausuario_id" a "asignado_a_usuario_id")
ALTER TABLE entrenamientos 
    CHANGE COLUMN asignado_ausuario_id asignado_a_usuario_id INT DEFAULT NULL;

-- 4. VERIFICACIÓN: Mostrar el nuevo esquema de entrenamientos
DESCRIBE entrenamientos;

-- 5. VERIFICACIÓN: Contar ejercicios restantes
SELECT COUNT(*) as total_ejercicios FROM ejercicios;

-- 6. VERIFICACIÓN: Listar tablas actuales
SHOW TABLES;

-- =========================================
-- RESULTADO ESPERADO:
-- - 30 ejercicios en total (IDs 1-30)
-- - Campo "asignado_a_usuario_id" correctamente nombrado
-- =========================================
