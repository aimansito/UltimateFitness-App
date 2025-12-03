<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

#[AsEventListener(event: 'lexik_jwt_authentication.on_jwt_created')]
class JWTCreatedListener
{
    public function __invoke(JWTCreatedEvent $event): void
    {
        $user = $event->getUser();
        $payload = $event->getData();

        // Agregar 'username' al payload (MisDietasController lo requiere en línea 47)
        $payload['username'] = $user->getUserIdentifier();
        $payload['email'] = $user->getUserIdentifier();

        $event->setData($payload);
    }
}
