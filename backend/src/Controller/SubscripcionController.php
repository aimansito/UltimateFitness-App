<?php

namespace App\Controller;

use App\Entity\Usuario;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * CONTROLADOR DE SUSCRIPCIONES PREMIUM
 *
 * RUTAS:
 *  - GET  /api/suscripciones/info
 *  - GET  /api/suscripciones/mi-suscripcion
 *  - GET  /api/suscripciones/mi-entrenador
 *  - POST /api/suscripciones/cancelar
 *
 * La activación real de Premium ocurre vía Stripe: ver StripeController
 * (POST /api/stripe/create-checkout-session + webhook).
 */
#[Route('/api/suscripciones', name: 'api_suscripciones_')]
class SubscripcionController extends AbstractController
{
    private const PREMIUM_NAME = 'Ultimate Premium';
    private const PREMIUM_PRICE = 19.99;
    private const PREMIUM_CURRENCY = 'EUR';
    private const PREMIUM_FEATURES = [
        'Entrenador personal asignado',
        'Planes de entrenamiento personalizados',
        'Dietas personalizadas',
        'Acceso completo al blog',
        'Seguimiento de progreso avanzado',
        'Soporte prioritario'
    ];

    public function __construct(private EntityManagerInterface $entityManager)
    {
    }

    /* ============================================================
     *  GET /api/suscripciones/info (PÚBLICO)
     * ============================================================ */
    #[Route('/info', name: 'info', methods: ['GET'])]
    public function info(): JsonResponse
    {
        return $this->json([
            'success' => true,
            'plan' => [
                'nombre' => self::PREMIUM_NAME,
                'precio' => self::PREMIUM_PRICE,
                'moneda' => self::PREMIUM_CURRENCY,
                'periodo' => 'mensual',
                'caracteristicas' => self::PREMIUM_FEATURES
            ]
        ]);
    }

    /* ============================================================
     *  GET /api/suscripciones/mi-suscripcion (JWT)
     * ============================================================ */
    #[Route('/mi-suscripcion', name: 'mi_suscripcion', methods: ['GET'])]
    public function miSuscripcion(Connection $connection): JsonResponse
    {
        $usuario = $this->getUser();

        if (!$usuario instanceof Usuario) {
            return $this->json(['success' => false, 'error' => 'No autenticado'], 401);
        }

        // AHORA consulta correcta: estado = 'activo'
        $sql = "
            SELECT s.*, p.metodo, p.ultimos_4_digitos
            FROM suscripciones s
            LEFT JOIN historial_pagos p ON s.id = p.suscripcion_id
            WHERE s.usuario_id = ? AND s.estado = 'activo'
            ORDER BY s.id DESC LIMIT 1
        ";

        $suscripcion = $connection->fetchAssociative($sql, [$usuario->getId()]);

        if (!$suscripcion) {
            return $this->json([
                'success' => false,
                'message' => 'No tienes suscripción activa'
            ], 404);
        }

        return $this->json([
            'success' => true,
            'suscripcion' => [
                'id' => (int)$suscripcion['id'],
                'plan_nombre' => self::PREMIUM_NAME,
                'plan_precio' => (float)$suscripcion['precio_mensual'],
                'fecha_inicio' => $suscripcion['fecha_inicio'],
                'fecha_fin' => $suscripcion['fecha_fin'],
                'estado' => $suscripcion['estado'],
                'auto_renovacion' => (bool)$suscripcion['auto_renovacion'],
                'metodo_pago' => $suscripcion['metodo'] ?? null,
                'ultimos4_digitos' => $suscripcion['ultimos_4_digitos'] ?? null
            ]
        ]);
    }

    /* ============================================================
     *  GET /api/suscripciones/mi-entrenador (solo premium)
     * ============================================================ */
    #[Route('/mi-entrenador', name: 'mi_entrenador', methods: ['GET'])]
    public function miEntrenador(): JsonResponse
    {
        $usuario = $this->getUser();

        if (!$usuario instanceof Usuario) {
            return $this->json(['success' => false, 'error' => 'No autenticado'], 401);
        }

        if (!$usuario->isEsPremium()) {
            return $this->json(['success' => false, 'error' => 'Solo disponible para usuarios premium'], 403);
        }

        $entrenador = $usuario->getEntrenadorAsignado();

        if (!$entrenador) {
            return $this->json(['success' => false, 'message' => 'No tienes entrenador asignado aún'], 404);
        }

        return $this->json([
            'success' => true,
            'entrenador' => [
                'id' => $entrenador->getId(),
                'nombre' => $entrenador->getNombre(),
                'apellidos' => $entrenador->getApellidos(),
                'nombre_completo' => $entrenador->getNombreCompleto(),
                'email' => $entrenador->getEmail(),
                'telefono' => $entrenador->getTelefono(),
                'especialidad' => $entrenador->getEspecialidad(),
                'especialidad_formateada' => $entrenador->getEspecialidadFormateada(),
                'anos_experiencia' => $entrenador->getAnosExperiencia(),
                'certificacion' => $entrenador->getCertificacion(),
                'biografia' => $entrenador->getBiografia(),
                'valoracion_promedio' => (float)$entrenador->getValoracionPromedio(),
                'total_valoraciones' => $entrenador->getTotalValoraciones()
            ]
        ]);
    }

    // ============================================================
    //  POST /api/suscripciones/cancelar (solo premium)
    // ============================================================
    #[Route('/cancelar', name: 'cancelar_premium', methods: ['POST'])]
    public function cancelarPremium(Connection $connection): JsonResponse
    {
        $usuario = $this->getUser();

        if (!$usuario instanceof Usuario) {
            return $this->json(['success' => false, 'error' => 'No autenticado'], 401);
        }

        if (!$usuario->isEsPremium()) {
            return $this->json([
                'success' => false,
                'error' => 'No tienes una suscripción premium activa'
            ], Response::HTTP_BAD_REQUEST);
        }

        try {
            // NOTA: esto solo desactiva el flag local. Mientras el usuario tenga una
            // suscripción de Stripe real activa (stripe_subscription_id en la tabla
            // suscripciones), Stripe seguirá cobrando cada mes hasta que también se
            // cancele allí (\Stripe\Subscription::update(..., ['cancel_at_period_end' => true])).
            // Pendiente de implementar cuando haya suscripciones reales que cancelar.
            $sql = "UPDATE suscripciones
                    SET activa = 0, auto_renovacion = 0
                    WHERE usuario_id = ? AND activa = 1";
            
            $connection->executeStatement($sql, [$usuario->getId()]);

            // Cambiar usuario a no premium
            $usuario->setEsPremium(false);
            $this->entityManager->flush();

            return $this->json([
                'success' => true,
                'message' => 'Suscripción premium cancelada correctamente',
                'force_logout' => true // Forzar logout para recargar permisos
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al cancelar la suscripción: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
