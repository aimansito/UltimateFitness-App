<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/entrenador')]
class GuardarDietaController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/crear-dieta', name: 'api_entrenador_crear_dieta', methods: ['POST'])]
    public function crearDieta(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            // Validaciones
            if (!isset($data['nombre']) || empty($data['nombre'])) {
                return $this->json(['success' => false, 'error' => 'El nombre de la dieta es obligatorio'], 400);
            }

            if (!isset($data['cliente_id']) || empty($data['cliente_id'])) {
                return $this->json(['success' => false, 'error' => 'El ID del cliente es obligatorio'], 400);
            }

            if (!isset($data['plan_semanal']) || empty($data['plan_semanal'])) {
                return $this->json(['success' => false, 'error' => 'El plan semanal es obligatorio'], 400);
            }

            // Validar que todos los días y momentos estén completos
            $diasRequeridos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
            $momentosRequeridos = ['desayuno', 'media_manana', 'almuerzo', 'merienda', 'cena', 'post_entreno'];
            
            $planSemanal = $data['plan_semanal'];
            
            foreach ($diasRequeridos as $dia) {
                if (!isset($planSemanal[$dia])) {
                    return $this->json(['success' => false, 'error' => "Falta el día: $dia"], 400);
                }
                
                foreach ($momentosRequeridos as $momento) {
                    if (!isset($planSemanal[$dia][$momento])) {
                        return $this->json(['success' => false, 'error' => "Falta el momento '$momento' en el día '$dia'"], 400);
                    }
                    
                    if (empty($planSemanal[$dia][$momento])) {
                        return $this->json(['success' => false, 'error' => "El momento '$momento' del día '$dia' está vacío. Todos los momentos deben tener al menos un plato."], 400);
                    }
                }
            }

            $conn = $this->entityManager->getConnection();
            $conn->beginTransaction();

            try {
                // 1. Insertar dieta
                $sqlDieta = "
                    INSERT INTO dietas (
                        nombre,
                        descripcion,
                        creador_id,
                        asignado_a_usuario_id,
                        calorias_totales,
                        es_publica,
                        fecha_creacion
                    ) VALUES (
                        :nombre,
                        :descripcion,
                        :creador_id,
                        :cliente_id,
                        :calorias,
                        0,
                        NOW()
                    )
                ";

                $stmt = $conn->prepare($sqlDieta);
                $stmt->executeStatement([
                    'nombre' => $data['nombre'],
                    'descripcion' => $data['descripcion'] ?? null,
                    'creador_id' => $data['creador_id'],
                    'cliente_id' => $data['cliente_id'],
                    'calorias' => $data['calorias_totales'] ?? 0
                ]);

                $dietaId = $conn->lastInsertId();

                // 2. Insertar en calendario_usuario para todos los días
                $sqlCalendario = "
                    INSERT INTO calendario_usuario (
                        usuario_id,
                        dieta_id,
                        dia_semana,
                        fecha_asignacion,
                        completado
                    ) VALUES (
                        :usuario_id,
                        :dieta_id,
                        :dia_semana,
                        NOW(),
                        0
                    )
                ";

                foreach ($diasRequeridos as $dia) {
                    $stmt = $conn->prepare($sqlCalendario);
                    $stmt->executeStatement([
                        'usuario_id' => $data['cliente_id'],
                        'dieta_id' => $dietaId,
                        'dia_semana' => $dia
                    ]);
                }

                // 3. Insertar en dieta_platos (nueva tabla)
                $sqlDietaPlatos = "
                    INSERT INTO dieta_platos (
                        dieta_id,
                        plato_id,
                        dia_semana,
                        tipo_comida,
                        orden
                    ) VALUES (
                        :dieta_id,
                        :plato_id,
                        :dia_semana,
                        :tipo_comida,
                        :orden
                    )
                ";

                foreach ($planSemanal as $dia => $momentos) {
                    foreach ($momentos as $momento => $items) {
                        $orden = 1;
                        
                        foreach ($items as $item) {
                            // Determinar plato_id
                            $platoId = null;
                            
                            if (isset($item['plato_id'])) {
                                // Es un plato predefinido
                                $platoId = $item['plato_id'];
                            } elseif (isset($item['tipo']) && ($item['tipo'] === 'plato' || $item['tipo'] === 'plato_personalizado')) {
                                // Es un plato personalizado recién creado
                                // Primero crear el plato
                                $sqlCrearPlato = "
                                    INSERT INTO platos (
                                        nombre,
                                        descripcion,
                                        tipo_comida,
                                        calorias_totales,
                                        proteinas_totales,
                                        carbohidratos_totales,
                                        grasas_totales,
                                        creador_id,
                                        es_publico,
                                        fecha_creacion
                                    ) VALUES (
                                        :nombre,
                                        :descripcion,
                                        :tipo_comida,
                                        :calorias,
                                        :proteinas,
                                        :carbohidratos,
                                        :grasas,
                                        :creador_id,
                                        0,
                                        NOW()
                                    )
                                ";
                                
                                $stmtPlato = $conn->prepare($sqlCrearPlato);
                                $stmtPlato->executeStatement([
                                    'nombre' => $item['nombre'],
                                    'descripcion' => $item['descripcion'] ?? 'Plato personalizado',
                                    'tipo_comida' => $momento,
                                    'calorias' => $item['calorias'] ?? 0,
                                    'proteinas' => $item['proteinas'] ?? 0,
                                    'carbohidratos' => $item['carbohidratos'] ?? 0,
                                    'grasas' => $item['grasas'] ?? 0,
                                    'creador_id' => $data['creador_id']
                                ]);
                                
                                $platoId = $conn->lastInsertId();
                                
                                // Insertar ingredientes en plato_alimentos
                                if (isset($item['ingredientes']) && is_array($item['ingredientes'])) {
                                    $sqlPlatoAlimento = "
                                        INSERT INTO plato_alimentos (
                                            plato_id,
                                            alimento_id,
                                            cantidad_gramos,
                                            orden
                                        ) VALUES (
                                            :plato_id,
                                            :alimento_id,
                                            :cantidad_gramos,
                                            :orden
                                        )
                                    ";
                                    
                                    $ordenIngrediente = 1;
                                    foreach ($item['ingredientes'] as $ingrediente) {
                                        $stmtIngrediente = $conn->prepare($sqlPlatoAlimento);
                                        $stmtIngrediente->executeStatement([
                                            'plato_id' => $platoId,
                                            'alimento_id' => $ingrediente['alimentoId'],
                                            'cantidad_gramos' => $ingrediente['cantidad'],
                                            'orden' => $ordenIngrediente
                                        ]);
                                        $ordenIngrediente++;
                                    }
                                }
                            }
                            
                            if ($platoId) {
                                // Insertar en dieta_platos
                                $stmt = $conn->prepare($sqlDietaPlatos);
                                $stmt->executeStatement([
                                    'dieta_id' => $dietaId,
                                    'plato_id' => $platoId,
                                    'dia_semana' => $dia,
                                    'tipo_comida' => $momento,
                                    'orden' => $orden
                                ]);
                                $orden++;
                            }
                        }
                    }
                }

                $conn->commit();

                return $this->json([
                    'success' => true,
                    'message' => 'Dieta creada y asignada correctamente',
                    'dieta_id' => $dietaId
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