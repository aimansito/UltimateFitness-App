<?php

namespace App\Controller;

use Stripe\Stripe;
use Stripe\Checkout\Session;
use Stripe\Webhook;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Usuario;
use App\Entity\Suscripcion;
use App\Entity\HistorialPago;

/**
 * Suscripción Premium real vía Stripe Checkout (un solo plan).
 * La fuente de verdad del pago es el webhook, no el redirect del navegador.
 */
class StripeController extends AbstractController
{
    private const PREMIUM_PRICE = 19.99;

    private string $stripeSecret;
    private string $webhookSecret;
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->stripeSecret = $_ENV['STRIPE_SECRET_KEY'] ?? '';
        $this->webhookSecret = $_ENV['STRIPE_WEBHOOK_SECRET'] ?? '';
        $this->em = $em;
    }

    #[Route('/api/stripe/create-checkout-session', name: 'api_stripe_create_checkout', methods: ['POST'])]
    public function createCheckoutSession(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof Usuario) {
            return new JsonResponse(['success' => false, 'error' => 'Usuario no autenticado'], 401);
        }

        if ($user->isEsPremium()) {
            return new JsonResponse(['success' => false, 'error' => 'Ya tienes una suscripción Premium activa'], 400);
        }

        if (!$this->stripeSecret || !($_ENV['STRIPE_PRICE_PREMIUM'] ?? null)) {
            return new JsonResponse(['success' => false, 'error' => 'El cobro con Stripe no está configurado todavía (faltan STRIPE_SECRET_KEY / STRIPE_PRICE_PREMIUM)'], 500);
        }

        Stripe::setApiKey($this->stripeSecret);

        $frontendUrl = $_ENV['FRONTEND_URL'] ?? 'http://localhost:5173';

        try {
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [
                    [
                        'price' => $_ENV['STRIPE_PRICE_PREMIUM'],
                        'quantity' => 1,
                    ]
                ],
                'mode' => 'subscription',
                'success_url' => $frontendUrl . '/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => $frontendUrl . '/upgrade-premium?canceled=true',
                'client_reference_id' => (string) $user->getId(),
                'customer_email' => $user->getEmail(),
            ]);

            return new JsonResponse(['success' => true, 'checkoutUrl' => $session->url]);
        } catch (\Exception $e) {
            return new JsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    #[Route('/api/stripe/webhook', name: 'api_stripe_webhook', methods: ['POST'])]
    public function webhook(Request $request): JsonResponse
    {
        $payload = $request->getContent();
        $sigHeader = $request->headers->get('stripe-signature');

        try {
            $event = Webhook::constructEvent(
                $payload,
                rtrim((string) $sigHeader),
                $this->webhookSecret
            );
        } catch (\UnexpectedValueException $e) {
            return new JsonResponse(['error' => 'Payload inválido'], 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            return new JsonResponse(['error' => 'Firma inválida'], 400);
        }

        switch ($event->type) {
            case 'checkout.session.completed':
                $this->procesarCheckoutCompletado($event->data->object);
                break;

            case 'customer.subscription.deleted':
                $this->procesarSuscripcionCancelada($event->data->object);
                break;

            default:
                break;
        }

        return new JsonResponse(['success' => true]);
    }

    private function procesarCheckoutCompletado(\Stripe\Checkout\Session $session): void
    {
        $userId = $session->client_reference_id;
        if (!$userId) {
            return;
        }

        $usuario = $this->em->getRepository(Usuario::class)->find($userId);
        if (!$usuario) {
            return;
        }

        $usuario->setEsPremium(true);
        $usuario->setFechaPremium(new \DateTime());

        $suscripcion = new Suscripcion();
        $suscripcion->setUsuario($usuario);
        $suscripcion->setFechaInicio(new \DateTime());
        $suscripcion->setPrecioMensual((string) self::PREMIUM_PRICE);
        $suscripcion->setEstado('activo');
        $suscripcion->setAutoRenovacion(true);
        $suscripcion->setActiva(true);
        $suscripcion->setStripeCustomerId((string) $session->customer);
        $suscripcion->setStripeSubscriptionId((string) $session->subscription);
        $this->em->persist($suscripcion);

        $historialPago = new HistorialPago();
        $historialPago->setUsuario($usuario);
        $historialPago->setSuscripcion($suscripcion);
        $historialPago->setMonto((string) self::PREMIUM_PRICE);
        $historialPago->setMetodoPago('stripe');
        $historialPago->setIdTransaccionExterna((string) $session->id);
        $historialPago->setEstado('completado');
        $historialPago->setDescripcion('Suscripción Ultimate Premium');
        $this->em->persist($historialPago);

        $this->em->flush();
    }

    private function procesarSuscripcionCancelada(\Stripe\Subscription $stripeSubscription): void
    {
        $suscripcion = $this->em->getRepository(Suscripcion::class)
            ->findOneBy(['stripeSubscriptionId' => $stripeSubscription->id]);

        if (!$suscripcion) {
            return;
        }

        $suscripcion->setActiva(false);
        $suscripcion->setEstado('cancelado');
        $suscripcion->setAutoRenovacion(false);

        $usuario = $suscripcion->getUsuario();
        if ($usuario) {
            $usuario->setEsPremium(false);
        }

        $this->em->flush();
    }
}
