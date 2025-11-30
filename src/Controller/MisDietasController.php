<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/usuario')]
class MisDietasController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/mis-dietas/{usuarioId}', name: 'api_usuario_mis_dietas', methods: ['GET'])]
    public function getMisDietas(int $usuarioId): JsonResponse
    {
        try {
            // Query actualizada para buscar por asignado_a_usuario_id
            $sql = "
                SELECT 
                    d.id,
                    d.nombre,
                    d.descripcion,
                    d.calorias_totales,
                    d.proteinas_totales,
                    d.carbohidratos_totales,
                    d.grasas_totales,
                    DATE_FORMAT(d.fecha_creacion, '%d/%m/%Y') as fecha_asignacion
                FROM dietas d
                WHERE d.asignado_a_usuario_id = :usuarioId
                ORDER BY d.fecha_creacion DESC
            ";

            $stmt = $this->entityManager->getConnection()->prepare($sql);
            $result = $stmt->executeQuery(['usuarioId' => $usuarioId]);
            $dietas = $result->fetchAllAssociative();

            return $this->json([
                'success' => true,
                'total' => count($dietas),
                'dietas' => $dietas
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/dieta/{dietaId}/usuario/{usuarioId}', name: 'api_usuario_detalle_dieta', methods: ['GET'])]
    public function getDetalleDieta(int $dietaId, int $usuarioId): JsonResponse
    {
        try {
            // Info básica de la dieta
            $sql = "
                SELECT 
                    d.id,
                    d.nombre,
                    d.descripcion,
                    d.calorias_totales,
                    d.proteinas_totales,
                    d.carbohidratos_totales,
                    d.grasas_totales
                FROM dietas d
                WHERE d.id = :dietaId
                AND d.asignado_a_usuario_id = :usuarioId
            ";

            $stmt = $this->entityManager->getConnection()->prepare($sql);
            $result = $stmt->executeQuery(['dietaId' => $dietaId, 'usuarioId' => $usuarioId]);
            $dieta = $result->fetchAssociative();

            if (!$dieta) {
                return $this->json(['success' => false, 'error' => 'Dieta no encontrada'], 404);
            }

            // Obtener platos por día usando la nueva tabla dieta_platos
            $sqlPlatos = "
                SELECT 
                    dp.dia_semana,
                    dp.tipo_comida,
                    p.id as plato_id,
                    p.nombre as plato_nombre,
                    p.descripcion as plato_descripcion,
                    p.calorias_totales,
                    p.proteinas_totales,
                    p.carbohidratos_totales,
                    p.grasas_totales
                FROM dieta_platos dp
                INNER JOIN platos p ON dp.plato_id = p.id
                WHERE dp.dieta_id = :dietaId
                ORDER BY 
                    FIELD(dp.dia_semana, 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'),
                    FIELD(dp.tipo_comida, 'desayuno', 'media_manana', 'almuerzo', 'merienda', 'cena', 'post_entreno'),
                    dp.orden
            ";

            $stmt = $this->entityManager->getConnection()->prepare($sqlPlatos);
            $result = $stmt->executeQuery(['dietaId' => $dietaId]);
            $platos = $result->fetchAllAssociative();

            // Agrupar por día y momento
            $planSemanal = [
                'lunes' => [],
                'martes' => [],
                'miercoles' => [],
                'jueves' => [],
                'viernes' => [],
                'sabado' => [],
                'domingo' => []
            ];

            foreach ($platos as $plato) {
                $dia = $plato['dia_semana'];
                $momento = $plato['tipo_comida'];
                
                // Obtener ingredientes del plato
                $sqlIngredientes = "
                    SELECT 
                        pa.cantidad_gramos,
                        a.id as alimento_id,
                        a.nombre as alimento_nombre,
                        a.calorias,
                        a.proteinas,
                        a.carbohidratos,
                        a.grasas
                    FROM plato_alimentos pa
                    INNER JOIN alimentos a ON pa.alimento_id = a.id
                    WHERE pa.plato_id = :platoId
                    ORDER BY pa.orden
                ";
                
                $stmtIng = $this->entityManager->getConnection()->prepare($sqlIngredientes);
                $resultIng = $stmtIng->executeQuery(['platoId' => $plato['plato_id']]);
                $ingredientes = $resultIng->fetchAllAssociative();
                
                $planSemanal[$dia][] = [
                    'momento_dia' => $momento,
                    'plato_nombre' => $plato['plato_nombre'],
                    'plato_descripcion' => $plato['plato_descripcion'],
                    'ingredientes' => $ingredientes,
                    'calorias_totales' => (float)$plato['calorias_totales'],
                    'proteinas_totales' => (float)$plato['proteinas_totales'],
                    'carbohidratos_totales' => (float)$plato['carbohidratos_totales'],
                    'grasas_totales' => (float)$plato['grasas_totales']
                ];
            }

            return $this->json([
                'success' => true,
                'dieta' => $dieta,
                'plan_semanal' => $planSemanal
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}