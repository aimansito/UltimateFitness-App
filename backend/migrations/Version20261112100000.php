<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261112100000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Entreno del día: foto, día de la rutina y ejercicios hechos (tarjeta estilo Strava)';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE calendario_usuario
            ADD foto_url VARCHAR(500) DEFAULT NULL,
            ADD dia_hecho VARCHAR(100) DEFAULT NULL,
            ADD ejercicios_hechos JSON DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE calendario_usuario DROP foto_url, DROP dia_hecho, DROP ejercicios_hechos');
    }
}
