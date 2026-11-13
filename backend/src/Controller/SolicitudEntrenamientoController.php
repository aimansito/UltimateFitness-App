<?php

namespace App\Controller;

use App\Entity\Entrenador;
use App\Entity\SolicitudEntrenamiento;
use App\Entity\Usuario;
use App\Repository\EntrenadorRepository;
use App\Repository\SolicitudEntrenamientoRepository;
use App\Repository\UsuarioRepository;
use App\Service\SolicitudEntrenamientoService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Solicitudes de entrenamiento (cliente -> entrenador).
 *
 * Lado cliente:    /api/solicitudes/...        (JWT de Usuario)
 * Lado entrenador: /api/entrenador/solicitudes/... (JWT de Entrenador, por el prefijo /entrenador que usa api.js)
 */
class SolicitudEntrenamientoController extends AbstractController
{
    public function __construct(
        private SolicitudEntrenamientoService $solicitudService,
        private SolicitudEntrenamientoRepository $solicitudRepository,
        private EntrenadorRepository $entrenadorRepository,
        private UsuarioRepository $usuarioRepository
    ) {
    }

    // ============================================
    // LADO CLIENTE
    // ============================================

    /**
     * Entrenadores disponibles para descubrir/solicitar (público para el cliente autenticado)
     * GET /api/solicitudes/descubrir
     */
    #[Route('/api/solicitudes/descubrir', name: 'api_solicitudes_descubrir', methods: ['GET'])]
    public function descubrirEntrenadores(): JsonResponse
    {
        $usuario = $this->getUser();
        if (!$usuario instanceof Usuario) {
            return $this->json(['success' => false, 'error' => 'No autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        $entrenadores = $this->entrenadorRepository->findActivos();

        return $this->json([
            'success' => true,
            'entrenadores' => array_map([$this, 'serializeEntrenadorPublico'], $entrenadores),
        ]);
    }

    /**
     * Crear una solicitud a un entrenador
     * POST /api/solicitudes/{entrenadorId}
     */
    #[Route('/api/solicitudes/{entrenadorId}', name: 'api_solicitudes_crear', methods: ['POST'], requirements: ['entrenadorId' => '\d+'])]
    public function solicitar(int $entrenadorId, Request $request): JsonResponse
    {
        $usuario = $this->getUser();
        if (!$usuario instanceof Usuario) {
            return $this->json(['success' => false, 'error' => 'No autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        $entrenador = $this->entrenadorRepository->find($entrenadorId);
        if (!$entrenador) {
            return $this->json(['success' => false, 'error' => 'Entrenador no encontrado'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true) ?? [];
        $mensaje = $data['mensaje'] ?? null;

        try {
            $solicitud = $this->solicitudService->solicitar($usuario, $entrenador, $mensaje);
        } catch (\DomainException $e) {
            return $this->json(['success' => false, 'error' => $e->getMessage()], Response::HTTP_CONFLICT);
        }

        return $this->json([
            'success' => true,
            'message' => 'Solicitud enviada correctamente',
            'solicitud' => $this->serializeSolicitud($solicitud, false),
        ], Response::HTTP_CREATED);
    }

    /**
     * Estado de la solicitud/relación actual del cliente
     * GET /api/solicitudes/mia
     */
    #[Route('/api/solicitudes/mia', name: 'api_solicitudes_mia', methods: ['GET'])]
    public function miSolicitud(): JsonResponse
    {
        $usuario = $this->getUser();
        if (!$usuario instanceof Usuario) {
            return $this->json(['success' => false, 'error' => 'No autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        $solicitud = $this->solicitudRepository->findAceptadaDeUsuario($usuario)
            ?? $this->solicitudRepository->findPendienteDeUsuario($usuario);

        if (!$solicitud) {
            return $this->json(['success' => false, 'message' => 'No tienes ninguna solicitud'], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'success' => true,
            'solicitud' => $this->serializeSolicitud($solicitud, false),
        ]);
    }

    /**
     * Cancelar una solicitud propia pendiente
     * DELETE /api/solicitudes/{id}
     */
    #[Route('/api/solicitudes/{id}/cancelar', name: 'api_solicitudes_cancelar', methods: ['DELETE', 'POST'], requirements: ['id' => '\d+'])]
    public function cancelar(int $id): JsonResponse
    {
        $usuario = $this->getUser();
        if (!$usuario instanceof Usuario) {
            return $this->json(['success' => false, 'error' => 'No autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        $solicitud = $this->solicitudRepository->find($id);
        if (!$solicitud || $solicitud->getUsuario()?->getId() !== $usuario->getId()) {
            return $this->json(['success' => false, 'error' => 'Solicitud no encontrada'], Response::HTTP_NOT_FOUND);
        }

        try {
            $this->solicitudService->cancelar($solicitud);
        } catch (\DomainException $e) {
            return $this->json(['success' => false, 'error' => $e->getMessage()], Response::HTTP_CONFLICT);
        }

        return $this->json(['success' => true, 'message' => 'Solicitud cancelada']);
    }

    /**
     * Finalizar la relación activa (lado cliente)
     * POST /api/solicitudes/finalizar
     */
    #[Route('/api/solicitudes/finalizar', name: 'api_solicitudes_finalizar_cliente', methods: ['POST'])]
    public function finalizarComoCliente(): JsonResponse
    {
        $usuario = $this->getUser();
        if (!$usuario instanceof Usuario) {
            return $this->json(['success' => false, 'error' => 'No autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        try {
            $this->solicitudService->finalizar($usuario);
        } catch (\DomainException $e) {
            return $this->json(['success' => false, 'error' => $e->getMessage()], Response::HTTP_CONFLICT);
        }

        return $this->json(['success' => true, 'message' => 'Relación finalizada']);
    }

    // ============================================
    // LADO ENTRENADOR
    // ============================================

    /**
     * Solicitudes pendientes recibidas
     * GET /api/entrenador/solicitudes
     */
    #[Route('/api/entrenador/solicitudes', name: 'api_entrenador_solicitudes_list', methods: ['GET'])]
    public function solicitudesPendientes(): JsonResponse
    {
        $entrenador = $this->getUser();
        if (!$entrenador instanceof Entrenador) {
            return $this->json(['success' => false, 'error' => 'No autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        $solicitudes = $this->solicitudRepository->findPendientesDeEntrenador($entrenador);

        return $this->json([
            'success' => true,
            'solicitudes' => array_map(fn (SolicitudEntrenamiento $s) => $this->serializeSolicitud($s, true), $solicitudes),
        ]);
    }

    /**
     * Aceptar una solicitud recibida
     * POST /api/entrenador/solicitudes/{id}/aceptar
     */
    #[Route('/api/entrenador/solicitudes/{id}/aceptar', name: 'api_entrenador_solicitudes_aceptar', methods: ['POST'], requirements: ['id' => '\d+'])]
    public function aceptar(int $id): JsonResponse
    {
        $entrenador = $this->getUser();
        if (!$entrenador instanceof Entrenador) {
            return $this->json(['success' => false, 'error' => 'No autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        $solicitud = $this->solicitudRepository->find($id);
        if (!$solicitud || $solicitud->getEntrenador()?->getId() !== $entrenador->getId()) {
            return $this->json(['success' => false, 'error' => 'Solicitud no encontrada'], Response::HTTP_NOT_FOUND);
        }

        try {
            $this->solicitudService->aceptar($solicitud);
        } catch (\DomainException $e) {
            return $this->json(['success' => false, 'error' => $e->getMessage()], Response::HTTP_CONFLICT);
        }

        return $this->json(['success' => true, 'message' => 'Solicitud aceptada']);
    }

    /**
     * Rechazar una solicitud recibida
     * POST /api/entrenador/solicitudes/{id}/rechazar
     */
    #[Route('/api/entrenador/solicitudes/{id}/rechazar', name: 'api_entrenador_solicitudes_rechazar', methods: ['POST'], requirements: ['id' => '\d+'])]
    public function rechazar(int $id, Request $request): JsonResponse
    {
        $entrenador = $this->getUser();
        if (!$entrenador instanceof Entrenador) {
            return $this->json(['success' => false, 'error' => 'No autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        $solicitud = $this->solicitudRepository->find($id);
        if (!$solicitud || $solicitud->getEntrenador()?->getId() !== $entrenador->getId()) {
            return $this->json(['success' => false, 'error' => 'Solicitud no encontrada'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true) ?? [];
        $motivo = $data['motivo'] ?? null;

        try {
            $this->solicitudService->rechazar($solicitud, $motivo);
        } catch (\DomainException $e) {
            return $this->json(['success' => false, 'error' => $e->getMessage()], Response::HTTP_CONFLICT);
        }

        return $this->json(['success' => true, 'message' => 'Solicitud rechazada']);
    }

    /**
     * Finalizar la relación con un cliente (lado entrenador)
     * POST /api/entrenador/solicitudes/finalizar/{usuarioId}
     */
    #[Route('/api/entrenador/solicitudes/finalizar/{usuarioId}', name: 'api_entrenador_solicitudes_finalizar', methods: ['POST'], requirements: ['usuarioId' => '\d+'])]
    public function finalizarComoEntrenador(int $usuarioId): JsonResponse
    {
        $entrenador = $this->getUser();
        if (!$entrenador instanceof Entrenador) {
            return $this->json(['success' => false, 'error' => 'No autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        $usuario = $this->usuarioRepository->find($usuarioId);
        if (!$usuario || $usuario->getEntrenadorAsignado()?->getId() !== $entrenador->getId()) {
            return $this->json(['success' => false, 'error' => 'Cliente no encontrado o no asignado a este entrenador'], Response::HTTP_NOT_FOUND);
        }

        try {
            $this->solicitudService->finalizar($usuario);
        } catch (\DomainException $e) {
            return $this->json(['success' => false, 'error' => $e->getMessage()], Response::HTTP_CONFLICT);
        }

        return $this->json(['success' => true, 'message' => 'Relación finalizada']);
    }

    // ============================================
    // SERIALIZACIÓN
    // ============================================

    private function serializeEntrenadorPublico(Entrenador $entrenador): array
    {
        return [
            'id' => $entrenador->getId(),
            'nombre' => $entrenador->getNombre(),
            'apellidos' => $entrenador->getApellidos(),
            'nombre_completo' => $entrenador->getNombreCompleto(),
            'especialidad' => $entrenador->getEspecialidad(),
            'especialidad_formateada' => $entrenador->getEspecialidadFormateada(),
            'biografia' => $entrenador->getBiografia(),
            'anos_experiencia' => $entrenador->getAnosExperiencia(),
            'valoracion_promedio' => $entrenador->getValoracionPromedio(),
            'total_valoraciones' => $entrenador->getTotalValoraciones(),
            'precio_sesion_presencial' => $entrenador->getPrecioSesionPresencial(),
            'foto_url' => $entrenador->getFotoUrl(),
        ];
    }

    /**
     * Perfil público de un cliente, SIN datos de salud privados
     * (sin peso, altura, imc, notas_salud, observaciones, etc.)
     */
    private function serializeUsuarioPublico(Usuario $usuario): array
    {
        return [
            'id' => $usuario->getId(),
            'nombre' => $usuario->getNombre(),
            'apellidos' => $usuario->getApellidos(),
            'nombre_completo' => $usuario->getNombreCompleto(),
            'edad' => $usuario->getEdad(),
            'objetivo' => $usuario->getObjetivo(),
            'nivel_actividad' => $usuario->getNivelActividad(),
            'foto_url' => $usuario->getFotoUrl(),
            'bio_corta' => $usuario->getBioCorta(),
        ];
    }

    private function serializeSolicitud(SolicitudEntrenamiento $solicitud, bool $vistaEntrenador): array
    {
        $data = [
            'id' => $solicitud->getId(),
            'estado' => $solicitud->getEstado(),
            'mensaje' => $solicitud->getMensaje(),
            'motivo_rechazo' => $solicitud->getMotivoRechazo(),
            'fecha_solicitud' => $solicitud->getFechaSolicitud()?->format('Y-m-d H:i:s'),
            'fecha_respuesta' => $solicitud->getFechaRespuesta()?->format('Y-m-d H:i:s'),
        ];

        if ($vistaEntrenador) {
            $data['usuario'] = $solicitud->getUsuario() ? $this->serializeUsuarioPublico($solicitud->getUsuario()) : null;
        } else {
            $data['entrenador'] = $solicitud->getEntrenador() ? $this->serializeEntrenadorPublico($solicitud->getEntrenador()) : null;
        }

        return $data;
    }
}
