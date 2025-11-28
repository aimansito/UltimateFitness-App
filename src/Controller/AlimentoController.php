<?php

namespace App\Controller;

use App\Entity\Alimento;
use App\Repository\AlimentoRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Controlador para gestión de Alimentos
 */
#[Route('/api', name: 'api_alimentos_')]
class AlimentoController extends AbstractController
{
    private AlimentoRepository $alimentoRepository;
    private EntityManagerInterface $entityManager;

    public function __construct(
        AlimentoRepository $alimentoRepository,
        EntityManagerInterface $entityManager
    ) {
        $this->alimentoRepository = $alimentoRepository;
        $this->entityManager = $entityManager;
    }

    // ============================================
    // ENDPOINTS PÚBLICOS
    // ============================================

    /**
     * Listar todos los alimentos
     * GET /api/alimentos
     */
    #[Route('/alimentos', name: 'list', methods: ['GET'])]
    public function listarAlimentos(Request $request): JsonResponse
    {
        try {
            $tipo = $request->query->get('tipo');

            if ($tipo) {
                $alimentos = $this->alimentoRepository->findBy(['tipoAlimento' => $tipo]);
            } else {
                $alimentos = $this->alimentoRepository->findAll();
            }

            $data = array_map(function($alimento) {
                return [
                    'id' => $alimento->getId(),
                    'nombre' => $alimento->getNombre(),
                    'tipo_alimento' => $alimento->getTipoAlimento(),
                    'categoria' => $alimento->getTipoAlimento(),
                    'calorias' => (float) $alimento->getCalorias(),
                    'proteinas' => (float) $alimento->getProteinas(),
                    'carbohidratos' => (float) $alimento->getCarbohidratos(),
                    'grasas' => (float) $alimento->getGrasas(),
                    'descripcion' => $alimento->getDescripcion(),
                    'precio_kg' => (float) $alimento->getPrecioKg(),
                    'imagen_url' => $alimento->getImagenUrl(),
                ];
            }, $alimentos);

            return $this->jsonWithUnicode([
                'success' => true,
                'alimentos' => $data,
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al obtener alimentos: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtener un alimento por ID
     * GET /api/alimentos/{id}
     */
    #[Route('/alimentos/{id}', name: 'detail', methods: ['GET'])]
    public function obtenerAlimento(int $id): JsonResponse
    {
        try {
            $alimento = $this->alimentoRepository->find($id);

            if (!$alimento) {
                return $this->jsonWithUnicode([
                    'success' => false,
                    'error' => 'Alimento no encontrado',
                ], Response::HTTP_NOT_FOUND);
            }

            return $this->jsonWithUnicode([
                'success' => true,
                'alimento' => [
                    'id' => $alimento->getId(),
                    'nombre' => $alimento->getNombre(),
                    'tipo_alimento' => $alimento->getTipoAlimento(),
                    'calorias' => (float) $alimento->getCalorias(),
                    'proteinas' => (float) $alimento->getProteinas(),
                    'carbohidratos' => (float) $alimento->getCarbohidratos(),
                    'grasas' => (float) $alimento->getGrasas(),
                    'descripcion' => $alimento->getDescripcion(),
                    'precio_kg' => (float) $alimento->getPrecioKg(),
                    'imagen_url' => $alimento->getImagenUrl(),
                ],
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al obtener alimento: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Buscar alimentos por nombre
     * GET /api/alimentos/buscar?q=pollo
     */
    #[Route('/alimentos/buscar', name: 'search', methods: ['GET'])]
    public function buscarAlimentos(Request $request): JsonResponse
    {
        try {
            $query = $request->query->get('q', '');

            if (empty($query)) {
                return $this->jsonWithUnicode([
                    'success' => false,
                    'error' => 'Parámetro de búsqueda requerido',
                ], Response::HTTP_BAD_REQUEST);
            }

            $alimentos = $this->alimentoRepository->buscarPorNombre($query);

            $data = array_map(function($alimento) {
                return [
                    'id' => $alimento->getId(),
                    'nombre' => $alimento->getNombre(),
                    'tipo_alimento' => $alimento->getTipoAlimento(),
                    'calorias' => (float) $alimento->getCalorias(),
                    'proteinas' => (float) $alimento->getProteinas(),
                    'carbohidratos' => (float) $alimento->getCarbohidratos(),
                    'grasas' => (float) $alimento->getGrasas(),
                ];
            }, $alimentos);

            return $this->jsonWithUnicode([
                'success' => true,
                'alimentos' => $data,
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al buscar alimentos: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Alimentos por tipo
     * GET /api/alimentos/tipo/{tipo}
     */
    #[Route('/alimentos/tipo/{tipo}', name: 'by_type', methods: ['GET'])]
    public function alimentosPorTipo(string $tipo): JsonResponse
    {
        try {
            $alimentos = $this->alimentoRepository->findBy(['tipoAlimento' => $tipo]);

            $data = array_map(function($alimento) {
                return [
                    'id' => $alimento->getId(),
                    'nombre' => $alimento->getNombre(),
                    'tipo_alimento' => $alimento->getTipoAlimento(),
                    'calorias' => (float) $alimento->getCalorias(),
                    'proteinas' => (float) $alimento->getProteinas(),
                    'carbohidratos' => (float) $alimento->getCarbohidratos(),
                    'grasas' => (float) $alimento->getGrasas(),
                    'descripcion' => $alimento->getDescripcion(),
                ];
            }, $alimentos);

            return $this->jsonWithUnicode([
                'success' => true,
                'tipo' => $tipo,
                'alimentos' => $data,
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al obtener alimentos: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // ============================================
    // ENDPOINTS DE ADMIN
    // ============================================

    /**
     * Crear nuevo alimento (admin)
     * POST /api/admin/alimentos
     */
    #[Route('/admin/alimentos', name: 'create', methods: ['POST'])]
    public function crearAlimento(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!isset($data['nombre']) || !isset($data['tipo_alimento'])) {
                return $this->jsonWithUnicode([
                    'success' => false,
                    'error' => 'Nombre y tipo de alimento son obligatorios',
                ], Response::HTTP_BAD_REQUEST);
            }

            $alimento = new Alimento();
            $alimento->setNombre($data['nombre']);
            $alimento->setTipoAlimento($data['tipo_alimento']);
            $alimento->setCalorias($data['calorias'] ?? '0');
            $alimento->setProteinas($data['proteinas'] ?? '0');
            $alimento->setCarbohidratos($data['carbohidratos'] ?? '0');
            $alimento->setGrasas($data['grasas'] ?? '0');
            $alimento->setPrecioKg($data['precio_kg'] ?? '0');
            $alimento->setDescripcion($data['descripcion'] ?? null);
            $alimento->setImagenUrl($data['imagen_url'] ?? null);

            $this->entityManager->persist($alimento);
            $this->entityManager->flush();

            return $this->jsonWithUnicode([
                'success' => true,
                'message' => 'Alimento creado exitosamente',
                'alimento' => [
                    'id' => $alimento->getId(),
                    'nombre' => $alimento->getNombre(),
                ],
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al crear alimento: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Actualizar alimento (admin)
     * PUT /api/admin/alimentos/{id}
     */
    #[Route('/admin/alimentos/{id}', name: 'update', methods: ['PUT'])]
    public function actualizarAlimento(int $id, Request $request): JsonResponse
    {
        try {
            $alimento = $this->alimentoRepository->find($id);

            if (!$alimento) {
                return $this->jsonWithUnicode([
                    'success' => false,
                    'error' => 'Alimento no encontrado',
                ], Response::HTTP_NOT_FOUND);
            }

            $data = json_decode($request->getContent(), true);

            if (isset($data['nombre'])) $alimento->setNombre($data['nombre']);
            if (isset($data['tipo_alimento'])) $alimento->setTipoAlimento($data['tipo_alimento']);
            if (isset($data['calorias'])) $alimento->setCalorias($data['calorias']);
            if (isset($data['proteinas'])) $alimento->setProteinas($data['proteinas']);
            if (isset($data['carbohidratos'])) $alimento->setCarbohidratos($data['carbohidratos']);
            if (isset($data['grasas'])) $alimento->setGrasas($data['grasas']);
            if (isset($data['precio_kg'])) $alimento->setPrecioKg($data['precio_kg']);
            if (isset($data['descripcion'])) $alimento->setDescripcion($data['descripcion']);
            if (isset($data['imagen_url'])) $alimento->setImagenUrl($data['imagen_url']);

            $this->entityManager->flush();

            return $this->jsonWithUnicode([
                'success' => true,
                'message' => 'Alimento actualizado exitosamente',
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al actualizar alimento: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Eliminar alimento (admin)
     * DELETE /api/admin/alimentos/{id}
     */
    #[Route('/admin/alimentos/{id}', name: 'delete', methods: ['DELETE'])]
    public function eliminarAlimento(int $id): JsonResponse
    {
        try {
            $alimento = $this->alimentoRepository->find($id);

            if (!$alimento) {
                return $this->jsonWithUnicode([
                    'success' => false,
                    'error' => 'Alimento no encontrado',
                ], Response::HTTP_NOT_FOUND);
            }

            $this->entityManager->remove($alimento);
            $this->entityManager->flush();

            return $this->jsonWithUnicode([
                'success' => true,
                'message' => 'Alimento eliminado exitosamente',
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al eliminar alimento: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    private function jsonWithUnicode($data, int $status = 200, array $headers = [], array $context = []): JsonResponse
    {
        $response = $this->json($data, $status, $headers, $context);
        $response->setEncodingOptions($response->getEncodingOptions() | JSON_UNESCAPED_UNICODE);
        return $response;
    }
}