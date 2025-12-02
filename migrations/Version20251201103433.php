<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251201103433 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE dias_ejercicios (id INT AUTO_INCREMENT NOT NULL, dia_entrenamiento_id INT NOT NULL, ejercicio_id INT NOT NULL, series INT DEFAULT 3 NOT NULL, repeticiones INT DEFAULT 12 NOT NULL, descanso_segundos INT DEFAULT 60 NOT NULL, notas LONGTEXT DEFAULT NULL, orden INT DEFAULT 0 NOT NULL, INDEX idx_dia_entrenamiento (dia_entrenamiento_id), INDEX idx_ejercicio (ejercicio_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE dias_entrenamiento (id INT AUTO_INCREMENT NOT NULL, entrenamiento_id INT NOT NULL, dia_semana INT NOT NULL, concepto VARCHAR(100) DEFAULT NULL, es_descanso TINYINT(1) DEFAULT 0 NOT NULL, orden INT DEFAULT 0 NOT NULL, INDEX idx_entrenamiento (entrenamiento_id), INDEX idx_dia_semana (dia_semana), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE dias_ejercicios ADD CONSTRAINT FK_142C168469586A48 FOREIGN KEY (dia_entrenamiento_id) REFERENCES dias_entrenamiento (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE dias_ejercicios ADD CONSTRAINT FK_142C168430890A7D FOREIGN KEY (ejercicio_id) REFERENCES ejercicios (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE dias_entrenamiento ADD CONSTRAINT FK_B76B44DA1C17D8 FOREIGN KEY (entrenamiento_id) REFERENCES entrenamientos (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE dieta_platos CHANGE dia_semana dia_semana ENUM(\'lunes\',\'martes\',\'miercoles\',\'jueves\',\'viernes\',\'sabado\',\'domingo\'), CHANGE tipo_comida tipo_comida ENUM(\'desayuno\',\'media_manana\',\'almuerzo\',\'merienda\',\'cena\',\'post_entreno\')');
        $this->addSql('ALTER TABLE entrenadores DROP revisado_por, DROP fecha_registro');
        $this->addSql('ALTER TABLE entrenamientos DROP FOREIGN KEY FK_24DCB62B6B62C1A2');
        $this->addSql('DROP INDEX IDX_24DCB62B6B62C1A2 ON entrenamientos');
        $this->addSql('ALTER TABLE entrenamientos CHANGE asignado_a_usuario_id asignado_ausuario_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE entrenamientos ADD CONSTRAINT FK_24DCB62B6B62C1A2 FOREIGN KEY (asignado_ausuario_id) REFERENCES usuarios (id) ON DELETE CASCADE');
        $this->addSql('CREATE INDEX IDX_24DCB62B6B62C1A2 ON entrenamientos (asignado_ausuario_id)');
        $this->addSql('ALTER TABLE platos CHANGE tipo_comida tipo_comida ENUM(\'desayuno\',\'media_manana\',\'almuerzo\',\'merienda\',\'cena\',\'post_entreno\'), CHANGE dificultad dificultad ENUM(\'facil\',\'media\',\'dificil\') DEFAULT \'media\'');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE dias_ejercicios DROP FOREIGN KEY FK_142C168469586A48');
        $this->addSql('ALTER TABLE dias_ejercicios DROP FOREIGN KEY FK_142C168430890A7D');
        $this->addSql('ALTER TABLE dias_entrenamiento DROP FOREIGN KEY FK_B76B44DA1C17D8');
        $this->addSql('DROP TABLE dias_ejercicios');
        $this->addSql('DROP TABLE dias_entrenamiento');
        $this->addSql('ALTER TABLE dieta_platos CHANGE dia_semana dia_semana VARCHAR(255) DEFAULT NULL, CHANGE tipo_comida tipo_comida VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE entrenadores ADD revisado_por INT DEFAULT NULL, ADD fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL');
        $this->addSql('ALTER TABLE entrenamientos DROP FOREIGN KEY FK_24DCB62B6B62C1A2');
        $this->addSql('DROP INDEX IDX_24DCB62B6B62C1A2 ON entrenamientos');
        $this->addSql('ALTER TABLE entrenamientos CHANGE asignado_ausuario_id asignado_a_usuario_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE entrenamientos ADD CONSTRAINT FK_24DCB62B6B62C1A2 FOREIGN KEY (asignado_a_usuario_id) REFERENCES usuarios (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('CREATE INDEX IDX_24DCB62B6B62C1A2 ON entrenamientos (asignado_a_usuario_id)');
        $this->addSql('ALTER TABLE platos CHANGE tipo_comida tipo_comida VARCHAR(255) DEFAULT NULL, CHANGE dificultad dificultad VARCHAR(255) DEFAULT \'media\'');
    }
}
