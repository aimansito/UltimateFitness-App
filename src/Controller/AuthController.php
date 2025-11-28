<?php

namespace App\Controller;

use App\Entity\Usuario;
use App\Entity\Entrenador;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class AuthController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['email']) || !isset($data['password'])) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Email y password son requeridos'
            ], 400);
        }

        $email = $data['email'];
        $password = $data['password'];

        // Buscar primero en usuarios
        $usuario = $this->entityManager->getRepository(Usuario::class)->findOneBy(['email' => $email]);
        
        if ($usuario && password_verify($password, $usuario->getPassword())) {
            return new JsonResponse([
                'success' => true,
                'message' => 'Login exitoso',
                'usuario' => [
                    'id' => $usuario->getId(),
                    'email' => $usuario->getEmail(),
                    'nombre' => $usuario->getNombre(),
                    'apellidos' => $usuario->getApellidos(),
                    'nombreCompleto' => $usuario->getNombre() . ' ' . $usuario->getApellidos(),
                    'telefono' => $usuario->getTelefono(),
                    'objetivo' => $usuario->getObjetivo(),
                    'es_premium' => $usuario->isEsPremium(),
                    'rol' => $usuario->getRol() ?? 'usuario',
                    'es_admin' => $usuario->getRol() === 'admin',
                    'fecha_registro' => $usuario->getFechaRegistro()?->format('Y-m-d H:i:s'),
                    'tipo_entidad' => 'usuario'
                ]
            ]);
        }

        // Buscar en entrenadores
        $entrenador = $this->entityManager->getRepository(Entrenador::class)->findOneBy(['email' => $email]);
        
        if ($entrenador && password_verify($password, $entrenador->getPasswordHash())) {
            return new JsonResponse([
                'success' => true,
                'message' => 'Login exitoso',
                'usuario' => [
                    'id' => $entrenador->getId(),
                    'email' => $entrenador->getEmail(),
                    'nombre' => $entrenador->getNombre(),
                    'apellidos' => $entrenador->getApellidos(),
                    'nombreCompleto' => $entrenador->getNombre() . ' ' . $entrenador->getApellidos(),
                    'telefono' => $entrenador->getTelefono(),
                    'especialidad' => $entrenador->getEspecialidad(),
                    'es_premium' => false,
                    'rol' => 'entrenador',
                    'es_admin' => false,
                    'fecha_registro' => $entrenador->getFechaRegistro()?->format('Y-m-d H:i:s'),
                    'tipo_entidad' => 'entrenador'
                ]
            ]);
        }

        return new JsonResponse([
            'success' => false,
            'message' => 'Credenciales inválidas'
        ], 401);
    }

    #[Route('/api/test-hash', name: 'test_hash', methods: ['GET'])]
    public function testHash(Request $request): JsonResponse
    {
        $password = $request->query->get('password', 'password123');
        $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 13]);
        $verify = password_verify($password, $hash);

        return new JsonResponse([
            'password_original' => $password,
            'hash_generado' => $hash,
            'verificacion' => $verify ? 'VÁLIDO' : 'INVÁLIDO',
            'longitud' => strlen($hash)
        ]);
    }

    #[Route('/api/reset-passwords', name: 'reset_passwords', methods: ['GET'])]
    public function resetPasswords(): JsonResponse
    {
        $usuarios = $this->entityManager->getRepository(Usuario::class)->findAll();
        $results = [];

        foreach ($usuarios as $usuario) {
            $password = $usuario->getEmail() === 'admin@ultimatefitness.com' ? 'admin123' : 'password123';
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 13]);
            
            $usuario->setPassword($hashedPassword);
            $this->entityManager->persist($usuario);
            
            $results[] = [
                'id' => $usuario->getId(),
                'email' => $usuario->getEmail(),
                'password' => $password,
                'hash_preview' => substr($hashedPassword, 0, 40)
            ];
        }

        $this->entityManager->flush();

        return new JsonResponse([
            'success' => true,
            'message' => 'Contraseñas reseteadas',
            'usuarios' => $results
        ]);
    }

    #[Route('/api/reset-entrenadores-passwords', name: 'reset_entrenadores_passwords', methods: ['GET'])]
    public function resetEntrenadoresPasswords(): JsonResponse
    {
        $entrenadores = $this->entityManager->getRepository(Entrenador::class)->findAll();
        $results = [];

        foreach ($entrenadores as $entrenador) {
            $hashedPassword = password_hash('password123', PASSWORD_BCRYPT, ['cost' => 13]);
            
            $entrenador->setPasswordHash($hashedPassword);
            $this->entityManager->persist($entrenador);
            
            $results[] = [
                'id' => $entrenador->getId(),
                'email' => $entrenador->getEmail(),
                'nombre' => $entrenador->getNombre(),
                'password' => 'password123',
                'hash_preview' => substr($hashedPassword, 0, 40)
            ];
        }

        $this->entityManager->flush();

        return new JsonResponse([
            'success' => true,
            'message' => 'Contraseñas de entrenadores reseteadas',
            'entrenadores' => $results
        ]);
    }
}