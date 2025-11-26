<?php

namespace App\Controller;

use App\Entity\Plan;
use App\Repository\PlanRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Controlador para gestionar Planes de Suscripción
 */
#[Route('/api/planes', name: 'api_planes_')]
class PlanController extends AbstractController
{
    private PlanRepository $planRepository;
    private EntityManagerInterface $entityManager;

    public function __construct(
        PlanRepository $planRepository,
        EntityManagerInterface $entityManager
    ) {
        $this->planRepository = $planRepository;
        $this->entityManager = $entityManager;
    }

    /**
     * Listar todos los planes activos
     * GET /api/planes
     */
    #[Route('', name: 'list', methods: ['GET'])]
    public function listarPlanes(): JsonResponse
    {
        try {
            $planes = $this->planRepository->findPlanesActivos();

            $data = array_map(function (Plan $plan) {
                return $this->serializePlan($plan);
            }, $planes);

            return $this->json([
                'success' => true,
                'planes' => $data,
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al obtener planes: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtener detalle de un plan específico
     * GET /api/planes/{id}
     */
    #[Route('/{id}', name: 'detail', methods: ['GET'])]
    public function detallePlan(int $id): JsonResponse
    {
        try {
            $plan = $this->planRepository->find($id);

            if (!$plan) {
                return $this->json([
                    'success' => false,
                    'error' => 'Plan no encontrado',
                ], Response::HTTP_NOT_FOUND);
            }

            return $this->json([
                'success' => true,
                'plan' => $this->serializePlan($plan),
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al obtener plan: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtener planes mensuales
     * GET /api/planes/mensuales
     */
    #[Route('/tipo/mensuales', name: 'mensuales', methods: ['GET'])]
    public function planesMensuales(): JsonResponse
    {
        try {
            $planes = $this->planRepository->findPlanesMensuales();

            $data = array_map(function (Plan $plan) {
                return $this->serializePlan($plan);
            }, $planes);

            return $this->json([
                'success' => true,
                'planes' => $data,
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al obtener planes mensuales',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtener planes anuales
     * GET /api/planes/anuales
     */
    #[Route('/tipo/anuales', name: 'anuales', methods: ['GET'])]
    public function planesAnuales(): JsonResponse
    {
        try {
            $planes = $this->planRepository->findPlanesAnuales();

            $data = array_map(function (Plan $plan) {
                return $this->serializePlan($plan);
            }, $planes);

            return $this->json([
                'success' => true,
                'planes' => $data,
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al obtener planes anuales',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Crear un nuevo plan (solo admin)
     * POST /api/planes
     */
      #[Route('', name: 'create', methods: ['POST'])]
    public function crearPlan(Request $request): JsonResponse
    {
        try {
            // TODO: Obtener usuario actual de la sesión
            // Por ahora comentamos la verificación para pruebas
            // $usuarioActual = null;
            // if (!$this->roleChecker->isAdmin($usuarioActual)) {
            //     return $this->roleChecker->denyAccess('Solo los administradores pueden crear planes');
            // }

            $data = json_decode($request->getContent(), true);

            // Validar datos obligatorios
            if (!isset($data['nombre']) || !isset($data['precio_mensual'])) {
                return $this->json([
                    'success' => false,
                    'error' => 'Nombre y precio mensual son obligatorios',
                ], Response::HTTP_BAD_REQUEST);
            }

            $plan = new Plan();
            $plan->setNombre($data['nombre']);
            $plan->setDescripcion($data['descripcion'] ?? null);
            $plan->setPrecioMensual($data['precio_mensual']);
            $plan->setPrecioAnual($data['precio_anual'] ?? null);
            $plan->setDuracionDias($data['duracion_dias'] ?? 30);
            $plan->setCaracteristicas($data['caracteristicas'] ?? []);
            $plan->setActivo($data['activo'] ?? true);
            $plan->setOrden($data['orden'] ?? 0);

            $this->entityManager->persist($plan);
            $this->entityManager->flush();

            return $this->json([
                'success' => true,
                'message' => 'Plan creado exitosamente',
                'plan' => $this->serializePlan($plan),
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al crear plan: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Actualizar un plan existente (solo admin)
     * PUT /api/planes/{id}
     */
    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function actualizarPlan(int $id, Request $request): JsonResponse
    {
        try {
            // TODO: Verificar que el usuario es admin

            $plan = $this->planRepository->find($id);

            if (!$plan) {
                return $this->json([
                    'success' => false,
                    'error' => 'Plan no encontrado',
                ], Response::HTTP_NOT_FOUND);
            }

            $data = json_decode($request->getContent(), true);

            if (isset($data['nombre'])) $plan->setNombre($data['nombre']);
            if (isset($data['descripcion'])) $plan->setDescripcion($data['descripcion']);
            if (isset($data['precio_mensual'])) $plan->setPrecioMensual($data['precio_mensual']);
            if (isset($data['precio_anual'])) $plan->setPrecioAnual($data['precio_anual']);
            if (isset($data['duracion_dias'])) $plan->setDuracionDias($data['duracion_dias']);
            if (isset($data['caracteristicas'])) $plan->setCaracteristicas($data['caracteristicas']);
            if (isset($data['activo'])) $plan->setActivo($data['activo']);
            if (isset($data['orden'])) $plan->setOrden($data['orden']);

            $this->entityManager->flush();

            return $this->json([
                'success' => true,
                'message' => 'Plan actualizado exitosamente',
                'plan' => $this->serializePlan($plan),
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al actualizar plan: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Desactivar un plan (solo admin)
     * DELETE /api/planes/{id}
     */
    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function desactivarPlan(int $id): JsonResponse
    {
        try {
            // TODO: Verificar que el usuario es admin

            $plan = $this->planRepository->find($id);

            if (!$plan) {
                return $this->json([
                    'success' => false,
                    'error' => 'Plan no encontrado',
                ], Response::HTTP_NOT_FOUND);
            }

            // No eliminamos, solo desactivamos
            $plan->setActivo(false);
            $this->entityManager->flush();

            return $this->json([
                'success' => true,
                'message' => 'Plan desactivado exitosamente',
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al desactivar plan: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Serializar un plan a array
     */
    private function serializePlan(Plan $plan): array
    {
        return [
            'id' => $plan->getId(),
            'nombre' => $plan->getNombre(),
            'descripcion' => $plan->getDescripcion(),
            'precio_mensual' => $plan->getPrecioMensual(),
            'precio_anual' => $plan->getPrecioAnual(),
            'duracion_dias' => $plan->getDuracionDias(),
            'caracteristicas' => $plan->getCaracteristicas(),
            'activo' => $plan->isActivo(),
            'orden' => $plan->getOrden(),
            'es_mensual' => $plan->esMensual(),
            'es_anual' => $plan->esAnual(),
            'precio_formateado' => $plan->getPrecioFormateado(),
        ];
    }
}