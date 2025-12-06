<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Controlador para gestionar el calendario semanal del usuario
 * Permite asignar dietas a cada día de la semana
 */
#[Route('/api/custom/calendario')]
class CalendarioController extends AbstractController
{
    // ============================================
    // OBTENER PLAN SEMANAL DEL USUARIO
    // ============================================
    #[Route('/usuario/{usuarioId}', name: 'calendario_usuario', methods: ['GET'])]
    public function obtenerCalendario(
        int $usuarioId,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $connection = $entityManager->getConnection();
        
        $sql = 'SELECT cu.*, d.nombre as dieta_nombre, d.descripcion as dieta_descripcion,
                       d.valoracion_promedio, d.total_valoraciones
                FROM calendario_usuario cu
                LEFT JOIN dietas d ON cu.dieta_id = d.id
                WHERE cu.usuario_id = :usuarioId
                AND cu.fecha_asignacion >= CURDATE()
                ORDER BY FIELD(cu.dia_semana, "lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo")';
        
        $stmt = $connection->prepare($sql);
        $result = $stmt->executeQuery(['usuarioId' => $usuarioId]);
        $calendario = $result->fetchAllAssociative();

        return $this->json([
            'success' => true,
            'calendario' => $calendario
        ]);
    }

    // ============================================
    // GUARDAR PLAN SEMANAL COMPLETO
    // ============================================
    #[Route('/guardar', name: 'calendario_guardar', methods: ['POST'])]
    public function guardarCalendario(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['usuario_id']) || !isset($data['plan'])) {
            return $this->json([
                'success' => false,
                'error' => 'Faltan parámetros: usuario_id, plan'
            ], Response::HTTP_BAD_REQUEST);
        }

        $usuarioId = $data['usuario_id'];
        $plan = $data['plan'];
        $connection = $entityManager->getConnection();

        try {
            $connection->beginTransaction();

            // Eliminar asignaciones antiguas del usuario
            $connection->executeStatement(
                'DELETE FROM calendario_usuario WHERE usuario_id = :usuarioId',
                ['usuarioId' => $usuarioId]
            );

            // Insertar nuevas asignaciones
            foreach ($plan as $dia) {
                if ($dia['dieta_id']) {
                    $connection->executeStatement(
                        'INSERT INTO calendario_usuario 
                        (usuario_id, dieta_id, dia_semana, completado, fecha_asignacion, notas) 
                        VALUES (:usuarioId, :dietaId, :diaSemana, :completado, :fechaAsignacion, :notas)',
                        [
                            'usuarioId' => $usuarioId,
                            'dietaId' => $dia['dieta_id'],
                            'diaSemana' => $dia['dia_semana'],
                            'completado' => $dia['completado'] ? 1 : 0,
                            'fechaAsignacion' => $dia['fecha_asignacion'],
                            'notas' => $dia['notas'] ?? null
                        ]
                    );
                }
            }

            $connection->commit();

            return $this->json([
                'success' => true,
                'message' => 'Calendario guardado exitosamente'
            ]);

        } catch (\Exception $e) {
            $connection->rollBack();
            return $this->json([
                'success' => false,
                'error' => 'Error al guardar el calendario: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // ============================================
    // MARCAR DÍA COMO COMPLETADO
    // ============================================
    #[Route('/completar/{id}', name: 'calendario_completar', methods: ['PATCH'])]
    public function marcarCompletado(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $completado = $data['completado'] ?? false;

        $connection = $entityManager->getConnection();
        $connection->executeStatement(
            'UPDATE calendario_usuario SET completado = :completado WHERE id = :id',
            ['completado' => $completado ? 1 : 0, 'id' => $id]
        );

        return $this->json([
            'success' => true,
            'message' => 'Estado actualizado'
        ]);
    }

    // ============================================
    // ACTUALIZAR NOTAS DE UN DÍA
    // ============================================
    #[Route('/notas/{id}', name: 'calendario_notas', methods: ['PATCH'])]
    public function actualizarNotas(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $notas = $data['notas'] ?? '';

        $connection = $entityManager->getConnection();
        $connection->executeStatement(
            'UPDATE calendario_usuario SET notas = :notas WHERE id = :id',
            ['notas' => $notas, 'id' => $id]
        );

        return $this->json([
            'success' => true,
            'message' => 'Notas actualizadas'
        ]);
    }

    // ============================================
    // OBTENER ESTADÍSTICAS SEMANALES
    // ============================================
    #[Route('/estadisticas/{usuarioId}', name: 'calendario_estadisticas', methods: ['GET'])]
    public function obtenerEstadisticas(
        int $usuarioId,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $connection = $entityManager->getConnection();
        
        $sql = 'SELECT 
                    COUNT(*) as dias_planificados,
                    SUM(completado) as dias_completados,
                    SUM(CASE WHEN dieta_id IS NOT NULL THEN 1 ELSE 0 END) as dias_con_dieta
                FROM calendario_usuario 
                WHERE usuario_id = :usuarioId
                AND fecha_asignacion >= CURDATE()';
        
        $stmt = $connection->prepare($sql);
        $result = $stmt->executeQuery(['usuarioId' => $usuarioId]);
        $stats = $result->fetchAssociative();

        return $this->json([
            'success' => true,
            'estadisticas' => $stats
        ]);
    }
}