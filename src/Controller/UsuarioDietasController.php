<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/usuario')]
class UsuarioDietasController extends AbstractController
{
    // ============================================
    // LISTAR DIETAS DEL USUARIO
    // ============================================
    #[Route('/mis-dietas/{usuarioId}', name: 'usuario_dietas_list', methods: ['GET'])]
    public function listarDietas(
        int $usuarioId,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        try {
            $conn = $entityManager->getConnection();

            // ✅ DIETAS ASIGNADAS POR ENTRENADOR
            $sqlAsignadas = "
                SELECT
                    d.id,
                    d.nombre,
                    d.descripcion,
                    d.calorias_totales,
                    d.proteinas_totales,
                    d.carbohidratos_totales,
                    d.grasas_totales,
                    d.es_publica,
                    e.nombre as entrenador_nombre,
                    e.apellidos as entrenador_apellidos,
                    DATE_FORMAT(d.fecha_creacion, '%d/%m/%Y') as fecha_asignacion
                FROM dietas d
                INNER JOIN entrenadores e ON d.creador_id = e.id
                WHERE d.asignado_a_usuario_id = ?
                AND d.creador_id IS NOT NULL
                ORDER BY d.fecha_creacion DESC
            ";

            $dietasAsignadas = $conn->executeQuery($sqlAsignadas, [$usuarioId])
                ->fetchAllAssociative();

            // ✅ DIETAS CREADAS POR EL USUARIO
            $sqlCreadas = "
                SELECT
                    d.id,
                    d.nombre,
                    d.descripcion,
                    d.calorias_totales,
                    d.proteinas_totales,
                    d.carbohidratos_totales,
                    d.grasas_totales,
                    d.es_publica,
                    DATE_FORMAT(d.fecha_creacion, '%d/%m/%Y') as fecha_creacion
                FROM dietas d
                WHERE d.asignado_a_usuario_id = ?
                AND d.creador_id IS NULL
                ORDER BY d.fecha_creacion DESC
            ";

            $dietasCreadas = $conn->executeQuery($sqlCreadas, [$usuarioId])
                ->fetchAllAssociative();

            return $this->json([
                'success' => true,
                'dietasAsignadas' => $dietasAsignadas,
                'dietasCreadas' => $dietasCreadas
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al cargar dietas: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // ============================================
    // VER DETALLE DE UNA DIETA
    // ============================================
    #[Route('/dieta/{dietaId}', name: 'usuario_dieta_detalle', methods: ['GET'])]
    public function verDetalleDieta(
        int $dietaId,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        try {
            $conn = $entityManager->getConnection();

            // Info básica de la dieta
            $sqlDieta = "
                SELECT
                    d.id,
                    d.nombre,
                    d.descripcion,
                    d.calorias_totales,
                    d.proteinas_totales,
                    d.carbohidratos_totales,
                    d.grasas_totales,
                    d.es_publica,
                    e.nombre as entrenador_nombre,
                    e.apellidos as entrenador_apellidos
                FROM dietas d
                LEFT JOIN entrenadores e ON d.creador_id = e.id
                WHERE d.id = ?
            ";

            $dieta = $conn->executeQuery($sqlDieta, [$dietaId])
                ->fetchAssociative();

            if (!$dieta) {
                return $this->json([
                    'success' => false,
                    'error' => 'Dieta no encontrada'
                ], Response::HTTP_NOT_FOUND);
            }

            // Obtener platos organizados por día y momento
            $sqlPlatos = "
                SELECT
                    dp.dia_semana,
                    dp.tipo_comida,
                    dp.orden,
                    p.id as plato_id,
                    p.nombre as plato_nombre,
                    p.descripcion as plato_descripcion,
                    p.calorias_totales,
                    p.proteinas_totales,
                    p.carbohidratos_totales,
                    p.grasas_totales,
                    p.tiempo_preparacion,
                    p.dificultad
                FROM dieta_platos dp
                INNER JOIN platos p ON dp.plato_id = p.id
                WHERE dp.dieta_id = ?
                ORDER BY
                    FIELD(dp.dia_semana, 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'),
                    FIELD(dp.tipo_comida, 'desayuno', 'media_manana', 'almuerzo', 'merienda', 'cena', 'post_entreno'),
                    dp.orden
            ";

            $platos = $conn->executeQuery($sqlPlatos, [$dietaId])
                ->fetchAllAssociative();

            // Organizar en estructura semanal
            $planSemanal = [
                'lunes' => ['desayuno' => [], 'media_manana' => [], 'almuerzo' => [], 'merienda' => [], 'cena' => [], 'post_entreno' => []],
                'martes' => ['desayuno' => [], 'media_manana' => [], 'almuerzo' => [], 'merienda' => [], 'cena' => [], 'post_entreno' => []],
                'miercoles' => ['desayuno' => [], 'media_manana' => [], 'almuerzo' => [], 'merienda' => [], 'cena' => [], 'post_entreno' => []],
                'jueves' => ['desayuno' => [], 'media_manana' => [], 'almuerzo' => [], 'merienda' => [], 'cena' => [], 'post_entreno' => []],
                'viernes' => ['desayuno' => [], 'media_manana' => [], 'almuerzo' => [], 'merienda' => [], 'cena' => [], 'post_entreno' => []],
                'sabado' => ['desayuno' => [], 'media_manana' => [], 'almuerzo' => [], 'merienda' => [], 'cena' => [], 'post_entreno' => []],
                'domingo' => ['desayuno' => [], 'media_manana' => [], 'almuerzo' => [], 'merienda' => [], 'cena' => [], 'post_entreno' => []]
            ];

            foreach ($platos as $plato) {
                $dia = $plato['dia_semana'];
                $momento = $plato['tipo_comida'];

                // Obtener ingredientes del plato
                $sqlIngredientes = "
                    SELECT
                        a.id as alimento_id,
                        a.nombre as alimento_nombre,
                        pa.cantidad_gramos,
                        a.calorias,
                        a.proteinas,
                        a.carbohidratos,
                        a.grasas
                    FROM plato_alimentos pa
                    INNER JOIN alimentos a ON pa.alimento_id = a.id
                    WHERE pa.plato_id = ?
                    ORDER BY pa.orden
                ";

                $ingredientes = $conn->executeQuery($sqlIngredientes, [$plato['plato_id']])
                    ->fetchAllAssociative();

                $planSemanal[$dia][$momento][] = [
                    'plato_id' => $plato['plato_id'],
                    'nombre' => $plato['plato_nombre'],
                    'descripcion' => $plato['plato_descripcion'],
                    'calorias' => (float)$plato['calorias_totales'],
                    'proteinas' => (float)$plato['proteinas_totales'],
                    'carbohidratos' => (float)$plato['carbohidratos_totales'],
                    'grasas' => (float)$plato['grasas_totales'],
                    'tiempo_preparacion' => $plato['tiempo_preparacion'],
                    'dificultad' => $plato['dificultad'],
                    'ingredientes' => $ingredientes
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
                'error' => 'Error al cargar detalle: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
