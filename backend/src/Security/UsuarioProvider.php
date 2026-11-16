<?php

namespace App\Security;

use App\Entity\Usuario;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\Exception\UserNotFoundException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;

/**
 * Localiza la cuenta para iniciar sesión por email o por nombre de usuario.
 *
 * El nombre solo sirve si identifica a una única cuenta (nombre, o "nombre apellidos");
 * si hay varias personas con el mismo nombre, hay que entrar con el email.
 * Los tokens JWT guardan el email, así que al validar cada petición siempre se busca por email.
 */
final class UsuarioProvider implements UserProviderInterface, PasswordUpgraderInterface
{
    public function __construct(private EntityManagerInterface $em)
    {
    }

    public function loadUserByIdentifier(string $identifier): UserInterface
    {
        $identifier = trim($identifier);
        $repo = $this->em->getRepository(Usuario::class);

        $usuario = $identifier !== '' ? $repo->findOneBy(['email' => $identifier]) : null;

        if ($usuario === null && $identifier !== '' && !str_contains($identifier, '@')) {
            $candidatos = $repo->createQueryBuilder('u')
                ->where('LOWER(u.nombre) = :n OR LOWER(CONCAT(u.nombre, \' \', COALESCE(u.apellidos, \'\'))) = :n')
                ->setParameter('n', mb_strtolower($identifier))
                ->setMaxResults(2)
                ->getQuery()
                ->getResult();
            if (\count($candidatos) === 1) {
                $usuario = $candidatos[0];
            }
        }

        if ($usuario === null) {
            $e = new UserNotFoundException('Cuenta no encontrada.');
            $e->setUserIdentifier($identifier);
            throw $e;
        }

        return $usuario;
    }

    public function refreshUser(UserInterface $user): UserInterface
    {
        if (!$user instanceof Usuario) {
            throw new UnsupportedUserException(sprintf('Clase no soportada: %s', $user::class));
        }

        return $this->loadUserByIdentifier($user->getUserIdentifier());
    }

    public function supportsClass(string $class): bool
    {
        return $class === Usuario::class || is_subclass_of($class, Usuario::class);
    }

    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if ($user instanceof Usuario) {
            $user->setPasswordHash($newHashedPassword);
            $this->em->flush();
        }
    }
}
