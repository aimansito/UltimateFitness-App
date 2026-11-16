<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261116100000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Registro de series, repeticiones y peso por ejercicio (progreso)';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE registros_series (
            id INT AUTO_INCREMENT NOT NULL,
            usuario_id INT NOT NULL,
            ejercicio_id INT NOT NULL,
            entrenamiento_id INT DEFAULT NULL,
            fecha DATE NOT NULL,
            serie SMALLINT NOT NULL,
            repeticiones SMALLINT NOT NULL,
            peso_kg NUMERIC(6, 2) DEFAULT NULL,
            fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
            INDEX idx_registro_usuario_ejercicio (usuario_id, ejercicio_id, fecha),
            INDEX IDX_registro_ejercicio (ejercicio_id),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE registros_series ADD CONSTRAINT FK_registro_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE registros_series ADD CONSTRAINT FK_registro_ejercicio FOREIGN KEY (ejercicio_id) REFERENCES ejercicios (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE registros_series');
    }
}
