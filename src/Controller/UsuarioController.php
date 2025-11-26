<?php

namespace App\Controller;

use App\Entity\Usuario;
use App\Entity\CalendarioUsuario;
use App\Entity\Suscripcion;
use App\Entity\HistorialPago;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Controlador para gestionar Usuarios
 * Incluye funcionalidades de perfil, progreso, premium y administración
 */
#[Route('/api/custom')]
class UsuarioController extends AbstractController
{
    // ============================================
    // ENTRENAMIENTOS AGENDADOS DEL USUARIO
    // ============================================
    #[Route('/usuarios/{id}/entrenamientos', name: 'usuarios_entrenamientos', methods: ['GET'])]
    public function entrenamientos(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $usuario = $entityManager->getRepository(Usuario::class)->find($id);
        
        if (!$usuario) {
            return $this->json([
                'success' => false,
                'error' => 'Usuario no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        // Obtener entrenamientos del calendario del usuario
        $calendarios = $entityManager->getRepository(CalendarioUsuario::class)
            ->findBy(['usuario' => $usuario]);

        $entrenamientos = [];
        foreach ($calendarios as $calendario) {
            if ($entrenamiento = $calendario->getEntrenamiento()) {
                $entrenamientos[] = [
                    'id' => $entrenamiento->getId(),
                    'nombre' => $entrenamiento->getNombre(),
                    'descripcion' => $entrenamiento->getDescripcion(),
                    'tipo' => $entrenamiento->getTipo(),
                    'nivelDificultad' => $entrenamiento->getNivelDificultad(),
                    'duracionMinutos' => $entrenamiento->getDuracionMinutos(),
                    'diaSemana' => $calendario->getDiaSemana(),
                    'completado' => $calendario->isCompletado(),
                    'calendarioId' => $calendario->getId()
                ];
            }
        }

        return $this->json([
            'success' => true,
            'total' => count($entrenamientos),
            'entrenamientos' => $entrenamientos
        ]);
    }

    // ============================================
    // DIETAS AGENDADAS DEL USUARIO
    // ============================================
    #[Route('/usuarios/{id}/dietas', name: 'usuarios_dietas', methods: ['GET'])]
    public function dietas(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $usuario = $entityManager->getRepository(Usuario::class)->find($id);
        
        if (!$usuario) {
            return $this->json([
                'success' => false,
                'error' => 'Usuario no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        // Obtener dietas del calendario del usuario
        $calendarios = $entityManager->getRepository(CalendarioUsuario::class)
            ->findBy(['usuario' => $usuario]);

        $dietas = [];
        foreach ($calendarios as $calendario) {
            if ($dieta = $calendario->getDieta()) {
                $dietas[] = [
                    'id' => $dieta->getId(),
                    'nombre' => $dieta->getNombre(),
                    'descripcion' => $dieta->getDescripcion(),
                    'diaSemana' => $calendario->getDiaSemana(),
                    'completado' => $calendario->isCompletado(),
                    'calendarioId' => $calendario->getId()
                ];
            }
        }

        return $this->json([
            'success' => true,
            'total' => count($dietas),
            'dietas' => $dietas
        ]);
    }

    // ============================================
    // PROGRESO DEL USUARIO
    // ============================================
    #[Route('/usuarios/{id}/progreso', name: 'usuarios_progreso', methods: ['GET'])]
    public function progreso(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $usuario = $entityManager->getRepository(Usuario::class)->find($id);
        
        if (!$usuario) {
            return $this->json([
                'success' => false,
                'error' => 'Usuario no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        // Contar eventos agendados
        $totalAgendados = $entityManager->getRepository(CalendarioUsuario::class)
            ->count(['usuario' => $usuario]);

        // Contar completados
        $totalCompletados = $entityManager->getRepository(CalendarioUsuario::class)
            ->count(['usuario' => $usuario, 'completado' => true]);

        // Calcular porcentaje
        $porcentajeCompletado = $totalAgendados > 0 
            ? round(($totalCompletados / $totalAgendados) * 100, 2)
            : 0;

        return $this->json([
            'success' => true,
            'usuario' => [
                'id' => $usuario->getId(),
                'nombre' => $usuario->getNombreCompleto(),
                'objetivo' => $usuario->getObjetivo(),
                'esPremium' => $usuario->isEsPremium(),
                'fechaRegistro' => $usuario->getFechaRegistro()?->format('Y-m-d H:i:s')
            ],
            'estadisticas' => [
                'totalAgendados' => $totalAgendados,
                'totalCompletados' => $totalCompletados,
                'porcentajeCompletado' => $porcentajeCompletado,
                'diasActivo' => $this->calcularDiasActivo($usuario)
            ]
        ]);
    }

    // ============================================
    // ACTUALIZAR PERFIL
    // ============================================
    #[Route('/usuarios/{id}/actualizar', name: 'usuarios_actualizar', methods: ['PUT', 'PATCH'])]
    public function actualizar(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $usuario = $entityManager->getRepository(Usuario::class)->find($id);
        
        if (!$usuario) {
            return $this->json([
                'success' => false,
                'error' => 'Usuario no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['nombre'])) {
            $usuario->setNombre($data['nombre']);
        }
        if (isset($data['apellidos'])) {
            $usuario->setApellidos($data['apellidos']);
        }
        if (isset($data['telefono'])) {
            $usuario->setTelefono($data['telefono']);
        }
        if (isset($data['objetivo'])) {
            $usuario->setObjetivo($data['objetivo']);
        }
        if (isset($data['observaciones'])) {
            $usuario->setObservaciones($data['observaciones']);
        }

        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => 'Perfil actualizado',
            'usuario' => [
                'id' => $usuario->getId(),
                'nombre' => $usuario->getNombre(),
                'apellidos' => $usuario->getApellidos(),
                'email' => $usuario->getEmail(),
                'telefono' => $usuario->getTelefono(),
                'objetivo' => $usuario->getObjetivo(),
                'observaciones' => $usuario->getObservaciones()
            ]
        ]);
    }

    // ============================================
    // UPGRADE A PREMIUM (mejorado con fecha)
    // ============================================
    #[Route('/usuarios/{id}/upgrade-premium', name: 'usuarios_upgrade_premium', methods: ['POST'])]
    public function upgradePremium(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $usuario = $entityManager->getRepository(Usuario::class)->find($id);
        
        if (!$usuario) {
            return $this->json([
                'success' => false,
                'error' => 'Usuario no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        if ($usuario->isEsPremium()) {
            return $this->json([
                'success' => false,
                'error' => 'El usuario ya es Premium'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Actualizar a premium con fecha
        $usuario->setEsPremium(true);
        $usuario->setFechaPremium(new \DateTime());
        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => '¡Felicidades! Ahora eres usuario Premium',
            'usuario' => [
                'id' => $usuario->getId(),
                'nombre' => $usuario->getNombreCompleto(),
                'esPremium' => true,
                'fechaPremium' => $usuario->getFechaPremium()?->format('Y-m-d'),
            ]
        ]);
    }

    // ============================================
    // ESTADÍSTICAS DEL USUARIO
    // ============================================
    #[Route('/usuarios/{id}/estadisticas', name: 'usuarios_estadisticas', methods: ['GET'])]
    public function estadisticas(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $usuario = $entityManager->getRepository(Usuario::class)->find($id);
        
        if (!$usuario) {
            return $this->json([
                'success' => false,
                'error' => 'Usuario no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        // Días de la semana con actividad
        $calendarios = $entityManager->getRepository(CalendarioUsuario::class)
            ->findBy(['usuario' => $usuario]);

        $diasConActividad = [];
        foreach ($calendarios as $calendario) {
            $dia = $calendario->getDiaSemana();
            if (!in_array($dia, $diasConActividad)) {
                $diasConActividad[] = $dia;
            }
        }

        return $this->json([
            'success' => true,
            'estadisticas' => [
                'diasActivo' => $this->calcularDiasActivo($usuario),
                'diasConActividad' => count($diasConActividad),
                'totalEventos' => count($calendarios),
                'racha' => 0 // Implementar lógica de racha si es necesario
            ]
        ]);
    }

    // ============================================
    // VERIFICAR SI ES PREMIUM
    // ============================================
    #[Route('/usuarios/{id}/es-premium', name: 'usuarios_check_premium', methods: ['GET'])]
    public function esPremium(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $usuario = $entityManager->getRepository(Usuario::class)->find($id);

        if (!$usuario) {
            return $this->json([
                'success' => false,
                'error' => 'Usuario no encontrado',
            ], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'success' => true,
            'es_premium' => $usuario->isEsPremium(),
            'fecha_premium' => $usuario->getFechaPremium()?->format('Y-m-d'),
            'rol' => $usuario->getRol(),
        ]);
    }

    // ============================================
    // INFORMACIÓN COMPLETA DE PREMIUM
    // ============================================
    #[Route('/usuarios/{id}/info-premium', name: 'usuarios_premium_info', methods: ['GET'])]
    public function infoPremium(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $usuario = $entityManager->getRepository(Usuario::class)->find($id);

        if (!$usuario) {
            return $this->json([
                'success' => false,
                'error' => 'Usuario no encontrado',
            ], Response::HTTP_NOT_FOUND);
        }

        // Buscar suscripción activa
        $suscripcionActiva = $entityManager->getRepository(Suscripcion::class)
            ->findOneBy([
                'usuario' => $usuario,
                'estado' => 'activo'
            ]);

        return $this->json([
            'success' => true,
            'es_premium' => $usuario->isEsPremium(),
            'fecha_premium' => $usuario->getFechaPremium()?->format('Y-m-d'),
            'rol' => $usuario->getRol(),
            'tiene_suscripcion_activa' => $suscripcionActiva !== null,
            'suscripcion' => $suscripcionActiva ? [
                'id' => $suscripcionActiva->getId(),
                'fecha_inicio' => $suscripcionActiva->getFechaInicio()->format('Y-m-d'),
                'fecha_fin' => $suscripcionActiva->getFechaFin()?->format('Y-m-d'),
                'precio_mensual' => $suscripcionActiva->getPrecioMensual(),
                'auto_renovacion' => $suscripcionActiva->isAutoRenovacion(),
                'metodo_pago' => $suscripcionActiva->getMetodoPago(),
            ] : null,
        ]);
    }

    // ============================================
    // HACER PREMIUM MANUALMENTE (solo admin)
    // ============================================
    #[Route('/usuarios/{id}/hacer-premium', name: 'usuarios_make_premium', methods: ['POST'])]
    public function hacerPremium(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        // TODO: Verificar que el usuario actual es admin
        // if ($currentUser->getRol() !== 'admin') { return error; }

        $usuario = $entityManager->getRepository(Usuario::class)->find($id);

        if (!$usuario) {
            return $this->json([
                'success' => false,
                'error' => 'Usuario no encontrado',
            ], Response::HTTP_NOT_FOUND);
        }

        if ($usuario->isEsPremium()) {
            return $this->json([
                'success' => false,
                'error' => 'El usuario ya es premium',
            ], Response::HTTP_CONFLICT);
        }

        $usuario->setEsPremium(true);
        $usuario->setFechaPremium(new \DateTime());
        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => 'Usuario actualizado a premium',
            'usuario' => [
                'id' => $usuario->getId(),
                'nombre' => $usuario->getNombre(),
                'email' => $usuario->getEmail(),
                'es_premium' => $usuario->isEsPremium(),
                'fecha_premium' => $usuario->getFechaPremium()?->format('Y-m-d'),
            ],
        ]);
    }

    // ============================================
    // QUITAR PREMIUM (solo admin)
    // ============================================
    #[Route('/usuarios/{id}/quitar-premium', name: 'usuarios_remove_premium', methods: ['POST'])]
    public function quitarPremium(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        // TODO: Verificar que el usuario actual es admin

        $usuario = $entityManager->getRepository(Usuario::class)->find($id);

        if (!$usuario) {
            return $this->json([
                'success' => false,
                'error' => 'Usuario no encontrado',
            ], Response::HTTP_NOT_FOUND);
        }

        $usuario->setEsPremium(false);
        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => 'Premium removido del usuario',
            'usuario' => [
                'id' => $usuario->getId(),
                'nombre' => $usuario->getNombre(),
                'es_premium' => false,
            ],
        ]);
    }

    // ============================================
    // VERIFICAR SI ES ADMIN
    // ============================================
    #[Route('/usuarios/{id}/es-admin', name: 'usuarios_check_admin', methods: ['GET'])]
    public function esAdmin(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $usuario = $entityManager->getRepository(Usuario::class)->find($id);

        if (!$usuario) {
            return $this->json([
                'success' => false,
                'error' => 'Usuario no encontrado',
            ], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'success' => true,
            'es_admin' => $usuario->isAdmin(),
            'rol' => $usuario->getRol(),
        ]);
    }

    // ============================================
    // OBTENER PERFIL COMPLETO (con datos de pago)
    // ============================================
    #[Route('/usuarios/{id}/perfil-completo', name: 'usuarios_profile_full', methods: ['GET'])]
    public function perfilCompleto(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $usuario = $entityManager->getRepository(Usuario::class)->find($id);

        if (!$usuario) {
            return $this->json([
                'success' => false,
                'error' => 'Usuario no encontrado',
            ], Response::HTTP_NOT_FOUND);
        }

        // Obtener suscripción activa
        $suscripcionActiva = $entityManager->getRepository(Suscripcion::class)
            ->findOneBy(['usuario' => $usuario, 'estado' => 'activo']);

        // Obtener historial de pagos (últimos 5)
        $historialPagos = $entityManager->getRepository(HistorialPago::class)
            ->findBy(['usuario' => $usuario], ['fechaPago' => 'DESC'], 5);

        return $this->json([
            'success' => true,
            'usuario' => [
                'id' => $usuario->getId(),
                'nombre' => $usuario->getNombre(),
                'apellidos' => $usuario->getApellidos(),
                'email' => $usuario->getEmail(),
                'telefono' => $usuario->getTelefono(),
                'objetivo' => $usuario->getObjetivo(),
                'observaciones' => $usuario->getObservaciones(),
                'es_premium' => $usuario->isEsPremium(),
                'fecha_premium' => $usuario->getFechaPremium()?->format('Y-m-d'),
                'rol' => $usuario->getRol(),
                'fecha_registro' => $usuario->getFechaRegistro()?->format('Y-m-d H:i:s'),
            ],
            'suscripcion' => $suscripcionActiva ? [
                'id' => $suscripcionActiva->getId(),
                'fecha_inicio' => $suscripcionActiva->getFechaInicio()->format('Y-m-d'),
                'fecha_fin' => $suscripcionActiva->getFechaFin()?->format('Y-m-d'),
                'precio_mensual' => $suscripcionActiva->getPrecioMensual(),
                'estado' => $suscripcionActiva->getEstado(),
                'auto_renovacion' => $suscripcionActiva->isAutoRenovacion(),
            ] : null,
            'ultimos_pagos' => array_map(function($pago) {
                return [
                    'id' => $pago->getId(),
                    'monto' => $pago->getMonto(),
                    'moneda' => $pago->getMoneda(),
                    'estado' => $pago->getEstado(),
                    'fecha' => $pago->getFechaPago()->format('Y-m-d H:i:s'),
                ];
            }, $historialPagos),
        ]);
    }

    // ============================================
    // LISTAR TODOS LOS USUARIOS (solo admin)
    // ============================================
    #[Route('/usuarios', name: 'usuarios_list_all', methods: ['GET'])]
    public function listarTodos(
        EntityManagerInterface $entityManager
    ): JsonResponse {
        // TODO: Verificar que el usuario actual es admin

        $usuarios = $entityManager->getRepository(Usuario::class)->findAll();

        $data = array_map(function($usuario) {
            return [
                'id' => $usuario->getId(),
                'nombre' => $usuario->getNombreCompleto(),
                'email' => $usuario->getEmail(),
                'telefono' => $usuario->getTelefono(),
                'es_premium' => $usuario->isEsPremium(),
                'rol' => $usuario->getRol(),
                'fecha_registro' => $usuario->getFechaRegistro()?->format('Y-m-d'),
            ];
        }, $usuarios);

        return $this->json([
            'success' => true,
            'total' => count($data),
            'usuarios' => $data,
        ]);
    }

    // ============================================
    // ESTADÍSTICAS GLOBALES (solo admin)
    // ============================================
    #[Route('/usuarios/estadisticas-globales', name: 'usuarios_global_stats', methods: ['GET'])]
    public function estadisticasGlobales(
        EntityManagerInterface $entityManager
    ): JsonResponse {
        // TODO: Verificar que el usuario actual es admin

        $totalUsuarios = $entityManager->getRepository(Usuario::class)->count([]);
        $usuariosPremium = $entityManager->getRepository(Usuario::class)->count(['esPremium' => true]);
        $usuariosGratuitos = $totalUsuarios - $usuariosPremium;
        $administradores = $entityManager->getRepository(Usuario::class)->count(['rol' => 'admin']);

        $suscripcionesActivas = $entityManager->getRepository(Suscripcion::class)
            ->count(['estado' => 'activo']);

        return $this->json([
            'success' => true,
            'estadisticas' => [
                'total_usuarios' => $totalUsuarios,
                'usuarios_premium' => $usuariosPremium,
                'usuarios_gratuitos' => $usuariosGratuitos,
                'administradores' => $administradores,
                'suscripciones_activas' => $suscripcionesActivas,
                'porcentaje_premium' => $totalUsuarios > 0 ? round(($usuariosPremium / $totalUsuarios) * 100, 2) : 0,
            ],
        ]);
    }

    // ============================================
    // HELPER: Calcular días activo
    // ============================================
    private function calcularDiasActivo(Usuario $usuario): int
    {
        $fechaRegistro = $usuario->getFechaRegistro();
        if (!$fechaRegistro) {
            return 0;
        }

        $ahora = new \DateTime();
        $diferencia = $ahora->diff($fechaRegistro);
        
        return $diferencia->days;
    }
}