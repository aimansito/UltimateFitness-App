-- ============================================
-- DATOS DE PRUEBA - ULTIMATE FITNESS
-- ============================================

USE ultimatefitness_db;

-- ENTRENADORES (10+)
INSERT INTO entrenadores (nombre, apellidos, email, password_hash, telefono, especialidad, biografia, precio_sesion_presencial) VALUES
('Carlos', 'Martínez López', 'carlos.martinez@ultimate.com', '$2y$10$abcdefghijklmnopqrstuv', '666123456', 'ambos', 'Entrenador con 10 años de experiencia en fitness y nutrición', 35.00),
('Laura', 'García Sánchez', 'laura.garcia@ultimate.com', '$2y$10$bcdefghijklmnopqrstuvw', '677234567', 'nutricion', 'Especialista en nutrición deportiva y dietas personalizadas', 40.00),
('Pablo', 'Romero Silva', 'pablo.romero@ultimate.com', '$2y$10$cdefghijklmnopqrstuvwx', '688345678', 'entrenamiento', 'Experto en CrossFit y entrenamiento funcional', 45.00),
('Ana', 'Fernández Ruiz', 'ana.fernandez@ultimate.com', '$2y$10$defghijklmnopqrstuvwxy', '699456789', 'ambos', 'Entrenadora personal certificada NSCA', 38.00),
('Miguel', 'López Torres', 'miguel.lopez@ultimate.com', '$2y$10$efghijklmnopqrstuvwxyz', '611567890', 'entrenamiento', 'Especialista en hipertrofia y culturismo', 42.00),
('Sara', 'González Castro', 'sara.gonzalez@ultimate.com', '$2y$10$fghijklmnopqrstuvwxyza', '622678901', 'nutricion', 'Nutricionista deportiva con enfoque en vegetarianos', 40.00),
('David', 'Díaz Navarro', 'david.diaz@ultimate.com', '$2y$10$ghijklmnopqrstuvwxyzab', '633789012', 'ambos', 'Entrenador de alto rendimiento', 50.00),
('Elena', 'Jiménez Moreno', 'elena.jimenez@ultimate.com', '$2y$10$hijklmnopqrstuvwxyzabc', '644890123', 'entrenamiento', 'Especialista en entrenamiento femenino', 37.00),
('Javier', 'Ruiz Vega', 'javier.ruiz@ultimate.com', '$2y$10$ijklmnopqrstuvwxyzabcd', '655901234', 'nutricion', 'Experto en dietas cetogénicas', 40.00),
('Marta', 'Muñoz Gil', 'marta.munoz@ultimate.com', '$2y$10$jklmnopqrstuvwxyzabcde', '666012345', 'ambos', 'Entrenadora y nutricionista integral', 45.00);

-- USUARIOS (15+)
INSERT INTO usuarios (nombre, apellidos, email, password_hash, telefono, observaciones, objetivo, es_premium, entrenador_id) VALUES
('Juan', 'Pérez Gómez', 'juan.perez@email.com', '$2y$10$klmnopqrstuvwxyzabcdef', '677111111', NULL, 'ganar_masa', TRUE, 1),
('María', 'Sánchez López', 'maria.sanchez@email.com', '$2y$10$lmnopqrstuvwxyzabcdefg', '688222222', 'Vegetariana', 'perder_peso', TRUE, 2),
('Pedro', 'Martínez Ruiz', 'pedro.martinez@email.com', '$2y$10$mnopqrstuvwxyzabcdefgh', '699333333', NULL, 'resistencia', FALSE, NULL),
('Lucía', 'González Torres', 'lucia.gonzalez@email.com', '$2y$10$nopqrstuvwxyzabcdefghi', '611444444', NULL, 'tonificar', TRUE, 3),
('Antonio', 'Fernández Castro', 'antonio.fernandez@email.com', '$2y$10$opqrstuvwxyzabcdefghij', '622555555', 'Problemas de rodilla', 'cuidar_alimentacion', FALSE, NULL),
('Carmen', 'López Navarro', 'carmen.lopez@email.com', '$2y$10$pqrstuvwxyzabcdefghijk', '633666666', NULL, 'ganar_masa', TRUE, 1),
('Francisco', 'García Moreno', 'francisco.garcia@email.com', '$2y$10$qrstuvwxyzabcdefghijkl', '644777777', NULL, 'perder_peso', FALSE, NULL),
('Isabel', 'Díaz Vega', 'isabel.diaz@email.com', '$2y$10$rstuvwxyzabcdefghijklm', '655888888', NULL, 'resistencia', TRUE, 4),
('José', 'Jiménez Gil', 'jose.jimenez@email.com', '$2y$10$stuvwxyzabcdefghijklmn', '666999999', NULL, 'tonificar', FALSE, NULL),
('Rosa', 'Muñoz Ortiz', 'rosa.munoz@email.com', '$2y$10$tuvwxyzabcdefghijklmno', '677000000', NULL, 'ganar_masa', TRUE, 5),
('Manuel', 'Ruiz Delgado', 'manuel.ruiz@email.com', '$2y$10$uvwxyzabcdefghijklmnop', '688111111', NULL, 'perder_peso', FALSE, NULL),
('Teresa', 'Sánchez Ortiz', 'teresa.sanchez@email.com', '$2y$10$vwxyzabcdefghijklmnopq', '699222222', 'Alérgica al gluten', 'cuidar_alimentacion', TRUE, 2),
('Alberto', 'López Moreno', 'alberto.lopez@email.com', '$2y$10$wxyzabcdefghijklmnopqr', '611333333', NULL, 'resistencia', FALSE, NULL),
('Patricia', 'González Vega', 'patricia.gonzalez@email.com', '$2y$10$xyzabcdefghijklmnopqrs', '622444444', NULL, 'tonificar', TRUE, 6),
('Roberto', 'Fernández Gil', 'roberto.fernandez@email.com', '$2y$10$yzabcdefghijklmnopqrst', '633555555', NULL, 'ganar_masa', FALSE, NULL);

-- SERVICIOS
INSERT INTO servicios (nombre, descripcion, precio, tipo, duracion_dias, incluye_entrenador, incluye_dieta_personalizada, incluye_entreno_personalizado) VALUES
('Plan Gratuito', 'Acceso a contenido básico, blogs y rutinas públicas', 0.00, 'gratuito', NULL, FALSE, FALSE, FALSE),
('Premium Mensual', 'Asesoramiento 1:1 con entrenador personal, dietas y entrenamientos personalizados', 89.00, 'suscripcion', 30, TRUE, TRUE, TRUE),
('Premium Trimestral', 'Plan de 3 meses con 15% de descuento', 227.00, 'suscripcion', 90, TRUE, TRUE, TRUE),
('Premium Anual', 'Plan de 12 meses con 30% de descuento', 749.00, 'suscripcion', 365, TRUE, TRUE, TRUE),
('Sesión Presencial Individual', 'Sesión presencial adicional con tu entrenador', 35.00, 'extra', NULL, FALSE, FALSE, FALSE),
('Pack 10 Sesiones Presenciales', 'Pack de 10 sesiones con descuento', 300.00, 'extra', NULL, FALSE, FALSE, FALSE),
('Plan Nutricional Personalizado', 'Diseño de dieta completamente personalizada', 75.00, 'extra', NULL, FALSE, TRUE, FALSE),
('Rutina Personalizada', 'Diseño de rutina de entrenamiento personalizada', 60.00, 'extra', NULL, FALSE, FALSE, TRUE),
('Consulta Puntual 30min', 'Consulta única con entrenador o nutricionista', 25.00, 'extra', NULL, FALSE, FALSE, FALSE),
('Valoración Inicial Completa', 'Análisis de composición corporal y plan inicial', 50.00, 'extra', NULL, FALSE, FALSE, FALSE);

-- SUSCRIPCIONES
INSERT INTO suscripciones (usuario_id, servicio_id, entrenador_asignado_id, entrenamiento_presencial, fecha_inicio, fecha_fin, precio_mensual, estado, metodo_pago) VALUES
(1, 2, 1, FALSE, '2025-01-15', '2025-02-14', 89.00, 'activo', 'Tarjeta'),
(2, 2, 2, FALSE, '2025-02-01', '2025-03-01', 89.00, 'activo', 'PayPal'),
(3, 1, NULL, FALSE, '2025-01-20', NULL, 0.00, 'activo', NULL),
(4, 3, 3, TRUE, '2025-01-10', '2025-04-10', 227.00, 'activo', 'Tarjeta'),
(5, 1, NULL, FALSE, '2025-02-15', NULL, 0.00, 'activo', NULL),
(6, 2, 1, FALSE, '2025-03-01', '2025-03-31', 89.00, 'activo', 'Transferencia'),
(7, 1, NULL, FALSE, '2025-02-10', NULL, 0.00, 'activo', NULL),
(8, 2, 4, FALSE, '2025-01-25', '2025-02-24', 89.00, 'activo', 'Tarjeta'),
(9, 1, NULL, FALSE, '2025-03-05', NULL, 0.00, 'activo', NULL),
(10, 2, 5, FALSE, '2025-02-10', '2025-03-10', 89.00, 'activo', 'PayPal'),
(11, 1, NULL, FALSE, '2025-01-30', NULL, 0.00, 'activo', NULL),
(12, 4, 2, FALSE, '2025-01-01', '2026-01-01', 749.00, 'activo', 'Tarjeta'),
(13, 1, NULL, FALSE, '2025-02-20', NULL, 0.00, 'activo', NULL),
(14, 2, 6, FALSE, '2025-03-15', '2025-04-14', 89.00, 'activo', 'Tarjeta'),
(15, 1, NULL, FALSE, '2025-03-01', NULL, 0.00, 'activo', NULL);

-- ALIMENTOS (25+)
INSERT INTO alimentos (nombre, tipo_alimento, descripcion, calorias, proteinas, carbohidratos, grasas, precio_kg, imagen_url) VALUES
('Pechuga de pollo', 'proteina', 'Carne magra alta en proteína', 165.00, 31.00, 0.00, 3.60, 8.50, '/img/pollo.jpg'),
('Arroz basmati', 'carbohidrato', 'Arroz de grano largo', 130.00, 2.70, 28.00, 0.30, 3.20, '/img/arroz.jpg'),
('Salmón fresco', 'proteina', 'Pescado rico en omega-3', 206.00, 22.00, 0.00, 13.00, 18.00, '/img/salmon.jpg'),
('Brócoli', 'verdura', 'Verdura crucífera rica en nutrientes', 34.00, 2.80, 7.00, 0.40, 2.50, '/img/brocoli.jpg'),
('Aguacate', 'grasa', 'Fruta rica en grasas saludables', 160.00, 2.00, 9.00, 15.00, 5.00, '/img/aguacate.jpg'),
('Huevos', 'proteina', 'Proteína completa y versátil', 155.00, 13.00, 1.10, 11.00, 2.80, '/img/huevos.jpg'),
('Avena', 'carbohidrato', 'Cereal integral rico en fibra', 389.00, 16.90, 66.00, 6.90, 2.00, '/img/avena.jpg'),
('Plátano', 'fruta', 'Fruta energética rica en potasio', 89.00, 1.10, 23.00, 0.30, 1.50, '/img/platano.jpg'),
('Yogur griego natural', 'lacteo', 'Lácteo alto en proteína', 59.00, 10.00, 3.60, 0.40, 4.50, '/img/yogur.jpg'),
('Almendras', 'grasa', 'Frutos secos ricos en grasas saludables', 579.00, 21.00, 22.00, 50.00, 12.00, '/img/almendras.jpg'),
('Batata', 'carbohidrato', 'Tubérculo rico en carbohidratos complejos', 86.00, 1.60, 20.00, 0.10, 2.20, '/img/batata.jpg'),
('Espinacas', 'verdura', 'Verdura de hoja verde', 23.00, 2.90, 3.60, 0.40, 3.00, '/img/espinacas.jpg'),
('Ternera magra', 'proteina', 'Carne roja magra', 250.00, 26.00, 0.00, 17.00, 12.00, '/img/ternera.jpg'),
('Quinoa', 'carbohidrato', 'Pseudocereal completo', 120.00, 4.40, 21.00, 1.90, 5.50, '/img/quinoa.jpg'),
('Atún en lata', 'proteina', 'Pescado conservado', 116.00, 26.00, 0.00, 0.80, 8.00, '/img/atun.jpg'),
('Pasta integral', 'carbohidrato', 'Pasta de trigo integral', 124.00, 5.30, 23.00, 1.30, 2.80, '/img/pasta.jpg'),
('Tomates', 'verdura', 'Verdura rica en licopeno', 18.00, 0.90, 3.90, 0.20, 2.00, '/img/tomate.jpg'),
('Pavo', 'proteina', 'Carne magra alternativa', 135.00, 30.00, 0.00, 1.00, 9.50, '/img/pavo.jpg'),
('Lentejas', 'proteina', 'Legumbre rica en proteína vegetal', 116.00, 9.00, 20.00, 0.40, 2.50, '/img/lentejas.jpg'),
('Manzana', 'fruta', 'Fruta rica en fibra', 52.00, 0.30, 14.00, 0.20, 1.80, '/img/manzana.jpg'),
('Queso fresco', 'lacteo', 'Lácteo bajo en grasa', 98.00, 11.00, 3.50, 4.50, 6.00, '/img/queso.jpg'),
('Pan integral', 'carbohidrato', 'Pan de trigo integral', 247.00, 13.00, 41.00, 3.50, 2.50, '/img/pan.jpg'),
('Fresas', 'fruta', 'Fruta baja en calorías', 32.00, 0.70, 7.70, 0.30, 4.00, '/img/fresas.jpg'),
('Garbanzos', 'proteina', 'Legumbre versátil', 164.00, 8.90, 27.00, 2.60, 2.80, '/img/garbanzos.jpg'),
('Aceite de oliva', 'grasa', 'Grasa saludable mediterránea', 884.00, 0.00, 0.00, 100.00, 8.00, '/img/aceite.jpg');


-- DIETAS (12+)
INSERT INTO dietas (nombre, descripcion, creador_id, calorias_totales, es_publica) VALUES
('Dieta Volumen 3000kcal', 'Plan semanal para ganar masa muscular', 1, 3000, TRUE),
('Dieta Definición 2000kcal', 'Reducción de grasa manteniendo músculo', 1, 2000, TRUE),
('Dieta Vegetariana Equilibrada', 'Plan vegetariano completo', 2, 2200, TRUE),
('Dieta Alta Proteína', 'Para deportistas alto requerimiento', 1, 2800, FALSE),
('Dieta Mediterránea', 'Basada en dieta mediterránea', 2, 2100, TRUE),
('Dieta Cetogénica', 'Baja carbohidratos, alta grasas', 2, 1800, FALSE),
('Dieta Flexible 2500kcal', 'Con variedad y flexibilidad', 1, 2500, FALSE),
('Dieta Mantenimiento', 'Mantener peso y salud', 2, 2300, TRUE),
('Dieta Hipertrofia', 'Para atletas avanzados', 5, 3500, FALSE),
('Dieta Low Carb', 'Reducción de carbohidratos', 2, 1900, TRUE),
('Dieta Vegana Completa', 'Sin productos animales', 6, 2200, TRUE),
('Dieta Pre-Competición', 'Para preparación eventos', 3, 3200, FALSE);

-- EJERCICIOS (30+)
INSERT INTO ejercicios (nombre, tipo, grupo_muscular, descripcion, video_url, nivel_dificultad) VALUES
('Sentadilla con barra', 'gym', 'Piernas', 'Ejercicio fundamental para cuádriceps', 'https://youtube.com/sentadilla', 'intermedio'),
('Press banca', 'gym', 'Pecho', 'Ejercicio básico de pectoral', 'https://youtube.com/pressbanca', 'intermedio'),
('Peso muerto', 'gym', 'Espalda', 'Ejercicio compuesto cadena posterior', 'https://youtube.com/pesomuerto', 'avanzado'),
('Dominadas', 'gym', 'Espalda', 'Tracción vertical para dorsal', 'https://youtube.com/dominadas', 'intermedio'),
('Press militar', 'gym', 'Hombros', 'Desarrollo de deltoides', 'https://youtube.com/pressmilitar', 'intermedio'),
('Burpees', 'workout', 'Cuerpo completo', 'Ejercicio alta intensidad', 'https://youtube.com/burpees', 'intermedio'),
('Flexiones', 'workout', 'Pecho', 'Empuje peso corporal', 'https://youtube.com/flexiones', 'principiante'),
('Mountain climbers', 'workout', 'Core', 'Ejercicio dinámico core', 'https://youtube.com/mountain', 'principiante'),
('Sentadilla búlgara', 'gym', 'Piernas', 'Sentadilla unilateral', 'https://youtube.com/bulgaria', 'intermedio'),
('Remo con barra', 'gym', 'Espalda', 'Tracción horizontal', 'https://youtube.com/remo', 'intermedio'),
('Zancadas', 'workout', 'Piernas', 'Ejercicio unilateral', 'https://youtube.com/zancadas', 'principiante'),
('Plancha abdominal', 'workout', 'Core', 'Isométrico core', 'https://youtube.com/plancha', 'principiante'),
('Curl bíceps', 'gym', 'Brazos', 'Aislamiento bíceps', 'https://youtube.com/curl', 'principiante'),
('Fondos paralelas', 'gym', 'Tríceps', 'Empuje tríceps', 'https://youtube.com/fondos', 'intermedio'),
('Box jumps', 'workout', 'Piernas', 'Saltos pliométricos', 'https://youtube.com/boxjumps', 'intermedio'),
('Press inclinado', 'gym', 'Pecho', 'Pectoral superior', 'https://youtube.com/pressinclinado', 'intermedio'),
('Remo mancuerna', 'gym', 'Espalda', 'Trabajo unilateral espalda', 'https://youtube.com/remomancuerna', 'intermedio'),
('Elevaciones laterales', 'gym', 'Hombros', 'Deltoides lateral', 'https://youtube.com/elevaciones', 'principiante'),
('Abdominales bicicleta', 'workout', 'Core', 'Trabajo oblicuos', 'https://youtube.com/bicicleta', 'principiante'),
('Saltos cuerda', 'cardio', 'Cardio', 'Cardio alta intensidad', 'https://youtube.com/cuerda', 'intermedio'),
('Peso muerto rumano', 'gym', 'Piernas', 'Isquiotibiales', 'https://youtube.com/rumano', 'intermedio'),
('Extensión tríceps', 'gym', 'Brazos', 'Aislamiento tríceps', 'https://youtube.com/extension', 'principiante'),
('Face pulls', 'gym', 'Hombros', 'Deltoides posterior', 'https://youtube.com/facepulls', 'intermedio'),
('Jumping jacks', 'cardio', 'Cardio', 'Calentamiento cardio', 'https://youtube.com/jacks', 'principiante'),
('Hip thrust', 'gym', 'Piernas', 'Glúteos', 'https://youtube.com/hipthrust', 'intermedio'),
('Russian twist', 'workout', 'Core', 'Rotación core', 'https://youtube.com/russian', 'intermedio'),
('Prensa piernas', 'gym', 'Piernas', 'Cuádriceps', 'https://youtube.com/prensa', 'principiante'),
('Pull over', 'gym', 'Espalda', 'Dorsal ancho', 'https://youtube.com/pullover', 'intermedio'),
('Patada glúteo', 'gym', 'Piernas', 'Glúteos aislado', 'https://youtube.com/patada', 'principiante'),
('Farmer walk', 'funcional', 'Cuerpo completo', 'Agarre y core', 'https://youtube.com/farmer', 'intermedio');

-- ENTRENAMIENTOS (12+)
INSERT INTO entrenamientos (nombre, descripcion, tipo, creador_id, duracion_minutos, nivel_dificultad, es_publico) VALUES
('Full Body Principiante', 'Cuerpo completo 3 veces semana', 'gym', 1, 60, 'principiante', TRUE),
('HIIT 20 minutos', 'Alta intensidad sin equipo', 'hiit', 3, 20, 'intermedio', TRUE),
('Torso-Pierna Intermedio', 'División clásica 4 días', 'gym', 1, 75, 'intermedio', TRUE),
('CrossFit WOD', 'Workout of the Day', 'funcional', 3, 45, 'avanzado', FALSE),
('Rutina Fuerza 5x5', 'Programa fuerza básicos', 'gym', 1, 90, 'avanzado', FALSE),
('Cardio HIIT Avanzado', 'Circuito pérdida grasa', 'hiit', 3, 30, 'avanzado', TRUE),
('Upper Body Gym', 'Tren superior', 'gym', 1, 60, 'intermedio', TRUE),
('Movilidad Flexibilidad', 'Recuperación activa', 'funcional', 4, 40, 'principiante', TRUE),
('Piernas Avanzado', 'Día intenso piernas', 'gym', 5, 80, 'avanzado', FALSE),
('Tabata Express', 'Tabata 15 minutos', 'hiit', 3, 15, 'intermedio', TRUE),
('Push Pull Legs', 'Rutina PPL 6 días', 'gym', 5, 70, 'avanzado', FALSE),
('Entrenamiento Casa', 'Sin equipamiento', 'workout', 4, 45, 'intermedio', TRUE);

SELECT 'Datos de prueba insertados correctamente' AS Mensaje;
SELECT 'Entrenadores' AS Tabla, COUNT(*) AS Total FROM entrenadores
UNION ALL SELECT 'Usuarios', COUNT(*) FROM usuarios
UNION ALL SELECT 'Servicios', COUNT(*) FROM servicios
UNION ALL SELECT 'Suscripciones', COUNT(*) FROM suscripciones
UNION ALL SELECT 'Alimentos', COUNT(*) FROM alimentos
UNION ALL SELECT 'Dietas', COUNT(*) FROM dietas
UNION ALL SELECT 'Ejercicios', COUNT(*) FROM ejercicios
UNION ALL SELECT 'Entrenamientos', COUNT(*) FROM entrenamientos;