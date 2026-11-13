<?php

namespace App\EventListener;

use App\Entity\Entrenador;
use App\Entity\Usuario;
use App\Security\RoleChecker;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Cierra los IDOR de rutas que reciben el id de la cuenta por URL:
 * el id debe ser el de la cuenta autenticada (o un admin).
 * Se ejecuta después del router (32) y del firewall (8).
 */
#[AsEventListener(event: KernelEvents::REQUEST, priority: 4)]
class OwnerAccessSubscriber
{
    /** ruta => parámetro con el id del Usuario dueño. true = también su entrenador asignado */
    private const RUTAS_USUARIO = [
        'usuarios_entrenamientos' => ['id', true],
        'usuarios_dietas' => ['id', true],
        'usuarios_progreso' => ['id', true],
        'usuarios_estadisticas' => ['id', true],
        'usuarios_upgrade_premium' => ['id', false],
        'usuarios_check_premium' => ['id', false],
        'usuarios_premium_info' => ['id', false],
        'usuario_entrenamientos_list' => ['usuarioId', false],
        'platos_usuario' => ['usuarioId', false],
    ];

    /** ruta => parámetro con el id del Entrenador dueño */
    private const RUTAS_ENTRENADOR = [
        'api_entrenadores_dashboard_stats' => 'id',
        'entrenador_entrenamientos_list' => 'entrenadorId',
        'platos_entrenador' => 'entrenadorId',
    ];

    public function __construct(
        private Security $security,
        private RoleChecker $roleChecker,
        private EntityManagerInterface $entityManager
    ) {
    }

    public function __invoke(RequestEvent $event): void
    {
        $request = $event->getRequest();
        $ruta = (string) $request->attributes->get('_route');
        $user = $this->security->getUser();

        if (isset(self::RUTAS_USUARIO[$ruta])) {
            [$param, $permiteEntrenador] = self::RUTAS_USUARIO[$ruta];
            $id = (int) $request->attributes->get($param);

            if ($user instanceof Usuario && ($user->getId() === $id || $this->roleChecker->isAdmin($user))) {
                return;
            }
            if ($permiteEntrenador && $user instanceof Entrenador) {
                $cliente = $this->entityManager->getRepository(Usuario::class)->find($id);
                if ($cliente && $cliente->getEntrenadorAsignado()?->getId() === $user->getId()) {
                    return;
                }
            }
            $event->setResponse($this->roleChecker->denyAccess());
            return;
        }

        if (isset(self::RUTAS_ENTRENADOR[$ruta])) {
            $id = (int) $request->attributes->get(self::RUTAS_ENTRENADOR[$ruta]);

            if ($user instanceof Entrenador && $user->getId() === $id) {
                return;
            }
            if ($user instanceof Usuario && $this->roleChecker->isAdmin($user)) {
                return;
            }
            $event->setResponse($this->roleChecker->denyAccess());
        }
    }
}
