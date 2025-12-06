<?php

namespace App\Controller;

use App\Entity\Usuario;
use App\Repository\UsuarioRepository;
use App\Repository\EntrenadorRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class RegistroController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private UserPasswordHasherInterface $passwordHasher;
    private UsuarioRepository $usuarioRepository;
    private EntrenadorRepository $entrenadorRepository;

    public function __construct(
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        UsuarioRepository $usuarioRepository,
        EntrenadorRepository $entrenadorRepository
    ) {
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
        $this->usuarioRepository = $usuarioRepository;
        $this->entrenadorRepository = $entrenadorRepository;
    }

    /**
     * Registro de nuevo usuario
     * POST /api/register
     */
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            // Validación básica
            if (!isset($data['nombre'], $data['apellidos'], $data['email'], $data['password'])) {
                return $this->json([
                    'success' => false,
                    'error' => 'Faltan datos obligatorios'
                ], Response::HTTP_BAD_REQUEST);
            }

            // Email duplicado
            if ($this->usuarioRepository->findOneBy(['email' => $data['email']])) {
                return $this->json([
                    'success' => false,
                    'error' => 'El email ya está registrado'
                ], Response::HTTP_CONFLICT);
            }

            // Crear usuario
            $usuario = new Usuario();
            $usuario->setNombre($data['nombre']);
            $usuario->setApellidos($data['apellidos']);
            $usuario->setEmail($data['email']);

            // Hash de contraseña
            $hashedPassword = $this->passwordHasher->hashPassword($usuario, $data['password']);
            $usuario->setPasswordHash($hashedPassword);

            // Datos opcionales
            if (isset($data['telefono'])) $usuario->setTelefono($data['telefono']);

            // Datos físicos
            if (isset($data['sexo'])) $usuario->setSexo($data['sexo']);
            if (isset($data['edad'])) $usuario->setEdad((int)$data['edad']);
            if (isset($data['peso_actual'])) $usuario->setPesoActual((string)$data['peso_actual']);
            if (isset($data['altura'])) $usuario->setAltura((int)$data['altura']);
            if (isset($data['peso_objetivo'])) $usuario->setPesoObjetivo((string)$data['peso_objetivo']);

            // Objetivo y actividad
            if (isset($data['objetivo'])) $usuario->setObjetivo($data['objetivo']);
            if (isset($data['nivel_actividad'])) $usuario->setNivelActividad($data['nivel_actividad']);
            if (isset($data['notas_salud'])) $usuario->setNotasSalud($data['notas_salud']);

            // Calcular IMC si es posible
            if ($usuario->getPesoActual() && $usuario->getAltura()) {
                $peso = (float)$usuario->getPesoActual();
                $alturaM = $usuario->getAltura() / 100;
                $imc = $peso / ($alturaM * $alturaM);
                $usuario->setImc((string)round($imc, 2));
            }

            // Premium opcional en registro
            $isPremium = isset($data['quiere_premium']) && $data['quiere_premium'];

            if ($isPremium) {
                $usuario->setEsPremium(true);
                $usuario->setFechaPremium(new \DateTime());

                // Asignar entrenador automáticamente
                $entrenador = $this->asignarEntrenadorAleatorio();
                if ($entrenador) {
                    $usuario->setEntrenadorAsignado($entrenador);
                }
            }

            // Guardar
            $this->entityManager->persist($usuario);
            $this->entityManager->flush();

            return $this->json([
                'success' => true,
                'message' => $isPremium
                    ? 'Usuario registrado con plan Premium y entrenador asignado'
                    : 'Usuario registrado correctamente',
                'usuario' => [
                    'id' => $usuario->getId(),
                    'nombre_completo' => $usuario->getNombreCompleto(),
                    'email' => $usuario->getEmail(),
                    'es_premium' => $usuario->isEsPremium(),
                    'entrenador' => $usuario->getEntrenadorAsignado()
                        ? [
                            'id' => $usuario->getEntrenadorAsignado()->getId(),
                            'nombre' => $usuario->getEntrenadorAsignado()->getNombreCompleto(),
                            'especialidad' => $usuario->getEntrenadorAsignado()->getEspecialidad()
                        ]
                        : null
                ]
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al registrar usuario: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Asignar un entrenador aleatorio activo
     */
    private function asignarEntrenadorAleatorio()
    {
        $conn = $this->entityManager->getConnection();
        $sql = "SELECT id FROM entrenadores WHERE activo = 1 ORDER BY RAND() LIMIT 1";
        $result = $conn->executeQuery($sql)->fetchAssociative();

        return $result ? $this->entrenadorRepository->find($result['id']) : null;
    }
}
