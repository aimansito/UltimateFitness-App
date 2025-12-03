<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/entrenador')]
class CrearEntrenamientoController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/crear-entrenamiento', name: 'api_entrenador_crear_entrenamiento', methods: ['POST'])]
    public function crearEntrenamiento(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            // Validaciones básicas
            if (!isset($data['nombre']) || empty($data['nombre'])) {
                return $this->json(['success' => false, 'error' => 'El nombre del entrenamiento es obligatorio'], 400);
            }

            if (!isset($data['cliente_id']) || empty($data['cliente_id'])) {
                return $this->json(['success' => false, 'error' => 'El ID del cliente es obligatorio'], 400);
            }

            if (!isset($data['plan_semanal']) || empty($data['plan_semanal'])) {
                return $this->json(['success' => false, 'error' => 'El plan semanal es obligatorio'], 400);
            }

            // Validar que haya al menos 5 días activos (no de descanso)
            $diasActivos = 0;
            foreach ($data['plan_semanal'] as $dia) {
                if (!$dia['es_descanso']) {
                    $diasActivos++;
                }
            }

            if ($diasActivos < 5) {
                return $this->json([
                    'success' => false, 
                    'error' => 'Debes tener al menos 5 días activos (no de descanso). Actualmente tienes ' . $diasActivos
                ], 400);
            }

            // Validar que los días activos tengan al menos 1 ejercicio
            foreach ($data['plan_semanal'] as $dia) {
                if (!$dia['es_descanso']) {
                    if (!isset($dia['ejercicios']) || count($dia['ejercicios']) === 0) {
                        return $this->json([
                            'success' => false,
                            'error' => 'El día "' . $dia['dia_nombre'] . '" está activo pero no tiene ejercicios. Añade al menos 1 ejercicio o márcalo como descanso.'
                        ], 400);
                    }
                }
            }

            $conn = $this->entityManager->getConnection();
            $conn->beginTransaction();

            try {
                // 1. Insertar entrenamiento
                $sqlEntrenamiento = "
                    INSERT INTO entrenamientos (
                        nombre,
                        descripcion,
                        tipo,
                        creador_id,
                        asignado_a_usuario_id,
                        duracion_minutos,
                        nivel_dificultad,
                        es_publico,
                        fecha_creacion
                    ) VALUES (
                        :nombre,
                        :descripcion,
                        :tipo,
                        :creador_id,
                        :cliente_id,
                        :duracion,
                        :nivel,
                        0,
                        NOW()
                    )
                ";

                $stmt = $conn->prepare($sqlEntrenamiento);
                $stmt->executeStatement([
                    'nombre' => $data['nombre'],
                    'descripcion' => $data['descripcion'] ?? '',
                    'tipo' => $data['tipo'] ?? 'gym',
                    'creador_id' => $data['creador_id'],
                    'cliente_id' => $data['cliente_id'],
                    'duracion' => $data['duracion_minutos'] ?? 60,
                    'nivel' => $data['nivel_dificultad'] ?? 'intermedio'
                ]);

                $entrenamientoId = $conn->lastInsertId();

                // 2. Insertar días de entrenamiento
                $diasSemana = ['lunes' => 1, 'martes' => 2, 'miercoles' => 3, 'jueves' => 4, 'viernes' => 5, 'sabado' => 6, 'domingo' => 7];
                
                foreach ($data['plan_semanal'] as $dia) {
                    $diaSemanaNum = $diasSemana[$dia['dia_nombre']];
                    
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
                        'dia_semana' => $diaSemanaNum,
                        'concepto' => $dia['concepto'] ?? '',
                        'es_descanso' => $dia['es_descanso'] ? 1 : 0,
                        'orden' => $diaSemanaNum
                    ]);

                    $diaId = $conn->lastInsertId();

                    // 3. Insertar ejercicios del día (solo si no es descanso)
                    if (!$dia['es_descanso'] && isset($dia['ejercicios'])) {
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
                                'descanso' => $ejercicio['descanso_segundos'] ?? 60,
                                'notas' => $ejercicio['notas'] ?? '',
                                'orden' => $orden
                            ]);
                            
                            $orden++;
                        }
                    }
                }

                // 4. Insertar en calendario_usuario (7 días de la semana)
                $diasSemanaTexto = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
                
                foreach ($diasSemanaTexto as $dia) {
                    $sqlCalendario = "
                        INSERT INTO calendario_usuario (
                            usuario_id,
                            entrenamiento_id,
                            dia_semana,
                            fecha_asignacion,
                            completado
                        ) VALUES (
                            :usuario_id,
                            :entrenamiento_id,
                            :dia_semana,
                            NOW(),
                            0
                        )
                    ";

                    $stmt = $conn->prepare($sqlCalendario);
                    $stmt->executeStatement([
                        'usuario_id' => $data['cliente_id'],
                        'entrenamiento_id' => $entrenamientoId,
                        'dia_semana' => $dia
                    ]);
                }

                $conn->commit();

                return $this->json([
                    'success' => true,
                    'message' => 'Entrenamiento creado y asignado correctamente',
                    'entrenamiento_id' => $entrenamientoId
                ]);

            } catch (\Exception $e) {
                $conn->rollBack();
                throw $e;
            }

        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}