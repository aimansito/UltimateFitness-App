<?php

namespace App\Command;

use Doctrine\DBAL\Connection;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

/**
 * Para bases de datos creadas a mano o desde un volcado (sin historial de migraciones).
 *
 * Revisa cada migración: si todos sus cambios ya están en la base de datos, la registra como ejecutada;
 * si no hay ninguno, la deja pendiente para doctrine:migrations:migrate; si solo hay una parte, para
 * sin tocar nada, porque aplicarla o saltarla podría dejar la base de datos inconsistente.
 *
 *   php bin/console app:sincronizar-migraciones && php bin/console doctrine:migrations:migrate
 */
#[AsCommand(name: 'app:sincronizar-migraciones', description: 'Registra como hechas las migraciones que ya están aplicadas en la base de datos')]
class SincronizarMigracionesCommand extends Command
{
    /** versión => marcas que deja la migración: 'tabla' o 'tabla.columna' */
    private const MARCAS = [
        '20251201103433' => ['dias_ejercicios', 'dias_entrenamiento', 'entrenamientos.asignado_ausuario_id'],
        '20251205192455' => ['entrenamientos.creador_usuario_id', 'dietas.asignado_a_usuario_id', 'entrenadores.certificacion', 'usuarios.rol'],
        '20260922140000' => ['solicitudes_entrenamiento', 'usuarios.foto_url', 'usuarios.bio_corta'],
        '20261025120000' => ['suscripciones.stripe_customer_id', 'suscripciones.stripe_subscription_id'],
        '20261107125138' => ['ejercicios.imagen_url'],
        '20261111100000' => ['seguimientos', 'guardados', 'usuarios.perfil_publico', 'calendario_usuario.compartido_en_feed', 'entrenamientos.clonado_de_id'],
        '20261112100000' => ['calendario_usuario.foto_url', 'calendario_usuario.ejercicios_hechos'],
        '20261113100000' => ['usuarios.email_verificado', 'usuarios.token_verificacion'],
        '20261115100000' => ['ejercicios.creador_usuario_id'],
        '20261116100000' => ['registros_series'],
    ];

    public function __construct(private Connection $conn)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        // Crea la tabla de historial si aún no existe
        $this->ejecutar('doctrine:migrations:sync-metadata-storage', [], $output);

        $registradas = array_map(
            fn ($v) => preg_replace('/\D/', '', (string) $v),
            $this->conn->fetchFirstColumn('SELECT version FROM doctrine_migration_versions')
        );

        $esquema = $this->conn->createSchemaManager();
        $tablas = array_map('strtolower', $esquema->listTableNames());
        $existe = function (string $marca) use ($esquema, $tablas): bool {
            [$tabla, $columna] = array_pad(explode('.', $marca, 2), 2, null);
            if (!\in_array($tabla, $tablas, true)) {
                return false;
            }
            if ($columna === null) {
                return true;
            }
            return \array_key_exists($columna, array_change_key_case($esquema->listTableColumns($tabla)));
        };

        foreach (self::MARCAS as $version => $marcas) {
            $version = (string) $version; // PHP convierte las claves numéricas del array en enteros
            if (\in_array($version, $registradas, true)) {
                continue;
            }
            $presentes = array_filter($marcas, $existe);
            if (\count($presentes) === 0) {
                $io->text("Version$version: pendiente, la aplicará migrate");
                continue;
            }
            if (\count($presentes) < \count($marcas)) {
                $io->error(sprintf(
                    "Version%s está aplicada solo en parte. Existe: %s. Falta: %s. No se toca nada; revisa la base de datos.",
                    $version,
                    implode(', ', $presentes),
                    implode(', ', array_diff($marcas, $presentes))
                ));
                return Command::FAILURE;
            }
            $this->ejecutar('doctrine:migrations:version', [
                'version' => 'DoctrineMigrations\\Version' . $version,
                '--add' => true,
            ], $output);
            $io->text("Version$version: ya estaba aplicada, registrada como hecha");
        }

        $io->success('Historial de migraciones sincronizado.');
        return Command::SUCCESS;
    }

    /** Lanza otro comando sin preguntas: en el servidor no hay nadie para responder */
    private function ejecutar(string $nombre, array $argumentos, OutputInterface $output): void
    {
        $entrada = new ArrayInput($argumentos);
        $entrada->setInteractive(false);
        $codigo = $this->getApplication()->find($nombre)->run($entrada, $output);
        if ($codigo !== Command::SUCCESS) {
            throw new \RuntimeException("Ha fallado $nombre");
        }
    }
}
