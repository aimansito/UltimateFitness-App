<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Añade stripe_customer_id / stripe_subscription_id a suscripciones,
 * para el cobro real con Stripe Checkout (ver StripeController).
 */
final class Version20261025120000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Añade columnas de Stripe a suscripciones';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE suscripciones ADD stripe_customer_id VARCHAR(255) DEFAULT NULL, ADD stripe_subscription_id VARCHAR(255) DEFAULT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_SUSCRIPCIONES_STRIPE_SUBSCRIPTION_ID ON suscripciones (stripe_subscription_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP INDEX UNIQ_SUSCRIPCIONES_STRIPE_SUBSCRIPTION_ID ON suscripciones');
        $this->addSql('ALTER TABLE suscripciones DROP stripe_customer_id, DROP stripe_subscription_id');
    }
}
