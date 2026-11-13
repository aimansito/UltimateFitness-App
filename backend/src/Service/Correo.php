<?php

namespace App\Service;

use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Email;

/**
 * Envío de correo con symfony/mailer.
 *
 * MAILER_DSN  smtp://usuario:clave@host:587 | smtps://usuario:clave@host:465 | null://null
 * MAILER_FROM "Ultimate Fitness <no-reply@tudominio.com>"
 *
 * Con null://null no se envía nada: se deja constancia en el log.
 * Nunca lanza excepción: un fallo de correo no debe romper el registro ni la recuperación.
 */
class Correo
{
    public function __construct(
        private MailerInterface $mailer,
        private LoggerInterface $logger,
        #[Autowire('%env(default::MAILER_DSN)%')] private ?string $dsn = null,
        #[Autowire('%env(default::MAILER_FROM)%')] private ?string $remitente = null,
    ) {
    }

    public function configurado(): bool
    {
        return $this->dsn !== null && $this->dsn !== '' && !str_starts_with($this->dsn, 'null:');
    }

    /** Devuelve true si el servidor aceptó el mensaje. */
    public function enviar(string $para, string $asunto, string $html, string $texto, ?string $responderA = null): bool
    {
        if (!filter_var($para, FILTER_VALIDATE_EMAIL)) {
            $this->logger->warning('Correo no enviado: destinatario no válido');
            return false;
        }

        if (!$this->configurado()) {
            $this->logger->notice('Correo no enviado (MAILER_DSN sin configurar)', ['para' => $para, 'asunto' => $asunto]);
            return false;
        }

        try {
            $email = (new Email())
                ->from($this->remitente())
                ->to($para)
                ->subject(str_replace(["\r", "\n"], ' ', $asunto))
                ->text($texto)
                ->html($html);
            if ($responderA !== null && filter_var($responderA, FILTER_VALIDATE_EMAIL)) {
                $email->replyTo($responderA);
            }

            $this->mailer->send($email);
            $this->logger->info('Correo enviado', ['para' => $para, 'asunto' => $asunto]);
            return true;
        } catch (\Throwable $e) {
            $this->logger->error('Fallo al enviar correo', [
                'para' => $para,
                'asunto' => $asunto,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    private function remitente(): Address
    {
        $valor = trim((string) $this->remitente);
        if ($valor !== '') {
            return Address::create($valor);
        }
        // Sin MAILER_FROM: se usa el usuario SMTP si es un email (caso habitual con Gmail o Brevo)
        $usuario = urldecode((string) parse_url((string) $this->dsn, PHP_URL_USER));
        if (filter_var($usuario, FILTER_VALIDATE_EMAIL)) {
            return new Address($usuario, 'Ultimate Fitness');
        }
        throw new \RuntimeException('MAILER_FROM no configurado');
    }
}
