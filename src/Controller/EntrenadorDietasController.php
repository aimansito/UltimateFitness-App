<?php

namespace App\Controller;

use App\Entity\Dieta;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Controlador para gestionar dietas del entrenador
 */
#[Route('/api/entrenador')]
class EntrenadorDietasController extends AbstractController
{
    // ============================================
    // LISTAR TODAS LAS DIETAS DEL ENTRENADOR
    // ============================================
    #[Route('/dietas/{entrenadorId}', name: 'entrenador_dietas_list', methods: ['GET'])]
    public function listarDietas(
        int $entrenadorId,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        try {
            $conn = $entityManager->getConnection();

            $sql = "
                SELECT
                    d.id,
                    d.nombre,
                    d.descripcion,
                    d.calorias_totales,
                    d.proteinas_totales,
                    d.carbohidratos_totales,
                    d.grasas_totales,
                    d.es_publica,
                    d.valoracion_promedio,
                    DATE_FORMAT(d.fecha_creacion, '%d/%m/%Y') as fecha_creacion,
                    COUNT(DISTINCT d2.asignado_a_usuario_id) as usuarios_asignados
                FROM dietas d
                LEFT JOIN dietas d2 ON d.nombre = d2.nombre AND d2.asignado_a_usuario_id IS NOT NULL
                WHERE d.creador_id = :entrenadorId
                GROUP BY d.id
                ORDER BY d.fecha_creacion DESC
            ";

            $stmt = $conn->prepare($sql);
            $result = $stmt->executeQuery(['entrenadorId' => $entrenadorId]);
            $dietas = $result->fetchAllAssociative();

            foreach ($dietas as &$dieta) {
                $dieta['es_publica'] = (bool)$dieta['es_publica'];
                $dieta['calorias_totales'] = (float)$dieta['calorias_totales'];
                $dieta['proteinas_totales'] = (float)$dieta['proteinas_totales'];
                $dieta['carbohidratos_totales'] = (float)$dieta['carbohidratos_totales'];
                $dieta['grasas_totales'] = (float)$dieta['grasas_totales'];
                $dieta['valoracion_promedio'] = (float)$dieta['valoracion_promedio'];
                $dieta['usuarios_asignados'] = (int)$dieta['usuarios_asignados'];
            }

            return $this->json([
                'success' => true,
                'dietas' => $dietas,
                'total' => count($dietas)
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al obtener dietas: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // ============================================
    // VER USUARIOS ASIGNADOS A UNA DIETA
    // ============================================
    #[Route('/dieta/{dietaId}/usuarios-asignados', name: 'entrenador_dieta_usuarios', methods: ['GET'])]
    public function usuariosAsignados(
        int $dietaId,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        try {
            $conn = $entityManager->getConnection();

            $sql = "
                SELECT
                    u.id,
                    u.nombre,
                    u.apellidos,
                    u.email,
                    u.es_premium,
                    DATE_FORMAT(d.fecha_creacion, '%d/%m/%Y') as fecha_asignacion
                FROM dietas d
                INNER JOIN usuarios u ON d.asignado_a_usuario_id = u.id
                WHERE d.id = :dietaId
                ORDER BY u.nombre ASC
            ";

            $stmt = $conn->prepare($sql);
            $result = $stmt->executeQuery(['dietaId' => $dietaId]);
            $usuarios = $result->fetchAllAssociative();

            foreach ($usuarios as &$usuario) {
                $usuario['es_premium'] = (bool)$usuario['es_premium'];
            }

            return $this->json([
                'success' => true,
                'usuarios' => $usuarios,
                'total' => count($usuarios)
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al obtener usuarios asignados: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // ============================================
    // ELIMINAR DIETA
    // ============================================
    #[Route('/dieta/{dietaId}', name: 'entrenador_dieta_delete', methods: ['DELETE'])]
    public function eliminarDieta(
        int $dietaId,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        try {
            $dieta = $entityManager->getRepository(Dieta::class)->find($dietaId);

            if (!$dieta) {
                return $this->json([
                    'success' => false,
                    'error' => 'Dieta no encontrada'
                ], Response::HTTP_NOT_FOUND);
            }

            $entityManager->remove($dieta);
            $entityManager->flush();

            return $this->json([
                'success' => true,
                'message' => 'Dieta eliminada exitosamente'
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al eliminar dieta: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
