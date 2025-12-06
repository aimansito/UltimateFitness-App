<?php

namespace App\Controller;

use App\Repository\UsuarioRepository;
use App\Repository\SuscripcionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/entrenador')]
class MisClientesController extends AbstractController
{
    private UsuarioRepository $usuarioRepository;
    private SuscripcionRepository $suscripcionRepository;
    private EntityManagerInterface $entityManager;

    public function __construct(
        UsuarioRepository $usuarioRepository,
        SuscripcionRepository $suscripcionRepository,
        EntityManagerInterface $entityManager
    ) {
        $this->usuarioRepository = $usuarioRepository;
        $this->suscripcionRepository = $suscripcionRepository;
        $this->entityManager = $entityManager;
    }

    #[Route('/mis-clientes/{entrenadorId}', name: 'api_entrenador_mis_clientes', methods: ['GET'])]
    public function getMisClientes(int $entrenadorId): JsonResponse
    {
        try {
            // Query SQL directa para obtener clientes PREMIUM del entrenador
            // Ya no usamos la tabla servicios - consultamos directamente usuarios
            $sql = "
                SELECT 
                    u.id,
                    u.nombre,
                    u.apellidos,
                    u.email,
                    u.telefono,
                    u.objetivo,
                    u.peso_actual,
                    u.altura,
                    u.edad,
                    u.nivel_actividad,
                    u.es_premium,
                    DATE_FORMAT(u.fecha_registro, '%d/%m/%Y') as fecha_registro,
                    'Ultimate Premium' as plan
                FROM usuarios u
                WHERE u.entrenador_id = :entrenadorId 
                AND u.es_premium = 1
                ORDER BY u.nombre ASC
            ";

            $stmt = $this->entityManager->getConnection()->prepare($sql);
            $result = $stmt->executeQuery(['entrenadorId' => $entrenadorId]);
            $clientes = $result->fetchAllAssociative();

            // Formatear datos
            $clientesFormateados = array_map(function($cliente) {
                return [
                    'id' => (int) $cliente['id'],
                    'nombre' => $cliente['nombre'],
                    'apellidos' => $cliente['apellidos'],
                    'email' => $cliente['email'],
                    'telefono' => $cliente['telefono'],
                    'objetivo' => $cliente['objetivo'],
                    'peso_actual' => $cliente['peso_actual'] ? (float) $cliente['peso_actual'] : null,
                    'altura' => $cliente['altura'] ? (int) $cliente['altura'] : null,
                    'edad' => $cliente['edad'] ? (int) $cliente['edad'] : null,
                    'nivel_actividad' => $cliente['nivel_actividad'],
                    'es_premium' => (bool) $cliente['es_premium'],
                    'fecha_registro' => $cliente['fecha_registro'],
                    'plan' => $cliente['plan']
                ];
            }, $clientes);

            return $this->json([
                'success' => true,
                'total' => count($clientesFormateados),
                'clientes' => $clientesFormateados
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/cliente/{usuarioId}/dietas', name: 'api_entrenador_cliente_dietas', methods: ['GET'])]
    public function getDietasCliente(int $usuarioId): JsonResponse
    {
        try {
            $sql = "
                SELECT 
                    id,
                    nombre,
                    descripcion,
                    calorias_totales,
                    es_publica,
                    valoracion_promedio,
                    fecha_creacion
                FROM dietas
                WHERE creador_id = :usuarioId
                ORDER BY fecha_creacion DESC
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

    #[Route('/cliente/{usuarioId}/entrenamientos', name: 'api_entrenador_cliente_entrenamientos', methods: ['GET'])]
    public function getEntrenamientosCliente(int $usuarioId): JsonResponse
    {
        try {
            $sql = "
                SELECT 
                    id,
                    nombre,
                    descripcion,
                    tipo,
                    duracion_minutos,
                    nivel_dificultad,
                    es_publico,
                    valoracion_promedio,
                    fecha_creacion
                FROM entrenamientos
                WHERE creador_id = :usuarioId
                ORDER BY fecha_creacion DESC
            ";

            $stmt = $this->entityManager->getConnection()->prepare($sql);
            $result = $stmt->executeQuery(['usuarioId' => $usuarioId]);
            $entrenamientos = $result->fetchAllAssociative();

            return $this->json([
                'success' => true,
                'total' => count($entrenamientos),
                'entrenamientos' => $entrenamientos
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}