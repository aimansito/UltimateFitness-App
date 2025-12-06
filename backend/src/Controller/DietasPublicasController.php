<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/custom/dietas')]
class DietasPublicasController extends AbstractController
{
    // ============================================
    // LISTAR DIETAS PÚBLICAS
    // ============================================
    #[Route('/publicas', name: 'dietas_publicas_list', methods: ['GET'])]
    public function listarDietasPublicas(
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
                    e.nombre as creador_nombre,
                    e.apellidos as creador_apellidos,
                    DATE_FORMAT(d.fecha_creacion, '%d/%m/%Y') as fecha_creacion
                FROM dietas d
                LEFT JOIN entrenadores e ON d.creador_id = e.id
                WHERE d.es_publica = 1
                ORDER BY d.fecha_creacion DESC
            ";

            $dietas = $conn->executeQuery($sql)->fetchAllAssociative();

            return $this->json([
                'success' => true,
                'dietas' => $dietas
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al cargar dietas públicas: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
