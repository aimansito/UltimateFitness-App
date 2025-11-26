<?php

namespace App\Controller;

use App\Entity\HistorialPago;
use App\Entity\Suscripcion;
use App\Entity\Usuario;
use App\Repository\HistorialPagoRepository;
use App\Repository\PlanRepository;
use App\Repository\SuscripcionRepository;
use App\Repository\UsuarioRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Controlador para gestionar Pagos y integración con Stripe
 */
#[Route('/api/pagos', name: 'api_pagos_')]
class PagoController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private PlanRepository $planRepository;
    private UsuarioRepository $usuarioRepository;
    private SuscripcionRepository $suscripcionRepository;
    private HistorialPagoRepository $historialPagoRepository;

    public function __construct(
        EntityManagerInterface $entityManager,
        PlanRepository $planRepository,
        UsuarioRepository $usuarioRepository,
        SuscripcionRepository $suscripcionRepository,
        HistorialPagoRepository $historialPagoRepository
    ) {
        $this->entityManager = $entityManager;
        $this->planRepository = $planRepository;
        $this->usuarioRepository = $usuarioRepository;
        $this->suscripcionRepository = $suscripcionRepository;
        $this->historialPagoRepository = $historialPagoRepository;
    }

    /**
     * Crear sesión de checkout de Stripe
     * POST /api/pagos/crear-sesion
     */
    #[Route('/crear-sesion', name: 'create_session', methods: ['POST'])]
    public function crearSesionCheckout(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            // Validar datos
            if (!isset($data['plan_id']) || !isset($data['usuario_id'])) {
                return $this->json([
                    'success' => false,
                    'error' => 'plan_id y usuario_id son obligatorios',
                ], Response::HTTP_BAD_REQUEST);
            }

            // Buscar plan
            $plan = $this->planRepository->find($data['plan_id']);
            if (!$plan) {
                return $this->json([
                    'success' => false,
                    'error' => 'Plan no encontrado',
                ], Response::HTTP_NOT_FOUND);
            }

            // Buscar usuario
            $usuario = $this->usuarioRepository->find($data['usuario_id']);
            if (!$usuario) {
                return $this->json([
                    'success' => false,
                    'error' => 'Usuario no encontrado',
                ], Response::HTTP_NOT_FOUND);
            }

            // Verificar si ya tiene suscripción activa
            $suscripcionActiva = $this->suscripcionRepository->findSuscripcionActiva($usuario);
            if ($suscripcionActiva) {
                return $this->json([
                    'success' => false,
                    'error' => 'El usuario ya tiene una suscripción activa',
                ], Response::HTTP_CONFLICT);
            }

            // TODO: Aquí integrarías con Stripe SDK
            // Por ahora devolvemos un mock para pruebas
            
            // Crear URL de checkout simulada
            $checkoutUrl = 'http://localhost:5173/pago/procesar?plan=' . $plan->getId() . '&usuario=' . $usuario->getId();

            return $this->json([
                'success' => true,
                'checkout_url' => $checkoutUrl,
                'session_id' => 'mock_session_' . uniqid(),
                'plan' => [
                    'id' => $plan->getId(),
                    'nombre' => $plan->getNombre(),
                    'precio' => $plan->esMensual() ? $plan->getPrecioMensual() : $plan->getPrecioAnual(),
                ],
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al crear sesión: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Webhook de Stripe (recibe notificaciones de pagos)
     * POST /api/pagos/webhook
     */
    #[Route('/webhook', name: 'webhook', methods: ['POST'])]
    public function webhookStripe(Request $request): JsonResponse
    {
        try {
            $payload = $request->getContent();
            $signature = $request->headers->get('Stripe-Signature');

            // TODO: Verificar firma de Stripe
            // $event = \Stripe\Webhook::constructEvent($payload, $signature, $webhookSecret);

            // Mock para desarrollo
            $event = json_decode($payload, true);

            // Procesar evento según tipo
            switch ($event['type'] ?? 'payment_intent.succeeded') {
                case 'payment_intent.succeeded':
                    return $this->procesarPagoExitoso($event);

                case 'payment_intent.payment_failed':
                    return $this->procesarPagoFallido($event);

                case 'customer.subscription.created':
                    return $this->procesarSuscripcionCreada($event);

                case 'customer.subscription.deleted':
                    return $this->procesarSuscripcionCancelada($event);

                default:
                    return $this->json(['success' => true, 'message' => 'Evento no manejado']);
            }
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error en webhook: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Confirmar pago manual (para desarrollo/testing)
     * POST /api/pagos/confirmar
     */
    #[Route('/confirmar', name: 'confirm', methods: ['POST'])]
    public function confirmarPago(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!isset($data['plan_id']) || !isset($data['usuario_id'])) {
                return $this->json([
                    'success' => false,
                    'error' => 'Faltan datos obligatorios',
                ], Response::HTTP_BAD_REQUEST);
            }

            $plan = $this->planRepository->find($data['plan_id']);
            $usuario = $this->usuarioRepository->find($data['usuario_id']);

            if (!$plan || !$usuario) {
                return $this->json([
                    'success' => false,
                    'error' => 'Plan o usuario no encontrado',
                ], Response::HTTP_NOT_FOUND);
            }

            // Actualizar usuario a premium
            $usuario->setEsPremium(true);
            $usuario->setFechaPremium(new \DateTime());

            // Crear suscripción
            $suscripcion = new Suscripcion();
            $suscripcion->setUsuario($usuario);
            // $suscripcion->setServicio(...); // Si tienes relación con servicios
            $suscripcion->setFechaInicio(new \DateTime());
            
            $fechaFin = new \DateTime();
            $fechaFin->modify('+' . $plan->getDuracionDias() . ' days');
            $suscripcion->setFechaFin($fechaFin);
            
            $suscripcion->setPrecioMensual($plan->getPrecioMensual());
            $suscripcion->setEstado('activo');
            $suscripcion->setMetodoPago('stripe');
            $suscripcion->setIdTransaccionExterna('test_' . uniqid());

            // Crear registro en historial de pagos
            $historialPago = new HistorialPago();
            $historialPago->setUsuario($usuario);
            $historialPago->setSuscripcion($suscripcion);
            $historialPago->setMonto($plan->esMensual() ? $plan->getPrecioMensual() : $plan->getPrecioAnual());
            $historialPago->setMetodoPago('stripe');
            $historialPago->setIdTransaccionExterna('test_' . uniqid());
            $historialPago->setEstado('completado');
            $historialPago->setDescripcion('Pago de plan: ' . $plan->getNombre());

            $this->entityManager->persist($suscripcion);
            $this->entityManager->persist($historialPago);
            $this->entityManager->flush();

            return $this->json([
                'success' => true,
                'message' => 'Pago confirmado y usuario actualizado a premium',
                'suscripcion_id' => $suscripcion->getId(),
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al confirmar pago: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtener historial de pagos de un usuario
     * GET /api/pagos/usuario/{id}
     */
    #[Route('/usuario/{id}', name: 'user_history', methods: ['GET'])]
    public function historialUsuario(int $id): JsonResponse
    {
        try {
            $usuario = $this->usuarioRepository->find($id);

            if (!$usuario) {
                return $this->json([
                    'success' => false,
                    'error' => 'Usuario no encontrado',
                ], Response::HTTP_NOT_FOUND);
            }

            $pagos = $this->historialPagoRepository->findByUsuario($usuario);

            $data = array_map(function (HistorialPago $pago) {
                return [
                    'id' => $pago->getId(),
                    'monto' => $pago->getMonto(),
                    'moneda' => $pago->getMoneda(),
                    'metodo_pago' => $pago->getMetodoPago(),
                    'estado' => $pago->getEstado(),
                    'descripcion' => $pago->getDescripcion(),
                    'fecha_pago' => $pago->getFechaPago()->format('Y-m-d H:i:s'),
                ];
            }, $pagos);

            return $this->json([
                'success' => true,
                'pagos' => $data,
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al obtener historial',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Procesar pago exitoso
     */
    private function procesarPagoExitoso(array $event): JsonResponse
    {
        // Lógica para actualizar usuario a premium
        // Crear suscripción
        // Registrar en historial_pagos
        
        return $this->json(['success' => true, 'message' => 'Pago procesado']);
    }

    /**
     * Procesar pago fallido
     */
    private function procesarPagoFallido(array $event): JsonResponse
    {
        // Lógica para notificar usuario
        // Registrar intento fallido
        
        return $this->json(['success' => true, 'message' => 'Pago fallido procesado']);
    }

    /**
     * Procesar suscripción creada
     */
    private function procesarSuscripcionCreada(array $event): JsonResponse
    {
        return $this->json(['success' => true, 'message' => 'Suscripción creada']);
    }

    /**
     * Procesar suscripción cancelada
     */
    private function procesarSuscripcionCancelada(array $event): JsonResponse
    {
        return $this->json(['success' => true, 'message' => 'Suscripción cancelada']);
    }
}