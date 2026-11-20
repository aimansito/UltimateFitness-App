<?php

namespace App\Controller;

use App\Entity\Usuario;
use Doctrine\DBAL\Connection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Progreso de fuerza: el usuario apunta las series (repeticiones y peso) que hace de cada
 * ejercicio y ve su evolución. Cada usuario solo ve y toca sus propios registros.
 */
#[Route('/api/progreso')]
class ProgresoController extends AbstractController
{
    private const MAX_SERIES = 20;

    public function __construct(private Connection $conn)
    {
    }

    // ============================================
    // GUARDAR LAS SERIES DE UN EJERCICIO EN UN DÍA
    // (si ya había registro ese día, se sustituye)
    // ============================================
    #[Route('/registros', name: 'progreso_guardar', methods: ['POST'])]
    public function guardar(Request $request): JsonResponse
    {
        $usuario = $this->getUser();
        if (!$usuario instanceof Usuario) {
            return $this->json(['success' => false, 'error' => 'Solo los usuarios pueden registrar su progreso'], Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true) ?: [];
        $ejercicioId = (int) ($data['ejercicioId'] ?? 0);
        $entrenamientoId = isset($data['entrenamientoId']) ? (int) $data['entrenamientoId'] : null;
        $series = $data['series'] ?? null;

        if (!$this->ejercicioVisible($ejercicioId, (int) $usuario->getId())) {
            return $this->json(['success' => false, 'error' => 'Ejercicio no encontrado'], Response::HTTP_NOT_FOUND);
        }
        if (!\is_array($series) || \count($series) === 0 || \count($series) > self::MAX_SERIES) {
            return $this->json(['success' => false, 'error' => 'Indica entre 1 y ' . self::MAX_SERIES . ' series'], Response::HTTP_BAD_REQUEST);
        }

        $fecha = $this->fechaValida($data['fecha'] ?? null);
        if ($fecha === null) {
            return $this->json(['success' => false, 'error' => 'Fecha no válida (no puede ser futura ni de hace más de un año)'], Response::HTTP_BAD_REQUEST);
        }

        $filas = [];
        foreach (array_values($series) as $i => $s) {
            $reps = (int) ($s['repeticiones'] ?? 0);
            $peso = isset($s['peso']) && $s['peso'] !== '' && $s['peso'] !== null ? (float) $s['peso'] : null;
            if ($reps < 1 || $reps > 200) {
                return $this->json(['success' => false, 'error' => 'Las repeticiones de cada serie deben estar entre 1 y 200'], Response::HTTP_BAD_REQUEST);
            }
            if ($peso !== null && ($peso < 0 || $peso > 1000)) {
                return $this->json(['success' => false, 'error' => 'El peso debe estar entre 0 y 1000 kg'], Response::HTTP_BAD_REQUEST);
            }
            $filas[] = [$i + 1, $reps, $peso !== null ? round($peso, 2) : null];
        }

        // La rutina solo se guarda si es del usuario (si no, se ignora)
        if ($entrenamientoId !== null && !$this->conn->fetchOne(
            'SELECT 1 FROM entrenamientos WHERE id = ? AND (creador_usuario_id = ? OR asignado_ausuario_id = ?)',
            [$entrenamientoId, $usuario->getId(), $usuario->getId()]
        )) {
            $entrenamientoId = null;
        }

        $this->conn->transactional(function (Connection $c) use ($usuario, $ejercicioId, $entrenamientoId, $fecha, $filas) {
            $c->executeStatement(
                'DELETE FROM registros_series WHERE usuario_id = ? AND ejercicio_id = ? AND fecha = ?',
                [$usuario->getId(), $ejercicioId, $fecha]
            );
            foreach ($filas as [$serie, $reps, $peso]) {
                $c->insert('registros_series', [
                    'usuario_id' => $usuario->getId(),
                    'ejercicio_id' => $ejercicioId,
                    'entrenamiento_id' => $entrenamientoId,
                    'fecha' => $fecha,
                    'serie' => $serie,
                    'repeticiones' => $reps,
                    'peso_kg' => $peso,
                ]);
            }
        });

        return $this->json(['success' => true] + $this->historial((int) $usuario->getId(), $ejercicioId));
    }

    // ============================================
    // HISTORIAL DE UN EJERCICIO
    // ============================================
    #[Route('/ejercicio/{id}', name: 'progreso_ejercicio', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function ejercicio(int $id): JsonResponse
    {
        $usuario = $this->getUser();
        if (!$usuario instanceof Usuario) {
            return $this->json(['success' => false, 'error' => 'No autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json(['success' => true] + $this->historial((int) $usuario->getId(), $id));
    }

    // ============================================
    // BORRAR UNA SESIÓN (todas las series de ese día)
    // ============================================
    #[Route('/ejercicio/{id}/{fecha}', name: 'progreso_borrar', requirements: ['id' => '\d+', 'fecha' => '\d{4}-\d{2}-\d{2}'], methods: ['DELETE'])]
    public function borrar(int $id, string $fecha): JsonResponse
    {
        $usuario = $this->getUser();
        if (!$usuario instanceof Usuario) {
            return $this->json(['success' => false, 'error' => 'No autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        $this->conn->executeStatement(
            'DELETE FROM registros_series WHERE usuario_id = ? AND ejercicio_id = ? AND fecha = ?',
            [$usuario->getId(), $id, $fecha]
        );

        return $this->json(['success' => true] + $this->historial((int) $usuario->getId(), $id));
    }

    // ============================================
    // RESUMEN: ejercicios con registros y su mejora
    // ============================================
    #[Route('/resumen', name: 'progreso_resumen', methods: ['GET'])]
    public function resumen(): JsonResponse
    {
        $usuario = $this->getUser();
        if (!$usuario instanceof Usuario) {
            return $this->json(['success' => false, 'error' => 'No autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        // Mejor serie (1RM estimado) de cada sesión, por ejercicio
        $filas = $this->conn->fetchAllAssociative(
            'SELECT r.ejercicio_id, e.nombre, e.grupo_muscular, r.fecha,
                    MAX(r.peso_kg) AS peso_max,
                    MAX(COALESCE(r.peso_kg, 0) * (1 + r.repeticiones / 30)) AS e1rm,
                    MAX(r.repeticiones) AS reps_max,
                    SUM(r.repeticiones * COALESCE(r.peso_kg, 0)) AS volumen
             FROM registros_series r
             JOIN ejercicios e ON e.id = r.ejercicio_id
             WHERE r.usuario_id = ?
             GROUP BY r.ejercicio_id, e.nombre, e.grupo_muscular, r.fecha
             ORDER BY r.fecha ASC',
            [$usuario->getId()]
        );

        $ejercicios = [];
        foreach ($filas as $f) {
            $id = (int) $f['ejercicio_id'];
            $ejercicios[$id] ??= [
                'ejercicioId' => $id,
                'nombre' => $f['nombre'],
                'grupoMuscular' => $f['grupo_muscular'],
                'sesiones' => 0,
                'evolucion' => [],
            ];
            $ejercicios[$id]['sesiones']++;
            $ejercicios[$id]['evolucion'][] = [
                'fecha' => $f['fecha'],
                'pesoMax' => $f['peso_max'] !== null ? (float) $f['peso_max'] : null,
                'e1rm' => round((float) $f['e1rm'], 1),
                'repsMax' => (int) $f['reps_max'],
            ];
        }

        $lista = array_map(function (array $e) {
            $primera = $e['evolucion'][0];
            $ultima = end($e['evolucion']);
            $e['ultimaFecha'] = $ultima['fecha'];
            $e['pesoActual'] = $ultima['pesoMax'];
            $e['mejorPeso'] = max(array_map(fn ($s) => (float) ($s['pesoMax'] ?? 0), $e['evolucion']));
            // Mejora del 1RM estimado entre la primera y la última sesión
            $e['mejora'] = $primera['e1rm'] > 0 && \count($e['evolucion']) > 1
                ? round(($ultima['e1rm'] - $primera['e1rm']) / $primera['e1rm'] * 100, 1)
                : null;
            $e['evolucion'] = \array_slice($e['evolucion'], -12);
            return $e;
        }, array_values($ejercicios));

        usort($lista, fn ($a, $b) => strcmp($b['ultimaFecha'], $a['ultimaFecha']));

        $totales = $this->conn->fetchAssociative(
            'SELECT COUNT(DISTINCT fecha) AS dias, COUNT(*) AS series, COALESCE(SUM(repeticiones * COALESCE(peso_kg, 0)), 0) AS volumen
             FROM registros_series WHERE usuario_id = ?',
            [$usuario->getId()]
        );

        return $this->json([
            'success' => true,
            'totales' => [
                'dias' => (int) $totales['dias'],
                'series' => (int) $totales['series'],
                'volumen' => (int) round((float) $totales['volumen']),
            ],
            'ejercicios' => $lista,
        ]);
    }

    // ============================================
    // RUTINAS DEL USUARIO CON SU ACTIVIDAD REGISTRADA
    // ============================================
    #[Route('/rutinas', name: 'progreso_rutinas', methods: ['GET'])]
    public function rutinas(): JsonResponse
    {
        $usuario = $this->getUser();
        if (!$usuario instanceof Usuario) {
            return $this->json(['success' => false, 'error' => 'No autenticado'], Response::HTTP_UNAUTHORIZED);
        }
        $uid = (int) $usuario->getId();

        $filas = $this->conn->fetchAllAssociative(
            'SELECT e.id, e.nombre,
                    COUNT(DISTINCT r.fecha) AS sesiones,
                    MAX(r.fecha) AS ultima,
                    COALESCE(SUM(r.repeticiones * COALESCE(r.peso_kg, 0)), 0) AS volumen
             FROM entrenamientos e
             LEFT JOIN registros_series r ON r.entrenamiento_id = e.id AND r.usuario_id = ?
             WHERE e.creador_usuario_id = ? OR e.asignado_ausuario_id = ?
             GROUP BY e.id, e.nombre',
            [$uid, $uid, $uid]
        );

        $lista = array_map(fn (array $f) => [
            'id' => (int) $f['id'],
            'nombre' => $f['nombre'],
            'sesiones' => (int) $f['sesiones'],
            'ultima' => $f['ultima'],
            'volumen' => (int) round((float) $f['volumen']),
        ], $filas);
        // Primero las que tienen actividad reciente
        usort($lista, fn ($a, $b) => strcmp((string) $b['ultima'], (string) $a['ultima']) ?: $b['id'] <=> $a['id']);

        return $this->json(['success' => true, 'rutinas' => $lista]);
    }

    // ============================================
    // PROGRESO DE UNA RUTINA: semanas, ejercicios y últimas series
    // ============================================
    #[Route('/rutina/{id}', name: 'progreso_rutina', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function rutina(int $id): JsonResponse
    {
        $usuario = $this->getUser();
        if (!$usuario instanceof Usuario) {
            return $this->json(['success' => false, 'error' => 'No autenticado'], Response::HTTP_UNAUTHORIZED);
        }
        $uid = (int) $usuario->getId();

        $nombre = $this->conn->fetchOne(
            'SELECT nombre FROM entrenamientos WHERE id = ? AND (creador_usuario_id = ? OR asignado_ausuario_id = ?)',
            [$id, $uid, $uid]
        );
        if ($nombre === false) {
            return $this->json(['success' => false, 'error' => 'Rutina no encontrada'], Response::HTTP_NOT_FOUND);
        }

        // Ejercicios que forman la rutina (un ejercicio puede estar en varios días)
        $plan = $this->conn->fetchAllAssociative(
            'SELECT dej.ejercicio_id, ej.nombre, ej.grupo_muscular, de.dia_semana, de.concepto, dej.series, dej.repeticiones
             FROM dias_entrenamiento de
             JOIN dias_ejercicios dej ON dej.dia_entrenamiento_id = de.id
             JOIN ejercicios ej ON ej.id = dej.ejercicio_id
             WHERE de.entrenamiento_id = ? AND de.es_descanso = 0
             ORDER BY de.dia_semana ASC, dej.orden ASC',
            [$id]
        );

        $registros = $this->conn->fetchAllAssociative(
            'SELECT ejercicio_id, fecha, serie, repeticiones, peso_kg FROM registros_series
             WHERE usuario_id = ? AND entrenamiento_id = ? AND fecha >= ?
             ORDER BY fecha ASC, serie ASC',
            [$uid, $id, (new \DateTimeImmutable('today'))->modify('-1 year')->format('Y-m-d')]
        );

        // Sesiones por ejercicio y fecha
        $sesiones = [];
        $semanas = [];
        $fechas = [];
        $totalSeries = 0;
        $totalVolumen = 0.0;
        foreach ($registros as $r) {
            $ej = (int) $r['ejercicio_id'];
            $fecha = $r['fecha'];
            $reps = (int) $r['repeticiones'];
            $peso = $r['peso_kg'] !== null ? (float) $r['peso_kg'] : null;
            $vol = $peso !== null ? $reps * $peso : 0;

            $sesiones[$ej][$fecha] ??= ['fecha' => $fecha, 'series' => [], 'pesoMax' => null, 'volumen' => 0, 'e1rm' => 0];
            $s = &$sesiones[$ej][$fecha];
            $s['series'][] = ['repeticiones' => $reps, 'peso' => $peso];
            $s['volumen'] += $vol;
            if ($peso !== null) {
                $s['pesoMax'] = max($s['pesoMax'] ?? 0, $peso);
                $s['e1rm'] = max($s['e1rm'], round($peso * (1 + $reps / 30), 1));
            }
            unset($s);

            // Semana ISO (lunes) para la gráfica semanal
            $lunes = (new \DateTimeImmutable($fecha))->modify('monday this week')->format('Y-m-d');
            $semanas[$lunes] ??= ['semana' => $lunes, 'volumen' => 0, 'series' => 0, 'dias' => []];
            $semanas[$lunes]['volumen'] += $vol;
            $semanas[$lunes]['series']++;
            $semanas[$lunes]['dias'][$fecha] = true;

            $fechas[$fecha] = true;
            $totalSeries++;
            $totalVolumen += $vol;
        }

        $ejercicios = [];
        foreach ($plan as $p) {
            $ej = (int) $p['ejercicio_id'];
            if (isset($ejercicios[$ej])) {
                if (!\in_array((int) $p['dia_semana'], $ejercicios[$ej]['dias'], true)) {
                    $ejercicios[$ej]['dias'][] = (int) $p['dia_semana'];
                }
                continue;
            }
            $lista = array_values($sesiones[$ej] ?? []);
            $primera = $lista[0] ?? null;
            $ultima = $lista ? end($lista) : null;
            $ejercicios[$ej] = [
                'ejercicioId' => $ej,
                'nombre' => $p['nombre'],
                'grupoMuscular' => $p['grupo_muscular'],
                'dias' => [(int) $p['dia_semana']],
                'plan' => ['series' => (int) $p['series'], 'repeticiones' => (int) $p['repeticiones']],
                'sesiones' => \count($lista),
                'ultima' => $ultima,
                'mejorPeso' => $lista ? max(array_map(fn ($x) => (float) ($x['pesoMax'] ?? 0), $lista)) : null,
                'mejora' => $primera && $ultima && \count($lista) > 1 && $primera['e1rm'] > 0
                    ? round(($ultima['e1rm'] - $primera['e1rm']) / $primera['e1rm'] * 100, 1)
                    : null,
                'evolucion' => array_map(fn ($x) => [
                    'fecha' => $x['fecha'],
                    'pesoMax' => $x['pesoMax'],
                    'e1rm' => $x['e1rm'],
                    'volumen' => (int) round($x['volumen']),
                ], \array_slice($lista, -12)),
            ];
        }

        $semanas = array_map(fn ($s) => [
            'semana' => $s['semana'],
            'volumen' => (int) round($s['volumen']),
            'series' => $s['series'],
            'dias' => \count($s['dias']),
        ], \array_slice(array_values($semanas), -12));

        return $this->json([
            'success' => true,
            'rutina' => ['id' => $id, 'nombre' => $nombre],
            'totales' => [
                'sesiones' => \count($fechas),
                'series' => $totalSeries,
                'volumen' => (int) round($totalVolumen),
            ],
            'semanas' => $semanas,
            'ejercicios' => array_values($ejercicios),
        ]);
    }

    // ============================================
    // HELPERS
    // ============================================

    /** Sesiones de un ejercicio (más recientes primero) y sus récords */
    private function historial(int $usuarioId, int $ejercicioId): array
    {
        $filas = $this->conn->fetchAllAssociative(
            'SELECT fecha, serie, repeticiones, peso_kg FROM registros_series
             WHERE usuario_id = ? AND ejercicio_id = ?
             ORDER BY fecha DESC, serie ASC',
            [$usuarioId, $ejercicioId]
        );

        $sesiones = [];
        foreach ($filas as $f) {
            $fecha = $f['fecha'];
            $peso = $f['peso_kg'] !== null ? (float) $f['peso_kg'] : null;
            $reps = (int) $f['repeticiones'];
            $sesiones[$fecha] ??= ['fecha' => $fecha, 'series' => [], 'pesoMax' => null, 'volumen' => 0, 'e1rm' => 0];
            $sesiones[$fecha]['series'][] = ['serie' => (int) $f['serie'], 'repeticiones' => $reps, 'peso' => $peso];
            if ($peso !== null) {
                $sesiones[$fecha]['pesoMax'] = max($sesiones[$fecha]['pesoMax'] ?? 0, $peso);
                $sesiones[$fecha]['volumen'] += $reps * $peso;
                // 1RM estimado (Epley)
                $sesiones[$fecha]['e1rm'] = max($sesiones[$fecha]['e1rm'], round($peso * (1 + $reps / 30), 1));
            }
        }
        $sesiones = \array_slice(array_values($sesiones), 0, 60);

        $record = null;
        foreach ($sesiones as $s) {
            if ($s['pesoMax'] !== null && ($record === null || $s['pesoMax'] > $record['peso'])) {
                $record = ['peso' => $s['pesoMax'], 'fecha' => $s['fecha']];
            }
        }

        return [
            'sesiones' => $sesiones,
            'record' => $record,
            'mejor1rm' => $sesiones ? max(array_column($sesiones, 'e1rm')) : null,
        ];
    }

    private function ejercicioVisible(int $id, int $usuarioId): bool
    {
        return $id > 0 && (bool) $this->conn->fetchOne(
            'SELECT 1 FROM ejercicios WHERE id = ? AND (creador_usuario_id IS NULL OR creador_usuario_id = ?)',
            [$id, $usuarioId]
        );
    }

    /** Fecha Y-m-d entre hace un año y hoy; por defecto, hoy */
    private function fechaValida(?string $valor): ?string
    {
        $hoy = new \DateTimeImmutable('today');
        if ($valor === null || $valor === '') {
            return $hoy->format('Y-m-d');
        }
        $fecha = \DateTimeImmutable::createFromFormat('!Y-m-d', $valor);
        if (!$fecha || $fecha->format('Y-m-d') !== $valor || $fecha > $hoy || $fecha < $hoy->modify('-1 year')) {
            return null;
        }
        return $fecha->format('Y-m-d');
    }
}
