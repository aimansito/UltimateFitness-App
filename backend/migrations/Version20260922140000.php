<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Perfil público de usuario (foto_url, bio_corta) + tabla solicitudes_entrenamiento
 * (solicitud del cliente a un entrenador, con aceptar/rechazar).
 */
final class Version20260922140000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Añade perfil público a usuarios y crea solicitudes_entrenamiento';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE solicitudes_entrenamiento (id INT AUTO_INCREMENT NOT NULL, usuario_id INT NOT NULL, entrenador_id INT NOT NULL, mensaje LONGTEXT DEFAULT NULL, estado VARCHAR(20) DEFAULT \'pendiente\' NOT NULL, motivo_rechazo LONGTEXT DEFAULT NULL, fecha_solicitud DATETIME NOT NULL, fecha_respuesta DATETIME DEFAULT NULL, fecha_fin DATETIME DEFAULT NULL, INDEX idx_usuario (usuario_id), INDEX idx_entrenador (entrenador_id), INDEX idx_estado (estado), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE solicitudes_entrenamiento ADD CONSTRAINT FK_SOLICITUDES_USUARIO FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE solicitudes_entrenamiento ADD CONSTRAINT FK_SOLICITUDES_ENTRENADOR FOREIGN KEY (entrenador_id) REFERENCES entrenadores (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE usuarios ADD foto_url VARCHAR(500) DEFAULT NULL, ADD bio_corta VARCHAR(280) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE solicitudes_entrenamiento DROP FOREIGN KEY FK_SOLICITUDES_USUARIO');
        $this->addSql('ALTER TABLE solicitudes_entrenamiento DROP FOREIGN KEY FK_SOLICITUDES_ENTRENADOR');
        $this->addSql('DROP TABLE solicitudes_entrenamiento');
        $this->addSql('ALTER TABLE usuarios DROP foto_url, DROP bio_corta');
    }
}
