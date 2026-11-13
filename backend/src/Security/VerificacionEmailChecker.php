<?php

namespace App\Security;

use App\Entity\Usuario;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAccountStatusException;
use Symfony\Component\Security\Core\User\UserCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * Impide iniciar sesión hasta confirmar el email.
 * Se comprueba DESPUÉS de validar la contraseña: así no se revela a terceros
 * qué emails están registrados o pendientes de confirmar.
 */
class VerificacionEmailChecker implements UserCheckerInterface
{
    public const CODIGO = 'email_no_verificado';

    public function checkPreAuth(UserInterface $user): void
    {
    }

    public function checkPostAuth(UserInterface $user): void
    {
        if ($user instanceof Usuario && !$user->isEmailVerificado()) {
            throw new CustomUserMessageAccountStatusException(self::CODIGO);
        }
    }
}
