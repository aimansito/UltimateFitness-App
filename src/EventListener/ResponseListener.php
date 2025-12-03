<?php

namespace App\EventListener;

use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

#[AsEventListener(event: KernelEvents::RESPONSE)]
class ResponseListener
{
    public function __invoke(ResponseEvent $event): void
    {
        $response = $event->getResponse();

        // Asegurar que todas las respuestas JSON tengan charset UTF-8
        if (str_contains($response->headers->get('Content-Type', ''), 'application/json')) {
            $response->headers->set('Content-Type', 'application/json; charset=utf-8');
        }

        // Asegurar que las respuestas HTML también tengan UTF-8
        if (str_contains($response->headers->get('Content-Type', ''), 'text/html')) {
            $response->headers->set('Content-Type', 'text/html; charset=utf-8');
        }
    }
}
