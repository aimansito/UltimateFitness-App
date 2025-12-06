<?php

namespace App\Controller;

use App\Entity\Usuario;
use App\Repository\UsuarioRepository;
use App\Repository\EntrenadorRepository;
use App\Repository\SuscripcionRepository;
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
    private EntityManagerInterface $entityManager;
    private RoleChecker $roleChecker;

    public function __construct(
        UsuarioRepository $usuarioRepository,
        EntrenadorRepository $entrenadorRepository,
        SuscripcionRepository $suscripcionRepository,
        EntityManagerInterface $entityManager,
        RoleChecker $roleChecker
    ) {
        $this->usuarioRepository = $usuarioRepository;
        $this->entrenadorRepository = $entrenadorRepository;
        $this->suscripcionRepository = $suscripcionRepository;
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

            $conn = $this->entityManager->getConnection();

            // Estadísticas de usuarios
            $totalUsuarios = (int)$conn->executeQuery('SELECT COUNT(*) FROM usuarios')->fetchOne();
            $usuariosNormales = (int)$conn->executeQuery('SELECT COUNT(*) FROM usuarios WHERE es_premium = 0')->fetchOne();
            $usuariosPremium = (int)$conn->executeQuery('SELECT COUNT(*) FROM usuarios WHERE es_premium = 1')->fetchOne();

            // Total de entrenadores
            $totalEntrenadores = (int)$conn->executeQuery('SELECT COUNT(*) FROM entrenadores')->fetchOne();

            return $this->jsonWithUnicode([
                'success' => true,
                'estadisticas' => [
                    'total_usuarios' => $totalUsuarios,
                    'usuarios_normales' => $usuariosNormales,
                    'usuarios_premium' => $usuariosPremium,
                    'total_entrenadores' => $totalEntrenadores,
                ]
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

    // ============================================
    // GESTIÓN DE ENTRENADORES
    // ============================================

    /**
     * Listar todos los entrenadores
     * GET /api/admin/entrenadores
     */
    #[Route('/entrenadores', name: 'entrenadores_list', methods: ['GET'])]
    public function listarEntrenadores(): JsonResponse
    {
        try {
            $conn = $this->entityManager->getConnection();

            $sql = "
                SELECT
                    id,
                    nombre,
                    apellidos,
                    email,
                    telefono,
                    especialidad,
                    anos_experiencia,
                    certificacion,
                    biografia,
                    fecha_aplicacion
                FROM entrenadores
                ORDER BY id DESC
            ";

            $result = $conn->executeQuery($sql);
            $entrenadores = $result->fetchAllAssociative();

            foreach ($entrenadores as &$entrenador) {
                $entrenador['nombre_completo'] = trim($entrenador['nombre'] . ' ' . $entrenador['apellidos']);
                $entrenador['anos_experiencia'] = (int)$entrenador['anos_experiencia'];
            }

            return $this->jsonWithUnicode([
                'success' => true,
                'entrenadores' => $entrenadores,
                'total' => count($entrenadores)
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al obtener entrenadores: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Crear nuevo entrenador
     * POST /api/admin/entrenadores
     */
    #[Route('/entrenadores', name: 'entrenadores_create', methods: ['POST'])]
    public function crearEntrenador(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            $conn = $this->entityManager->getConnection();

            // Generar password hash por defecto (puede cambiar después)
            $defaultPassword = password_hash('cambiar123', PASSWORD_BCRYPT);

            $sql = "INSERT INTO entrenadores (nombre, apellidos, email, password_hash, telefono, especialidad, anos_experiencia, certificacion, biografia, activo, estado_aplicacion, fecha_aplicacion)
                    VALUES (:nombre, :apellidos, :email, :password_hash, :telefono, :especialidad, :anos_experiencia, :certificacion, :biografia, 1, 'aprobado', NOW())";

            $conn->executeStatement($sql, [
                'nombre' => $data['nombre'] ?? '',
                'apellidos' => $data['apellidos'] ?? '',
                'email' => $data['email'] ?? '',
                'password_hash' => $defaultPassword,
                'telefono' => $data['telefono'] ?? null,
                'especialidad' => $data['especialidad'] ?? 'ambos',
                'anos_experiencia' => $data['anos_experiencia'] ?? 0,
                'certificacion' => $data['certificacion'] ?? null,
                'biografia' => $data['biografia'] ?? null
            ]);

            return $this->jsonWithUnicode([
                'success' => true,
                'message' => 'Entrenador creado exitosamente. Password temporal: cambiar123',
                'id' => $conn->lastInsertId()
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al crear entrenador: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Actualizar entrenador
     * PUT /api/admin/entrenadores/{id}
     */
    #[Route('/entrenadores/{id}', name: 'entrenadores_update', methods: ['PUT'])]
    public function actualizarEntrenador(int $id, Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $conn = $this->entityManager->getConnection();

            $sql = "UPDATE entrenadores SET
                    nombre = :nombre,
                    apellidos = :apellidos,
                    email = :email,
                    telefono = :telefono,
                    especialidad = :especialidad,
                    anos_experiencia = :anos_experiencia,
                    certificacion = :certificacion,
                    biografia = :biografia
                    WHERE id = :id";

            $conn->executeStatement($sql, [
                'id' => $id,
                'nombre' => $data['nombre'] ?? '',
                'apellidos' => $data['apellidos'] ?? '',
                'email' => $data['email'] ?? '',
                'telefono' => $data['telefono'] ?? null,
                'especialidad' => $data['especialidad'] ?? 'ambos',
                'anos_experiencia' => $data['anos_experiencia'] ?? 0,
                'certificacion' => $data['certificacion'] ?? null,
                'biografia' => $data['biografia'] ?? null
            ]);

            return $this->jsonWithUnicode([
                'success' => true,
                'message' => 'Entrenador actualizado exitosamente'
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al actualizar entrenador: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Eliminar entrenador
     * DELETE /api/admin/entrenadores/{id}
     */
    #[Route('/entrenadores/{id}', name: 'entrenadores_delete', methods: ['DELETE'])]
    public function eliminarEntrenador(int $id): JsonResponse
    {
        try {
            $conn = $this->entityManager->getConnection();
            $conn->executeStatement('DELETE FROM entrenadores WHERE id = :id', ['id' => $id]);

            return $this->jsonWithUnicode([
                'success' => true,
                'message' => 'Entrenador eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al eliminar entrenador: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // ============================================
    // GESTIÓN DE DIETAS
    // ============================================

    /**
     * Listar todas las dietas
     * GET /api/admin/dietas
     */
    #[Route('/dietas', name: 'dietas_list', methods: ['GET'])]
    public function listarDietas(): JsonResponse
    {
        try {
            $conn = $this->entityManager->getConnection();

            $sql = "
                SELECT
                    d.id,
                    d.nombre,
                    d.descripcion,
                    d.calorias_totales,
                    d.es_publica,
                    d.valoracion_promedio,
                    d.total_valoraciones,
                    d.fecha_creacion,
                    e.nombre as creador_nombre,
                    e.apellidos as creador_apellidos
                FROM dietas d
                LEFT JOIN entrenadores e ON d.creador_id = e.id
                ORDER BY d.fecha_creacion DESC
            ";

            $result = $conn->executeQuery($sql);
            $dietas = $result->fetchAllAssociative();

            foreach ($dietas as &$dieta) {
                $dieta['es_publica'] = (bool)$dieta['es_publica'];
                $dieta['valoracion_promedio'] = (float)$dieta['valoracion_promedio'];
                $dieta['calorias_totales'] = (int)$dieta['calorias_totales'];
                $dieta['destacada'] = ($dieta['valoracion_promedio'] > 4.5 && $dieta['total_valoraciones'] > 100);
            }

            return $this->jsonWithUnicode([
                'success' => true,
                'dietas' => $dietas,
                'total' => count($dietas)
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al obtener dietas: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // ============================================
    // GESTIÓN DE ALIMENTOS
    // ============================================

    /**
     * Listar todos los alimentos
     * GET /api/admin/alimentos
     */
    #[Route('/alimentos', name: 'alimentos_list', methods: ['GET'])]
    public function listarAlimentos(): JsonResponse
    {
        try {
            $conn = $this->entityManager->getConnection();

            $sql = "
                SELECT
                    id,
                    nombre,
                    tipo_alimento as categoria,
                    descripcion,
                    calorias,
                    proteinas,
                    carbohidratos,
                    grasas,
                    precio_kg
                FROM alimentos
                ORDER BY nombre ASC
            ";

            $result = $conn->executeQuery($sql);
            $alimentos = $result->fetchAllAssociative();

            foreach ($alimentos as &$alimento) {
                $alimento['calorias'] = (float)$alimento['calorias'];
                $alimento['proteinas'] = (float)$alimento['proteinas'];
                $alimento['carbohidratos'] = (float)$alimento['carbohidratos'];
                $alimento['grasas'] = (float)$alimento['grasas'];
                $alimento['precio_kg'] = $alimento['precio_kg'] ? (float)$alimento['precio_kg'] : null;
            }

            return $this->jsonWithUnicode([
                'success' => true,
                'alimentos' => $alimentos,
                'total' => count($alimentos)
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al obtener alimentos: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Crear nuevo alimento
     * POST /api/admin/alimentos
     */
    #[Route('/alimentos', name: 'alimentos_create', methods: ['POST'])]
    public function crearAlimento(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $conn = $this->entityManager->getConnection();

            $sql = "INSERT INTO alimentos (nombre, tipo_alimento, descripcion, calorias, proteinas, carbohidratos, grasas, precio_kg)
                    VALUES (:nombre, :tipo_alimento, :descripcion, :calorias, :proteinas, :carbohidratos, :grasas, :precio_kg)";

            $conn->executeStatement($sql, [
                'nombre' => $data['nombre'] ?? '',
                'tipo_alimento' => $data['categoria'] ?? '',
                'descripcion' => $data['descripcion'] ?? null,
                'calorias' => $data['calorias'] ?? 0,
                'proteinas' => $data['proteinas'] ?? 0,
                'carbohidratos' => $data['carbohidratos'] ?? 0,
                'grasas' => $data['grasas'] ?? 0,
                'precio_kg' => $data['precio_kg'] ?? null
            ]);

            return $this->jsonWithUnicode([
                'success' => true,
                'message' => 'Alimento creado exitosamente',
                'id' => $conn->lastInsertId()
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al crear alimento: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Actualizar alimento
     * PUT /api/admin/alimentos/{id}
     */
    #[Route('/alimentos/{id}', name: 'alimentos_update', methods: ['PUT'])]
    public function actualizarAlimento(int $id, Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $conn = $this->entityManager->getConnection();

            $sql = "UPDATE alimentos SET
                    nombre = :nombre,
                    tipo_alimento = :tipo_alimento,
                    descripcion = :descripcion,
                    calorias = :calorias,
                    proteinas = :proteinas,
                    carbohidratos = :carbohidratos,
                    grasas = :grasas,
                    precio_kg = :precio_kg
                    WHERE id = :id";

            $conn->executeStatement($sql, [
                'id' => $id,
                'nombre' => $data['nombre'] ?? '',
                'tipo_alimento' => $data['categoria'] ?? '',
                'descripcion' => $data['descripcion'] ?? null,
                'calorias' => $data['calorias'] ?? 0,
                'proteinas' => $data['proteinas'] ?? 0,
                'carbohidratos' => $data['carbohidratos'] ?? 0,
                'grasas' => $data['grasas'] ?? 0,
                'precio_kg' => $data['precio_kg'] ?? null
            ]);

            return $this->jsonWithUnicode([
                'success' => true,
                'message' => 'Alimento actualizado exitosamente'
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al actualizar alimento: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Eliminar alimento
     * DELETE /api/admin/alimentos/{id}
     */
    #[Route('/alimentos/{id}', name: 'alimentos_delete', methods: ['DELETE'])]
    public function eliminarAlimento(int $id): JsonResponse
    {
        try {
            $conn = $this->entityManager->getConnection();
            $conn->executeStatement('DELETE FROM alimentos WHERE id = :id', ['id' => $id]);

            return $this->jsonWithUnicode([
                'success' => true,
                'message' => 'Alimento eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al eliminar alimento: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // ============================================
    // GESTIÓN DE EJERCICIOS
    // ============================================

    /**
     * Listar todos los ejercicios
     * GET /api/admin/ejercicios
     */
    #[Route('/ejercicios', name: 'ejercicios_list', methods: ['GET'])]
    public function listarEjercicios(): JsonResponse
    {
        try {
            $conn = $this->entityManager->getConnection();

            $sql = "
                SELECT
                    id,
                    nombre,
                    tipo,
                    grupo_muscular,
                    descripcion,
                    nivel_dificultad,
                    valoracion_promedio,
                    total_valoraciones
                FROM ejercicios
                ORDER BY nombre ASC
            ";

            $result = $conn->executeQuery($sql);
            $ejercicios = $result->fetchAllAssociative();

            foreach ($ejercicios as &$ejercicio) {
                $ejercicio['valoracion_promedio'] = (float)$ejercicio['valoracion_promedio'];
                $ejercicio['premium'] = ($ejercicio['valoracion_promedio'] > 4.5); // Ejemplo de lógica
            }

            return $this->jsonWithUnicode([
                'success' => true,
                'ejercicios' => $ejercicios,
                'total' => count($ejercicios)
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al obtener ejercicios: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Crear nuevo ejercicio
     * POST /api/admin/ejercicios
     */
    #[Route('/ejercicios', name: 'ejercicios_create', methods: ['POST'])]
    public function crearEjercicio(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $conn = $this->entityManager->getConnection();

            $sql = "INSERT INTO ejercicios (nombre, tipo, grupo_muscular, descripcion, nivel_dificultad)
                    VALUES (:nombre, :tipo, :grupo_muscular, :descripcion, :nivel_dificultad)";

            $conn->executeStatement($sql, [
                'nombre' => $data['nombre'] ?? '',
                'tipo' => $data['tipo'] ?? '',
                'grupo_muscular' => $data['grupo_muscular'] ?? '',
                'descripcion' => $data['descripcion'] ?? null,
                'nivel_dificultad' => $data['nivel_dificultad'] ?? 'medio'
            ]);

            return $this->jsonWithUnicode([
                'success' => true,
                'message' => 'Ejercicio creado exitosamente',
                'id' => $conn->lastInsertId()
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al crear ejercicio: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Actualizar ejercicio
     * PUT /api/admin/ejercicios/{id}
     */
    #[Route('/ejercicios/{id}', name: 'ejercicios_update', methods: ['PUT'])]
    public function actualizarEjercicio(int $id, Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $conn = $this->entityManager->getConnection();

            $sql = "UPDATE ejercicios SET
                    nombre = :nombre,
                    tipo = :tipo,
                    grupo_muscular = :grupo_muscular,
                    descripcion = :descripcion,
                    nivel_dificultad = :nivel_dificultad
                    WHERE id = :id";

            $conn->executeStatement($sql, [
                'id' => $id,
                'nombre' => $data['nombre'] ?? '',
                'tipo' => $data['tipo'] ?? '',
                'grupo_muscular' => $data['grupo_muscular'] ?? '',
                'descripcion' => $data['descripcion'] ?? null,
                'nivel_dificultad' => $data['nivel_dificultad'] ?? 'medio'
            ]);

            return $this->jsonWithUnicode([
                'success' => true,
                'message' => 'Ejercicio actualizado exitosamente'
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al actualizar ejercicio: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Eliminar ejercicio
     * DELETE /api/admin/ejercicios/{id}
     */
    #[Route('/ejercicios/{id}', name: 'ejercicios_delete', methods: ['DELETE'])]
    public function eliminarEjercicio(int $id): JsonResponse
    {
        try {
            $conn = $this->entityManager->getConnection();
            $conn->executeStatement('DELETE FROM ejercicios WHERE id = :id', ['id' => $id]);

            return $this->jsonWithUnicode([
                'success' => true,
                'message' => 'Ejercicio eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al eliminar ejercicio: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // ============================================
    // GESTIÓN DE BLOG POSTS
    // ============================================

    /**
     * Listar todos los posts del blog
     * GET /api/admin/blog
     */
    #[Route('/blog', name: 'blog_list', methods: ['GET'])]
    public function listarBlogPosts(): JsonResponse
    {
        try {
            $conn = $this->entityManager->getConnection();

            $sql = "
                SELECT
                    id,
                    titulo,
                    slug,
                    extracto,
                    categoria,
                    es_premium,
                    destacado,
                    fecha_publicacion,
                    fecha_creacion
                FROM blog_posts
                ORDER BY fecha_creacion DESC
            ";

            $result = $conn->executeQuery($sql);
            $posts = $result->fetchAllAssociative();

            foreach ($posts as &$post) {
                $post['es_premium'] = (bool)$post['es_premium'];
                $post['destacado'] = (bool)$post['destacado'];
            }

            return $this->jsonWithUnicode([
                'success' => true,
                'posts' => $posts,
                'total' => count($posts)
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al obtener posts: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtener detalle de un post del blog
     * GET /api/admin/blog/{id}
     */
    #[Route('/blog/{id}', name: 'blog_detail', methods: ['GET'])]
    public function detalleBlogPost(int $id): JsonResponse
    {
        try {
            $conn = $this->entityManager->getConnection();

            $sql = "SELECT * FROM blog_posts WHERE id = :id";
            $post = $conn->executeQuery($sql, ['id' => $id])->fetchAssociative();

            if (!$post) {
                return $this->jsonWithUnicode([
                    'success' => false,
                    'error' => 'Post no encontrado'
                ], Response::HTTP_NOT_FOUND);
            }

            $post['es_premium'] = (bool)$post['es_premium'];
            $post['destacado'] = (bool)$post['destacado'];

            return $this->jsonWithUnicode([
                'success' => true,
                'post' => $post
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al obtener post: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Crear nuevo post del blog
     * POST /api/admin/blog
     */
    #[Route('/blog', name: 'blog_create', methods: ['POST'])]
    public function crearBlogPost(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $conn = $this->entityManager->getConnection();

            // Generar slug a partir del título
            $slug = $this->generateSlug($data['titulo'] ?? '');

            $sql = "INSERT INTO blog_posts (titulo, slug, extracto, contenido, imagen_portada, categoria, es_premium, destacado, fecha_publicacion, fecha_creacion, fecha_actualizacion)
                    VALUES (:titulo, :slug, :extracto, :contenido, :imagen_portada, :categoria, :es_premium, :destacado, :fecha_publicacion, NOW(), NOW())";

            $conn->executeStatement($sql, [
                'titulo' => $data['titulo'] ?? '',
                'slug' => $slug,
                'extracto' => $data['extracto'] ?? null,
                'contenido' => $data['contenido'] ?? '',
                'imagen_portada' => $data['imagen_portada'] ?? null,
                'categoria' => $data['categoria'] ?? 'noticias',
                'es_premium' => $data['es_premium'] ?? false,
                'destacado' => $data['destacado'] ?? false,
                'fecha_publicacion' => $data['fecha_publicacion'] ?? null
            ]);

            return $this->jsonWithUnicode([
                'success' => true,
                'message' => 'Post creado exitosamente',
                'id' => $conn->lastInsertId(),
                'slug' => $slug
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al crear post: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Actualizar post del blog
     * PUT /api/admin/blog/{id}
     */
    #[Route('/blog/{id}', name: 'blog_update', methods: ['PUT'])]
    public function actualizarBlogPost(int $id, Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $conn = $this->entityManager->getConnection();

            // Regenerar slug si el título cambió
            $slug = isset($data['titulo']) ? $this->generateSlug($data['titulo']) : null;

            $updates = [];
            $params = ['id' => $id];

            if (isset($data['titulo'])) {
                $updates[] = 'titulo = :titulo';
                $params['titulo'] = $data['titulo'];
                $updates[] = 'slug = :slug';
                $params['slug'] = $slug;
            }
            if (isset($data['extracto'])) {
                $updates[] = 'extracto = :extracto';
                $params['extracto'] = $data['extracto'];
            }
            if (isset($data['contenido'])) {
                $updates[] = 'contenido = :contenido';
                $params['contenido'] = $data['contenido'];
            }
            if (isset($data['imagen_portada'])) {
                $updates[] = 'imagen_portada = :imagen_portada';
                $params['imagen_portada'] = $data['imagen_portada'];
            }
            if (isset($data['categoria'])) {
                $updates[] = 'categoria = :categoria';
                $params['categoria'] = $data['categoria'];
            }
            if (isset($data['es_premium'])) {
                $updates[] = 'es_premium = :es_premium';
                $params['es_premium'] = $data['es_premium'];
            }
            if (isset($data['destacado'])) {
                $updates[] = 'destacado = :destacado';
                $params['destacado'] = $data['destacado'];
            }
            if (isset($data['fecha_publicacion'])) {
                $updates[] = 'fecha_publicacion = :fecha_publicacion';
                $params['fecha_publicacion'] = $data['fecha_publicacion'];
            }

            $updates[] = 'fecha_actualizacion = NOW()';

            if (empty($updates)) {
                return $this->jsonWithUnicode([
                    'success' => false,
                    'error' => 'No hay datos para actualizar'
                ], Response::HTTP_BAD_REQUEST);
            }

            $sql = "UPDATE blog_posts SET " . implode(', ', $updates) . " WHERE id = :id";
            $conn->executeStatement($sql, $params);

            return $this->jsonWithUnicode([
                'success' => true,
                'message' => 'Post actualizado exitosamente'
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al actualizar post: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Eliminar post del blog
     * DELETE /api/admin/blog/{id}
     */
    #[Route('/blog/{id}', name: 'blog_delete', methods: ['DELETE'])]
    public function eliminarBlogPost(int $id): JsonResponse
    {
        try {
            $conn = $this->entityManager->getConnection();
            $conn->executeStatement('DELETE FROM blog_posts WHERE id = :id', ['id' => $id]);

            return $this->jsonWithUnicode([
                'success' => true,
                'message' => 'Post eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al eliminar post: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Helper para generar slug desde un título
     */
    private function generateSlug(string $title): string
    {
        $slug = strtolower($title);
        // Reemplazar caracteres especiales españoles
        $slug = str_replace(['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü'], ['a', 'e', 'i', 'o', 'u', 'n', 'u'], $slug);
        // Reemplazar caracteres no alfanuméricos con guiones
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
        // Eliminar guiones al inicio y al final
        $slug = trim($slug, '-');
        return $slug;
    }

    // ============================================
    // GESTIÓN DE SUSCRIPCIONES
    // ============================================

    /**
     * Listar todas las suscripciones
     * GET /api/admin/suscripciones
     */
    #[Route('/suscripciones', name: 'suscripciones_list', methods: ['GET'])]
    public function listarSuscripciones(): JsonResponse
    {
        try {
            $conn = $this->entityManager->getConnection();

            $sql = "
                SELECT
                    s.id,
                    s.usuario_id,
                    s.entrenador_asignado_id,
                    s.fecha_inicio,
                    s.fecha_fin,
                    s.estado,
                    s.precio_mensual,
                    s.auto_renovacion,
                    s.activa,
                    u.nombre AS usuario_nombre,
                    u.apellidos AS usuario_apellidos,
                    u.email AS usuario_email
                FROM suscripciones s
                INNER JOIN usuarios u ON s.usuario_id = u.id
                ORDER BY s.fecha_inicio DESC
            ";

            $result = $conn->executeQuery($sql);
            $suscripciones = $result->fetchAllAssociative();

            foreach ($suscripciones as &$suscripcion) {
                $suscripcion['precio_mensual'] = isset($suscripcion['precio_mensual'])
                    ? (float)$suscripcion['precio_mensual']
                    : 0.0;
                $suscripcion['usuario_nombre_completo'] = trim($suscripcion['usuario_nombre'] . ' ' . $suscripcion['usuario_apellidos']);
                $suscripcion['plan_nombre'] = 'Premium Ultimate Fitness';
                $suscripcion['plan_precio'] = $suscripcion['precio_mensual'];
            }

            return $this->jsonWithUnicode([
                'success' => true,
                'suscripciones' => $suscripciones,
                'total' => count($suscripciones)
            ]);
        } catch (\Exception $e) {
            return $this->jsonWithUnicode([
                'success' => false,
                'error' => 'Error al obtener suscripciones: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
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
