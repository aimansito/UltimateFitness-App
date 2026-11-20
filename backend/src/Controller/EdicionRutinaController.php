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
 * Cambios sobre una rutina ya creada: añadir, sustituir o quitar ejercicios de un día.
 * Solo la persona que creó la rutina puede tocarla.
 */
#[Route('/api/usuario/rutina')]
class EdicionRutinaController extends AbstractController
{
    public function __construct(private Connection $conn)
    {
    }

    // ============================================
    // AÑADIR UN EJERCICIO A UN DÍA (lo pasa a día de entreno si era descanso)
    // ============================================
    #[Route('/{id}/dia/{diaSemana}/ejercicios', name: 'rutina_anadir_ejercicio', requirements: ['id' => '\d+', 'diaSemana' => '[1-7]'], methods: ['POST'])]
    public function anadir(int $id, int $diaSemana, Request $request): JsonResponse
    {
        $uid = $this->usuarioId();
        if ($uid === null) {
            return $this->error('No autenticado', Response::HTTP_UNAUTHORIZED);
        }
        if (!$this->conn->fetchOne('SELECT 1 FROM entrenamientos WHERE id = ? AND creador_usuario_id = ?', [$id, $uid])) {
            return $this->error('Rutina no encontrada', Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true) ?: [];
        $ejercicioId = (int) ($data['ejercicioId'] ?? 0);
        if (!$this->ejercicioVisible($ejercicioId, $uid)) {
            return $this->error('Ejercicio no encontrado', Response::HTTP_NOT_FOUND);
        }
        [$series, $reps, $descanso] = $this->parametros($data);

        $diaId = $this->conn->fetchOne('SELECT id FROM dias_entrenamiento WHERE entrenamiento_id = ? AND dia_semana = ?', [$id, $diaSemana]);
        if ($diaId === false) {
            $this->conn->insert('dias_entrenamiento', [
                'entrenamiento_id' => $id,
                'dia_semana' => $diaSemana,
                'concepto' => 'Entrenamiento',
                'es_descanso' => 0,
                'orden' => $diaSemana,
            ]);
            $diaId = (int) $this->conn->lastInsertId();
        } else {
            $this->conn->executeStatement(
                "UPDATE dias_entrenamiento SET es_descanso = 0, concepto = COALESCE(NULLIF(concepto, ''), 'Entrenamiento') WHERE id = ?",
                [$diaId]
            );
        }

        $orden = (int) $this->conn->fetchOne('SELECT COALESCE(MAX(orden), 0) + 1 FROM dias_ejercicios WHERE dia_entrenamiento_id = ?', [$diaId]);
        $this->conn->insert('dias_ejercicios', [
            'dia_entrenamiento_id' => $diaId,
            'ejercicio_id' => $ejercicioId,
            'series' => $series ?? 3,
            'repeticiones' => $reps ?? 12,
            'descanso_segundos' => $descanso ?? 60,
            'orden' => $orden,
        ]);

        return $this->json(['success' => true, 'id' => (int) $this->conn->lastInsertId()], Response::HTTP_CREATED);
    }

    // ============================================
    // SUSTITUIR UN EJERCICIO O CAMBIAR SUS SERIES / REPETICIONES / DESCANSO
    // ============================================
    #[Route('/ejercicio/{id}', name: 'rutina_cambiar_ejercicio', requirements: ['id' => '\d+'], methods: ['PATCH'])]
    public function cambiar(int $id, Request $request): JsonResponse
    {
        $uid = $this->usuarioId();
        if ($uid === null) {
            return $this->error('No autenticado', Response::HTTP_UNAUTHORIZED);
        }
        if (!$this->esSuyo($id, $uid)) {
            return $this->error('Ejercicio no encontrado', Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true) ?: [];
        $cambios = [];
        if (isset($data['ejercicioId'])) {
            $nuevo = (int) $data['ejercicioId'];
            if (!$this->ejercicioVisible($nuevo, $uid)) {
                return $this->error('Ejercicio no encontrado', Response::HTTP_NOT_FOUND);
            }
            $cambios['ejercicio_id'] = $nuevo;
        }
        [$series, $reps, $descanso] = $this->parametros($data);
        if ($series !== null) {
            $cambios['series'] = $series;
        }
        if ($reps !== null) {
            $cambios['repeticiones'] = $reps;
        }
        if ($descanso !== null) {
            $cambios['descanso_segundos'] = $descanso;
        }
        if (!$cambios) {
            return $this->error('Nada que cambiar', Response::HTTP_BAD_REQUEST);
        }

        $this->conn->update('dias_ejercicios', $cambios, ['id' => $id]);

        return $this->json(['success' => true]);
    }

    // ============================================
    // QUITAR UN EJERCICIO (si el día se queda vacío, pasa a descanso)
    // ============================================
    #[Route('/ejercicio/{id}', name: 'rutina_quitar_ejercicio', requirements: ['id' => '\d+'], methods: ['DELETE'])]
    public function quitar(int $id): JsonResponse
    {
        $uid = $this->usuarioId();
        if ($uid === null) {
            return $this->error('No autenticado', Response::HTTP_UNAUTHORIZED);
        }
        $diaId = $this->esSuyo($id, $uid);
        if (!$diaId) {
            return $this->error('Ejercicio no encontrado', Response::HTTP_NOT_FOUND);
        }

        $this->conn->delete('dias_ejercicios', ['id' => $id]);
        if (!$this->conn->fetchOne('SELECT 1 FROM dias_ejercicios WHERE dia_entrenamiento_id = ?', [$diaId])) {
            $this->conn->executeStatement('UPDATE dias_entrenamiento SET es_descanso = 1 WHERE id = ?', [$diaId]);
        }

        return $this->json(['success' => true]);
    }

    // ============================================
    // HELPERS
    // ============================================
    private function usuarioId(): ?int
    {
        $u = $this->getUser();
        return $u instanceof Usuario ? (int) $u->getId() : null;
    }

    /** Id del día si el ejercicio de rutina pertenece a una rutina creada por el usuario */
    private function esSuyo(int $diaEjercicioId, int $uid): int|false
    {
        $dia = $this->conn->fetchOne(
            'SELECT dx.dia_entrenamiento_id
             FROM dias_ejercicios dx
             JOIN dias_entrenamiento de ON de.id = dx.dia_entrenamiento_id
             JOIN entrenamientos e ON e.id = de.entrenamiento_id
             WHERE dx.id = ? AND e.creador_usuario_id = ?',
            [$diaEjercicioId, $uid]
        );
        return $dia === false ? false : (int) $dia;
    }

    private function ejercicioVisible(int $id, int $uid): bool
    {
        return $id > 0 && (bool) $this->conn->fetchOne(
            'SELECT 1 FROM ejercicios WHERE id = ? AND (creador_usuario_id IS NULL OR creador_usuario_id = ?)',
            [$id, $uid]
        );
    }

    /** Series, repeticiones y descanso dentro de rangos razonables (null si no vienen) */
    private function parametros(array $data): array
    {
        $rango = fn (string $k, int $min, int $max) => isset($data[$k]) ? max($min, min($max, (int) $data[$k])) : null;
        return [$rango('series', 1, 20), $rango('repeticiones', 1, 100), $rango('descanso', 0, 600)];
    }

    private function error(string $mensaje, int $codigo): JsonResponse
    {
        return $this->json(['success' => false, 'error' => $mensaje], $codigo);
    }
}
