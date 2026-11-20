<?php

namespace App\Controller;

use App\Service\AvatarStorage;
use App\Service\VisibilidadService;
use Doctrine\DBAL\Connection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Seguimientos, guardados, copias y feed del entreno diario.
 * La identidad sale siempre de getUser(); toda visibilidad pasa por VisibilidadService.
 */
#[Route('/api/social')]
class SocialController extends AbstractController
{
    private const POR_PAGINA = 20;
    private const REQ_CUENTA = ['tipo' => 'usuario|entrenador', 'id' => '\d+'];
    private const REQ_ITEM = ['itemTipo' => 'entrenamiento|dieta|plato|ejercicio', 'id' => '\d+'];
    private const DIAS = [1 => 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

    public function __construct(
        private VisibilidadService $visibilidad,
        private Connection $conn,
        private AvatarStorage $imagenes
    ) {
    }

    /** Ejercicios guardados al completar un entreno (copia, por si la rutina cambia después) */
    private static function ejerciciosHechos(?string $json): array
    {
        $lista = $json ? json_decode($json, true) : null;
        return \is_array($lista) ? array_values($lista) : [];
    }

    // ============================================
    // SEGUIR / DEJAR DE SEGUIR (idempotentes)
    // ============================================
    #[Route('/seguir/{tipo}/{id}', name: 'social_seguir', requirements: self::REQ_CUENTA, methods: ['POST'])]
    public function seguir(string $tipo, int $id): JsonResponse
    {
        $actor = $this->visibilidad->actor($this->getUser());
        if ($actor === null) {
            return $this->noAutenticado();
        }
        if ($this->visibilidad->esDueno($actor, $tipo, $id)) {
            return $this->json(['success' => false, 'error' => 'No puedes seguirte a ti mismo'], Response::HTTP_BAD_REQUEST);
        }

        $cuenta = $this->visibilidad->cuenta($tipo, $id);
        if ($cuenta === null) {
            return $this->json(['success' => false, 'error' => 'Perfil no encontrado'], Response::HTTP_NOT_FOUND);
        }
        if (!$cuenta['perfil_publico'] && !$actor['admin']) {
            return $this->json(['success' => false, 'error' => 'Este perfil es privado'], Response::HTTP_FORBIDDEN);
        }

        $this->conn->executeStatement(
            'INSERT IGNORE INTO seguimientos (seguidor_tipo, seguidor_id, seguido_tipo, seguido_id) VALUES (?, ?, ?, ?)',
            [$actor['tipo'], $actor['id'], $tipo, $id]
        );

        return $this->json(['success' => true, 'loSigo' => true] + $this->visibilidad->contadores($tipo, $id));
    }

    #[Route('/seguir/{tipo}/{id}', name: 'social_dejar_de_seguir', requirements: self::REQ_CUENTA, methods: ['DELETE'])]
    public function dejarDeSeguir(string $tipo, int $id): JsonResponse
    {
        $actor = $this->visibilidad->actor($this->getUser());
        if ($actor === null) {
            return $this->noAutenticado();
        }

        $this->conn->executeStatement(
            'DELETE FROM seguimientos WHERE seguidor_tipo = ? AND seguidor_id = ? AND seguido_tipo = ? AND seguido_id = ?',
            [$actor['tipo'], $actor['id'], $tipo, $id]
        );

        return $this->json(['success' => true, 'loSigo' => false] + $this->visibilidad->contadores($tipo, $id));
    }

    // ============================================
    // LISTAS DE SEGUIDORES / SEGUIDOS (accesibles sin sesión)
    // ============================================
    #[Route('/seguidores/{tipo}/{id}', name: 'social_seguidores', requirements: self::REQ_CUENTA, methods: ['GET'])]
    public function seguidores(string $tipo, int $id, Request $request): JsonResponse
    {
        return $this->listaSeguimientos($tipo, $id, $request, true);
    }

    #[Route('/seguidos/{tipo}/{id}', name: 'social_seguidos', requirements: self::REQ_CUENTA, methods: ['GET'])]
    public function seguidos(string $tipo, int $id, Request $request): JsonResponse
    {
        return $this->listaSeguimientos($tipo, $id, $request, false);
    }

    private function listaSeguimientos(string $tipo, int $id, Request $request, bool $seguidores): JsonResponse
    {
        $cuenta = $this->visibilidad->cuenta($tipo, $id);
        if ($cuenta === null) {
            return $this->json(['success' => false, 'error' => 'Perfil no encontrado'], Response::HTTP_NOT_FOUND);
        }

        $actor = $this->visibilidad->actor($this->getUser());
        $verTodo = $this->visibilidad->esDueno($actor, $tipo, $id) || ($actor['admin'] ?? false);
        if (!$cuenta['perfil_publico'] && !$verTodo) {
            return $this->json(['success' => false, 'error' => 'Este perfil es privado'], Response::HTTP_FORBIDDEN);
        }

        $pagina = max(1, $request->query->getInt('pagina', 1));
        [$mio, $otro] = $seguidores ? ['seguido', 'seguidor'] : ['seguidor', 'seguido'];

        // Se pide una fila de más para saber si hay otra página
        $filas = $this->conn->fetchAllAssociative(
            "SELECT {$otro}_tipo AS tipo, {$otro}_id AS id FROM seguimientos
             WHERE {$mio}_tipo = ? AND {$mio}_id = ?
             ORDER BY fecha_creacion DESC, id DESC
             LIMIT " . (self::POR_PAGINA + 1) . ' OFFSET ' . (($pagina - 1) * self::POR_PAGINA),
            [$tipo, $id]
        );
        $hayMas = count($filas) > self::POR_PAGINA;
        $filas = array_slice($filas, 0, self::POR_PAGINA);

        $cuentas = [];
        foreach ($filas as $f) {
            $c = $this->visibilidad->cuenta($f['tipo'], (int) $f['id']);
            if ($c === null) {
                continue;
            }
            $cuentas[] = [
                'tipo' => $c['tipo'],
                'id' => $c['id'],
                'nombre' => trim($c['nombre'] . ' ' . $c['apellidos']),
                'fotoUrl' => $c['foto_url'],
                'loSigo' => $this->visibilidad->sigue($actor, $c['tipo'], $c['id']),
                'esMio' => $this->visibilidad->esDueno($actor, $c['tipo'], $c['id']),
            ];
        }

        return $this->json(['success' => true, 'pagina' => $pagina, 'hayMas' => $hayMas, 'cuentas' => $cuentas]);
    }

    // ============================================
    // GUARDADOS (favoritos)
    // ============================================
    #[Route('/guardados', name: 'social_guardados', methods: ['GET'])]
    public function guardados(): JsonResponse
    {
        $actor = $this->visibilidad->actor($this->getUser());
        if ($actor === null) {
            return $this->noAutenticado();
        }

        $cuenta = $this->visibilidad->cuenta($actor['tipo'], $actor['id']);
        $items = $cuenta ? $this->visibilidad->favoritosDe($cuenta, $actor) : [];

        return $this->json([
            'success' => true,
            'items' => array_map(fn (array $i) => $i + ['guardado' => true], $items),
        ]);
    }

    #[Route('/guardados/{itemTipo}/{id}', name: 'social_guardar', requirements: self::REQ_ITEM, methods: ['POST'])]
    public function guardar(string $itemTipo, int $id): JsonResponse
    {
        $actor = $this->visibilidad->actor($this->getUser());
        if ($actor === null) {
            return $this->noAutenticado();
        }
        if ($this->visibilidad->itemVisible($actor, $itemTipo, $id) === null) {
            return $this->noEncontrado();
        }

        $this->conn->executeStatement(
            'INSERT IGNORE INTO guardados (propietario_tipo, propietario_id, item_tipo, item_id) VALUES (?, ?, ?, ?)',
            [$actor['tipo'], $actor['id'], $itemTipo, $id]
        );

        return $this->json(['success' => true, 'guardado' => true]);
    }

    #[Route('/guardados/{itemTipo}/{id}', name: 'social_quitar_guardado', requirements: self::REQ_ITEM, methods: ['DELETE'])]
    public function quitarGuardado(string $itemTipo, int $id): JsonResponse
    {
        $actor = $this->visibilidad->actor($this->getUser());
        if ($actor === null) {
            return $this->noAutenticado();
        }

        $this->conn->executeStatement(
            'DELETE FROM guardados WHERE propietario_tipo = ? AND propietario_id = ? AND item_tipo = ? AND item_id = ?',
            [$actor['tipo'], $actor['id'], $itemTipo, $id]
        );

        return $this->json(['success' => true, 'guardado' => false]);
    }

    // ============================================
    // COPIAR A MI BIBLIOTECA
    // ============================================
    #[Route('/clonar/{itemTipo}/{id}', name: 'social_clonar', requirements: ['itemTipo' => 'entrenamiento|dieta', 'id' => '\d+'], methods: ['POST'])]
    public function clonar(string $itemTipo, int $id): JsonResponse
    {
        $actor = $this->visibilidad->actor($this->getUser());
        if ($actor === null) {
            return $this->noAutenticado();
        }
        if ($this->visibilidad->itemVisible($actor, $itemTipo, $id) === null) {
            return $this->noEncontrado();
        }

        $esUsuario = $actor['tipo'] === 'usuario';
        $this->conn->beginTransaction();
        try {
            if ($itemTipo === 'entrenamiento') {
                $this->conn->executeStatement(
                    'INSERT INTO entrenamientos
                        (creador_id, creador_usuario_id, nombre, descripcion, tipo, duracion_minutos,
                         nivel_dificultad, es_publico, clonado_de_id)
                     SELECT ?, ?, nombre, descripcion, tipo, duracion_minutos, nivel_dificultad, 0, id
                     FROM entrenamientos WHERE id = ?',
                    [$esUsuario ? null : $actor['id'], $esUsuario ? $actor['id'] : null, $id]
                );
                $nuevoId = (int) $this->conn->lastInsertId();

                $this->conn->executeStatement(
                    'INSERT INTO entrenamiento_ejercicios
                        (entrenamiento_id, ejercicio_id, orden, series, repeticiones, descanso_segundos, notas)
                     SELECT ?, ejercicio_id, orden, series, repeticiones, descanso_segundos, notas
                     FROM entrenamiento_ejercicios WHERE entrenamiento_id = ?',
                    [$nuevoId, $id]
                );

                $dias = $this->conn->fetchAllAssociative(
                    'SELECT id, dia_semana, concepto, es_descanso, orden FROM dias_entrenamiento WHERE entrenamiento_id = ?',
                    [$id]
                );
                foreach ($dias as $dia) {
                    $this->conn->executeStatement(
                        'INSERT INTO dias_entrenamiento (entrenamiento_id, dia_semana, concepto, es_descanso, orden)
                         VALUES (?, ?, ?, ?, ?)',
                        [$nuevoId, $dia['dia_semana'], $dia['concepto'], $dia['es_descanso'], $dia['orden']]
                    );
                    $this->conn->executeStatement(
                        'INSERT INTO dias_ejercicios
                            (dia_entrenamiento_id, ejercicio_id, series, repeticiones, descanso_segundos, notas, orden)
                         SELECT ?, ejercicio_id, series, repeticiones, descanso_segundos, notas, orden
                         FROM dias_ejercicios WHERE dia_entrenamiento_id = ?',
                        [(int) $this->conn->lastInsertId(), $dia['id']]
                    );
                }
            } else {
                $this->conn->executeStatement(
                    'INSERT INTO dietas
                        (creador_id, asignado_a_usuario_id, nombre, descripcion, calorias_totales, proteinas_totales,
                         carbohidratos_totales, grasas_totales, es_publica, clonado_de_id)
                     SELECT ?, ?, nombre, descripcion, calorias_totales, proteinas_totales,
                            carbohidratos_totales, grasas_totales, 0, id
                     FROM dietas WHERE id = ?',
                    [$esUsuario ? null : $actor['id'], $esUsuario ? $actor['id'] : null, $id]
                );
                $nuevoId = (int) $this->conn->lastInsertId();

                $this->conn->executeStatement(
                    'INSERT INTO dieta_platos (dieta_id, plato_id, dia_semana, tipo_comida, orden, notas)
                     SELECT ?, plato_id, dia_semana, tipo_comida, orden, notas
                     FROM dieta_platos WHERE dieta_id = ?',
                    [$nuevoId, $id]
                );
            }
            $this->conn->commit();
        } catch (\Throwable) {
            $this->conn->rollBack();
            return $this->json(['success' => false, 'error' => 'No se pudo copiar el contenido'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json(['success' => true, 'itemTipo' => $itemTipo, 'id' => $nuevoId], Response::HTTP_CREATED);
    }

    // ============================================
    // PUBLICAR / OCULTAR UN ÍTEM PROPIO
    // ============================================
    #[Route('/visibilidad/{itemTipo}/{id}', name: 'social_visibilidad', requirements: ['itemTipo' => 'entrenamiento|dieta', 'id' => '\d+'], methods: ['PATCH'])]
    public function visibilidadItem(string $itemTipo, int $id, Request $request): JsonResponse
    {
        $actor = $this->visibilidad->actor($this->getUser());
        if ($actor === null) {
            return $this->noAutenticado();
        }

        $data = json_decode($request->getContent(), true);
        if (!is_array($data) || !is_bool($data['publico'] ?? null)) {
            return $this->json(['success' => false, 'error' => 'publico debe ser verdadero o falso'], Response::HTTP_BAD_REQUEST);
        }

        // Solo el autor: la condición de propiedad va en el propio UPDATE
        if ($itemTipo === 'entrenamiento') {
            $sql = $actor['tipo'] === 'usuario'
                ? 'UPDATE entrenamientos SET es_publico = ? WHERE id = ? AND creador_usuario_id = ?'
                : 'UPDATE entrenamientos SET es_publico = ? WHERE id = ? AND creador_id = ? AND creador_usuario_id IS NULL';
            $existe = $actor['tipo'] === 'usuario'
                ? 'SELECT 1 FROM entrenamientos WHERE id = ? AND creador_usuario_id = ?'
                : 'SELECT 1 FROM entrenamientos WHERE id = ? AND creador_id = ? AND creador_usuario_id IS NULL';
        } else {
            $sql = $actor['tipo'] === 'usuario'
                ? 'UPDATE dietas SET es_publica = ? WHERE id = ? AND creador_id IS NULL AND asignado_a_usuario_id = ?'
                : 'UPDATE dietas SET es_publica = ? WHERE id = ? AND creador_id = ?';
            $existe = $actor['tipo'] === 'usuario'
                ? 'SELECT 1 FROM dietas WHERE id = ? AND creador_id IS NULL AND asignado_a_usuario_id = ?'
                : 'SELECT 1 FROM dietas WHERE id = ? AND creador_id = ?';
        }

        if (!$this->conn->fetchOne($existe, [$id, $actor['id']])) {
            return $this->noEncontrado();
        }
        $this->conn->executeStatement($sql, [$data['publico'] ? 1 : 0, $id, $actor['id']]);

        return $this->json(['success' => true, 'publico' => $data['publico']]);
    }

    // ============================================
    // ENTRENO DE HOY (calendario del usuario)
    // ============================================
    #[Route('/entreno-hoy', name: 'social_entreno_hoy', methods: ['GET'])]
    public function entrenoHoy(): JsonResponse
    {
        $actor = $this->visibilidad->actor($this->getUser());
        if ($actor === null || $actor['tipo'] !== 'usuario') {
            return $this->json(['success' => true, 'hoy' => [], 'rutinas' => []]);
        }

        $hoy = $this->conn->fetchAllAssociative(
            'SELECT cu.id, cu.completado, cu.compartido_en_feed, cu.fecha_completado,
                    cu.foto_url, cu.foto_es_tarjeta, cu.duracion_minutos AS duracion_real, cu.dia_hecho, cu.ejercicios_hechos,
                    e.id AS entrenamiento_id, e.nombre, e.tipo, e.duracion_minutos
             FROM calendario_usuario cu
             INNER JOIN entrenamientos e ON e.id = cu.entrenamiento_id
             WHERE cu.usuario_id = ? AND (cu.dia_semana = ? OR DATE(cu.fecha_completado) = CURDATE())
             ORDER BY cu.completado DESC, cu.id DESC',
            [$actor['id'], self::DIAS[(int) date('N')]]
        );

        $rutinas = $this->conn->fetchAllAssociative(
            'SELECT id, nombre FROM entrenamientos
             WHERE creador_usuario_id = :id OR asignado_ausuario_id = :id
             ORDER BY fecha_creacion DESC LIMIT 60',
            ['id' => $actor['id']]
        );

        return $this->json([
            'success' => true,
            'hoy' => array_map(fn (array $f) => [
                'id' => (int) $f['id'],
                'completadoHoy' => (bool) $f['completado'] && $f['fecha_completado'] !== null
                    && substr($f['fecha_completado'], 0, 10) === date('Y-m-d'),
                'compartido' => (bool) $f['compartido_en_feed'],
                'hora' => $f['fecha_completado'] ? substr((string) $f['fecha_completado'], 11, 5) : null,
                'fotoUrl' => $f['foto_url'],
                'fotoEsTarjeta' => (bool) $f['foto_es_tarjeta'],
                'duracionReal' => $f['duracion_real'] !== null ? (int) $f['duracion_real'] : null,
                'diaHecho' => $f['dia_hecho'],
                'ejercicios' => self::ejerciciosHechos($f['ejercicios_hechos']),
                'entrenamiento' => [
                    'id' => (int) $f['entrenamiento_id'],
                    'nombre' => $f['nombre'],
                    'tipo' => $f['tipo'],
                    'duracionMinutos' => $f['duracion_minutos'] !== null ? (int) $f['duracion_minutos'] : null,
                ],
            ], $hoy),
            'rutinas' => array_map(fn (array $f) => ['id' => (int) $f['id'], 'nombre' => $f['nombre']], $rutinas),
        ]);
    }

    /** Marca un entrenamiento como hecho hoy y decide si sale en el feed. */
    #[Route('/entreno-hoy', name: 'social_entreno_hoy_guardar', methods: ['POST'])]
    public function completarEntrenoHoy(Request $request): JsonResponse
    {
        $actor = $this->visibilidad->actor($this->getUser());
        if ($actor === null) {
            return $this->noAutenticado();
        }
        if ($actor['tipo'] !== 'usuario') {
            return $this->json(['success' => false, 'error' => 'Solo disponible para cuentas de usuario'], Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true);
        $entrenamientoId = is_array($data) ? (int) ($data['entrenamientoId'] ?? 0) : 0;
        $compartir = is_array($data) && ($data['compartir'] ?? false) === true;
        // Minutos reales medidos por el cronómetro de la sesión (opcional)
        $duracion = is_array($data) && isset($data['duracionMinutos']) ? (int) $data['duracionMinutos'] : null;
        if ($duracion !== null && ($duracion < 1 || $duracion > 600)) {
            $duracion = null;
        }

        if ($entrenamientoId < 1 || $this->visibilidad->itemVisible($actor, 'entrenamiento', $entrenamientoId) === null) {
            return $this->noEncontrado();
        }

        // Día de la rutina y ejercicios marcados: solo se aceptan los que pertenecen a esa rutina
        $diaHecho = null;
        $ejercicios = null;
        if (is_array($data) && array_key_exists('ejercicios', $data)) {
            $plan = $this->planRutina($entrenamientoId);
            $diaId = isset($data['diaId']) ? (int) $data['diaId'] : null;
            $dia = null;
            foreach ($plan as $d) {
                if ($d['id'] === $diaId || ($diaId === null && \count($plan) === 1)) {
                    $dia = $d;
                    break;
                }
            }
            $marcados = array_map('intval', is_array($data['ejercicios']) ? $data['ejercicios'] : []);
            $disponibles = $dia ? $dia['ejercicios'] : array_merge(...array_column($plan, 'ejercicios') ?: [[]]);
            $ejercicios = array_values(array_filter($disponibles, fn ($e) => \in_array($e['id'], $marcados, true)));
            $diaHecho = $dia ? mb_substr((string) $dia['nombre'], 0, 100) : null;
        }

        $dia = self::DIAS[(int) date('N')];
        $filaId = $this->conn->fetchOne(
            'SELECT id FROM calendario_usuario
             WHERE usuario_id = ? AND entrenamiento_id = ? AND (dia_semana = ? OR DATE(fecha_completado) = CURDATE())
             ORDER BY id DESC LIMIT 1',
            [$actor['id'], $entrenamientoId, $dia]
        );

        $json = $ejercicios !== null ? json_encode($ejercicios, JSON_UNESCAPED_UNICODE) : null;

        if ($filaId) {
            // Cambiar solo el interruptor de compartir no debe borrar los ejercicios ya guardados
            $this->conn->executeStatement(
                'UPDATE calendario_usuario
                 SET completado = 1, fecha_completado = COALESCE(fecha_completado, NOW()), compartido_en_feed = ?,
                     dia_hecho = IF(?, ?, dia_hecho), ejercicios_hechos = IF(?, ?, ejercicios_hechos),
                     duracion_minutos = COALESCE(?, duracion_minutos)
                 WHERE id = ? AND usuario_id = ?',
                [$compartir ? 1 : 0, $json !== null, $diaHecho, $json !== null, $json, $duracion, $filaId, $actor['id']]
            );
        } else {
            $this->conn->executeStatement(
                'INSERT INTO calendario_usuario
                    (usuario_id, entrenamiento_id, dia_semana, completado, fecha_asignacion, fecha_completado,
                     compartido_en_feed, dia_hecho, ejercicios_hechos, duracion_minutos)
                 VALUES (?, ?, ?, 1, CURDATE(), NOW(), ?, ?, ?, ?)',
                [$actor['id'], $entrenamientoId, $dia, $compartir ? 1 : 0, $diaHecho, $json, $duracion]
            );
            $filaId = $this->conn->lastInsertId();
        }

        return $this->json(['success' => true, 'id' => (int) $filaId, 'compartido' => $compartir]);
    }

    /** Días y ejercicios de una rutina visible para quien pregunta, para marcar lo que ha hecho */
    #[Route('/entreno-hoy/rutina/{id}', name: 'social_entreno_hoy_rutina', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function rutinaParaMarcar(int $id): JsonResponse
    {
        $actor = $this->visibilidad->actor($this->getUser());
        if ($actor === null) {
            return $this->noAutenticado();
        }
        $rutina = $this->visibilidad->itemVisible($actor, 'entrenamiento', $id);
        if ($rutina === null) {
            return $this->noEncontrado();
        }
        $info = $this->conn->fetchAssociative('SELECT nombre, duracion_minutos, nivel_dificultad FROM entrenamientos WHERE id = ?', [$id]);

        $plan = $this->planRutina($id);
        $hoy = (int) date('N');
        $diaSugerido = null;
        // Hoy si toca entrenar según la rutina; si no, el primer día con ejercicios
        foreach ($plan as $d) {
            if ($d['diaSemana'] === $hoy && !$d['descanso'] && $d['ejercicios']) {
                $diaSugerido = $d['id'];
            }
        }
        foreach ($plan as $d) {
            if ($diaSugerido === null && $d['ejercicios']) {
                $diaSugerido = $d['id'];
            }
        }

        return $this->json([
            'success' => true,
            'rutina' => [
                'id' => $id,
                'nombre' => $info['nombre'] ?? '',
                'duracionMinutos' => isset($info['duracion_minutos']) ? (int) $info['duracion_minutos'] : null,
                'nivel' => $info['nivel_dificultad'] ?? null,
            ],
            'dias' => $plan,
            'diaSugerido' => $diaSugerido ?? ($plan[0]['id'] ?? null),
        ]);
    }

    /**
     * Plan de una rutina: días con sus ejercicios. Las rutinas antiguas sin días guardan
     * los ejercicios directamente en entrenamiento_ejercicios: se devuelven como un único día.
     *
     * @return list<array{id:int|null, nombre:string, diaSemana:int|null, descanso:bool, ejercicios:list<array>}>
     */
    private function planRutina(int $entrenamientoId): array
    {
        $filas = $this->conn->fetchAllAssociative(
            'SELECT de.id AS dia_id, de.dia_semana, de.concepto, de.es_descanso, de.orden AS dia_orden,
                    ej.id AS ejercicio_id, ej.nombre, ej.grupo_muscular, dx.series, dx.repeticiones
             FROM dias_entrenamiento de
             LEFT JOIN dias_ejercicios dx ON dx.dia_entrenamiento_id = de.id
             LEFT JOIN ejercicios ej ON ej.id = dx.ejercicio_id
             WHERE de.entrenamiento_id = ?
             ORDER BY de.orden, de.dia_semana, dx.orden',
            [$entrenamientoId]
        );

        $dias = [];
        foreach ($filas as $f) {
            $diaId = (int) $f['dia_id'];
            if (!isset($dias[$diaId])) {
                $num = $f['dia_semana'] !== null ? (int) $f['dia_semana'] : null;
                $nombres = [1 => 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
                $nombreDia = $nombres[$num] ?? 'Día';
                $dias[$diaId] = [
                    'id' => $diaId,
                    'nombre' => trim($nombreDia . ($f['concepto'] ? ' · ' . $f['concepto'] : '')),
                    'diaSemana' => $num,
                    'descanso' => (bool) $f['es_descanso'],
                    'ejercicios' => [],
                ];
            }
            if ($f['ejercicio_id'] !== null) {
                $dias[$diaId]['ejercicios'][] = self::ejercicio($f);
            }
        }
        if ($dias) {
            return array_values($dias);
        }

        $ejercicios = $this->conn->fetchAllAssociative(
            'SELECT ej.id AS ejercicio_id, ej.nombre, ej.grupo_muscular, ee.series, ee.repeticiones
             FROM entrenamiento_ejercicios ee
             INNER JOIN ejercicios ej ON ej.id = ee.ejercicio_id
             WHERE ee.entrenamiento_id = ?
             ORDER BY ee.orden',
            [$entrenamientoId]
        );

        return $ejercicios ? [[
            'id' => null,
            'nombre' => 'Rutina completa',
            'diaSemana' => null,
            'descanso' => false,
            'ejercicios' => array_map([self::class, 'ejercicio'], $ejercicios),
        ]] : [];
    }

    private static function ejercicio(array $f): array
    {
        return [
            'id' => (int) $f['ejercicio_id'],
            'nombre' => $f['nombre'],
            'grupo' => $f['grupo_muscular'],
            'series' => $f['series'] !== null ? (int) $f['series'] : null,
            'repeticiones' => $f['repeticiones'],
        ];
    }

    /** Foto del entreno (estilo Strava). Solo la persona que lo hizo; sustituye la anterior. */
    #[Route('/entreno-hoy/{id}/foto', name: 'social_entreno_hoy_foto', requirements: ['id' => '\d+'], methods: ['POST'])]
    public function subirFotoEntreno(int $id, Request $request): JsonResponse
    {
        $actor = $this->visibilidad->actor($this->getUser());
        if ($actor === null || $actor['tipo'] !== 'usuario') {
            return $this->noAutenticado();
        }
        $anterior = $this->conn->fetchAssociative(
            'SELECT foto_url FROM calendario_usuario WHERE id = ? AND usuario_id = ? AND completado = 1',
            [$id, $actor['id']]
        );
        if ($anterior === false) {
            return $this->noEncontrado();
        }
        $archivo = $request->files->get('foto');
        if (!$archivo) {
            return $this->json(['success' => false, 'error' => 'No se recibió ninguna foto (máximo 4 MB)'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $url = $this->imagenes->guardarFotoEntreno($archivo);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['success' => false, 'error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }

        // tarjeta=1: la imagen ya lleva el diseño (logo, figura, tiempo); el feed la muestra tal cual
        $tarjeta = $request->request->get('tarjeta') === '1';
        $this->conn->executeStatement(
            'UPDATE calendario_usuario SET foto_url = ?, foto_es_tarjeta = ? WHERE id = ? AND usuario_id = ?',
            [$url, $tarjeta ? 1 : 0, $id, $actor['id']]
        );
        $this->imagenes->borrarFotoEntreno($anterior['foto_url']);

        return $this->json(['success' => true, 'fotoUrl' => $url, 'fotoEsTarjeta' => $tarjeta]);
    }

    #[Route('/entreno-hoy/{id}/foto', name: 'social_entreno_hoy_foto_borrar', requirements: ['id' => '\d+'], methods: ['DELETE'])]
    public function borrarFotoEntreno(int $id): JsonResponse
    {
        $actor = $this->visibilidad->actor($this->getUser());
        if ($actor === null || $actor['tipo'] !== 'usuario') {
            return $this->noAutenticado();
        }
        $foto = $this->conn->fetchOne('SELECT foto_url FROM calendario_usuario WHERE id = ? AND usuario_id = ?', [$id, $actor['id']]);
        if ($foto === false) {
            return $this->noEncontrado();
        }
        $this->conn->executeStatement('UPDATE calendario_usuario SET foto_url = NULL, foto_es_tarjeta = 0 WHERE id = ? AND usuario_id = ?', [$id, $actor['id']]);
        $this->imagenes->borrarFotoEntreno($foto);

        return $this->json(['success' => true]);
    }

    #[Route('/entreno-hoy/{id}', name: 'social_entreno_hoy_deshacer', requirements: ['id' => '\d+'], methods: ['DELETE'])]
    public function deshacerEntrenoHoy(int $id): JsonResponse
    {
        $actor = $this->visibilidad->actor($this->getUser());
        if ($actor === null || $actor['tipo'] !== 'usuario') {
            return $this->noAutenticado();
        }

        $foto = $this->conn->fetchOne('SELECT foto_url FROM calendario_usuario WHERE id = ? AND usuario_id = ?', [$id, $actor['id']]);
        $this->conn->executeStatement(
            'UPDATE calendario_usuario
             SET completado = 0, fecha_completado = NULL, compartido_en_feed = 0,
                 foto_url = NULL, foto_es_tarjeta = 0, dia_hecho = NULL, ejercicios_hechos = NULL, duracion_minutos = NULL
             WHERE id = ? AND usuario_id = ?',
            [$id, $actor['id']]
        );
        if ($foto) {
            $this->imagenes->borrarFotoEntreno($foto);
        }

        return $this->json(['success' => true]);
    }

    // ============================================
    // FEED: ENTRENOS COMPLETADOS HOY Y COMPARTIDOS (accesible sin sesión)
    // ============================================
    #[Route('/feed/entrenos', name: 'social_feed_entrenos', methods: ['GET'])]
    public function feedEntrenos(Request $request): JsonResponse
    {
        $actor = $this->visibilidad->actor($this->getUser());
        $pagina = max(1, $request->query->getInt('pagina', 1));
        $esUsuario = $actor !== null && $actor['tipo'] === 'usuario';

        // Misma regla que VisibilidadService::motivoBloqueo, aplicada en SQL para poder paginar
        $filas = $this->conn->fetchAllAssociative(
            "SELECT cu.id, cu.fecha_completado, cu.foto_url AS foto_entreno, cu.foto_es_tarjeta, cu.duracion_minutos AS duracion_real, cu.dia_hecho, cu.ejercicios_hechos,
                    u.id AS usuario_id, u.nombre, u.apellidos, u.foto_url,
                    e.id AS entrenamiento_id, e.nombre AS entrenamiento, e.tipo, e.duracion_minutos,
                    e.nivel_dificultad, e.es_publico, e.creador_usuario_id, e.asignado_ausuario_id
             FROM calendario_usuario cu
             INNER JOIN usuarios u ON u.id = cu.usuario_id
             INNER JOIN entrenamientos e ON e.id = cu.entrenamiento_id
             WHERE cu.completado = 1 AND cu.compartido_en_feed = 1 AND DATE(cu.fecha_completado) = CURDATE()
               AND (
                    :admin = 1
                    OR u.id = :miUsuario
                    OR (u.perfil_publico = 1 AND (
                        u.privacidad_entrenamientos = 'publico'
                        OR (u.privacidad_entrenamientos = 'seguidores' AND EXISTS (
                            SELECT 1 FROM seguimientos s
                            WHERE s.seguidor_tipo = :actorTipo AND s.seguidor_id = :actorId
                              AND s.seguido_tipo = 'usuario' AND s.seguido_id = u.id
                        ))
                    ))
               )
             ORDER BY cu.fecha_completado DESC, cu.id DESC
             LIMIT " . (self::POR_PAGINA + 1) . ' OFFSET ' . (($pagina - 1) * self::POR_PAGINA),
            [
                'admin' => ($actor['admin'] ?? false) ? 1 : 0,
                'miUsuario' => $esUsuario ? $actor['id'] : 0,
                'actorTipo' => $actor['tipo'] ?? '',
                'actorId' => $actor['id'] ?? 0,
            ]
        );
        $hayMas = count($filas) > self::POR_PAGINA;
        $filas = array_slice($filas, 0, self::POR_PAGINA);

        return $this->json([
            'success' => true,
            'pagina' => $pagina,
            'hayMas' => $hayMas,
            'entrenos' => array_map(function (array $f) {
                // El detalle de la rutina solo se puede abrir/copiar si la rutina es pública de su autor
                $abrible = (bool) $f['es_publico']
                    && !($f['creador_usuario_id'] === null && $f['asignado_ausuario_id'] !== null);
                return [
                    'id' => (int) $f['id'],
                    'hora' => substr((string) $f['fecha_completado'], 11, 5),
                    'fotoUrl' => $f['foto_entreno'],
                    'fotoEsTarjeta' => (bool) $f['foto_es_tarjeta'],
                    'duracionReal' => $f['duracion_real'] !== null ? (int) $f['duracion_real'] : null,
                    'diaHecho' => $f['dia_hecho'],
                    'ejercicios' => array_map(
                        fn (array $e) => ['nombre' => $e['nombre'] ?? '', 'grupo' => $e['grupo'] ?? null],
                        self::ejerciciosHechos($f['ejercicios_hechos'])
                    ),
                    'autor' => [
                        'tipo' => 'usuario',
                        'id' => (int) $f['usuario_id'],
                        'nombre' => trim($f['nombre'] . ' ' . $f['apellidos']),
                        'fotoUrl' => $f['foto_url'],
                    ],
                    'entrenamiento' => [
                        'id' => $abrible ? (int) $f['entrenamiento_id'] : null,
                        'nombre' => $f['entrenamiento'],
                        'tipo' => $f['tipo'],
                        'nivel' => $f['nivel_dificultad'],
                        'duracionMinutos' => $f['duracion_minutos'] !== null ? (int) $f['duracion_minutos'] : null,
                    ],
                ];
            }, $filas),
        ]);
    }

    // ============================================
    // MIS ENTRENOS COMPLETADOS (objetivos cumplidos del perfil)
    // ============================================
    #[Route('/mis-entrenos', name: 'social_mis_entrenos', methods: ['GET'])]
    public function misEntrenos(Request $request): JsonResponse
    {
        $actor = $this->visibilidad->actor($this->getUser());
        if ($actor === null || $actor['tipo'] !== 'usuario') {
            return $this->noAutenticado();
        }
        $pagina = max(1, $request->query->getInt('pagina', 1));

        $filas = $this->conn->fetchAllAssociative(
            'SELECT cu.id, cu.fecha_completado, cu.foto_url, cu.foto_es_tarjeta, cu.duracion_minutos, cu.dia_hecho,
                    cu.ejercicios_hechos, cu.compartido_en_feed, e.id AS entrenamiento_id, e.nombre
             FROM calendario_usuario cu
             INNER JOIN entrenamientos e ON e.id = cu.entrenamiento_id
             WHERE cu.usuario_id = ? AND cu.completado = 1 AND cu.fecha_completado IS NOT NULL
             ORDER BY cu.fecha_completado DESC, cu.id DESC
             LIMIT ' . (self::POR_PAGINA + 1) . ' OFFSET ' . (($pagina - 1) * self::POR_PAGINA),
            [$actor['id']]
        );
        $hayMas = \count($filas) > self::POR_PAGINA;
        $filas = \array_slice($filas, 0, self::POR_PAGINA);

        $total = (int) $this->conn->fetchOne(
            'SELECT COUNT(*) FROM calendario_usuario WHERE usuario_id = ? AND completado = 1 AND fecha_completado IS NOT NULL',
            [$actor['id']]
        );

        return $this->json([
            'success' => true,
            'pagina' => $pagina,
            'hayMas' => $hayMas,
            'total' => $total,
            'entrenos' => array_map(fn (array $f) => [
                'id' => (int) $f['id'],
                'fecha' => substr((string) $f['fecha_completado'], 0, 10),
                'hora' => substr((string) $f['fecha_completado'], 11, 5),
                'fotoUrl' => $f['foto_url'],
                'fotoEsTarjeta' => (bool) $f['foto_es_tarjeta'],
                'duracionMinutos' => $f['duracion_minutos'] !== null ? (int) $f['duracion_minutos'] : null,
                'diaHecho' => $f['dia_hecho'],
                'compartido' => (bool) $f['compartido_en_feed'],
                'ejercicios' => \count(self::ejerciciosHechos($f['ejercicios_hechos'])),
                'entrenamiento' => ['id' => (int) $f['entrenamiento_id'], 'nombre' => $f['nombre']],
            ], $filas),
        ]);
    }

    private function noAutenticado(): JsonResponse
    {
        return $this->json(['success' => false, 'error' => 'No autenticado'], Response::HTTP_UNAUTHORIZED);
    }

    private function noEncontrado(): JsonResponse
    {
        return $this->json(['success' => false, 'error' => 'Contenido no encontrado'], Response::HTTP_NOT_FOUND);
    }
}
