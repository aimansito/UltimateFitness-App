<?php

namespace App\Controller;

use App\Entity\Usuario;
use App\Repository\UsuarioRepository;
use App\Repository\EntrenadorRepository;
use App\Repository\SuscripcionRepository;
use App\Repository\PlanRepository;
use App\Security\RoleChecker;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Controlador del Panel de Administración
 * Gestión completa de usuarios, entrenadores, contenido y estadísticas
 */
#[Route('/api/admin', name: 'api_admin_')]
class AdminController extends AbstractController
{
    private UsuarioRepository $usuarioRepository;
    private EntrenadorRepository $entrenadorRepository;
    private SuscripcionRepository $suscripcionRepository;
    private PlanRepository $planRepository;
    private EntityManagerInterface $entityManager;
    private RoleChecker $roleChecker;

    public function __construct(
        UsuarioRepository $usuarioRepository,
        EntrenadorRepository $entrenadorRepository,
        SuscripcionRepository $suscripcionRepository,
        PlanRepository $planRepository,
        EntityManagerInterface $entityManager,
        RoleChecker $roleChecker
    ) {
        $this->usuarioRepository = $usuarioRepository;
        $this->entrenadorRepository = $entrenadorRepository;
        $this->suscripcionRepository = $suscripcionRepository;
        $this->planRepository = $planRepository;
        $this->entityManager = $entityManager;
        $this->roleChecker = $roleChecker;
    }

    // ============================================
    // DASHBOARD - ESTADÍSTICAS GLOBALES
    // ============================================

    /**
     * Dashboard principal con estadísticas generales
     * GET /api/admin/dashboard
     */
    #[Route('/dashboard', name: 'dashboard', methods: ['GET'])]
    public function dashboard(): JsonResponse
    {
        try {
            // TODO: Verificar que el usuario es admin
            // $usuarioActual = $this->getUser();
            // if (!$this->roleChecker->isAdmin($usuarioActual)) {
            //     return $this->roleChecker->denyAccess();
            // }

            // Estadísticas de usuarios
            $estadisticasUsuarios = $this->usuarioRepository->getEstadisticasUsuarios();
            
            // Estadísticas de entrenadores
            $estadisticasEntrenadores = $this->entrenadorRepository->getEstadisticas();
            
            // Estadísticas de suscripciones
            $estadisticasSuscripciones = $this->suscripcionRepository->getEstadisticas();
            
            // Ingresos mensuales recurrentes
            $mrr = $this->suscripcionRepository->getMRR();

            // Últimos registros
            $ultimosUsuarios = $this->usuarioRepository->findUltimosRegistros(5);
            $ultimosEntrenadores = $this->entrenadorRepository->findUltimosRegistros(5);

            // Aplicaciones pendientes
            $aplicacionesPendientes = $this->entrenadorRepository->countAplicacionesPendientes();

            return $this->jsonWithUnicode([
                'success' => true,
                'dashboard' => [
                    'usuarios' => $estadisticasUsuarios,
                    'entrenadores' => $estadisticasEntrenadores,
                    'suscripciones' => $estadisticasSuscripciones,
                    'ingresos' => [
                        'mrr' => $mrr,
                        'moneda' => 'EUR',
                    ],
                    'pendientes' => [
                        'aplicaciones_entrenador' => $aplicacionesPendientes,
                    ],
                    'ultimos_registros' => [
                        'usuarios' => array_map([$this, 'serializeUsuarioBasico'], $ultimosUsuarios),
                        'entrenadores' => array_map([$this, 'serializeEntrenadorBasico'], $ultimosEntrenadores),
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al obtener estadísticas: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // ============================================
    // GESTIÓN DE USUARIOS
    // ============================================

    /**
     * Listar todos los usuarios con filtros
     * GET /api/admin/usuarios
     */
    #[Route('/usuarios', name: 'usuarios_list', methods: ['GET'])]
    public function listarUsuarios(Request $request): JsonResponse
    {
        try {
            // TODO: Verificar admin
            // if (!$this->roleChecker->isAdmin($this->getUser())) {
            //     return $this->roleChecker->denyAccess();
            // }

            $search = $request->query->get('search');
            $esPremium = $request->query->get('premium');
            $rol = $request->query->get('rol');
            $objetivo = $request->query->get('objetivo');
            $page = $request->query->getInt('page', 1);
            $limit = $request->query->getInt('limit', 20);

            // Convertir string a boolean
            if ($esPremium !== null) {
                $esPremium = filter_var($esPremium, FILTER_VALIDATE_BOOLEAN);
            }

            $usuarios = $this->usuarioRepository->searchUsuarios(
                $search,
                $esPremium,
                $rol,
                $objetivo,
                $page,
                $limit
            );

            $total = $this->usuarioRepository->countUsuarios($search, $esPremium, $rol);

            $data = array_map([$this, 'serializeUsuarioCompleto'], $usuarios);

            return $this->jsonWithUnicode([
                'success' => true,
                'usuarios' => $data,
                'pagination' => [
                    'total' => $total,
                    'page' => $page,
                    'limit' => $limit,
                    'pages' => ceil($total / $limit),
                ],
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al obtener usuarios: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtener detalle completo de un usuario
     * GET /api/admin/usuarios/{id}
     */
    #[Route('/usuarios/{id}', name: 'usuarios_detail', methods: ['GET'])]
    public function detalleUsuario(int $id): JsonResponse
    {
        try {
            $usuario = $this->usuarioRepository->find($id);

            if (!$usuario) {
                return $this->jsonWithUnicode([
                    'success' => false,
                    'error' => 'Usuario no encontrado',
                ], Response::HTTP_NOT_FOUND);
            }

            return $this->jsonWithUnicode([
                'success' => true,
                'usuario' => $this->serializeUsuarioCompleto($usuario),
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al obtener usuario: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Actualizar usuario (admin puede modificar cualquier campo)
     * PUT /api/admin/usuarios/{id}
     */
    #[Route('/usuarios/{id}', name: 'usuarios_update', methods: ['PUT'])]
    public function actualizarUsuario(int $id, Request $request): JsonResponse
    {
        try {
            $usuario = $this->usuarioRepository->find($id);

            if (!$usuario) {
                return $this->jsonWithUnicode([
                    'success' => false,
                    'error' => 'Usuario no encontrado',
                ], Response::HTTP_NOT_FOUND);
            }

            $data = json_decode($request->getContent(), true);

            // Datos básicos
            if (isset($data['nombre'])) $usuario->setNombre($data['nombre']);
            if (isset($data['apellidos'])) $usuario->setApellidos($data['apellidos']);
            if (isset($data['email'])) $usuario->setEmail($data['email']);
            if (isset($data['telefono'])) $usuario->setTelefono($data['telefono']);
            if (isset($data['objetivo'])) $usuario->setObjetivo($data['objetivo']);
            if (isset($data['observaciones'])) $usuario->setObservaciones($data['observaciones']);

            // Datos físicos
            if (isset($data['sexo'])) $usuario->setSexo($data['sexo']);
            if (isset($data['edad'])) $usuario->setEdad($data['edad']);
            if (isset($data['peso_actual'])) $usuario->setPesoActual($data['peso_actual']);
            if (isset($data['altura'])) $usuario->setAltura($data['altura']);
            if (isset($data['peso_objetivo'])) $usuario->setPesoObjetivo($data['peso_objetivo']);
            if (isset($data['porcentaje_grasa'])) $usuario->setPorcentajeGrasa($data['porcentaje_grasa']);
            if (isset($data['nivel_actividad'])) $usuario->setNivelActividad($data['nivel_actividad']);
            if (isset($data['notas_salud'])) $usuario->setNotasSalud($data['notas_salud']);

            // Premium y rol (solo admin puede cambiar)
            if (isset($data['es_premium'])) $usuario->setEsPremium($data['es_premium']);
            if (isset($data['rol'])) $usuario->setRol($data['rol']);

            $this->entityManager->flush();

            return $this->jsonWithUnicode([
                'success' => true,
                'message' => 'Usuario actualizado exitosamente',
                'usuario' => $this->serializeUsuarioCompleto($usuario),
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al actualizar usuario: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Eliminar usuario
     * DELETE /api/admin/usuarios/{id}
     */
    #[Route('/usuarios/{id}', name: 'usuarios_delete', methods: ['DELETE'])]
    public function eliminarUsuario(int $id): JsonResponse
    {
        try {
            $usuario = $this->usuarioRepository->find($id);

            if (!$usuario) {
                return $this->jsonWithUnicode([
                    'success' => false,
                    'error' => 'Usuario no encontrado',
                ], Response::HTTP_NOT_FOUND);
            }

            // No permitir eliminar admins
            if ($usuario->isAdmin()) {
                return $this->jsonWithUnicode([
                    'success' => false,
                    'error' => 'No se puede eliminar un administrador',
                ], Response::HTTP_FORBIDDEN);
            }

            $this->usuarioRepository->remove($usuario);

            return $this->jsonWithUnicode([
                'success' => true,
                'message' => 'Usuario eliminado exitosamente',
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al eliminar usuario: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Hacer premium a un usuario
     * POST /api/admin/usuarios/{id}/hacer-premium
     */
    #[Route('/usuarios/{id}/hacer-premium', name: 'usuarios_make_premium', methods: ['POST'])]
    public function hacerPremium(int $id): JsonResponse
    {
        try {
            $usuario = $this->usuarioRepository->find($id);

            if (!$usuario) {
                return $this->jsonWithUnicode([
                    'success' => false,
                    'error' => 'Usuario no encontrado',
                ], Response::HTTP_NOT_FOUND);
            }

            if ($usuario->isEsPremium()) {
                return $this->jsonWithUnicode([
                    'success' => false,
                    'error' => 'El usuario ya es premium',
                ], Response::HTTP_BAD_REQUEST);
            }

            $usuario->setEsPremium(true);
            $usuario->setFechaPremium(new \DateTime());
            $this->entityManager->flush();

            return $this->jsonWithUnicode([
                'success' => true,
                'message' => 'Usuario actualizado a premium',
                'usuario' => $this->serializeUsuarioCompleto($usuario),
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al hacer premium: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Quitar premium a un usuario
     * POST /api/admin/usuarios/{id}/quitar-premium
     */
    #[Route('/usuarios/{id}/quitar-premium', name: 'usuarios_remove_premium', methods: ['POST'])]
    public function quitarPremium(int $id): JsonResponse
    {
        try {
            $usuario = $this->usuarioRepository->find($id);

            if (!$usuario) {
                return $this->jsonWithUnicode([
                    'success' => false,
                    'error' => 'Usuario no encontrado',
                ], Response::HTTP_NOT_FOUND);
            }

            $usuario->setEsPremium(false);
            $usuario->setFechaPremium(null);
            $this->entityManager->flush();

            return $this->jsonWithUnicode([
                'success' => true,
                'message' => 'Premium removido del usuario',
                'usuario' => $this->serializeUsuarioCompleto($usuario),
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al quitar premium: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // ============================================
    // ESTADÍSTICAS AVANZADAS
    // ============================================

    /**
     * Estadísticas detalladas de usuarios
     * GET /api/admin/estadisticas/usuarios
     */
    #[Route('/estadisticas/usuarios', name: 'stats_users', methods: ['GET'])]
    public function estadisticasUsuarios(): JsonResponse
    {
        try {
            $stats = [
                'general' => $this->usuarioRepository->getEstadisticasUsuarios(),
                'por_objetivo' => $this->usuarioRepository->getEstadisticasPorObjetivo(),
                'activos_ultimo_mes' => count($this->usuarioRepository->findUsuariosActivos(30)),
                'inactivos' => count($this->usuarioRepository->findUsuariosInactivos(30)),
                'registrados_ultimo_mes' => count($this->usuarioRepository->findRegistradosUltimoMes()),
            ];

            return $this->jsonWithUnicode([
                'success' => true,
                'estadisticas' => $stats,
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al obtener estadísticas: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // ============================================
    // MÉTODOS AUXILIARES DE SERIALIZACIÓN
    // ============================================

    private function serializeUsuarioBasico(Usuario $usuario): array
    {
        return [
            'id' => $usuario->getId(),
            'nombre_completo' => $usuario->getNombreCompleto(),
            'email' => $usuario->getEmail(),
            'es_premium' => $usuario->isEsPremium(),
            'rol' => $usuario->getRol(),
            'fecha_registro' => $usuario->getFechaRegistro()?->format('Y-m-d H:i:s'),
        ];
    }

    private function serializeUsuarioCompleto(Usuario $usuario): array
    {
        return [
            'id' => $usuario->getId(),
            'nombre' => $usuario->getNombre(),
            'apellidos' => $usuario->getApellidos(),
            'nombre_completo' => $usuario->getNombreCompleto(),
            'email' => $usuario->getEmail(),
            'telefono' => $usuario->getTelefono(),
            'objetivo' => $usuario->getObjetivo(),
            'observaciones' => $usuario->getObservaciones(),
            
            // Datos físicos
            'sexo' => $usuario->getSexo(),
            'edad' => $usuario->getEdad(),
            'peso_actual' => $usuario->getPesoActual(),
            'altura' => $usuario->getAltura(),
            'peso_objetivo' => $usuario->getPesoObjetivo(),
            'porcentaje_grasa' => $usuario->getPorcentajeGrasa(),
            'imc' => $usuario->getImc(),
            'clasificacion_imc' => $usuario->getClasificacionIMC(),
            'nivel_actividad' => $usuario->getNivelActividad(),
            'calorias_diarias' => $usuario->getCaloriasDiarias(),
            'notas_salud' => $usuario->getNotasSalud(),
            
            // Premium y rol
            'es_premium' => $usuario->isEsPremium(),
            'fecha_premium' => $usuario->getFechaPremium()?->format('Y-m-d'),
            'rol' => $usuario->getRol(),
            'es_admin' => $usuario->isAdmin(),
            
            // Auditoría
            'fecha_registro' => $usuario->getFechaRegistro()?->format('Y-m-d H:i:s'),
            'ultima_conexion' => $usuario->getUltimaConexion()?->format('Y-m-d H:i:s'),
        ];
    }

    private function serializeEntrenadorBasico($entrenador): array
    {
        return [
            'id' => $entrenador->getId(),
            'nombre_completo' => $entrenador->getNombreCompleto(),
            'email' => $entrenador->getEmail(),
            'especialidad' => $entrenador->getEspecialidad(),
            'anos_experiencia' => $entrenador->getAnosExperiencia(),
            'estado_aplicacion' => $entrenador->getEstadoAplicacion(),
            'fecha_registro' => $entrenador->getFechaRegistro()?->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * Helper para retornar JSON con caracteres Unicode sin escapar (tildes, ñ, etc.)
     */
    private function jsonWithUnicode($data, int $status = 200, array $headers = [], array $context = []): JsonResponse
    {
        $response = $this->json($data, $status, $headers, $context);
        $response->setEncodingOptions($response->getEncodingOptions() | JSON_UNESCAPED_UNICODE);
        return $response;
    }
}