<?php

namespace App\EventListener;

use Psr\Cache\CacheItemPoolInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Límite de intentos contra fuerza bruta y abuso en los endpoints públicos de cuenta.
 *
 *  - Login: solo cuentan los intentos fallidos. 5 por email+IP y 20 por IP cada 15 min.
 *    Un login correcto pone a cero el contador de ese email+IP.
 *  - Recuperar / restablecer contraseña y registro: cuenta cada petición, por IP.
 *
 * Se ejecuta antes del firewall (prioridad 8) para cortar sin llegar a comprobar la contraseña.
 */
class LimiteIntentosSubscriber
{
    private const VENTANA_LOGIN = 900;

    /** ruta => [máximo, ventana en segundos] para los que cuentan cada petición */
    private const POR_PETICION = [
        '/api/forgot-password' => [5, 900],
        '/api/reset-password' => [10, 900],
        '/api/register' => [5, 3600],
        '/api/verificar-email' => [20, 900],
        '/api/reenviar-verificacion' => [5, 900],
        '/api/contacto' => [5, 3600],
        '/api/custom/ejercicios' => [30, 3600], // solo cuenta el POST (crear ejercicio propio)
        // Piden la contraseña: se limitan para que no sirvan para adivinarla
        '/api/cuenta/password' => [10, 900],
        '/api/cuenta/eliminar' => [10, 900],
    ];

    private const LOGIN = ['/api/login', '/api/entrenador/login'];
    private const MAX_LOGIN_CUENTA = 5;
    private const MAX_LOGIN_IP = 20;

    public function __construct(
        #[Autowire(service: 'cache.app')] private CacheItemPoolInterface $cache,
    ) {
    }

    #[AsEventListener(event: KernelEvents::REQUEST, priority: 64)]
    public function alPedir(RequestEvent $event): void
    {
        $request = $event->getRequest();
        if (!$event->isMainRequest() || !$request->isMethod('POST')) {
            return;
        }
        $ruta = rtrim($request->getPathInfo(), '/');
        $ip = (string) $request->getClientIp();

        if (in_array($ruta, self::LOGIN, true)) {
            $espera = max(
                $this->bloqueo($this->claveCuenta($request, $ruta, $ip), self::MAX_LOGIN_CUENTA),
                $this->bloqueo("login_ip|$ip", self::MAX_LOGIN_IP)
            );
            if ($espera > 0) {
                $event->setResponse($this->respuesta($espera));
            }
            return;
        }

        if (isset(self::POR_PETICION[$ruta])) {
            [$maximo, $ventana] = self::POR_PETICION[$ruta];
            $clave = "$ruta|$ip";
            $espera = $this->bloqueo($clave, $maximo);
            if ($espera > 0) {
                $event->setResponse($this->respuesta($espera));
                return;
            }
            $this->sumar($clave, $ventana);
        }
    }

    #[AsEventListener(event: KernelEvents::RESPONSE)]
    public function alResponder(ResponseEvent $event): void
    {
        $request = $event->getRequest();
        if (!$event->isMainRequest() || !$request->isMethod('POST')) {
            return;
        }
        $ruta = rtrim($request->getPathInfo(), '/');
        if (!in_array($ruta, self::LOGIN, true)) {
            return;
        }
        $ip = (string) $request->getClientIp();
        $estado = $event->getResponse()->getStatusCode();

        if ($estado === 401) {
            $this->sumar($this->claveCuenta($request, $ruta, $ip), self::VENTANA_LOGIN);
            $this->sumar("login_ip|$ip", self::VENTANA_LOGIN);
        } elseif ($estado === 200) {
            $this->cache->deleteItem($this->id($this->claveCuenta($request, $ruta, $ip)));
        }
    }

    private function claveCuenta(Request $request, string $ruta, string $ip): string
    {
        $datos = json_decode($request->getContent(), true);
        $email = is_array($datos) && is_string($datos['email'] ?? null) ? mb_strtolower(trim($datos['email'])) : '';

        return "$ruta|$ip|$email";
    }

    /** Segundos que faltan para poder reintentar (0 = permitido) */
    private function bloqueo(string $clave, int $maximo): int
    {
        $estado = $this->cache->getItem($this->id($clave))->get();
        if (!is_array($estado) || $estado['hasta'] <= time() || $estado['n'] < $maximo) {
            return 0;
        }
        return $estado['hasta'] - time();
    }

    private function sumar(string $clave, int $ventana): void
    {
        $item = $this->cache->getItem($this->id($clave));
        $estado = $item->get();
        if (!is_array($estado) || $estado['hasta'] <= time()) {
            $estado = ['n' => 0, 'hasta' => time() + $ventana];
        }
        $estado['n']++;
        $item->set($estado);
        $item->expiresAt(new \DateTimeImmutable('@' . $estado['hasta']));
        $this->cache->save($item);
    }

    private function id(string $clave): string
    {
        return 'limite_' . hash('sha256', $clave);
    }

    private function respuesta(int $segundos): JsonResponse
    {
        $minutos = max(1, (int) ceil($segundos / 60));

        return new JsonResponse([
            'success' => false,
            'error' => "Demasiados intentos. Vuelve a probar en $minutos " . ($minutos === 1 ? 'minuto' : 'minutos') . '.',
            'message' => "Demasiados intentos. Vuelve a probar en $minutos " . ($minutos === 1 ? 'minuto' : 'minutos') . '.',
        ], 429, ['Retry-After' => (string) $segundos]);
    }
}
