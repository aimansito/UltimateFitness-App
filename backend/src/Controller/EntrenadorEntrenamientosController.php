<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/entrenador')]
class EntrenadorEntrenamientosController extends AbstractController
{
    /**
     * GET /api/entrenador/mis-entrenamientos/{entrenadorId}
     * Obtener entrenamientos creados por un entrenador
     */
    #[Route('/mis-entrenamientos/{entrenadorId}', name: 'entrenador_entrenamientos_list', methods: ['GET'])]
    public function listarEntrenamientos(
        int $entrenadorId,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        try {
            $conn = $entityManager->getConnection();

            // ============================================
            // ENTRENAMIENTOS CREADOS POR EL ENTRENADOR
            // ============================================
            $sql = "
                SELECT
                    e.id,
                    e.nombre,
                    e.descripcion,
                    e.tipo,
                    e.nivel_dificultad,
                    e.duracion_minutos,
                    e.es_publico,
                    e.valoracion_promedio,
                    e.total_valoraciones,
                    e.asignado_ausuario_id,
                    u.nombre as asignado_a_nombre,
                    u.apellidos as asignado_a_apellidos,
                    DATE_FORMAT(e.fecha_creacion, '%d/%m/%Y') as fecha_creacion
                FROM entrenamientos e
                LEFT JOIN usuarios u ON e.asignado_ausuario_id = u.id
                WHERE e.creador_id = ?
                ORDER BY e.fecha_creacion DESC
            ";

            $entrenamientos = $conn->executeQuery($sql, [$entrenadorId])
                ->fetchAllAssociative();

            // ============================================
            // AGREGAR DÍAS Y EJERCICIOS A CADA ENTRENAMIENTO
            // ============================================
            $entrenamientos = array_map(function($entrenamiento) use ($conn) {
                return $this->agregarDiasYEjercicios($entrenamiento, $conn);
            }, $entrenamientos);

            return $this->json([
                'success' => true,
                'creados' => $entrenamientos,
                'asignados' => [], // Los entrenadores no tienen entrenamientos asignados
                'total_creados' => count($entrenamientos),
                'total_asignados' => 0
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al cargar entrenamientos: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Helper: Agregar días y ejercicios a un entrenamiento
     */
    private function agregarDiasYEjercicios(array $entrenamiento, $conn): array
    {
        $entrenamientoId = $entrenamiento['id'];

        // Obtener días
        $sqlDias = "
            SELECT
                de.id,
                de.dia_semana,
                de.concepto,
                de.es_descanso,
                de.orden
            FROM dias_entrenamiento de
            WHERE de.entrenamiento_id = ?
            ORDER BY de.orden ASC
        ";

        $dias = $conn->executeQuery($sqlDias, [$entrenamientoId])
            ->fetchAllAssociative();

        // Para cada día, obtener ejercicios
        foreach ($dias as &$dia) {
            if (!$dia['es_descanso']) {
                $sqlEjercicios = "
                    SELECT
                        dej.id,
                        dej.series,
                        dej.repeticiones,
                        dej.descanso_segundos,
                        dej.notas,
                        dej.orden,
                        ej.id as ejercicio_id,
                        ej.nombre as ejercicio_nombre,
                        ej.grupo_muscular,
                        ej.tipo as ejercicio_tipo,
                        ej.nivel_dificultad as ejercicio_dificultad
                    FROM dias_ejercicios dej
                    INNER JOIN ejercicios ej ON dej.ejercicio_id = ej.id
                    WHERE dej.dia_entrenamiento_id = ?
                    ORDER BY dej.orden ASC
                ";

                $ejercicios = $conn->executeQuery($sqlEjercicios, [$dia['id']])
                    ->fetchAllAssociative();

                $dia['ejercicios'] = $ejercicios;
                $dia['total_ejercicios'] = count($ejercicios);
            } else {
                $dia['ejercicios'] = [];
                $dia['total_ejercicios'] = 0;
            }
        }

        $entrenamiento['dias'] = $dias;
        $entrenamiento['total_dias'] = count($dias);

        // Agregar info de asignación
        if ($entrenamiento['asignado_ausuario_id']) {
            $entrenamiento['asignadoA'] = [
                'id' => $entrenamiento['asignado_ausuario_id'],
                'nombre' => $entrenamiento['asignado_a_nombre'],
                'apellidos' => $entrenamiento['asignado_a_apellidos']
            ];
        }

        return $entrenamiento;
    }
}
