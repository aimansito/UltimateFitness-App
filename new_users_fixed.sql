
-- Nuevos usuarios desde TiDB (con acentos corregidos)
-- Tabla: usuarios (nombre correcto en plural)

INSERT INTO `usuarios` (id, entrenador_id, nombre, apellidos, email, password_hash, telefono, objetivo, nivel_actividad, es_premium, rol, fecha_registro, sexo, edad, peso_actual, altura) VALUES
(10, 1, 'Hugo', 'Serrano', 'hugo@example.com', '$2y$13$jtzo8aUdy7aH.HrNKnP.8O95eGH2gYf19Y34XoilPQy4LjGr3gkEW', '655444555', 'cuidar_alimentacion', 'moderado', 1, 'cliente', '2025-12-06 20:26:51', NULL, NULL, NULL, NULL),
(11, 4, 'Aiman', 'Harrar Daoud', 'aimaninstituto2020@gmail.com', '$2y$13$TjQ0zAMMGktPjvrSm9Pl4Ox7fh5ae/OCYonQJf2zrbwSc2NbnHRWa', '633714372', 'ganancia_muscular', 'moderado', 1, 'cliente', '2025-12-06 20:51:10', 'masculino', 21, 90.00, 185),
(12, NULL, 'Admin', 'Principal', 'admin@email.com', '$2y$13$iA1wYIPbHpGfsRundt0pzufiSQg3KNxqevYy1UZPLZO7JnkZ/G.v6', NULL, 'cuidar_alimentacion', 'ligero', 0, 'admin', '2025-12-07 01:02:13', NULL, NULL, NULL, NULL),
(13, NULL, 'Admin2', 'Nator', 'admin2@email.com', '$2y$10$FZIoIUkt3B/h5vF.NXU80uPkPsxSqtgZ04zCkNcbROXTyKEjOgU66', '633772311', 'perdida_peso', 'ligero', 0, 'admin', '2025-12-07 02:57:55', 'masculino', 21, 89.00, 186),
(14, 8, 'Ahardao', '1001', 'ahardao1001@g.educaand.es', '$2y$13$PpPZNOU1IccJWbBODNewoOmepxSoS//BcU0L7V.PJKA1nZRqAopNe', '7337373373', 'cuidar_alimentacion', 'ligero', 1, 'cliente', '2025-12-08 10:52:53', 'masculino', 21, 90.00, 185),
(30015, 10, 'Lionel', 'Messi', 'messi@email.com', '$2y$13$ZvtLPujoNYyRFKwmjikFDu0z9dvn3aWuPbgmO8RbI8Hi81eYnlH.6', '644644464', 'cuidar_alimentacion', 'ligero', 1, 'cliente', '2026-02-04 13:27:10', 'masculino', 22, 80.00, 180),
(30016, 8, 'Alessandra', 'Gómez Mary', 'o.alessandragomezm@gmail.com', '$2y$13$NN4LMjWGZT6qpK4LiDVgS.nRuN02kYBVRjc5YGJ5kxhIh8wjZsVae', '663427018', 'ganancia_muscular', 'moderado', 1, 'cliente', '2026-02-04 13:32:01', 'femenino', 20, 66.00, 160),
(60015, 9, 'Moises', 'Puerta Diaz', 'supermoises777@gmail.com', '$2y$13$lxgcyGASNYnZJ.SZOoE/2OiFFd7HbCXIjgVznLmdMrgjWbNSeoN92', '681296505', 'ganancia_muscular', 'intenso', 1, 'cliente', '2026-02-05 20:38:56', 'masculino', 21, 67.50, 178),
(90015, NULL, 'Miriam', 'Suárez Durán', 'mirisudu@gmail.com', '$2y$13$SqGBBHC0rsA9QWd2iUsFoeTb9Nqu2C8BOabnqPbGIhLAUOn7mhrxK', '644382078', 'mantenimiento', 'intenso', 1, 'cliente', '2026-02-07 12:52:50', 'femenino', 21, 57.00, 165);
