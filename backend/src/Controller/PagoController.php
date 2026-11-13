<?php

namespace App\Controller;

use App\Entity\HistorialPago;
use App\Entity\Usuario;
use App\Repository\HistorialPagoRepository;
use App\Repository\UsuarioRepository;
use App\Security\RoleChecker;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Historial de pagos. La creación de sesiones de pago y el webhook reales
 * viven en StripeController (POST /api/stripe/create-checkout-session,
 * POST /api/stripe/webhook) — este controlador ya no duplica ese flujo.
 */
#[Route('/api/pagos', name: 'api_pagos_')]
class PagoController extends AbstractController
{
    public function __construct(
        private UsuarioRepository $usuarioRepository,
        private HistorialPagoRepository $historialPagoRepository
    ) {
    }

    /**
     * Obtener historial de pagos de un usuario
     * GET /api/pagos/usuario/{id}
     */
    #[Route('/usuario/{id}', name: 'user_history', methods: ['GET'])]
    public function historialUsuario(int $id, RoleChecker $roleChecker): JsonResponse
    {
        try {
            $usuarioActual = $this->getUser();
            if (!$usuarioActual instanceof Usuario || ($usuarioActual->getId() !== $id && !$roleChecker->isAdmin($usuarioActual))) {
                return $roleChecker->denyAccess();
            }

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
}
