<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/usuario')]
class MisDietasController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * GET /api/usuario/mis-dietas/{usuarioId}
     * Obtener todas las dietas del usuario (asignadas y creadas)
     */
    #[Route('/mis-dietas/{usuarioId}', name: 'api_usuario_mis_dietas', methods: ['GET'])]
    public function getMisDietas(int $usuarioId): JsonResponse
    {
        $conn = $this->entityManager->getConnection();

        // ✅ Dietas ASIGNADAS (creadas por entrenador)
        $sqlAsignadas = "
            SELECT 
                d.id,
                d.nombre,
                d.descripcion,
                d.calorias_totales,
                d.proteinas_totales,
                d.carbohidratos_totales,
                d.grasas_totales,
                d.creador_id,
                e.nombre as entrenador_nombre,
                e.apellidos as entrenador_apellidos,
                DATE_FORMAT(d.fecha_creacion, '%d/%m/%Y') as fecha_asignacion
            FROM dietas d
            INNER JOIN entrenadores e ON d.creador_id = e.id
            WHERE d.asignado_a_usuario_id = :usuarioId
            AND d.creador_id IS NOT NULL
            ORDER BY d.fecha_creacion DESC
        ";

        $stmtAsignadas = $conn->prepare($sqlAsignadas);
        $resultAsignadas = $stmtAsignadas->executeQuery(['usuarioId' => $usuarioId]);
        $dietasAsignadas = $resultAsignadas->fetchAllAssociative();

        // ✅ Dietas CREADAS (por el propio usuario)
        $sqlCreadas = "
            SELECT 
                d.id,
                d.nombre,
                d.descripcion,
                d.calorias_totales,
                d.proteinas_totales,
                d.carbohidratos_totales,
                d.grasas_totales,
                DATE_FORMAT(d.fecha_creacion, '%d/%m/%Y') as fecha_creacion
            FROM dietas d
            WHERE d.asignado_a_usuario_id = :usuarioId
            AND d.creador_id IS NULL
            ORDER BY d.fecha_creacion DESC
        ";

        $stmtCreadas = $conn->prepare($sqlCreadas);
        $resultCreadas = $stmtCreadas->executeQuery(['usuarioId' => $usuarioId]);
        $dietasCreadas = $resultCreadas->fetchAllAssociative();

        return $this->json([
            'success' => true,
            'dietasAsignadas' => $dietasAsignadas,
            'dietasCreadas' => $dietasCreadas,
            'totalAsignadas' => count($dietasAsignadas),
            'totalCreadas' => count($dietasCreadas)
        ]);
    }

    /**
     * GET /api/usuario/dieta/{dietaId}/detalle
     * Obtener detalle completo de una dieta con platos e ingredientes
     */
    #[Route('/dieta/{dietaId}/detalle', name: 'api_usuario_detalle_dieta', methods: ['GET'])]
    public function getDetalleDieta(int $dietaId): JsonResponse
    {
        $conn = $this->entityManager->getConnection();

        // 1️⃣ Información básica de la dieta
        $sqlDieta = "
            SELECT 
                d.id,
                d.nombre,
                d.descripcion,
                d.calorias_totales,
                d.proteinas_totales,
                d.carbohidratos_totales,
                d.grasas_totales,
                d.fecha_creacion
            FROM dietas d
            WHERE d.id = :dietaId
        ";

        $stmtDieta = $conn->prepare($sqlDieta);
        $resultDieta = $stmtDieta->executeQuery(['dietaId' => $dietaId]);
        $dieta = $resultDieta->fetchAssociative();

        if (!$dieta) {
            return $this->json(['success' => false, 'error' => 'Dieta no encontrada'], 404);
        }

        // 2️⃣ Platos con ingredientes (consulta completa)
        $sqlPlatos = "
            SELECT 
                dp.dia_semana,
                dp.tipo_comida,
                dp.orden,
                p.id AS plato_id,
                p.nombre AS plato_nombre,
                p.descripcion AS plato_descripcion,
                p.calorias_totales AS plato_calorias,
                p.proteinas_totales AS plato_proteinas,
                p.carbohidratos_totales AS plato_carbohidratos,
                p.grasas_totales AS plato_grasas,
                a.id AS alimento_id,
                a.nombre AS alimento_nombre,
                pa.cantidad_gramos,
                a.calorias AS alimento_calorias_100g,
                a.proteinas AS alimento_proteinas_100g,
                a.carbohidratos AS alimento_carbohidratos_100g,
                a.grasas AS alimento_grasas_100g
            FROM dieta_platos dp
            INNER JOIN platos p ON dp.plato_id = p.id
            LEFT JOIN plato_alimentos pa ON p.id = pa.plato_id
            LEFT JOIN alimentos a ON pa.alimento_id = a.id
            WHERE dp.dieta_id = :dietaId
            ORDER BY 
                FIELD(dp.dia_semana, 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'),
                FIELD(dp.tipo_comida, 'desayuno', 'media_manana', 'almuerzo', 'merienda', 'cena', 'post_entreno'),
                dp.orden,
                p.nombre,
                a.nombre
        ";

        $stmtPlatos = $conn->prepare($sqlPlatos);
        $resultPlatos = $stmtPlatos->executeQuery(['dietaId' => $dietaId]);
        $rows = $resultPlatos->fetchAllAssociative();

        // 3️⃣ Estructurar datos por día y tipo de comida
        $planSemanal = [];
        $platosCache = [];

        foreach ($rows as $row) {
            $dia = $row['dia_semana'];
            $tipoComida = $row['tipo_comida'];
            $platoId = $row['plato_id'];

            // Inicializar estructura si no existe
            if (!isset($planSemanal[$dia])) {
                $planSemanal[$dia] = [];
            }
            if (!isset($planSemanal[$dia][$tipoComida])) {
                $planSemanal[$dia][$tipoComida] = [];
            }

            // Si el plato no está en el array de este día/comida, agregarlo
            if (!isset($platosCache[$dia][$tipoComida][$platoId])) {
                $platosCache[$dia][$tipoComida][$platoId] = [
                    'id' => $platoId,
                    'nombre' => $row['plato_nombre'],
                    'descripcion' => $row['plato_descripcion'],
                    'calorias' => (float)$row['plato_calorias'],
                    'proteinas' => (float)$row['plato_proteinas'],
                    'carbohidratos' => (float)$row['plato_carbohidratos'],
                    'grasas' => (float)$row['plato_grasas'],
                    'ingredientes' => []
                ];
                $planSemanal[$dia][$tipoComida][] = &$platosCache[$dia][$tipoComida][$platoId];
            }

            // Agregar ingrediente si existe
            if ($row['alimento_id']) {
                $cantidad = (float)$row['cantidad_gramos'];
                $platosCache[$dia][$tipoComida][$platoId]['ingredientes'][] = [
                    'id' => $row['alimento_id'],
                    'nombre' => $row['alimento_nombre'],
                    'cantidad_gramos' => $cantidad,
                    'calorias' => round(($row['alimento_calorias_100g'] * $cantidad) / 100, 2),
                    'proteinas' => round(($row['alimento_proteinas_100g'] * $cantidad) / 100, 2),
                    'carbohidratos' => round(($row['alimento_carbohidratos_100g'] * $cantidad) / 100, 2),
                    'grasas' => round(($row['alimento_grasas_100g'] * $cantidad) / 100, 2)
                ];
            }
        }

        return $this->json([
            'success' => true,
            'dieta' => [
                'id' => $dieta['id'],
                'nombre' => $dieta['nombre'],
                'descripcion' => $dieta['descripcion'],
                'calorias_totales' => (int)$dieta['calorias_totales'],
                'proteinas_totales' => (float)$dieta['proteinas_totales'],
                'carbohidratos_totales' => (float)$dieta['carbohidratos_totales'],
                'grasas_totales' => (float)$dieta['grasas_totales'],
                'fecha_creacion' => $dieta['fecha_creacion']
            ],
            'planSemanal' => $planSemanal
        ]);
    }
}
