<?php

namespace App\Controller;

use App\Entity\Usuario;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * CONTROLADOR DE SUSCRIPCIONES PREMIUM
 *
 * RUTAS:
 *  - POST /api/suscripciones/activar-premium
 *  - GET  /api/suscripciones/info
 *  - GET  /api/suscripciones/mi-suscripcion
 *  - GET  /api/suscripciones/mi-entrenador
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
     *  POST /api/suscripciones/activar-premium
     *  PROTEGIDO POR JWT
     * ============================================================ */
    #[Route('/activar-premium', name: 'activar_premium', methods: ['POST'])]
    public function activarPremium(Request $request, Connection $connection): JsonResponse
    {
        $usuario = $this->getUser();

        if (!$usuario instanceof Usuario) {
            return $this->json(['success' => false, 'error' => 'Usuario no autenticado'], 401);
        }

        if ($usuario->isEsPremium()) {
            return $this->json(['success' => false, 'error' => 'El usuario ya es premium'], 400);
        }

        $data = json_decode($request->getContent(), true) ?? [];
        $metodo = $data['metodo_pago'] ?? 'tarjeta';
        $referencia = $data['referencia'] ?? 'UPGRADE_' . time();

        try {
            // Ajustado a las columnas actuales de historial_pagos
            $sql = "
                INSERT INTO historial_pagos (
                    usuario_id,
                    suscripcion_id,
                    monto,
                    moneda,
                    metodo_pago,
                    id_transaccion_externa,
                    estado,
                    descripcion,
                    fecha_pago,
                    fecha_actualizacion
                ) VALUES (?, NULL, ?, 'EUR', ?, ?, 'completado', 'Upgrade premium', NOW(), NOW())
            ";

            $connection->prepare($sql)->executeStatement([
                $usuario->getId(),
                self::PREMIUM_PRICE,
                $metodo,
                $referencia
            ]);

            // Marcar al usuario como premium
            $usuario->setEsPremium(true);
            $usuario->setFechaPremium(new \DateTime());

            // Asignar entrenador aleatorio activo si no tiene
            if (!$usuario->getEntrenadorAsignado()) {
                $entrenadorId = $connection->fetchOne("SELECT id FROM entrenadores WHERE activo = 1 ORDER BY RAND() LIMIT 1");
                if ($entrenadorId) {
                    $entrenador = $this->entityManager->getRepository(\App\Entity\Entrenador::class)->find($entrenadorId);
                    if ($entrenador) {
                        $usuario->setEntrenadorAsignado($entrenador);
                    }
                }
            }

            $this->entityManager->flush();

            return $this->json([
                'success' => true,
                'message' => '¡Pago completado! Tu cuenta Premium se activará al volver a iniciar sesión.',
                'force_logout' => true
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al procesar el pago: ' . $e->getMessage()
            ], 500);
        }
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
}
