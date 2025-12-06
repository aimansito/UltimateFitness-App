<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/usuario')]
class UsuarioEntrenamientosController extends AbstractController
{
    /**
     * GET /api/usuario/mis-entrenamientos/{usuarioId}
     * Obtener entrenamientos creados y asignados a un usuario
     */
    #[Route('/mis-entrenamientos/{usuarioId}', name: 'usuario_entrenamientos_list', methods: ['GET'])]
    public function listarEntrenamientos(
        int $usuarioId,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        try {
            $conn = $entityManager->getConnection();

            // ============================================
            // ENTRENAMIENTOS CREADOS POR EL USUARIO
            // ============================================
            $sqlCreados = "
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
                    DATE_FORMAT(e.fecha_creacion, '%d/%m/%Y') as fecha_creacion
                FROM entrenamientos e
                WHERE e.creador_usuario_id = ?
                ORDER BY e.fecha_creacion DESC
            ";

            $entrenamientosCreados = $conn->executeQuery($sqlCreados, [$usuarioId])
                ->fetchAllAssociative();

            // ============================================
            // ENTRENAMIENTOS ASIGNADOS AL USUARIO
            // ============================================
            $sqlAsignados = "
                SELECT
                    e.id,
                    e.nombre,
                    e.descripcion,
                    e.tipo,
                    e.nivel_dificultad,
                    e.duracion_minutos,
                    e.valoracion_promedio,
                    e.total_valoraciones,
                    ent.nombre as entrenador_nombre,
                    ent.apellidos as entrenador_apellidos,
                    DATE_FORMAT(e.fecha_creacion, '%d/%m/%Y') as fecha_asignacion
                FROM entrenamientos e
                INNER JOIN entrenadores ent ON e.creador_id = ent.id
                WHERE e.asignado_ausuario_id = ?
                ORDER BY e.fecha_creacion DESC
            ";

            $entrenamientosAsignados = $conn->executeQuery($sqlAsignados, [$usuarioId])
                ->fetchAllAssociative();

            // ============================================
            // AGREGAR D�AS Y EJERCICIOS A CADA ENTRENAMIENTO
            // ============================================
            $entrenamientosCreados = array_map(function($entrenamiento) use ($conn) {
                return $this->agregarDiasYEjercicios($entrenamiento, $conn);
            }, $entrenamientosCreados);

            $entrenamientosAsignados = array_map(function($entrenamiento) use ($conn) {
                return $this->agregarDiasYEjercicios($entrenamiento, $conn);
            }, $entrenamientosAsignados);

            return $this->json([
                'success' => true,
                'creados' => $entrenamientosCreados,
                'asignados' => $entrenamientosAsignados,
                'total_creados' => count($entrenamientosCreados),
                'total_asignados' => count($entrenamientosAsignados)
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al cargar entrenamientos: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * GET /api/usuario/entrenamiento/{entrenamientoId}
     * Obtener detalle completo de un entrenamiento
     */
    #[Route('/entrenamiento/{entrenamientoId}', name: 'usuario_entrenamiento_detalle', methods: ['GET'])]
    public function detalleEntrenamiento(
        int $entrenamientoId,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        try {
            $conn = $entityManager->getConnection();

            // Datos b�sicos del entrenamiento
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
                    ent.nombre as entrenador_nombre,
                    ent.apellidos as entrenador_apellidos
                FROM entrenamientos e
                LEFT JOIN entrenadores ent ON e.creador_id = ent.id
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

            // Agregar d�as y ejercicios
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
     * Helper: Agregar d�as y ejercicios a un entrenamiento
     */
    private function agregarDiasYEjercicios(array $entrenamiento, $conn): array
    {
        $entrenamientoId = $entrenamiento['id'];

        // Obtener d�as
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

        // Para cada d�a, obtener ejercicios
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

    /**
     * POST /api/usuario/crear-entrenamiento
     * Crear un nuevo entrenamiento para un usuario
     */
    #[Route('/crear-entrenamiento', name: 'usuario_crear_entrenamiento', methods: ['POST'])]
    public function crearEntrenamiento(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        try {
            $data = json_decode($request->getContent(), true);

            // Validaciones básicas
            if (!isset($data['nombre']) || empty($data['nombre'])) {
                return $this->json(['success' => false, 'error' => 'El nombre del entrenamiento es obligatorio'], 400);
            }

            if (!isset($data['dias']) || !is_array($data['dias'])) {
                return $this->json(['success' => false, 'error' => 'Se requiere estructura de días (array)'], 400);
            }

            // Validar que haya 7 días
            if (count($data['dias']) !== 7) {
                return $this->json(['success' => false, 'error' => 'Debe incluir exactamente 7 días de la semana'], 400);
            }

            // Validar que haya al menos 5 días activos
            $diasActivos = array_filter($data['dias'], fn($dia) => !$dia['esDescanso']);
            if (count($diasActivos) < 5) {
                return $this->json(['success' => false, 'error' => 'Debes tener al menos 5 días activos (no de descanso)'], 400);
            }

            // Validar que días activos tengan ejercicios
            foreach ($diasActivos as $dia) {
                if (!isset($dia['ejercicios']) || count($dia['ejercicios']) === 0) {
                    return $this->json(['success' => false, 'error' => 'Los días activos deben tener al menos 1 ejercicio'], 400);
                }
            }

            $conn = $entityManager->getConnection();
            $conn->beginTransaction();

            try {
                // 1. Insertar entrenamiento (creado por usuario, no asignado a nadie)
                $sqlEntrenamiento = "
                    INSERT INTO entrenamientos (
                        nombre,
                        descripcion,
                        tipo,
                        creador_usuario_id,
                        duracion_minutos,
                        nivel_dificultad,
                        es_publico,
                        fecha_creacion
                    ) VALUES (
                        :nombre,
                        :descripcion,
                        :tipo,
                        :creador_usuario_id,
                        :duracion,
                        :nivel,
                        :es_publico,
                        NOW()
                    )
                ";

                $stmt = $conn->prepare($sqlEntrenamiento);
                $stmt->executeStatement([
                    'nombre' => $data['nombre'],
                    'descripcion' => $data['descripcion'] ?? '',
                    'tipo' => $data['tipo'] ?? 'gym',
                    'creador_usuario_id' => $data['creador_usuario_id'] ?? null,
                    'duracion' => $data['duracionMinutos'] ?? 60,
                    'nivel' => $data['nivelDificultad'] ?? 'intermedio',
                    'es_publico' => isset($data['esPublico']) ? ($data['esPublico'] ? 1 : 0) : 0
                ]);

                $entrenamientoId = $conn->lastInsertId();

                // 2. Insertar días y ejercicios
                foreach ($data['dias'] as $dia) {
                    // Insertar día
                    $sqlDia = "
                        INSERT INTO dias_entrenamiento (
                            entrenamiento_id,
                            dia_semana,
                            concepto,
                            es_descanso,
                            orden
                        ) VALUES (
                            :entrenamiento_id,
                            :dia_semana,
                            :concepto,
                            :es_descanso,
                            :orden
                        )
                    ";

                    $stmt = $conn->prepare($sqlDia);
                    $stmt->executeStatement([
                        'entrenamiento_id' => $entrenamientoId,
                        'dia_semana' => $dia['diaSemana'],
                        'concepto' => $dia['concepto'] ?? '',
                        'es_descanso' => $dia['esDescanso'] ? 1 : 0,
                        'orden' => $dia['diaSemana']
                    ]);

                    $diaId = $conn->lastInsertId();

                    // 3. Insertar ejercicios del día (solo si no es descanso)
                    if (!$dia['esDescanso'] && isset($dia['ejercicios'])) {
                        $orden = 1;

                        foreach ($dia['ejercicios'] as $ejercicio) {
                            $sqlEjercicio = "
                                INSERT INTO dias_ejercicios (
                                    dia_entrenamiento_id,
                                    ejercicio_id,
                                    series,
                                    repeticiones,
                                    descanso_segundos,
                                    notas,
                                    orden
                                ) VALUES (
                                    :dia_id,
                                    :ejercicio_id,
                                    :series,
                                    :repeticiones,
                                    :descanso,
                                    :notas,
                                    :orden
                                )
                            ";

                            $stmt = $conn->prepare($sqlEjercicio);
                            $stmt->executeStatement([
                                'dia_id' => $diaId,
                                'ejercicio_id' => $ejercicio['ejercicio_id'],
                                'series' => $ejercicio['series'] ?? 3,
                                'repeticiones' => $ejercicio['repeticiones'] ?? 12,
                                'descanso' => $ejercicio['descanso'] ?? 60,
                                'notas' => $ejercicio['notas'] ?? '',
                                'orden' => $orden
                            ]);

                            $orden++;
                        }
                    }
                }

                $conn->commit();

                return $this->json([
                    'success' => true,
                    'message' => 'Entrenamiento creado correctamente',
                    'entrenamiento_id' => $entrenamientoId
                ]);

            } catch (\Exception $e) {
                $conn->rollBack();
                throw $e;
            }

        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al crear entrenamiento: ' . $e->getMessage()
            ], 500);
        }
    }
}
