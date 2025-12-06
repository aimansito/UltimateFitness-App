<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251205192455 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE blog_posts (id INT AUTO_INCREMENT NOT NULL, titulo VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL, extracto LONGTEXT DEFAULT NULL, contenido LONGTEXT NOT NULL, imagen_portada VARCHAR(500) DEFAULT NULL, categoria VARCHAR(20) DEFAULT \'noticias\' NOT NULL, es_premium TINYINT(1) DEFAULT 0 NOT NULL, destacado TINYINT(1) DEFAULT 0 NOT NULL, fecha_publicacion DATETIME DEFAULT NULL, fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, UNIQUE INDEX UNIQ_78B2F932989D9B62 (slug), INDEX idx_categoria (categoria), INDEX idx_premium (es_premium), INDEX idx_destacado (destacado), INDEX idx_fecha_publicacion (fecha_publicacion), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE dias_ejercicios (id INT AUTO_INCREMENT NOT NULL, dia_entrenamiento_id INT NOT NULL, ejercicio_id INT NOT NULL, series INT DEFAULT 3 NOT NULL, repeticiones INT DEFAULT 12 NOT NULL, descanso_segundos INT DEFAULT 60 NOT NULL, notas LONGTEXT DEFAULT NULL, orden INT DEFAULT 0 NOT NULL, INDEX idx_dia_entrenamiento (dia_entrenamiento_id), INDEX idx_ejercicio (ejercicio_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE dias_entrenamiento (id INT AUTO_INCREMENT NOT NULL, entrenamiento_id INT NOT NULL, dia_semana INT NOT NULL, concepto VARCHAR(100) DEFAULT NULL, es_descanso TINYINT(1) DEFAULT 0 NOT NULL, orden INT DEFAULT 0 NOT NULL, INDEX idx_entrenamiento (entrenamiento_id), INDEX idx_dia_semana (dia_semana), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE dieta_platos (id INT AUTO_INCREMENT NOT NULL, dieta_id INT NOT NULL, plato_id INT NOT NULL, dia_semana ENUM(\'lunes\',\'martes\',\'miercoles\',\'jueves\',\'viernes\',\'sabado\',\'domingo\'), tipo_comida ENUM(\'desayuno\',\'media_manana\',\'almuerzo\',\'merienda\',\'cena\',\'post_entreno\'), orden INT DEFAULT 1 NOT NULL, notas LONGTEXT DEFAULT NULL, INDEX idx_dieta (dieta_id), INDEX idx_plato (plato_id), INDEX idx_dia_tipo (dia_semana, tipo_comida), UNIQUE INDEX unique_dieta_dia_comida_orden (dieta_id, dia_semana, tipo_comida, orden), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE historial_pagos (id INT AUTO_INCREMENT NOT NULL, usuario_id INT NOT NULL, suscripcion_id INT DEFAULT NULL, monto NUMERIC(10, 2) NOT NULL, moneda VARCHAR(3) DEFAULT \'EUR\' NOT NULL, metodo_pago VARCHAR(50) NOT NULL, id_transaccion_externa VARCHAR(255) NOT NULL, estado VARCHAR(20) DEFAULT \'pendiente\' NOT NULL, descripcion VARCHAR(255) DEFAULT NULL, metadata JSON DEFAULT NULL, fecha_pago DATETIME NOT NULL, fecha_actualizacion DATETIME NOT NULL, INDEX IDX_28FB96FB189E045D (suscripcion_id), INDEX idx_usuario (usuario_id), INDEX idx_transaccion (id_transaccion_externa), INDEX idx_estado (estado), INDEX idx_fecha (fecha_pago), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE plato_alimentos (id INT AUTO_INCREMENT NOT NULL, plato_id INT NOT NULL, alimento_id INT NOT NULL, cantidad_gramos NUMERIC(8, 2) NOT NULL, orden INT DEFAULT 1 NOT NULL, INDEX idx_plato (plato_id), INDEX idx_alimento (alimento_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE platos (id INT AUTO_INCREMENT NOT NULL, nombre VARCHAR(150) NOT NULL, descripcion LONGTEXT DEFAULT NULL, instrucciones LONGTEXT DEFAULT NULL, imagen_url VARCHAR(255) DEFAULT NULL, tipo_comida ENUM(\'desayuno\',\'media_manana\',\'almuerzo\',\'merienda\',\'cena\',\'post_entreno\'), tiempo_preparacion INT DEFAULT NULL, dificultad ENUM(\'facil\',\'media\',\'dificil\') DEFAULT \'media\', calorias_totales NUMERIC(8, 2) DEFAULT NULL, proteinas_totales NUMERIC(8, 2) DEFAULT NULL, carbohidratos_totales NUMERIC(8, 2) DEFAULT NULL, grasas_totales NUMERIC(8, 2) DEFAULT NULL, es_publico TINYINT(1) DEFAULT 1 NOT NULL, valoracion_promedio NUMERIC(3, 2) DEFAULT \'0.00\' NOT NULL, total_valoraciones INT DEFAULT 0 NOT NULL, creador_id INT DEFAULT NULL, fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, INDEX idx_tipo (tipo_comida), INDEX idx_publico (es_publico), INDEX idx_valoracion (valoracion_promedio), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE dias_ejercicios ADD CONSTRAINT FK_142C168469586A48 FOREIGN KEY (dia_entrenamiento_id) REFERENCES dias_entrenamiento (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE dias_ejercicios ADD CONSTRAINT FK_142C168430890A7D FOREIGN KEY (ejercicio_id) REFERENCES ejercicios (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE dias_entrenamiento ADD CONSTRAINT FK_B76B44DA1C17D8 FOREIGN KEY (entrenamiento_id) REFERENCES entrenamientos (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE dieta_platos ADD CONSTRAINT FK_84AECDBA615C2CBC FOREIGN KEY (dieta_id) REFERENCES dietas (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE dieta_platos ADD CONSTRAINT FK_84AECDBAB0DB09EF FOREIGN KEY (plato_id) REFERENCES platos (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE historial_pagos ADD CONSTRAINT FK_28FB96FBDB38439E FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE historial_pagos ADD CONSTRAINT FK_28FB96FB189E045D FOREIGN KEY (suscripcion_id) REFERENCES suscripciones (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE plato_alimentos ADD CONSTRAINT FK_9C1F1BEAB0DB09EF FOREIGN KEY (plato_id) REFERENCES platos (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE plato_alimentos ADD CONSTRAINT FK_9C1F1BEA974F2E6F FOREIGN KEY (alimento_id) REFERENCES alimentos (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE dieta_alimentos DROP FOREIGN KEY dieta_alimentos_ibfk_1');
        $this->addSql('ALTER TABLE dieta_alimentos DROP FOREIGN KEY dieta_alimentos_ibfk_2');
        $this->addSql('ALTER TABLE valoraciones_entrenador DROP FOREIGN KEY valoraciones_entrenador_ibfk_1');
        $this->addSql('ALTER TABLE valoraciones_entrenador DROP FOREIGN KEY valoraciones_entrenador_ibfk_2');
        $this->addSql('ALTER TABLE valoraciones_plato DROP FOREIGN KEY valoraciones_plato_ibfk_1');
        $this->addSql('ALTER TABLE valoraciones_plato DROP FOREIGN KEY valoraciones_plato_ibfk_2');
        $this->addSql('DROP TABLE dieta_alimentos');
        $this->addSql('DROP TABLE servicios');
        $this->addSql('DROP TABLE valoraciones_entrenador');
        $this->addSql('DROP TABLE valoraciones_plato');
        $this->addSql('ALTER TABLE alimentos CHANGE tipo_alimento tipo_alimento VARCHAR(20) NOT NULL, CHANGE descripcion descripcion LONGTEXT DEFAULT NULL');
        $this->addSql('DROP INDEX unique_usuario_dia ON calendario_usuario');
        $this->addSql('ALTER TABLE calendario_usuario CHANGE dia_semana dia_semana VARCHAR(20) NOT NULL, CHANGE completado completado TINYINT(1) DEFAULT 0 NOT NULL, CHANGE notas notas LONGTEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE calendario_usuario RENAME INDEX idx_dieta TO IDX_705DADA7615C2CBC');
        $this->addSql('ALTER TABLE calendario_usuario RENAME INDEX idx_entrenamiento TO IDX_705DADA7DA1C17D8');
        $this->addSql('DROP INDEX idx_valoracion ON dietas');
        $this->addSql('ALTER TABLE dietas ADD asignado_a_usuario_id INT DEFAULT NULL, ADD proteinas_totales NUMERIC(6, 2) DEFAULT NULL, ADD carbohidratos_totales NUMERIC(6, 2) DEFAULT NULL, ADD grasas_totales NUMERIC(6, 2) DEFAULT NULL, CHANGE creador_id creador_id INT DEFAULT NULL, CHANGE descripcion descripcion LONGTEXT DEFAULT NULL, CHANGE es_publica es_publica TINYINT(1) DEFAULT 1 NOT NULL, CHANGE valoracion_promedio valoracion_promedio NUMERIC(3, 2) DEFAULT \'0.00\' NOT NULL, CHANGE total_valoraciones total_valoraciones INT DEFAULT 0 NOT NULL, CHANGE fecha_creacion fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL');
        $this->addSql('ALTER TABLE dietas ADD CONSTRAINT FK_5C6F440E97AC95E3 FOREIGN KEY (asignado_a_usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE');
        $this->addSql('CREATE INDEX idx_dieta_asignado ON dietas (asignado_a_usuario_id)');
        $this->addSql('DROP INDEX idx_grupo ON ejercicios');
        $this->addSql('ALTER TABLE ejercicios CHANGE tipo tipo VARCHAR(20) NOT NULL, CHANGE descripcion descripcion LONGTEXT DEFAULT NULL, CHANGE nivel_dificultad nivel_dificultad VARCHAR(20) DEFAULT \'intermedio\' NOT NULL, CHANGE valoracion_promedio valoracion_promedio NUMERIC(3, 2) DEFAULT \'0.00\' NOT NULL, CHANGE total_valoraciones total_valoraciones INT DEFAULT 0 NOT NULL');
        $this->addSql('DROP INDEX idx_valoracion ON entrenadores');
        $this->addSql('ALTER TABLE entrenadores ADD certificacion LONGTEXT DEFAULT NULL, ADD anos_experiencia INT DEFAULT 0 NOT NULL, ADD cv_url VARCHAR(500) DEFAULT NULL, ADD foto_url VARCHAR(500) DEFAULT NULL, ADD estado_aplicacion VARCHAR(20) DEFAULT \'aprobado\' NOT NULL, ADD motivo_rechazo LONGTEXT DEFAULT NULL, ADD fecha_aplicacion DATETIME DEFAULT NULL, DROP fecha_registro, CHANGE especialidad especialidad VARCHAR(20) DEFAULT \'ambos\' NOT NULL, CHANGE biografia biografia LONGTEXT DEFAULT NULL, CHANGE valoracion_promedio valoracion_promedio NUMERIC(3, 2) DEFAULT \'0.00\' NOT NULL, CHANGE total_valoraciones total_valoraciones INT DEFAULT 0 NOT NULL, CHANGE precio_sesion_presencial precio_sesion_presencial NUMERIC(6, 2) DEFAULT \'35.00\' NOT NULL, CHANGE activo activo TINYINT(1) DEFAULT 1 NOT NULL');
        $this->addSql('CREATE INDEX idx_estado_aplicacion ON entrenadores (estado_aplicacion)');
        $this->addSql('CREATE INDEX idx_anos_experiencia ON entrenadores (anos_experiencia)');
        $this->addSql('ALTER TABLE entrenadores RENAME INDEX email TO UNIQ_E15FDEE2E7927C74');
        $this->addSql('DROP INDEX unique_entreno_ejercicio_orden ON entrenamiento_ejercicios');
        $this->addSql('ALTER TABLE entrenamiento_ejercicios CHANGE notas notas LONGTEXT DEFAULT NULL');
        $this->addSql('DROP INDEX idx_nivel ON entrenamientos');
        $this->addSql('ALTER TABLE entrenamientos ADD creador_usuario_id INT DEFAULT NULL, ADD asignado_ausuario_id INT DEFAULT NULL, CHANGE creador_id creador_id INT DEFAULT NULL, CHANGE descripcion descripcion LONGTEXT DEFAULT NULL, CHANGE tipo tipo VARCHAR(20) NOT NULL, CHANGE nivel_dificultad nivel_dificultad VARCHAR(20) DEFAULT \'intermedio\' NOT NULL, CHANGE es_publico es_publico TINYINT(1) DEFAULT 1 NOT NULL, CHANGE valoracion_promedio valoracion_promedio NUMERIC(3, 2) DEFAULT \'0.00\' NOT NULL, CHANGE total_valoraciones total_valoraciones INT DEFAULT 0 NOT NULL, CHANGE fecha_creacion fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL');
        $this->addSql('ALTER TABLE entrenamientos ADD CONSTRAINT FK_24DCB62BC5745869 FOREIGN KEY (creador_usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE entrenamientos ADD CONSTRAINT FK_24DCB62B6B62C1A2 FOREIGN KEY (asignado_ausuario_id) REFERENCES usuarios (id) ON DELETE CASCADE');
        $this->addSql('CREATE INDEX IDX_24DCB62BC5745869 ON entrenamientos (creador_usuario_id)');
        $this->addSql('CREATE INDEX IDX_24DCB62B6B62C1A2 ON entrenamientos (asignado_ausuario_id)');
        $this->addSql('ALTER TABLE suscripciones ADD auto_renovacion TINYINT(1) DEFAULT 1 NOT NULL, CHANGE estado estado VARCHAR(20) DEFAULT \'activo\' NOT NULL, CHANGE fecha_creacion fecha_creacion DATETIME NOT NULL');
        $this->addSql('ALTER TABLE suscripciones RENAME INDEX idx_entrenador TO IDX_FEE27D96944BA14C');
        $this->addSql('ALTER TABLE usuarios ADD fecha_nacimiento DATE DEFAULT NULL, ADD edad INT DEFAULT NULL, ADD peso_actual NUMERIC(5, 2) DEFAULT NULL, ADD altura INT DEFAULT NULL, ADD peso_objetivo NUMERIC(5, 2) DEFAULT NULL, ADD porcentaje_grasa NUMERIC(4, 2) DEFAULT NULL, ADD imc NUMERIC(4, 2) DEFAULT NULL, ADD nivel_actividad VARCHAR(20) DEFAULT \'ligero\' NOT NULL, ADD calorias_diarias INT DEFAULT NULL, ADD notas_salud LONGTEXT DEFAULT NULL, ADD fecha_premium DATE DEFAULT NULL, ADD rol VARCHAR(50) DEFAULT \'cliente\' NOT NULL, CHANGE observaciones observaciones LONGTEXT DEFAULT NULL, CHANGE objetivo objetivo VARCHAR(25) DEFAULT \'cuidar_alimentacion\' NOT NULL, CHANGE es_premium es_premium TINYINT(1) DEFAULT 0 NOT NULL, CHANGE fecha_registro fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL');
        $this->addSql('CREATE INDEX idx_rol ON usuarios (rol)');
        $this->addSql('CREATE INDEX idx_edad ON usuarios (edad)');
        $this->addSql('CREATE INDEX idx_nivel_actividad ON usuarios (nivel_actividad)');
        $this->addSql('ALTER TABLE usuarios RENAME INDEX email TO UNIQ_EF687F2E7927C74');
        $this->addSql('ALTER TABLE usuarios RENAME INDEX idx_entrenador TO IDX_EF687F24FE90CDB');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE dieta_alimentos (id INT AUTO_INCREMENT NOT NULL, dieta_id INT NOT NULL, alimento_id INT NOT NULL, dia_semana VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, tipo_comida VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, nombre_plato VARCHAR(150) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, cantidad_gramos INT NOT NULL, valoracion_promedio NUMERIC(3, 2) DEFAULT \'0.00\', total_valoraciones INT DEFAULT 0, orden INT DEFAULT 1, INDEX idx_valoracion (valoracion_promedio), INDEX idx_dia_tipo (dia_semana, tipo_comida), INDEX idx_alimento (alimento_id), INDEX idx_dieta (dieta_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE servicios (id INT AUTO_INCREMENT NOT NULL, nombre VARCHAR(150) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, descripcion TEXT CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, precio NUMERIC(8, 2) DEFAULT \'0.00\' NOT NULL, tipo VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, duracion_dias INT DEFAULT NULL, incluye_entrenador TINYINT(1) DEFAULT 0, incluye_dieta_personalizada TINYINT(1) DEFAULT 0, incluye_entreno_personalizado TINYINT(1) DEFAULT 0, activo TINYINT(1) DEFAULT 1, INDEX idx_tipo (tipo), INDEX idx_activo (activo), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE valoraciones_entrenador (id INT AUTO_INCREMENT NOT NULL, entrenador_id INT NOT NULL, cliente_id INT NOT NULL, estrellas INT NOT NULL, comentario TEXT CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, fecha DATETIME DEFAULT CURRENT_TIMESTAMP, UNIQUE INDEX unique_entrenador_cliente (entrenador_id, cliente_id), INDEX idx_entrenador (entrenador_id), INDEX idx_cliente (cliente_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE valoraciones_plato (id INT AUTO_INCREMENT NOT NULL, dieta_alimento_id INT NOT NULL, usuario_id INT NOT NULL, estrellas INT NOT NULL, comentario TEXT CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, facilidad_preparacion INT DEFAULT NULL, sabor INT DEFAULT NULL, fecha DATETIME DEFAULT CURRENT_TIMESTAMP, UNIQUE INDEX unique_plato_usuario (dieta_alimento_id, usuario_id), INDEX idx_plato (dieta_alimento_id), INDEX idx_usuario (usuario_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE dieta_alimentos ADD CONSTRAINT dieta_alimentos_ibfk_1 FOREIGN KEY (dieta_id) REFERENCES dietas (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE dieta_alimentos ADD CONSTRAINT dieta_alimentos_ibfk_2 FOREIGN KEY (alimento_id) REFERENCES alimentos (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE valoraciones_entrenador ADD CONSTRAINT valoraciones_entrenador_ibfk_1 FOREIGN KEY (entrenador_id) REFERENCES entrenadores (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE valoraciones_entrenador ADD CONSTRAINT valoraciones_entrenador_ibfk_2 FOREIGN KEY (cliente_id) REFERENCES usuarios (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE valoraciones_plato ADD CONSTRAINT valoraciones_plato_ibfk_1 FOREIGN KEY (dieta_alimento_id) REFERENCES dieta_alimentos (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE valoraciones_plato ADD CONSTRAINT valoraciones_plato_ibfk_2 FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE dias_ejercicios DROP FOREIGN KEY FK_142C168469586A48');
        $this->addSql('ALTER TABLE dias_ejercicios DROP FOREIGN KEY FK_142C168430890A7D');
        $this->addSql('ALTER TABLE dias_entrenamiento DROP FOREIGN KEY FK_B76B44DA1C17D8');
        $this->addSql('ALTER TABLE dieta_platos DROP FOREIGN KEY FK_84AECDBA615C2CBC');
        $this->addSql('ALTER TABLE dieta_platos DROP FOREIGN KEY FK_84AECDBAB0DB09EF');
        $this->addSql('ALTER TABLE historial_pagos DROP FOREIGN KEY FK_28FB96FBDB38439E');
        $this->addSql('ALTER TABLE historial_pagos DROP FOREIGN KEY FK_28FB96FB189E045D');
        $this->addSql('ALTER TABLE plato_alimentos DROP FOREIGN KEY FK_9C1F1BEAB0DB09EF');
        $this->addSql('ALTER TABLE plato_alimentos DROP FOREIGN KEY FK_9C1F1BEA974F2E6F');
        $this->addSql('DROP TABLE blog_posts');
        $this->addSql('DROP TABLE dias_ejercicios');
        $this->addSql('DROP TABLE dias_entrenamiento');
        $this->addSql('DROP TABLE dieta_platos');
        $this->addSql('DROP TABLE historial_pagos');
        $this->addSql('DROP TABLE plato_alimentos');
        $this->addSql('DROP TABLE platos');
        $this->addSql('ALTER TABLE alimentos CHANGE tipo_alimento tipo_alimento VARCHAR(255) NOT NULL, CHANGE descripcion descripcion TEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE calendario_usuario CHANGE dia_semana dia_semana VARCHAR(255) NOT NULL, CHANGE completado completado TINYINT(1) DEFAULT 0, CHANGE notas notas TEXT DEFAULT NULL');
        $this->addSql('CREATE UNIQUE INDEX unique_usuario_dia ON calendario_usuario (usuario_id, dia_semana)');
        $this->addSql('ALTER TABLE calendario_usuario RENAME INDEX idx_705dada7da1c17d8 TO idx_entrenamiento');
        $this->addSql('ALTER TABLE calendario_usuario RENAME INDEX idx_705dada7615c2cbc TO idx_dieta');
        $this->addSql('ALTER TABLE dietas DROP FOREIGN KEY FK_5C6F440E97AC95E3');
        $this->addSql('DROP INDEX idx_dieta_asignado ON dietas');
        $this->addSql('ALTER TABLE dietas DROP asignado_a_usuario_id, DROP proteinas_totales, DROP carbohidratos_totales, DROP grasas_totales, CHANGE creador_id creador_id INT NOT NULL, CHANGE descripcion descripcion TEXT DEFAULT NULL, CHANGE es_publica es_publica TINYINT(1) DEFAULT 1, CHANGE valoracion_promedio valoracion_promedio NUMERIC(3, 2) DEFAULT \'0.00\', CHANGE total_valoraciones total_valoraciones INT DEFAULT 0, CHANGE fecha_creacion fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP');
        $this->addSql('CREATE INDEX idx_valoracion ON dietas (valoracion_promedio)');
        $this->addSql('ALTER TABLE ejercicios CHANGE tipo tipo VARCHAR(255) NOT NULL, CHANGE descripcion descripcion TEXT DEFAULT NULL, CHANGE nivel_dificultad nivel_dificultad VARCHAR(255) DEFAULT \'intermedio\', CHANGE valoracion_promedio valoracion_promedio NUMERIC(3, 2) DEFAULT \'0.00\', CHANGE total_valoraciones total_valoraciones INT DEFAULT 0');
        $this->addSql('CREATE INDEX idx_grupo ON ejercicios (grupo_muscular)');
        $this->addSql('DROP INDEX idx_estado_aplicacion ON entrenadores');
        $this->addSql('DROP INDEX idx_anos_experiencia ON entrenadores');
        $this->addSql('ALTER TABLE entrenadores ADD fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP, DROP certificacion, DROP anos_experiencia, DROP cv_url, DROP foto_url, DROP estado_aplicacion, DROP motivo_rechazo, DROP fecha_aplicacion, CHANGE especialidad especialidad VARCHAR(255) DEFAULT \'ambos\' NOT NULL, CHANGE biografia biografia TEXT DEFAULT NULL, CHANGE valoracion_promedio valoracion_promedio NUMERIC(3, 2) DEFAULT \'0.00\', CHANGE total_valoraciones total_valoraciones INT DEFAULT 0, CHANGE precio_sesion_presencial precio_sesion_presencial NUMERIC(6, 2) DEFAULT \'35.00\', CHANGE activo activo TINYINT(1) DEFAULT 1');
        $this->addSql('CREATE INDEX idx_valoracion ON entrenadores (valoracion_promedio)');
        $this->addSql('ALTER TABLE entrenadores RENAME INDEX uniq_e15fdee2e7927c74 TO email');
        $this->addSql('ALTER TABLE entrenamiento_ejercicios CHANGE notas notas TEXT DEFAULT NULL');
        $this->addSql('CREATE UNIQUE INDEX unique_entreno_ejercicio_orden ON entrenamiento_ejercicios (entrenamiento_id, orden)');
        $this->addSql('ALTER TABLE entrenamientos DROP FOREIGN KEY FK_24DCB62BC5745869');
        $this->addSql('ALTER TABLE entrenamientos DROP FOREIGN KEY FK_24DCB62B6B62C1A2');
        $this->addSql('DROP INDEX IDX_24DCB62BC5745869 ON entrenamientos');
        $this->addSql('DROP INDEX IDX_24DCB62B6B62C1A2 ON entrenamientos');
        $this->addSql('ALTER TABLE entrenamientos DROP creador_usuario_id, DROP asignado_ausuario_id, CHANGE creador_id creador_id INT NOT NULL, CHANGE descripcion descripcion TEXT DEFAULT NULL, CHANGE tipo tipo VARCHAR(255) NOT NULL, CHANGE nivel_dificultad nivel_dificultad VARCHAR(255) DEFAULT \'intermedio\', CHANGE es_publico es_publico TINYINT(1) DEFAULT 1, CHANGE valoracion_promedio valoracion_promedio NUMERIC(3, 2) DEFAULT \'0.00\', CHANGE total_valoraciones total_valoraciones INT DEFAULT 0, CHANGE fecha_creacion fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP');
        $this->addSql('CREATE INDEX idx_nivel ON entrenamientos (nivel_dificultad)');
        $this->addSql('ALTER TABLE suscripciones DROP auto_renovacion, CHANGE estado estado VARCHAR(255) DEFAULT \'activo\', CHANGE fecha_creacion fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP');
        $this->addSql('ALTER TABLE suscripciones RENAME INDEX idx_fee27d96944ba14c TO idx_entrenador');
        $this->addSql('DROP INDEX idx_rol ON usuarios');
        $this->addSql('DROP INDEX idx_edad ON usuarios');
        $this->addSql('DROP INDEX idx_nivel_actividad ON usuarios');
        $this->addSql('ALTER TABLE usuarios DROP fecha_nacimiento, DROP edad, DROP peso_actual, DROP altura, DROP peso_objetivo, DROP porcentaje_grasa, DROP imc, DROP nivel_actividad, DROP calorias_diarias, DROP notas_salud, DROP fecha_premium, DROP rol, CHANGE observaciones observaciones TEXT DEFAULT NULL, CHANGE objetivo objetivo VARCHAR(255) DEFAULT \'cuidar_alimentacion\', CHANGE es_premium es_premium TINYINT(1) DEFAULT 0, CHANGE fecha_registro fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP');
        $this->addSql('ALTER TABLE usuarios RENAME INDEX uniq_ef687f2e7927c74 TO email');
        $this->addSql('ALTER TABLE usuarios RENAME INDEX idx_ef687f24fe90cdb TO idx_entrenador');
    }
}
