<?php

namespace App\Controller;

use App\Service\CorreosCuenta;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Formulario de contacto: envía el mensaje por email al titular (CONTACTO_EMAIL).
 * No se guarda en la base de datos. Protegido con límite de envíos por IP y un campo trampa para bots.
 */
class ContactoController extends AbstractController
{
    private const TIPOS = [
        'informacion' => 'Información general',
        'cuenta' => 'Mi cuenta',
        'tecnico' => 'Soporte técnico',
        'privacidad' => 'Privacidad y datos personales',
        'otro' => 'Otro',
    ];

    public function __construct(
        private CorreosCuenta $correos,
        private LoggerInterface $logger,
        #[Autowire('%env(default:app.contacto_por_defecto:CONTACTO_EMAIL)%')] private string $destino,
    ) {
    }

    #[Route('/api/contacto', name: 'api_contacto', methods: ['POST'])]
    public function enviar(Request $request): JsonResponse
    {
        $d = json_decode($request->getContent(), true);
        if (!is_array($d)) {
            return $this->error('Datos no válidos');
        }

        // Campo trampa: invisible para personas; si viene relleno es un bot. Se responde "ok" sin enviar nada.
        if (!empty($d['web'])) {
            return $this->json(['success' => true, 'message' => 'Mensaje enviado. Te responderemos lo antes posible.']);
        }

        $nombre = trim((string) ($d['nombre'] ?? ''));
        $email = trim((string) ($d['email'] ?? ''));
        $tipo = (string) ($d['tipoConsulta'] ?? 'otro');
        $asunto = trim((string) ($d['asunto'] ?? ''));
        $mensaje = trim((string) ($d['mensaje'] ?? ''));

        if ($nombre === '' || mb_strlen($nombre) > 100) {
            return $this->error('Escribe tu nombre (máximo 100 caracteres)');
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 255) {
            return $this->error('Escribe un email válido para poder responderte');
        }
        if (mb_strlen($asunto) > 150) {
            return $this->error('El asunto es demasiado largo (máximo 150 caracteres)');
        }
        if (mb_strlen($mensaje) < 10 || mb_strlen($mensaje) > 5000) {
            return $this->error('El mensaje debe tener entre 10 y 5000 caracteres');
        }

        $etiqueta = self::TIPOS[$tipo] ?? self::TIPOS['otro'];
        $asuntoFinal = $etiqueta . ($asunto !== '' ? ' · ' . $asunto : '');

        if (!$this->correos->contacto($this->destino, $nombre, $email, $asuntoFinal, $mensaje)) {
            $this->logger->error('No se pudo enviar un mensaje de contacto');
            return $this->json([
                'success' => false,
                'error' => 'No se pudo enviar el mensaje ahora mismo. Escríbenos directamente a ' . $this->destino,
            ], Response::HTTP_SERVICE_UNAVAILABLE);
        }

        return $this->json(['success' => true, 'message' => 'Mensaje enviado. Te responderemos lo antes posible.']);
    }

    private function error(string $mensaje): JsonResponse
    {
        return $this->json(['success' => false, 'error' => $mensaje], Response::HTTP_BAD_REQUEST);
    }
}
