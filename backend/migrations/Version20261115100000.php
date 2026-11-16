<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261115100000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Ejercicios creados por usuarios (privados de su cuenta)';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE ejercicios ADD creador_usuario_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE ejercicios ADD CONSTRAINT FK_ejercicios_creador_usuario FOREIGN KEY (creador_usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE');
        $this->addSql('CREATE INDEX idx_ejercicios_creador_usuario ON ejercicios (creador_usuario_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE ejercicios DROP FOREIGN KEY FK_ejercicios_creador_usuario');
        $this->addSql('DROP INDEX idx_ejercicios_creador_usuario ON ejercicios');
        $this->addSql('ALTER TABLE ejercicios DROP creador_usuario_id');
    }
}
