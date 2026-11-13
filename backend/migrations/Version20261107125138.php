<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261107125138 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add imagen_url column to ejercicios';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE ejercicios ADD imagen_url VARCHAR(500) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE ejercicios DROP imagen_url');
    }
}
