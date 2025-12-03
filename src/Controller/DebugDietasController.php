<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class DebugDietasController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/api/debug/dietas-usuario/12', name: 'debug_dietas', methods: ['GET'])]
    public function debugDietas(): JsonResponse
    {
        $sql = "
            SELECT 
                d.id,
                d.nombre,
                d.descripcion,
                d.calorias_totales,
                d.creador_id,
                e.nombre as entrenador_nombre,
                e.apellidos as entrenador_apellidos
            FROM dietas d
            INNER JOIN entrenadores e ON d.creador_id = e.id
            WHERE d.asignado_a_usuario_id = 12
            AND d.creador_id IS NOT NULL
            ORDER BY d.fecha_creacion DESC
        ";

        $result = $this->entityManager->getConnection()->executeQuery($sql);
        $dietas = $result->fetchAllAssociative();

        return $this->json([
            'success' => true,
            'count' => count($dietas),
            'dietas' => $dietas
        ]);
    }
}