<?php

namespace App\Security;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAccountStatusException;
use Symfony\Component\Security\Http\Authentication\AuthenticationFailureHandlerInterface;

/**
 * Fallo de login: si la contraseña era correcta pero el email está sin confirmar, devuelve un código
 * propio para que la web ofrezca reenviar el correo. El resto de fallos los gestiona LexikJWT igual que antes.
 */
class LoginFailureHandler implements AuthenticationFailureHandlerInterface
{
    public function __construct(
        #[Autowire(service: 'lexik_jwt_authentication.handler.authentication_failure')]
        private AuthenticationFailureHandlerInterface $lexik,
    ) {
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): Response
    {
        if ($exception instanceof CustomUserMessageAccountStatusException
            && $exception->getMessageKey() === VerificacionEmailChecker::CODIGO) {
            return new JsonResponse([
                'code' => VerificacionEmailChecker::CODIGO,
                'message' => 'Confirma tu email para entrar. Te enviamos un enlace al registrarte.',
            ], Response::HTTP_FORBIDDEN);
        }

        return $this->lexik->onAuthenticationFailure($request, $exception);
    }
}
