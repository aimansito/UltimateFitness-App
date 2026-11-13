<?php

namespace App\Controller;

use App\Entity\Usuario;
use App\Service\CorreosCuenta;
use App\Service\VerificacionEmail;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/** Confirmación del email tras el registro (rutas públicas, con límite de intentos) */
class VerificacionEmailController extends AbstractController
{
    public function __construct(
        private VerificacionEmail $verificacion,
        private CorreosCuenta $correos,
        private EntityManagerInterface $em,
    ) {
    }

    #[Route('/api/verificar-email', name: 'api_verificar_email', methods: ['POST'])]
    public function verificar(Request $request): JsonResponse
    {
        $token = json_decode($request->getContent(), true)['token'] ?? null;
        $usuario = is_string($token) ? $this->verificacion->confirmar($token) : null;

        if (!$usuario) {
            return $this->json([
                'success' => false,
                'error' => 'El enlace no es válido o ha caducado. Pide uno nuevo desde la página de inicio de sesión.',
            ], Response::HTTP_BAD_REQUEST);
        }

        $this->correos->bienvenida($usuario);

        return $this->json(['success' => true, 'message' => 'Email confirmado. Ya puedes iniciar sesión.']);
    }

    #[Route('/api/reenviar-verificacion', name: 'api_reenviar_verificacion', methods: ['POST'])]
    public function reenviar(Request $request): JsonResponse
    {
        $email = json_decode($request->getContent(), true)['email'] ?? null;
        // Respuesta idéntica exista o no la cuenta: no se revela quién está registrado
        $respuesta = $this->json([
            'success' => true,
            'message' => 'Si hay una cuenta pendiente de confirmar con ese email, te hemos enviado un enlace nuevo.',
        ]);

        if (!is_string($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $respuesta;
        }
        $usuario = $this->em->getRepository(Usuario::class)->findOneBy(['email' => $email]);
        if ($usuario && !$usuario->isEmailVerificado() && $this->verificacion->puedeReenviar($usuario)) {
            $this->verificacion->enviar($usuario);
        }

        return $respuesta;
    }
}
