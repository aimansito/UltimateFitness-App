<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/entrenador')]
class EntrenadorEntrenamientoDetalleController extends AbstractController
{
    /**
     * GET /api/entrenador/entrenamiento/{entrenamientoId}
     * Obtener detalle completo de un entrenamiento (para entrenador)
     */
    #[Route('/entrenamiento/{entrenamientoId}', name: 'entrenador_entrenamiento_detalle', methods: ['GET'])]
    public function detalle(
        int $entrenamientoId,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        try {
            $conn = $entityManager->getConnection();

            // Datos básicos del entrenamiento
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
                    DATE_FORMAT(e.fecha_creacion, '%d/%m/%Y %H:%i') as fecha_creacion,
                    e.creador_id,
                    e.asignado_ausuario_id
                FROM entrenamientos e
                WHERE e.id = ?
            ";

            $entrenamiento = $conn->executeQuery($sql, [$entrenamientoId])
                ->fetchAssociative();

            if (!$entrenamiento) {
                return $this->json([
                    'success' => false,
                    'error' => 'Entrenamiento no encontrado'
                ], Response::HTTP_NOT_FOUND);
            }

            // Si está asignado, obtener datos del usuario
            if ($entrenamiento['asignado_ausuario_id']) {
                $sqlUser = "SELECT id, nombre, apellidos FROM usuarios WHERE id = ?";
                $user = $conn->executeQuery($sqlUser, [$entrenamiento['asignado_ausuario_id']])->fetchAssociative();
                if ($user) {
                    $entrenamiento['asignado_a'] = $user;
                }
            }

            // Agregar días y ejercicios
            $entrenamiento = $this->agregarDiasYEjercicios($entrenamiento, $conn);

            return $this->json([
                'success' => true,
                'entrenamiento' => $entrenamiento
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al cargar entrenamiento: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Helper: Agregar días y ejercicios (Duplicado de UsuarioEntrenamientosController para evitar dependencias)
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

        return $entrenamiento;
    }
}
