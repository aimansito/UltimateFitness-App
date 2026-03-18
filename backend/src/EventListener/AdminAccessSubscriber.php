<?php

namespace App\EventListener;

use App\Entity\Usuario;
use App\Security\RoleChecker;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * Comprueba que las rutas /api/admin/* solo sean accesibles por usuarios con rol admin.
 * Se ejecuta después del firewall (autenticación).
 */
#[AsEventListener(event: KernelEvents::REQUEST, priority: 5)]
class AdminAccessSubscriber
{
    public function __construct(
        private Security $security,
        private RoleChecker $roleChecker
    ) {
    }

    public function __invoke(RequestEvent $event): void
    {
        $request = $event->getRequest();
        if (!str_starts_with($request->getPathInfo(), '/api/admin')) {
            return;
        }

        $user = $this->security->getUser();
        if ($user instanceof Usuario && $this->roleChecker->isAdmin($user)) {
            return;
        }

        $event->setResponse($this->roleChecker->denyAccess('Solo los administradores pueden acceder a esta sección.'));
    }
}
