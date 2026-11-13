<?php

namespace App\EventListener;

use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Endurece todas las respuestas de la API:
 *  - Cabeceras de seguridad (clickjacking, MIME sniffing, HSTS, CSP restrictiva: la API solo devuelve JSON).
 *  - Errores 5xx: el mensaje interno (SQL, rutas, clases...) se guarda en el log y al cliente
 *    le llega un texto genérico. Así no hace falta tocar cada catch de cada controlador.
 */
class SeguridadRespuestaSubscriber
{
    public function __construct(
        private LoggerInterface $logger,
        #[Autowire('%kernel.debug%')] private bool $debug,
    ) {
    }

    #[AsEventListener(event: KernelEvents::RESPONSE, priority: -100)]
    public function __invoke(ResponseEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }
        $request = $event->getRequest();
        $response = $event->getResponse();
        $h = $response->headers;

        $h->set('X-Content-Type-Options', 'nosniff');
        $h->set('X-Frame-Options', 'DENY');
        $h->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $h->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
        $h->set('Cross-Origin-Resource-Policy', 'same-site');
        if (!$h->has('Content-Security-Policy')) {
            $h->set('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
        }
        if ($request->isSecure()) {
            $h->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }
        $h->remove('X-Powered-By');
        if (\function_exists('header_remove') && !headers_sent()) {
            header_remove('X-Powered-By');
        }

        // Respuestas de datos personales: que no se guarden en cachés intermedias
        if (str_starts_with($request->getPathInfo(), '/api/') && !$h->hasCacheControlDirective('public')) {
            $h->addCacheControlDirective('no-store');
        }

        if ($this->debug || $response->getStatusCode() < 500 || !$response instanceof JsonResponse) {
            return;
        }
        $datos = json_decode((string) $response->getContent(), true);
        if (!\is_array($datos)) {
            return;
        }
        $interno = $datos['error'] ?? $datos['message'] ?? $datos['detail'] ?? null;
        if (\is_string($interno)) {
            $this->logger->error('Error 5xx devuelto por la API', [
                'ruta' => $request->getPathInfo(),
                'metodo' => $request->getMethod(),
                'estado' => $response->getStatusCode(),
                'error' => $interno,
            ]);
        }
        $generico = 'Ha ocurrido un error inesperado. Inténtalo de nuevo más tarde.';
        foreach (['error', 'message', 'detail', 'trace', 'file', 'line'] as $clave) {
            if (\array_key_exists($clave, $datos)) {
                $datos[$clave] = \in_array($clave, ['trace', 'file', 'line'], true) ? null : $generico;
            }
        }
        $datos = array_filter($datos, fn ($v) => $v !== null);
        $response->setData($datos);
    }
}
