<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261120100000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Entreno completado: duración real y foto ya compuesta como tarjeta (estilo Strava)';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE calendario_usuario ADD duracion_minutos SMALLINT DEFAULT NULL, ADD foto_es_tarjeta TINYINT(1) DEFAULT 0 NOT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE calendario_usuario DROP duracion_minutos, DROP foto_es_tarjeta');
    }
}
