<?php

namespace App\Controller;

use App\Entity\Usuario;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class AuthController extends AbstractController
{
    // ============================================
    // REGISTRO DE NUEVO USUARIO
    // ============================================
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        ValidatorInterface $validator
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Validar datos requeridos
        if (!isset($data['email']) || !isset($data['password']) || !isset($data['nombre'])) {
            return $this->json([
                'success' => false,
                'error' => 'Email, password y nombre son requeridos'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Verificar si el email ya existe
        $existingUser = $entityManager->getRepository(Usuario::class)
            ->findOneBy(['email' => $data['email']]);

        if ($existingUser) {
            return $this->json([
                'success' => false,
                'error' => 'El email ya está registrado'
            ], Response::HTTP_CONFLICT);
        }

        // Crear nuevo usuario
        $usuario = new Usuario();
        $usuario->setEmail($data['email']);
        $usuario->setNombre($data['nombre']);
        $usuario->setApellidos($data['apellidos'] ?? '');
        $usuario->setTelefono($data['telefono'] ?? null);
        $usuario->setObjetivo($data['objetivo'] ?? 'cuidar_alimentacion');

        // Hashear contraseña
        $hashedPassword = $passwordHasher->hashPassword($usuario, $data['password']);
        $usuario->setPassword($hashedPassword);

        // Validar entidad
        $errors = $validator->validate($usuario);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return $this->json([
                'success' => false,
                'errors' => $errorMessages
            ], Response::HTTP_BAD_REQUEST);
        }

        // Guardar en BD
        $entityManager->persist($usuario);
        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => 'Usuario registrado exitosamente',
            'usuario' => [
                'id' => $usuario->getId(),
                'email' => $usuario->getEmail(),
                'nombre' => $usuario->getNombre(),
                'apellidos' => $usuario->getApellidos()
            ]
        ], Response::HTTP_CREATED);
    }

    // ============================================
    // OBTENER USUARIO ACTUAL (AUTENTICADO)
    // ============================================
    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    public function me(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof Usuario) {
            return $this->json([
                'success' => false,
                'error' => 'Usuario no autenticado'
            ], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json([
            'success' => true,
            'usuario' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'nombre' => $user->getNombre(),
                'apellidos' => $user->getApellidos(),
                'nombreCompleto' => $user->getNombreCompleto(),
                'telefono' => $user->getTelefono(),
                'objetivo' => $user->getObjetivo(),
                'esPremium' => $user->isEsPremium(),
                'roles' => $user->getRoles(),
                'fechaRegistro' => $user->getFechaRegistro()?->format('Y-m-d H:i:s')
            ]
        ]);
    }

    // ============================================
    // HASHEAR CONTRASEÑAS EXISTENTES (SOLO UNA VEZ)
    // ============================================
    #[Route('/api/hash-passwords', name: 'api_hash_passwords', methods: ['POST'])]
    public function hashExistingPasswords(
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        // ADVERTENCIA: Este endpoint es solo para desarrollo
        // En producción, ELIMINAR o proteger con ROLE_ADMIN

        $usuarios = $entityManager->getRepository(Usuario::class)->findAll();
        $updated = 0;

        foreach ($usuarios as $usuario) {
            $currentHash = $usuario->getPassword();
            
            // Si la contraseña NO está hasheada (no empieza con $2y$)
            if (!str_starts_with($currentHash, '$2y$')) {
                // Hashear la contraseña actual
                $hashedPassword = $passwordHasher->hashPassword($usuario, $currentHash);
                $usuario->setPassword($hashedPassword);
                $updated++;
            }
        }

        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => "Se hashearon {$updated} contraseñas"
        ]);
    }
}