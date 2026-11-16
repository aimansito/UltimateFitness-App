<?php

namespace App\Command;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Types\StringType;
use Doctrine\DBAL\Types\TextType;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

/**
 * Reparación puntual de datos importados a mano:
 *  - textos con la codificación rota ("Definici├│n" en vez de "Definición"),
 *  - platos sin macros aunque tengan ingredientes,
 *  - dietas sin totales aunque tengan platos.
 * Es idempotente: solo toca lo que está mal, y se puede ejecutar las veces que haga falta.
 */
#[AsCommand(name: 'app:reparar-datos', description: 'Repara textos mal codificados y recalcula macros de platos y dietas')]
class RepararDatosCommand extends Command
{
    /** Columnas de texto que nunca deben tocarse (hashes, tokens, rutas) */
    private const COLUMNAS_IGNORADAS = [
        'password_hash', 'password', 'reset_token', 'token_verificacion',
        'foto_url', 'imagen_url', 'video_url', 'imagen_destacada', 'stripe_customer_id', 'stripe_subscription_id',
    ];

    /** Caracteres que delatan una doble codificación (UTF-8 leído como CP850 o como Latin-1) */
    private const MARCAS = ['├', '┬', 'Ã', 'Â'];

    public function __construct(private Connection $conn)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $textos = $this->repararTextos($io);
        $platos = $this->recalcularPlatos();
        $dietas = $this->recalcularDietas();

        $io->success(sprintf('Datos reparados: %d textos, %d platos, %d dietas.', $textos, $platos, $dietas));
        return Command::SUCCESS;
    }

    private function repararTextos(SymfonyStyle $io): int
    {
        $esquema = $this->conn->createSchemaManager();
        $arreglados = 0;

        foreach ($esquema->listTableNames() as $tabla) {
            if ($tabla === 'doctrine_migration_versions') {
                continue;
            }
            $columnas = array_change_key_case($esquema->listTableColumns($tabla));
            if (!isset($columnas['id'])) {
                continue;
            }
            $deTexto = [];
            foreach ($columnas as $nombre => $columna) {
                $tipo = $columna->getType();
                if (($tipo instanceof StringType || $tipo instanceof TextType) && !\in_array($nombre, self::COLUMNAS_IGNORADAS, true)) {
                    $deTexto[] = $nombre;
                }
            }
            if ($deTexto === []) {
                continue;
            }

            $condiciones = [];
            $parametros = [];
            foreach ($deTexto as $c) {
                foreach (self::MARCAS as $marca) {
                    $condiciones[] = "`$c` LIKE ?";
                    $parametros[] = '%' . $marca . '%';
                }
            }
            $filas = $this->conn->fetchAllAssociative(
                sprintf('SELECT `id`, `%s` FROM `%s` WHERE %s', implode('`, `', $deTexto), $tabla, implode(' OR ', $condiciones)),
                $parametros
            );

            foreach ($filas as $fila) {
                $cambios = [];
                foreach ($deTexto as $c) {
                    if ($fila[$c] === null) {
                        continue;
                    }
                    $nuevo = self::corregir((string) $fila[$c]);
                    if ($nuevo !== $fila[$c]) {
                        $cambios[$c] = $nuevo;
                    }
                }
                if ($cambios !== []) {
                    $this->conn->update($tabla, $cambios, ['id' => $fila['id']]);
                    $arreglados++;
                    $io->text(sprintf('%s #%s: %s', $tabla, $fila['id'], implode(' | ', array_map(fn ($v) => mb_strimwidth($v, 0, 60, '…'), $cambios))));
                }
            }
        }

        return $arreglados;
    }

    /**
     * Deshace una doble codificación: el texto UTF-8 se leyó como CP850 (consola de Windows)
     * o como Latin-1 y se volvió a guardar en UTF-8. Solo se acepta si la vuelta atrás es exacta
     * y el resultado es UTF-8 válido; si no, se deja como está.
     */
    public static function corregir(string $texto): string
    {
        foreach (['CP850', 'Windows-1252', 'ISO-8859-1'] as $codificacion) {
            $bytes = mb_convert_encoding($texto, $codificacion, 'UTF-8');
            if ($bytes === $texto || mb_convert_encoding($bytes, 'UTF-8', $codificacion) !== $texto) {
                continue;
            }
            if (!mb_check_encoding($bytes, 'UTF-8') || preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', $bytes)) {
                continue;
            }
            // Puede quedar una segunda capa (texto codificado dos veces): se repite
            return self::corregir($bytes);
        }

        return $texto;
    }

    /** Platos sin macros: se calculan a partir de sus ingredientes (valores por 100 g) */
    private function recalcularPlatos(): int
    {
        $filas = $this->conn->fetchAllAssociative(
            'SELECT p.id,
                    SUM(a.calorias * pa.cantidad_gramos / 100) AS kcal,
                    SUM(a.proteinas * pa.cantidad_gramos / 100) AS prot,
                    SUM(a.carbohidratos * pa.cantidad_gramos / 100) AS carb,
                    SUM(a.grasas * pa.cantidad_gramos / 100) AS gras
             FROM platos p
             JOIN plato_alimentos pa ON pa.plato_id = p.id
             JOIN alimentos a ON a.id = pa.alimento_id
             WHERE p.calorias_totales IS NULL OR p.calorias_totales = 0
             GROUP BY p.id'
        );
        foreach ($filas as $f) {
            $this->conn->update('platos', [
                'calorias_totales' => round((float) $f['kcal'], 2),
                'proteinas_totales' => round((float) $f['prot'], 2),
                'carbohidratos_totales' => round((float) $f['carb'], 2),
                'grasas_totales' => round((float) $f['gras'], 2),
            ], ['id' => $f['id']]);
        }

        return \count($filas);
    }

    /** Dietas sin totales: media diaria de los platos que tienen asignados */
    private function recalcularDietas(): int
    {
        $filas = $this->conn->fetchAllAssociative(
            'SELECT d.id,
                    COUNT(DISTINCT dp.dia_semana) AS dias,
                    SUM(p.calorias_totales) AS kcal,
                    SUM(p.proteinas_totales) AS prot,
                    SUM(p.carbohidratos_totales) AS carb,
                    SUM(p.grasas_totales) AS gras
             FROM dietas d
             JOIN dieta_platos dp ON dp.dieta_id = d.id
             JOIN platos p ON p.id = dp.plato_id
             WHERE d.calorias_totales IS NULL OR d.calorias_totales = 0
             GROUP BY d.id'
        );
        $n = 0;
        foreach ($filas as $f) {
            $dias = max(1, (int) $f['dias']);
            if ((float) $f['kcal'] <= 0) {
                continue;
            }
            $this->conn->update('dietas', [
                'calorias_totales' => (int) round((float) $f['kcal'] / $dias),
                'proteinas_totales' => round((float) $f['prot'] / $dias, 2),
                'carbohidratos_totales' => round((float) $f['carb'] / $dias, 2),
                'grasas_totales' => round((float) $f['gras'] / $dias, 2),
            ], ['id' => $f['id']]);
            $n++;
        }

        return $n;
    }
}
