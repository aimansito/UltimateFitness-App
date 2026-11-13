<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261113100000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Verificación de email al registrarse; tokens de recuperación guardados como hash';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE usuarios
            ADD email_verificado TINYINT(1) DEFAULT 0 NOT NULL,
            ADD token_verificacion VARCHAR(64) DEFAULT NULL,
            ADD token_verificacion_expira DATETIME DEFAULT NULL');
        // Las cuentas que ya existían se dan por verificadas: no se les bloquea el acceso
        $this->addSql('UPDATE usuarios SET email_verificado = 1');
        $this->addSql('CREATE INDEX idx_usuarios_token_verificacion ON usuarios (token_verificacion)');
        // Los enlaces de recuperación pendientes se guardaban en claro: se invalidan
        $this->addSql('UPDATE usuarios SET reset_token = NULL, reset_token_expires = NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP INDEX idx_usuarios_token_verificacion ON usuarios');
        $this->addSql('ALTER TABLE usuarios DROP email_verificado, DROP token_verificacion, DROP token_verificacion_expira');
    }
}
