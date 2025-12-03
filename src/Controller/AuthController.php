<?php

namespace App\Controller;

use App\Entity\Usuario;
use App\Entity\Entrenador;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

/**
 * AuthController - Autenticación con Lexik JWT Bundle
 */
class AuthController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private UserPasswordHasherInterface $passwordHasher;
    private JWTTokenManagerInterface $jwtManager;

    public function __construct(
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        JWTTokenManagerInterface $jwtManager
    ) {
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
        $this->jwtManager = $jwtManager;
    }

    /**
     * POST /api/login
     * Login de usuario o entrenador con Lexik JWT
     */
    #[Route('/api/login', name: 'login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email']) || !isset($data['password'])) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Email y contraseña requeridos'
            ], 400);
        }

        $email = $data['email'];
        $password = $data['password'];

        // 1️⃣ BUSCAR EN USUARIOS
        $usuarioRepo = $this->entityManager->getRepository(Usuario::class);
        $usuario = $usuarioRepo->findOneBy(['email' => $email]);

        if ($usuario && $this->passwordHasher->isPasswordValid($usuario, $password)) {
            // ✅ GENERAR TOKEN CON LEXIK JWT
            $token = $this->jwtManager->create($usuario);

            return new JsonResponse([
                'success' => true,
                'message' => 'Login exitoso',
                'token' => $token,
                'usuario' => [
                    'id' => $usuario->getId(),
                    'nombre' => $usuario->getNombre(),
                    'apellidos' => $usuario->getApellidos(),
                    'email' => $usuario->getEmail(),
                    'es_premium' => $usuario->isEsPremium(),
                    'rol' => $usuario->getRol()
                ]
            ]);
        }

        // 2️⃣ BUSCAR EN ENTRENADORES
        $entrenadorRepo = $this->entityManager->getRepository(Entrenador::class);
        $entrenador = $entrenadorRepo->findOneBy(['email' => $email]);

        if ($entrenador && $this->passwordHasher->isPasswordValid($entrenador, $password)) {
            // ✅ GENERAR TOKEN CON LEXIK JWT
            $token = $this->jwtManager->create($entrenador);

            return new JsonResponse([
                'success' => true,
                'message' => 'Login exitoso',
                'token' => $token,
                'usuario' => [
                    'id' => $entrenador->getId(),
                    'nombre' => $entrenador->getNombre(),
                    'apellidos' => $entrenador->getApellidos(),
                    'email' => $entrenador->getEmail(),
                    'especialidad' => $entrenador->getEspecialidad(),
                    'rol' => 'entrenador'
                ]
            ]);
        }

        return new JsonResponse([
            'success' => false,
            'message' => 'Email o contraseña incorrectos'
        ], 401);
    }

    /**
     * POST /api/register
     * Registro de nuevo usuario
     */
    #[Route('/api/register', name: 'register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email']) || !isset($data['password']) || !isset($data['nombre'])) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Campos requeridos: email, password, nombre'
            ], 400);
        }

        // Verificar si el usuario ya existe
        $usuarioRepo = $this->entityManager->getRepository(Usuario::class);
        $existente = $usuarioRepo->findOneBy(['email' => $data['email']]);

        if ($existente) {
            return new JsonResponse([
                'success' => false,
                'message' => 'El email ya está registrado'
            ], 400);
        }

        // Crear nuevo usuario
        $usuario = new Usuario();
        $usuario->setNombre($data['nombre']);
        $usuario->setApellidos($data['apellidos'] ?? '');
        $usuario->setEmail($data['email']);
        $usuario->setPasswordHash(
            $this->passwordHasher->hashPassword($usuario, $data['password'])
        );
        $usuario->setRol('cliente');
        $usuario->setEsPremium(false);
        $usuario->setNivelActividad('ligero');
        $usuario->setObjetivo('cuidar_alimentacion');

        $this->entityManager->persist($usuario);
        $this->entityManager->flush();

        return new JsonResponse([
            'success' => true,
            'message' => 'Usuario registrado correctamente',
            'usuario' => [
                'id' => $usuario->getId(),
                'nombre' => $usuario->getNombre(),
                'email' => $usuario->getEmail()
            ]
        ], 201);
    }

    /**
     * GET /api/reset-passwords
     * Reset de contraseñas para desarrollo (SOLO EN DEV)
     */
    #[Route('/api/reset-passwords', name: 'reset_passwords', methods: ['GET'])]
    public function resetPasswords(): JsonResponse
    {
        if ($this->getParameter('kernel.environment') !== 'dev') {
            return new JsonResponse([
                'success' => false,
                'message' => 'No permitido en producción'
            ], 403);
        }

        $usuarioRepo = $this->entityManager->getRepository(Usuario::class);
        $usuarios = $usuarioRepo->findAll();

        foreach ($usuarios as $usuario) {
            $usuario->setPasswordHash(
                $this->passwordHasher->hashPassword($usuario, 'password123')
            );
        }

        $entrenadorRepo = $this->entityManager->getRepository(Entrenador::class);
        $entrenadores = $entrenadorRepo->findAll();

        foreach ($entrenadores as $entrenador) {
            $entrenador->setPasswordHash(
                $this->passwordHasher->hashPassword($entrenador, 'password123')
            );
        }

        $this->entityManager->flush();

        return new JsonResponse([
            'success' => true,
            'message' => 'Contraseñas reseteadas a "password123"',
            'usuarios_actualizados' => count($usuarios),
            'entrenadores_actualizados' => count($entrenadores)
        ]);
    }
}