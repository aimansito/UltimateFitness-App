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

/**
 * Controlador de Autenticación
 * Gestiona registro, login y verificación de usuarios
 */
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
        $usuario->setRol('cliente'); // ← AÑADIDO: Asignar rol por defecto
        $usuario->setEsPremium(false); // ← AÑADIDO: Por defecto no es premium

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
                'apellidos' => $usuario->getApellidos(),
                'rol' => $usuario->getRol(),
                'es_premium' => $usuario->isEsPremium(),
            ]
        ], Response::HTTP_CREATED);
    }

    // ============================================
    // LOGIN DE USUARIO
    // ============================================
    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Validar datos
        if (!isset($data['email']) || !isset($data['password'])) {
            return $this->json([
                'success' => false,
                'error' => 'Email y password son requeridos'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Buscar usuario por email
        $usuario = $entityManager->getRepository(Usuario::class)
            ->findOneBy(['email' => $data['email']]);

        if (!$usuario) {
            return $this->json([
                'success' => false,
                'error' => 'Credenciales inválidas'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Verificar contraseña
        if (!$passwordHasher->isPasswordValid($usuario, $data['password'])) {
            return $this->json([
                'success' => false,
                'error' => 'Credenciales inválidas'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Actualizar última conexión
        $usuario->setUltimaConexion(new \DateTime());
        $entityManager->flush();

        // Login exitoso - devolver datos del usuario
        return $this->json([
            'success' => true,
            'message' => 'Login exitoso',
            'usuario' => [
                'id' => $usuario->getId(),
                'email' => $usuario->getEmail(),
                'nombre' => $usuario->getNombre(),
                'apellidos' => $usuario->getApellidos(),
                'nombreCompleto' => $usuario->getNombreCompleto(),
                'telefono' => $usuario->getTelefono(),
                'objetivo' => $usuario->getObjetivo(),
                'es_premium' => $usuario->isEsPremium(),
                'rol' => $usuario->getRol(),
                'es_admin' => $usuario->isAdmin(),
                'fecha_registro' => $usuario->getFechaRegistro()?->format('Y-m-d H:i:s'),
            ]
        ]);
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
                'es_premium' => $user->isEsPremium(),
                'rol' => $user->getRol(),
                'es_admin' => $user->isAdmin(),
                'roles' => $user->getRoles(),
                'fecha_registro' => $user->getFechaRegistro()?->format('Y-m-d H:i:s'),
                'fecha_premium' => $user->getFechaPremium()?->format('Y-m-d'),
            ]
        ]);
    }

    // ============================================
    // VERIFICAR USUARIO POR ID (para frontend)
    // ============================================
    #[Route('/api/usuarios/{id}/verify', name: 'api_verify_user', methods: ['GET'])]
    public function verifyUser(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $usuario = $entityManager->getRepository(Usuario::class)->find($id);

        if (!$usuario) {
            return $this->json([
                'success' => false,
                'error' => 'Usuario no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'success' => true,
            'usuario' => [
                'id' => $usuario->getId(),
                'email' => $usuario->getEmail(),
                'nombre' => $usuario->getNombre(),
                'apellidos' => $usuario->getApellidos(),
                'nombreCompleto' => $usuario->getNombreCompleto(),
                'es_premium' => $usuario->isEsPremium(),
                'rol' => $usuario->getRol(),
                'es_admin' => $usuario->isAdmin(),
            ]
        ]);
    }

    // ============================================
    // LOGOUT (limpiar sesión en frontend)
    // ============================================
    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        // En una aplicación stateless (JWT), el logout se maneja en frontend
        // simplemente eliminando el token

        return $this->json([
            'success' => true,
            'message' => 'Logout exitoso'
        ]);
    }

    // ============================================
    // HASHEAR CONTRASEÑAS EXISTENTES (SOLO DESARROLLO)
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
    #[Route('/api/test-hash', name: 'api_test_hash', methods: ['GET'])]
    public function testHash(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $password = $request->query->get('password', 'password123');

        // Obtener un usuario de ejemplo para hashear
        $usuario = $entityManager->getRepository(Usuario::class)->find(1);

        if (!$usuario) {
            return $this->json(['error' => 'No hay usuarios en la BD']);
        }

        // Generar hash
        $hash = $passwordHasher->hashPassword($usuario, $password);

        // Verificar que funciona
        $isValid = $passwordHasher->isPasswordValid($usuario, $password);

        return $this->json([
            'password_original' => $password,
            'hash_generado' => $hash,
            'verificacion' => $isValid ? 'VÁLIDO' : 'INVÁLIDO',
            'longitud' => strlen($hash),
        ]);
    }

    /**
     * Actualizar contraseñas de todos los usuarios
     * GET /api/reset-passwords
     */
    #[Route('/api/reset-passwords', name: 'api_reset_passwords', methods: ['GET'])]
    public function resetPasswords(
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        try {
            $usuarios = $entityManager->getRepository(Usuario::class)->findAll();
            $actualizados = [];

            foreach ($usuarios as $usuario) {
                // Determinar la contraseña según el email
                if ($usuario->getEmail() === 'admin@ultimatefitness.com') {
                    $passwordPlain = 'admin123';
                } else {
                    $passwordPlain = 'password123';
                }

                // Generar nuevo hash
                $hashedPassword = $passwordHasher->hashPassword($usuario, $passwordPlain);
                $usuario->setPasswordHash($hashedPassword);

                $actualizados[] = [
                    'id' => $usuario->getId(),
                    'email' => $usuario->getEmail(),
                    'password' => $passwordPlain,
                    'hash' => substr($hashedPassword, 0, 30) . '...',
                ];
            }

            $entityManager->flush();

            return $this->json([
                'success' => true,
                'message' => 'Contraseñas actualizadas',
                'total' => count($actualizados),
                'usuarios' => $actualizados,
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
