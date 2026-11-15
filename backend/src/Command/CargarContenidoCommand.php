<?php

namespace App\Command;

use App\Entity\Usuario;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * Carga el contenido inicial (datos/contenido_inicial.php): alimentos, ejercicios, platos,
 * y rutinas y dietas publicadas por la cuenta oficial "Ultimate Fitness".
 *
 * Es idempotente: lo que ya existe (mismo nombre, sin distinguir mayúsculas ni tildes) se reutiliza
 * y no se duplica. Valida todo antes de escribir y lo guarda en una sola transacción.
 *
 *   php bin/console app:cargar-contenido
 */
#[AsCommand(name: 'app:cargar-contenido', description: 'Carga alimentos, ejercicios, platos, rutinas y dietas de la cuenta oficial')]
class CargarContenidoCommand extends Command
{
    public const EMAIL_OFICIAL = 'equipo@ultimatefitnessuf.com';
    private const DIAS = [1 => 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    private const ORDEN_COMIDAS = ['desayuno', 'media_manana', 'almuerzo', 'merienda', 'post_entreno', 'cena'];

    private array $resumen = [];

    public function __construct(
        private Connection $conn,
        private EntityManagerInterface $em,
        private UserPasswordHasherInterface $hasher,
        #[Autowire('%kernel.project_dir%')] private string $raiz,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $datos = require $this->raiz . '/datos/contenido_inicial.php';

        $oficial = $this->cuentaOficial();
        $io->text('Cuenta oficial: ' . self::EMAIL_OFICIAL . ' (id ' . $oficial . ')');

        try {
            $this->conn->transactional(function () use ($datos, $oficial) {
                $alimentos = $this->cargarAlimentos($datos['alimentos']);
                $ejercicios = $this->cargarEjercicios($datos['ejercicios']);
                $this->validar($datos, $alimentos, $ejercicios);
                $platos = $this->cargarPlatos($datos['platos'], $alimentos);
                $this->cargarRutinas($datos['rutinas'], $ejercicios, $oficial);
                $this->cargarDietas($datos['dietas'], $platos, $oficial);
            });
        } catch (\RuntimeException $e) {
            $io->error($e->getMessage());
            return Command::FAILURE;
        }

        $io->table(['Contenido', 'Creados', 'Ya existían'], array_map(
            fn ($k, $v) => [$k, $v['creados'] ?? 0, $v['existentes'] ?? 0],
            array_keys($this->resumen),
            $this->resumen
        ));
        $io->success('Contenido cargado.');

        return Command::SUCCESS;
    }

    /** Cuenta "Ultimate Fitness" con perfil público. Sin contraseña conocida: no se usa para iniciar sesión. */
    private function cuentaOficial(): int
    {
        $repo = $this->em->getRepository(Usuario::class);
        $u = $repo->findOneBy(['email' => self::EMAIL_OFICIAL]);
        if ($u) {
            $this->contar('Cuenta oficial', false);
            return $u->getId();
        }
        $u = (new Usuario())
            ->setNombre('Ultimate Fitness')
            ->setApellidos('Equipo')
            ->setEmail(self::EMAIL_OFICIAL)
            ->setBioCorta('Rutinas y dietas preparadas por el equipo de Ultimate Fitness. Guárdalas o cópialas y adáptalas a ti.')
            ->setEmailVerificado(true)
            ->setPerfilPublico(true);
        $u->setPasswordHash($this->hasher->hashPassword($u, bin2hex(random_bytes(32))));
        $this->em->persist($u);
        $this->em->flush();
        $this->contar('Cuenta oficial', true);

        return $u->getId();
    }

    /** @return array<string, array{id:int,kcal:float,p:float,c:float,g:float}> por nombre normalizado */
    private function cargarAlimentos(array $catalogo): array
    {
        $mapa = $this->leerAlimentos();
        foreach ($catalogo as $nombre => [$tipo, $kcal, $p, $c, $g, $precio, $desc]) {
            if (isset($mapa[self::norm($nombre)])) {
                $this->contar('Alimentos', false);
                continue;
            }
            $this->conn->insert('alimentos', [
                'nombre' => $nombre, 'tipo_alimento' => $tipo, 'descripcion' => $desc,
                'calorias' => $kcal, 'proteinas' => $p, 'carbohidratos' => $c, 'grasas' => $g, 'precio_kg' => $precio,
            ]);
            $this->contar('Alimentos', true);
        }

        return $this->leerAlimentos();
    }

    private function leerAlimentos(): array
    {
        $mapa = [];
        foreach ($this->conn->fetchAllAssociative('SELECT id, nombre, calorias, proteinas, carbohidratos, grasas FROM alimentos ORDER BY id') as $f) {
            $mapa[self::norm($f['nombre'])] ??= [
                'id' => (int) $f['id'], 'kcal' => (float) $f['calorias'], 'p' => (float) $f['proteinas'],
                'c' => (float) $f['carbohidratos'], 'g' => (float) $f['grasas'],
            ];
        }
        return $mapa;
    }

    /** @return array<string,int> id por nombre normalizado */
    private function cargarEjercicios(array $catalogo): array
    {
        $mapa = $this->leerEjercicios();
        foreach ($catalogo as $nombre => [$tipo, $grupo, $nivel, $desc]) {
            if (isset($mapa[self::norm($nombre)])) {
                $this->contar('Ejercicios', false);
                continue;
            }
            $this->conn->insert('ejercicios', [
                'nombre' => $nombre, 'tipo' => $tipo, 'grupo_muscular' => $grupo, 'descripcion' => $desc,
                'nivel_dificultad' => $nivel, 'valoracion_promedio' => 0, 'total_valoraciones' => 0,
            ]);
            $this->contar('Ejercicios', true);
        }

        return $this->leerEjercicios();
    }

    private function leerEjercicios(): array
    {
        $mapa = [];
        foreach ($this->conn->fetchAllAssociative('SELECT id, nombre FROM ejercicios ORDER BY id') as $f) {
            $mapa[self::norm($f['nombre'])] ??= (int) $f['id'];
        }
        return $mapa;
    }

    /** Comprueba que cada ingrediente, ejercicio y plato referenciado existe antes de crear nada más */
    private function validar(array $datos, array $alimentos, array $ejercicios): void
    {
        $faltan = [];
        foreach ($datos['platos'] as $plato => $d) {
            foreach (array_keys($d[6]) as $ing) {
                if (!isset($alimentos[self::norm($ing)])) {
                    $faltan[] = "alimento «$ing» (plato «$plato»)";
                }
            }
        }
        foreach ($datos['rutinas'] as $rutina => $r) {
            foreach ($r[4] as [, $ejs]) {
                foreach ($ejs as [$ej]) {
                    if (!isset($ejercicios[self::norm($ej)])) {
                        $faltan[] = "ejercicio «$ej» (rutina «$rutina»)";
                    }
                }
            }
        }
        $platosConocidos = array_map([self::class, 'norm'], array_merge(
            array_keys($datos['platos']),
            $this->conn->fetchFirstColumn('SELECT nombre FROM platos')
        ));
        foreach ($datos['dietas'] as $dieta => [, $comidas]) {
            foreach ($comidas as $lista) {
                foreach ($lista as $p) {
                    if (!\in_array(self::norm($p), $platosConocidos, true)) {
                        $faltan[] = "plato «$p» (dieta «$dieta»)";
                    }
                }
            }
        }
        if ($faltan) {
            throw new \RuntimeException("No se ha cargado nada. Faltan:\n- " . implode("\n- ", array_unique($faltan)));
        }
    }

    /** @return array<string, array{id:int,kcal:float,p:float,c:float,g:float}> por nombre normalizado */
    private function cargarPlatos(array $catalogo, array $alimentos): array
    {
        $existentes = [];
        foreach ($this->conn->fetchAllAssociative('SELECT id, nombre FROM platos ORDER BY id') as $f) {
            $existentes[self::norm($f['nombre'])] ??= (int) $f['id'];
        }

        foreach ($catalogo as $nombre => [$comida, $dificultad, $minutos, , $desc, $instr, $ingredientes]) {
            if (isset($existentes[self::norm($nombre)])) {
                $this->contar('Platos', false);
                continue;
            }
            $t = ['kcal' => 0, 'p' => 0, 'c' => 0, 'g' => 0];
            foreach ($ingredientes as $ing => $gramos) {
                $a = $alimentos[self::norm($ing)];
                foreach ($t as $k => $v) {
                    $t[$k] += $a[$k] * $gramos / 100;
                }
            }
            $this->conn->insert('platos', [
                'creador_id' => null, 'nombre' => $nombre, 'descripcion' => $desc, 'instrucciones' => $instr,
                'tipo_comida' => $comida, 'tiempo_preparacion' => $minutos, 'dificultad' => $dificultad,
                'calorias_totales' => round($t['kcal'], 2), 'proteinas_totales' => round($t['p'], 2),
                'carbohidratos_totales' => round($t['c'], 2), 'grasas_totales' => round($t['g'], 2),
                'es_publico' => 1, 'valoracion_promedio' => 0, 'total_valoraciones' => 0,
            ]);
            $id = (int) $this->conn->lastInsertId();
            $orden = 1;
            foreach ($ingredientes as $ing => $gramos) {
                $this->conn->insert('plato_alimentos', [
                    'plato_id' => $id, 'alimento_id' => $alimentos[self::norm($ing)]['id'], 'cantidad_gramos' => $gramos, 'orden' => $orden++,
                ]);
            }
            $existentes[self::norm($nombre)] = $id;
            $this->contar('Platos', true);
        }

        $mapa = [];
        foreach ($this->conn->fetchAllAssociative(
            'SELECT id, nombre, calorias_totales, proteinas_totales, carbohidratos_totales, grasas_totales FROM platos ORDER BY id'
        ) as $f) {
            $mapa[self::norm($f['nombre'])] ??= [
                'id' => (int) $f['id'], 'kcal' => (float) $f['calorias_totales'], 'p' => (float) $f['proteinas_totales'],
                'c' => (float) $f['carbohidratos_totales'], 'g' => (float) $f['grasas_totales'],
            ];
        }
        return $mapa;
    }

    private function cargarRutinas(array $catalogo, array $ejercicios, int $oficial): void
    {
        foreach ($catalogo as $nombre => [$tipo, $minutos, $nivel, $desc, $dias]) {
            $ya = $this->conn->fetchOne('SELECT id FROM entrenamientos WHERE nombre = ? AND creador_usuario_id = ?', [$nombre, $oficial]);
            if ($ya) {
                $this->contar('Rutinas', false);
                continue;
            }
            $this->conn->insert('entrenamientos', [
                'creador_id' => null, 'creador_usuario_id' => $oficial, 'asignado_ausuario_id' => null,
                'nombre' => $nombre, 'descripcion' => $desc, 'tipo' => $tipo, 'duracion_minutos' => $minutos,
                'nivel_dificultad' => $nivel, 'es_publico' => 1, 'valoracion_promedio' => 0, 'total_valoraciones' => 0,
                'fecha_creacion' => date('Y-m-d H:i:s'),
            ]);
            $entrenamientoId = (int) $this->conn->lastInsertId();

            foreach ($dias as $numero => [$concepto, $ejs]) {
                $this->conn->insert('dias_entrenamiento', [
                    'entrenamiento_id' => $entrenamientoId, 'dia_semana' => $numero, 'concepto' => $concepto,
                    'es_descanso' => $ejs ? 0 : 1, 'orden' => $numero,
                ]);
                $diaId = (int) $this->conn->lastInsertId();
                $orden = 1;
                foreach ($ejs as [$ej, $series, $reps, $descanso, $notas]) {
                    $this->conn->insert('dias_ejercicios', [
                        'dia_entrenamiento_id' => $diaId, 'ejercicio_id' => $ejercicios[self::norm($ej)],
                        'series' => $series, 'repeticiones' => $reps, 'descanso_segundos' => $descanso,
                        'notas' => $notas, 'orden' => $orden++,
                    ]);
                }
            }
            $this->contar('Rutinas', true);
        }
    }

    private function cargarDietas(array $catalogo, array $platos, int $oficial): void
    {
        foreach ($catalogo as $nombre => [$desc, $comidas]) {
            $ya = $this->conn->fetchOne(
                'SELECT id FROM dietas WHERE nombre = ? AND asignado_a_usuario_id = ? AND creador_id IS NULL',
                [$nombre, $oficial]
            );
            if ($ya) {
                $this->contar('Dietas', false);
                continue;
            }
            $this->conn->insert('dietas', [
                'creador_id' => null, 'asignado_a_usuario_id' => $oficial, 'nombre' => $nombre, 'descripcion' => $desc,
                'es_publica' => 1, 'valoracion_promedio' => 0, 'total_valoraciones' => 0, 'fecha_creacion' => date('Y-m-d H:i:s'),
            ]);
            $dietaId = (int) $this->conn->lastInsertId();

            // Cada comida rota por su lista de platos a lo largo de la semana
            $total = ['kcal' => 0, 'p' => 0, 'c' => 0, 'g' => 0];
            foreach (self::DIAS as $n => $dia) {
                $orden = 1;
                foreach (self::ORDEN_COMIDAS as $comida) {
                    if (empty($comidas[$comida])) {
                        continue;
                    }
                    $lista = $comidas[$comida];
                    $plato = $platos[self::norm($lista[($n - 1) % \count($lista)])];
                    $this->conn->insert('dieta_platos', [
                        'dieta_id' => $dietaId, 'plato_id' => $plato['id'], 'dia_semana' => $dia,
                        'tipo_comida' => $comida, 'orden' => $orden++,
                    ]);
                    foreach ($total as $k => $v) {
                        $total[$k] += $plato[$k];
                    }
                }
            }
            // Totales de la dieta = media diaria de la semana
            $this->conn->update('dietas', [
                'calorias_totales' => (int) round($total['kcal'] / 7),
                'proteinas_totales' => round($total['p'] / 7, 2),
                'carbohidratos_totales' => round($total['c'] / 7, 2),
                'grasas_totales' => round($total['g'] / 7, 2),
            ], ['id' => $dietaId]);
            $this->contar('Dietas', true);
        }
    }

    private function contar(string $tipo, bool $creado): void
    {
        $this->resumen[$tipo][$creado ? 'creados' : 'existentes'] = ($this->resumen[$tipo][$creado ? 'creados' : 'existentes'] ?? 0) + 1;
    }

    /** Minúsculas, sin tildes y sin espacios repetidos: "Jalón al Pecho" = "jalon al pecho" */
    public static function norm(string $texto): string
    {
        $t = mb_strtolower(trim($texto), 'UTF-8');
        $t = strtr($t, ['á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u', 'ü' => 'u', 'ñ' => 'n', '×' => 'x']);
        return preg_replace('/\s+/', ' ', $t);
    }
}
