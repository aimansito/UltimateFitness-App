<?php

namespace App\Service;

use App\Entity\Usuario;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/**
 * Correos transaccionales de la cuenta: bienvenida y recuperación de contraseña.
 * Son correos de servicio (no publicidad), por eso no llevan baja de suscripción.
 */
class CorreosCuenta
{
    private string $web;

    public function __construct(
        private Correo $correo,
        #[Autowire('%env(default::FRONTEND_URL)%')] ?string $frontendUrl = null,
    ) {
        $this->web = rtrim($frontendUrl ?: 'http://localhost:5173', '/');
    }

    public function bienvenida(Usuario $usuario): bool
    {
        $nombre = (string) $usuario->getNombre();
        $enlace = $this->web . '/login';

        $texto = "Hola $nombre:\n\n"
            . "Tu cuenta en Ultimate Fitness ya está creada.\n\n"
            . "Desde tu panel puedes crear tus rutinas y tus dietas, guardar las de otras personas "
            . "y compartir tu entreno del día.\n\n"
            . "Entrar: $enlace\n\n"
            . "Si no has creado esta cuenta, responde a este correo y la eliminaremos.\n\n"
            . "Ultimate Fitness";

        $html = $this->plantilla(
            'Tu cuenta está lista',
            '<p>Hola ' . $this->e($nombre) . ':</p>'
            . '<p>Tu cuenta en Ultimate Fitness ya está creada.</p>'
            . '<p>Desde tu panel puedes crear tus rutinas y tus dietas, guardar las de otras personas y compartir tu entreno del día.</p>',
            'Entrar en mi cuenta',
            $enlace,
            'Si no has creado esta cuenta, responde a este correo y la eliminaremos.'
        );

        return $this->correo->enviar((string) $usuario->getEmail(), 'Bienvenido a Ultimate Fitness', $html, $texto);
    }

    public function recuperacion(Usuario $usuario, string $token): bool
    {
        $nombre = (string) $usuario->getNombre();
        $enlace = $this->web . '/restablecer-password?token=' . urlencode($token);

        $texto = "Hola $nombre:\n\n"
            . "Hemos recibido una solicitud para cambiar la contraseña de tu cuenta.\n\n"
            . "Cambiar contraseña: $enlace\n\n"
            . "El enlace caduca en 1 hora. Si no lo has pedido tú, ignora este correo: tu contraseña no cambia.\n\n"
            . "Ultimate Fitness";

        $html = $this->plantilla(
            'Cambia tu contraseña',
            '<p>Hola ' . $this->e($nombre) . ':</p>'
            . '<p>Hemos recibido una solicitud para cambiar la contraseña de tu cuenta.</p>',
            'Cambiar contraseña',
            $enlace,
            'El enlace caduca en 1 hora. Si no lo has pedido tú, ignora este correo: tu contraseña no cambia.'
        );

        return $this->correo->enviar((string) $usuario->getEmail(), 'Cambia tu contraseña de Ultimate Fitness', $html, $texto);
    }

    /** Aviso de seguridad: si no fue la persona titular, debe actuar */
    public function passwordCambiada(Usuario $usuario): bool
    {
        $nombre = (string) $usuario->getNombre();
        $enlace = $this->web . '/recuperar-password';
        $nota = 'Si no has sido tú, cambia tu contraseña ahora desde este enlace y escríbenos respondiendo a este correo.';

        $texto = "Hola $nombre:\n\nLa contraseña de tu cuenta de Ultimate Fitness se acaba de cambiar.\n\n$nota\n$enlace\n\nUltimate Fitness";
        $html = $this->plantilla(
            'Tu contraseña ha cambiado',
            '<p>Hola ' . $this->e($nombre) . ':</p><p>La contraseña de tu cuenta de Ultimate Fitness se acaba de cambiar.</p>',
            'No he sido yo',
            $enlace,
            $nota
        );

        return $this->correo->enviar((string) $usuario->getEmail(), 'Tu contraseña de Ultimate Fitness ha cambiado', $html, $texto);
    }

    /** Confirmación de supresión (se llama después de borrar, con los datos ya copiados) */
    public function cuentaEliminada(string $nombre, string $email): bool
    {
        $enlace = $this->web . '/register';
        $nota = 'Este es el último correo que recibirás de nosotros. Si no has pedido borrar la cuenta, responde a este correo.';

        $texto = "Hola $nombre:\n\nHemos eliminado tu cuenta de Ultimate Fitness y los datos asociados.\n\n$nota\n\nUltimate Fitness";
        $html = $this->plantilla(
            'Tu cuenta se ha eliminado',
            '<p>Hola ' . $this->e($nombre) . ':</p><p>Hemos eliminado tu cuenta de Ultimate Fitness y los datos asociados: perfil, datos de salud, rutinas, dietas, calendario, seguidores y favoritos.</p><p>Gracias por haber entrenado con nosotros.</p>',
            'Crear una cuenta nueva',
            $enlace,
            $nota
        );

        return $this->correo->enviar($email, 'Tu cuenta de Ultimate Fitness se ha eliminado', $html, $texto);
    }

    private function plantilla(string $titulo, string $cuerpo, string $boton, string $enlace, string $nota): string
    {
        $titulo = $this->e($titulo);
        $boton = $this->e($boton);
        $enlace = $this->e($enlace);
        $nota = $this->e($nota);

        return <<<HTML
<!doctype html>
<html lang="es">
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,Helvetica,sans-serif;color:#e5e5e5;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#141414;border:1px solid #2a2a2a;border-radius:16px;">
<tr><td style="padding:32px;">
<p style="margin:0 0 24px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#d4af37;font-weight:bold;">Ultimate Fitness</p>
<h1 style="margin:0 0 20px;font-size:24px;line-height:1.25;color:#ffffff;">{$titulo}</h1>
<div style="font-size:15px;line-height:1.6;color:#d4d4d4;">{$cuerpo}</div>
<p style="margin:28px 0;">
<a href="{$enlace}" style="display:inline-block;background:#d4af37;color:#000000;text-decoration:none;font-weight:bold;padding:14px 28px;border-radius:999px;font-size:15px;">{$boton}</a>
</p>
<p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:#8a8a8a;">Si el botón no funciona, copia este enlace en tu navegador:<br><a href="{$enlace}" style="color:#d4af37;word-break:break-all;">{$enlace}</a></p>
<p style="margin:20px 0 0;padding-top:20px;border-top:1px solid #2a2a2a;font-size:13px;line-height:1.5;color:#8a8a8a;">{$nota}</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>
HTML;
    }

    private function e(string $valor): string
    {
        return htmlspecialchars($valor, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }
}
