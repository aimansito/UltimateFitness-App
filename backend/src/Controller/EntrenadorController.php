<?php

namespace App\Controller;

use App\Entity\Entrenador;
use App\Repository\EntrenadorRepository;
use App\Repository\UsuarioRepository;
use App\Repository\EntrenamientoRepository;
use App\Repository\DietaRepository;
use App\Security\RoleChecker;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Controlador para gestión de Entrenadores
 * Incluye funcionalidad para panel de admin
 */
#[Route('/api/entrenadores', name: 'api_entrenadores_')]
class EntrenadorController extends AbstractController
{
    private EntrenadorRepository $entrenadorRepository;
    private UsuarioRepository $usuarioRepository;
    private EntrenamientoRepository $entrenamientoRepository;
    private DietaRepository $dietaRepository;
    private EntityManagerInterface $entityManager;
    private RoleChecker $roleChecker;

    public function __construct(
        EntrenadorRepository $entrenadorRepository,
        UsuarioRepository $usuarioRepository,
        EntrenamientoRepository $entrenamientoRepository,
        DietaRepository $dietaRepository,
        EntityManagerInterface $entityManager,
        RoleChecker $roleChecker
    ) {
        $this->entrenadorRepository = $entrenadorRepository;
        $this->usuarioRepository = $usuarioRepository;
        $this->entrenamientoRepository = $entrenamientoRepository;
        $this->dietaRepository = $dietaRepository;
        $this->entityManager = $entityManager;
        $this->roleChecker = $roleChecker;
    }

    // ============================================
    // ENDPOINTS PÚBLICOS
    // ============================================

    /**
     * Listar entrenadores activos (público)
     * GET /api/entrenadores
     */
    #[Route('', name: 'list', methods: ['GET'])]
    public function listarEntrenadores(Request $request): JsonResponse
    {
        try {
            $especialidad = $request->query->get('especialidad');

            if ($especialidad) {
                $entrenadores = $this->entrenadorRepository->findByEspecialidad($especialidad);
            } else {
                $entrenadores = $this->entrenadorRepository->findActivos();
            }

            $data = array_map(function (Entrenador $entrenador) {
                return $this->serializeEntrenador($entrenador);
            }, $entrenadores);

            return $this->json([
                'success' => true,
                'entrenadores' => $data,
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al obtener entrenadores: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtener detalle de un entrenador (público)
     * GET /api/entrenadores/{id}
     */
    #[Route('/{id}', name: 'detail', methods: ['GET'])]
    public function detalleEntrenador(int $id): JsonResponse
    {
        try {
            $entrenador = $this->entrenadorRepository->find($id);

            if (!$entrenador) {
                return $this->json([
                    'success' => false,
                    'error' => 'Entrenador no encontrado',
                ], Response::HTTP_NOT_FOUND);
            }

            return $this->json([
                'success' => true,
                'entrenador' => $this->serializeEntrenador($entrenador, true),
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al obtener entrenador: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Listar entrenadores mejor valorados (público)
     * GET /api/entrenadores/mejores/valorados
     */
    #[Route('/mejores/valorados', name: 'best_rated', methods: ['GET'])]
    public function mejorValorados(Request $request): JsonResponse
    {
        try {
            $limit = $request->query->getInt('limit', 10);
            $entrenadores = $this->entrenadorRepository->findMejorValorados($limit);

            $data = array_map(function (Entrenador $entrenador) {
                return $this->serializeEntrenador($entrenador);
            }, $entrenadores);

            return $this->json([
                'success' => true,
                'entrenadores' => $data,
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al obtener entrenadores: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // ============================================
    // ENDPOINTS DE ADMIN - GESTIÓN
    // ============================================

    /**
     * Listar todos los entrenadores (admin)
     * GET /api/entrenadores/admin/all
     */
    #[Route('/admin/all', name: 'admin_list', methods: ['GET'])]
    public function listarTodosAdmin(Request $request): JsonResponse
    {
        try {
            // TODO: Verificar que el usuario es admin
            // $usuarioActual = $this->getUser();
            // if (!$this->roleChecker->isAdmin($usuarioActual)) {
            //     return $this->roleChecker->denyAccess();
            // }

            $page = $request->query->getInt('page', 1);
            $limit = $request->query->getInt('limit', 20);
            $search = $request->query->get('search');
            $especialidad = $request->query->get('especialidad');
            $estado = $request->query->get('estado');

            if ($search || $especialidad || $estado) {
                $entrenadores = $this->entrenadorRepository->searchEntrenadores(
                    $search,
                    $especialidad,
                    null,
                    $estado
                );
            } else {
                $entrenadores = $this->entrenadorRepository->findAllPaginated($page, $limit);
            }

            $data = array_map(function (Entrenador $entrenador) {
                return $this->serializeEntrenador($entrenador, true);
            }, $entrenadores);

            return $this->json([
                'success' => true,
                'entrenadores' => $data,
                'total' => $this->entrenadorRepository->countTotal(),
                'page' => $page,
                'limit' => $limit,
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al obtener entrenadores: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Crear nuevo entrenador (admin)
     * POST /api/entrenadores
     */
    #[Route('', name: 'create', methods: ['POST'])]
    public function crearEntrenador(
        Request $request,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        try {
            // TODO: Verificar que el usuario es admin
            // $usuarioActual = $this->getUser();
            // if (!$this->roleChecker->isAdmin($usuarioActual)) {
            //     return $this->roleChecker->denyAccess();
            // }

            $data = json_decode($request->getContent(), true);

            // Validar datos obligatorios
            if (!isset($data['nombre']) || !isset($data['email']) || !isset($data['password'])) {
                return $this->json([
                    'success' => false,
                    'error' => 'Nombre, email y password son obligatorios',
                ], Response::HTTP_BAD_REQUEST);
            }

            // Verificar si el email ya existe
            if ($this->entrenadorRepository->findByEmail($data['email'])) {
                return $this->json([
                    'success' => false,
                    'error' => 'El email ya está registrado',
                ], Response::HTTP_CONFLICT);
            }

            $entrenador = new Entrenador();
            $entrenador->setNombre($data['nombre']);
            $entrenador->setApellidos($data['apellidos'] ?? '');
            $entrenador->setEmail($data['email']);
            $entrenador->setTelefono($data['telefono'] ?? null);
            $entrenador->setEspecialidad($data['especialidad'] ?? 'ambos');
            $entrenador->setBiografia($data['biografia'] ?? null);
            $entrenador->setCertificacion($data['certificacion'] ?? null);
            $entrenador->setAnosExperiencia($data['anos_experiencia'] ?? 0);
            $entrenador->setPrecioSesionPresencial($data['precio_sesion'] ?? '35.00');
            $entrenador->setActivo($data['activo'] ?? true);
            $entrenador->setEstadoAplicacion($data['estado_aplicacion'] ?? 'aprobado');

            // Hashear contraseña (temporal para entrenadores - mejorar después)
            $hashedPassword = $passwordHasher->hashPassword($entrenador, $data['password']);
            $entrenador->setPasswordHash($hashedPassword);


            $this->entrenadorRepository->save($entrenador);

            return $this->json([
                'success' => true,
                'message' => 'Entrenador creado exitosamente',
                'entrenador' => $this->serializeEntrenador($entrenador),
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al crear entrenador: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Actualizar entrenador (admin)
     * PUT /api/entrenadores/{id}
     */
    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function actualizarEntrenador(int $id, Request $request): JsonResponse
    {
        try {
            // TODO: Verificar que el usuario es admin
            // $usuarioActual = $this->getUser();
            // if (!$this->roleChecker->isAdmin($usuarioActual)) {
            //     return $this->roleChecker->denyAccess();
            // }

            $entrenador = $this->entrenadorRepository->find($id);

            if (!$entrenador) {
                return $this->json([
                    'success' => false,
                    'error' => 'Entrenador no encontrado',
                ], Response::HTTP_NOT_FOUND);
            }

            $data = json_decode($request->getContent(), true);

            if (isset($data['nombre'])) $entrenador->setNombre($data['nombre']);
            if (isset($data['apellidos'])) $entrenador->setApellidos($data['apellidos']);
            if (isset($data['email'])) $entrenador->setEmail($data['email']);
            if (isset($data['telefono'])) $entrenador->setTelefono($data['telefono']);
            if (isset($data['especialidad'])) $entrenador->setEspecialidad($data['especialidad']);
            if (isset($data['biografia'])) $entrenador->setBiografia($data['biografia']);
            if (isset($data['certificacion'])) $entrenador->setCertificacion($data['certificacion']);
            if (isset($data['anos_experiencia'])) $entrenador->setAnosExperiencia($data['anos_experiencia']);
            if (isset($data['precio_sesion'])) $entrenador->setPrecioSesionPresencial($data['precio_sesion']);
            if (isset($data['activo'])) $entrenador->setActivo($data['activo']);

            $this->entityManager->flush();

            return $this->json([
                'success' => true,
                'message' => 'Entrenador actualizado exitosamente',
                'entrenador' => $this->serializeEntrenador($entrenador),
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al actualizar entrenador: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Eliminar entrenador (admin)
     * DELETE /api/entrenadores/{id}
     */
    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function eliminarEntrenador(int $id): JsonResponse
    {
        try {
            // TODO: Verificar que el usuario es admin
            // $usuarioActual = $this->getUser();
            // if (!$this->roleChecker->isAdmin($usuarioActual)) {
            //     return $this->roleChecker->denyAccess();
            // }

            $entrenador = $this->entrenadorRepository->find($id);

            if (!$entrenador) {
                return $this->json([
                    'success' => false,
                    'error' => 'Entrenador no encontrado',
                ], Response::HTTP_NOT_FOUND);
            }

            // No eliminamos, solo desactivamos
            $entrenador->setActivo(false);
            $this->entityManager->flush();

            return $this->json([
                'success' => true,
                'message' => 'Entrenador desactivado exitosamente',
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al eliminar entrenador: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // ============================================
    // ENDPOINTS DE ADMIN - APLICACIONES
    // ============================================

    /**
     * Listar aplicaciones pendientes (admin)
     * GET /api/entrenadores/aplicaciones/pendientes
     */
    #[Route('/aplicaciones/pendientes', name: 'applications_pending', methods: ['GET'])]
    public function aplicacionesPendientes(): JsonResponse
    {
        try {
            // TODO: Verificar que el usuario es admin
            // $usuarioActual = $this->getUser();
            // if (!$this->roleChecker->isAdmin($usuarioActual)) {
            //     return $this->roleChecker->denyAccess();
            // }

            $entrenadores = $this->entrenadorRepository->findAplicacionesPendientes();

            $data = array_map(function (Entrenador $entrenador) {
                return $this->serializeEntrenador($entrenador, true);
            }, $entrenadores);

            return $this->json([
                'success' => true,
                'aplicaciones' => $data,
                'total' => count($data),
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al obtener aplicaciones: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Aprobar aplicación de entrenador (admin)
     * POST /api/entrenadores/{id}/aprobar
     */
    #[Route('/{id}/aprobar', name: 'approve', methods: ['POST'])]
    public function aprobarAplicacion(int $id): JsonResponse
    {
        try {
            // TODO: Obtener usuario actual
            $adminId = 1; // Temporal - usar $this->getUser()->getId()

            // TODO: Verificar que el usuario es admin
            // $usuarioActual = $this->getUser();
            // if (!$this->roleChecker->isAdmin($usuarioActual)) {
            //     return $this->roleChecker->denyAccess();
            // }

            $entrenador = $this->entrenadorRepository->find($id);

            if (!$entrenador) {
                return $this->json([
                    'success' => false,
                    'error' => 'Entrenador no encontrado',
                ], Response::HTTP_NOT_FOUND);
            }

            $entrenador->aprobar($adminId);
            $this->entityManager->flush();

            return $this->json([
                'success' => true,
                'message' => 'Aplicación aprobada exitosamente',
                'entrenador' => $this->serializeEntrenador($entrenador),
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al aprobar aplicación: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Rechazar aplicación de entrenador (admin)
     * POST /api/entrenadores/{id}/rechazar
     */
    #[Route('/{id}/rechazar', name: 'reject', methods: ['POST'])]
    public function rechazarAplicacion(int $id, Request $request): JsonResponse
    {
        try {
            // TODO: Obtener usuario actual
            $adminId = 1; // Temporal - usar $this->getUser()->getId()

            // TODO: Verificar que el usuario es admin
            // $usuarioActual = $this->getUser();
            // if (!$this->roleChecker->isAdmin($usuarioActual)) {
            //     return $this->roleChecker->denyAccess();
            // }

            $entrenador = $this->entrenadorRepository->find($id);

            if (!$entrenador) {
                return $this->json([
                    'success' => false,
                    'error' => 'Entrenador no encontrado',
                ], Response::HTTP_NOT_FOUND);
            }

            $data = json_decode($request->getContent(), true);
            $motivo = $data['motivo'] ?? 'No cumple con los requisitos';

            $entrenador->rechazar($adminId, $motivo);
            $this->entityManager->flush();

            return $this->json([
                'success' => true,
                'message' => 'Aplicación rechazada',
                'entrenador' => $this->serializeEntrenador($entrenador),
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al rechazar aplicación: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // ============================================
    // ENDPOINTS DE ESTADÍSTICAS
    // ============================================

    /**
     * Obtener estadísticas de entrenadores (admin)
     * GET /api/entrenadores/estadisticas
     */
    #[Route('/admin/estadisticas', name: 'stats', methods: ['GET'])]
    public function estadisticas(): JsonResponse
    {
        try {
            // TODO: Verificar que el usuario es admin
            // $usuarioActual = $this->getUser();
            // if (!$this->roleChecker->isAdmin($usuarioActual)) {
            //     return $this->roleChecker->denyAccess();
            // }

            $estadisticas = $this->entrenadorRepository->getEstadisticas();
            $estadisticas['valoracion_promedio_global'] = $this->entrenadorRepository->getValoracionPromedioGlobal();

            return $this->json([
                'success' => true,
                'estadisticas' => $estadisticas,
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al obtener estadísticas: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // ============================================
    // ENDPOINTS DE DASHBOARD
    // ============================================

    /**
     * Obtener estadísticas del dashboard para un entrenador
     * GET /api/entrenadores/{id}/dashboard-stats
     */
    #[Route('/{id}/dashboard-stats', name: 'dashboard_stats', methods: ['GET'])]
    public function dashboardStats(int $id): JsonResponse
    {
        try {
            $entrenador = $this->entrenadorRepository->find($id);

            if (!$entrenador) {
                return $this->json([
                    'success' => false,
                    'error' => 'Entrenador no encontrado',
                ], Response::HTTP_NOT_FOUND);
            }

            // Obtener conteos reales
            $totalClientes = $this->usuarioRepository->count(['entrenadorAsignado' => $entrenador]);
            $totalEntrenamientos = $this->entrenamientoRepository->count(['creador' => $entrenador]);
            $totalDietas = $this->dietaRepository->count(['creador' => $entrenador]);

            return $this->json([
                'success' => true,
                'estadisticas' => [
                    'total_clientes' => $totalClientes,
                    'entrenamientos_asignados' => $totalEntrenamientos,
                    'dietas_asignadas' => $totalDietas,
                ]
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al obtener estadísticas del dashboard: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // ============================================
    // MÉTODO AUXILIAR
    // ============================================

    /**
     * Serializar entrenador a array
     */
    private function serializeEntrenador(Entrenador $entrenador, bool $includePrivate = false): array
    {
        $data = [
            'id' => $entrenador->getId(),
            'nombre' => $entrenador->getNombre(),
            'apellidos' => $entrenador->getApellidos(),
            'nombre_completo' => $entrenador->getNombreCompleto(),
            'email' => $entrenador->getEmail(),
            'telefono' => $entrenador->getTelefono(),
            'especialidad' => $entrenador->getEspecialidad(),
            'especialidad_formateada' => $entrenador->getEspecialidadFormateada(),
            'biografia' => $entrenador->getBiografia(),
            'anos_experiencia' => $entrenador->getAnosExperiencia(),
            'valoracion_promedio' => $entrenador->getValoracionPromedio(),
            'total_valoraciones' => $entrenador->getTotalValoraciones(),
            'precio_sesion_presencial' => $entrenador->getPrecioSesionPresencial(),
            'activo' => $entrenador->isActivo(),
            'foto_url' => $entrenador->getFotoUrl(),
        ];

        // Incluir datos privados solo para admin
        if ($includePrivate) {
            $data['certificacion'] = $entrenador->getCertificacion();
            $data['cv_url'] = $entrenador->getCvUrl();
            $data['estado_aplicacion'] = $entrenador->getEstadoAplicacion();
            $data['motivo_rechazo'] = $entrenador->getMotivoRechazo();
            $data['fecha_aplicacion'] = $entrenador->getFechaAplicacion()?->format('Y-m-d H:i:s');
        }

        return $data;
    }
}
