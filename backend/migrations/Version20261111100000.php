<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261111100000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Capa social: privacidad de perfil, seguimientos, guardados, origen de copias y entreno compartido';
    }

    public function up(Schema $schema): void
    {
        foreach (['usuarios', 'entrenadores'] as $tabla) {
            $this->addSql("ALTER TABLE $tabla
                ADD perfil_publico TINYINT(1) DEFAULT 1 NOT NULL,
                ADD privacidad_entrenamientos VARCHAR(12) DEFAULT 'publico' NOT NULL,
                ADD privacidad_dietas VARCHAR(12) DEFAULT 'publico' NOT NULL,
                ADD privacidad_favoritos VARCHAR(12) DEFAULT 'publico' NOT NULL");
        }
        $this->addSql('ALTER TABLE entrenamientos ADD clonado_de_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE dietas ADD clonado_de_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE calendario_usuario
            ADD compartido_en_feed TINYINT(1) DEFAULT 0 NOT NULL,
            ADD fecha_completado DATETIME DEFAULT NULL');
        $this->addSql('CREATE TABLE seguimientos (
            id INT AUTO_INCREMENT NOT NULL,
            seguidor_tipo VARCHAR(12) NOT NULL,
            seguidor_id INT NOT NULL,
            seguido_tipo VARCHAR(12) NOT NULL,
            seguido_id INT NOT NULL,
            fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
            UNIQUE INDEX uniq_seguimiento (seguidor_tipo, seguidor_id, seguido_tipo, seguido_id),
            INDEX idx_seguido (seguido_tipo, seguido_id),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE guardados (
            id INT AUTO_INCREMENT NOT NULL,
            propietario_tipo VARCHAR(12) NOT NULL,
            propietario_id INT NOT NULL,
            item_tipo VARCHAR(15) NOT NULL,
            item_id INT NOT NULL,
            fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
            UNIQUE INDEX uniq_guardado (propietario_tipo, propietario_id, item_tipo, item_id),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE guardados');
        $this->addSql('DROP TABLE seguimientos');
        $this->addSql('ALTER TABLE calendario_usuario DROP compartido_en_feed, DROP fecha_completado');
        $this->addSql('ALTER TABLE dietas DROP clonado_de_id');
        $this->addSql('ALTER TABLE entrenamientos DROP clonado_de_id');
        foreach (['usuarios', 'entrenadores'] as $tabla) {
            $this->addSql("ALTER TABLE $tabla DROP perfil_publico, DROP privacidad_entrenamientos, DROP privacidad_dietas, DROP privacidad_favoritos");
        }
    }
}
