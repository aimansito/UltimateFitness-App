<?php

namespace App\Service;

use App\Entity\Usuario;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Enlaces de confirmación de email. En la base de datos solo se guarda el hash del token.
 */
class VerificacionEmail
{
    public const HORAS_VALIDEZ = 48;
    /** Tiempo mínimo entre dos reenvíos a la misma cuenta */
    private const MINUTOS_ENTRE_ENVIOS = 2;

    public function __construct(
        private EntityManagerInterface $em,
        private CorreosCuenta $correos,
    ) {
    }

    public static function hash(string $token): string
    {
        return hash('sha256', $token);
    }

    /** Genera un enlace nuevo (invalida el anterior) y lo envía. Devuelve si el correo salió. */
    public function enviar(Usuario $usuario): bool
    {
        $token = bin2hex(random_bytes(32));
        $usuario->setTokenVerificacion(self::hash($token), new \DateTime('+' . self::HORAS_VALIDEZ . ' hours'));
        $this->em->flush();

        return $this->correos->verificacion($usuario, $token);
    }

    /** Evita usar el reenvío para inundar el buzón de alguien */
    public function puedeReenviar(Usuario $usuario): bool
    {
        $expira = $usuario->getTokenVerificacionExpira();
        if (!$expira) {
            return true;
        }
        $emitido = (clone $expira)->modify('-' . self::HORAS_VALIDEZ . ' hours');
        return $emitido < new \DateTime('-' . self::MINUTOS_ENTRE_ENVIOS . ' minutes');
    }

    /** Confirma el email si el token es válido y no ha caducado */
    public function confirmar(string $token): ?Usuario
    {
        if (!preg_match('/^[a-f0-9]{64}$/', $token)) {
            return null;
        }
        $usuario = $this->em->getRepository(Usuario::class)->findOneBy(['tokenVerificacion' => self::hash($token)]);
        if (!$usuario || !$usuario->getTokenVerificacionExpira() || $usuario->getTokenVerificacionExpira() < new \DateTime()) {
            return null;
        }
        $usuario->setEmailVerificado(true);
        $this->em->flush();

        return $usuario;
    }
}
