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

class StripeController extends AbstractController
{
    private string $stripeSecret;
    private string $webhookSecret;
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->stripeSecret = $_ENV['STRIPE_SECRET_KEY'] ?? 'sk_test_mock';
        $this->webhookSecret = $_ENV['STRIPE_WEBHOOK_SECRET'] ?? 'whsec_mock';
        $this->em = $em;
    }

    #[Route('/api/stripe/create-checkout-session', name: 'api_stripe_create_checkout', methods: ['POST'])]
    public function createCheckoutSession(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['success' => false, 'error' => 'Usuario no autenticado'], 401);
        }

        $data = json_decode($request->getContent(), true);
        $planId = $data['planId'] ?? 'premium';

        $priceId = '';
        if ($planId === 'premium') {
            $priceId = $_ENV['STRIPE_PRICE_PREMIUM'] ?? 'price_1PXXX_mock_premium';
        } else if ($planId === 'elite') {
            $priceId = $_ENV['STRIPE_PRICE_ELITE'] ?? 'price_1PXXX_mock_elite';
        }

        // Dummy check for mock environment to bypass real Stripe API call if keys are missing
        if (str_starts_with($this->stripeSecret, 'sk_test_mock')) {
            return new JsonResponse([
                'success' => true,
                'checkoutUrl' => 'https://checkout.stripe.com/pay/cs_test_mock_123',
                'mock' => true
            ]);
        }

        Stripe::setApiKey($this->stripeSecret);

        $frontendUrl = $_ENV['FRONTEND_URL'] ?? 'http://localhost:5173';

        try {
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [
                    [
                        'price' => $priceId,
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

        $event = null;

        try {
            $event = Webhook::constructEvent(
                $payload,
                rtrim($sigHeader),
                $this->webhookSecret
            );
        } catch (\UnexpectedValueException $e) {
            return new JsonResponse(['error' => 'Payload inválido'], 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            return new JsonResponse(['error' => 'Firma inválida'], 400);
        }

        // Manejar el evento de Stripe
        switch ($event->type) {
            case 'checkout.session.completed':
                $session = $event->data->object;

                $userId = $session->client_reference_id;

                if ($userId) {
                    $usuario = $this->em->getRepository(Usuario::class)->find($userId);
                    if ($usuario) {
                        $usuario->setEsPremium(true);
                        $usuario->setFechaPremium(new \DateTime());
                        // NOTA: Para un sistema más completo, guarda el $session->customer y $session->subscription
                        $this->em->flush();
                    }
                }
                break;
            case 'customer.subscription.deleted':
                $subscription = $event->data->object;
                // Lógica de cancelación aquí. Ejemplo: buscar por customer y setEsPremium(false)
                break;
            default:
                break;
        }

        return new JsonResponse(['success' => true]);
    }
}
