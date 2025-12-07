<?php

namespace App\Controller;

use App\Entity\Usuario;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class PasswordResetController extends AbstractController
{
    private $entityManager;
    private $passwordHasher;

    public function __construct(EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher)
    {
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
    }

    #[Route('/api/forgot-password', name: 'api_forgot_password', methods: ['POST'])]
    public function forgotPassword(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;

        if (!$email) {
            return new JsonResponse(['error' => 'Email requerido'], 400);
        }

        $usuario = $this->entityManager->getRepository(Usuario::class)->findOneBy(['email' => $email]);

        if (!$usuario) {
            // Por seguridad, no revelar si el email existe o no, pero para este caso simulado
            // y por facilidad de debug, retornaremos error si no existe.
            // En prod idealmente: return new JsonResponse(['message' => 'Si el email existe, se ha enviado un correo.']);
            return new JsonResponse(['error' => 'No existe un usuario con ese email'], 404);
        }

        // Generar token
        $token = bin2hex(random_bytes(32));
        $usuario->setResetToken($token);
        // Expira en 1 hora
        $usuario->setResetTokenExpires(new \DateTime('+1 hour'));

        $this->entityManager->flush();

        // SIMULACIÓN DE ENVÍO DE EMAIL
        // En un entorno real aquí se enviaría el email.
        // Retornamos el token para que el frontend pueda simular el link.
        
        return new JsonResponse([
            'success' => true,
            'message' => 'Email de recuperación enviado (simulado)',
            'debug_token' => $token // SOLO PARA DEV/TEST
        ]);
    }

    #[Route('/api/reset-password', name: 'api_reset_password', methods: ['POST'])]
    public function resetPassword(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $token = $data['token'] ?? null;
        $newPassword = $data['password'] ?? null;

        if (!$token || !$newPassword) {
            return new JsonResponse(['error' => 'Token y nueva contraseña requeridos'], 400);
        }

        $usuario = $this->entityManager->getRepository(Usuario::class)->findOneBy(['resetToken' => $token]);

        if (!$usuario) {
            return new JsonResponse(['error' => 'Token inválido'], 400);
        }

        if ($usuario->getResetTokenExpires() < new \DateTime()) {
            return new JsonResponse(['error' => 'El token ha expirado'], 400);
        }

        // Actualizar contraseña
        $hashedPassword = $this->passwordHasher->hashPassword($usuario, $newPassword);
        $usuario->setPasswordHash($hashedPassword);
        
        // Limpiar token
        $usuario->setResetToken(null);
        $usuario->setResetTokenExpires(null);

        $this->entityManager->flush();

        return new JsonResponse([
            'success' => true,
            'message' => 'Contraseña actualizada correctamente'
        ]);
    }
}
