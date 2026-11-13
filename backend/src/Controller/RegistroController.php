<?php

namespace App\Controller;

use App\Entity\Usuario;
use App\Repository\UsuarioRepository;
use App\Service\CorreosCuenta;
use Psr\Log\LoggerInterface;
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

    public function __construct(
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        UsuarioRepository $usuarioRepository,
        private CorreosCuenta $correos,
        private LoggerInterface $logger
    ) {
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
        $this->usuarioRepository = $usuarioRepository;
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

            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL) || strlen($data['email']) > 255) {
                return $this->json(['success' => false, 'error' => 'El email no es válido'], Response::HTTP_BAD_REQUEST);
            }
            if (!is_string($data['password']) || strlen($data['password']) < 8) {
                return $this->json(['success' => false, 'error' => 'La contraseña debe tener al menos 8 caracteres'], Response::HTTP_BAD_REQUEST);
            }

            // Consentimientos (RGPD art. 7 y 9.2.a): deben llegar marcados explícitamente
            if (($data['acepta_terminos'] ?? false) !== true) {
                return $this->json(['success' => false, 'error' => 'Debes aceptar los Términos y condiciones y la Política de privacidad'], Response::HTTP_BAD_REQUEST);
            }
            $traeDatosSalud = !empty($data['peso_actual']) || !empty($data['altura']) || !empty($data['peso_objetivo']) || !empty($data['notas_salud']);
            if ($traeDatosSalud && ($data['consiente_salud'] ?? false) !== true) {
                return $this->json(['success' => false, 'error' => 'Falta el consentimiento para tratar los datos de salud'], Response::HTTP_BAD_REQUEST);
            }
            // Edad mínima sin consentimiento parental (LOPDGDD art. 7)
            if (isset($data['edad']) && $data['edad'] !== null && (int) $data['edad'] < 14) {
                return $this->json(['success' => false, 'error' => 'Debes tener al menos 14 años para registrarte'], Response::HTTP_BAD_REQUEST);
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

            // El registro siempre crea una cuenta gratuita: premium nunca se concede desde el cliente.

            // Privacidad por defecto (RGPD art. 25.2): el perfil empieza privado y la persona decide publicarlo
            $usuario->setPerfilPublico(false);

            // Guardar
            $this->entityManager->persist($usuario);
            $this->entityManager->flush();

            // Correo de bienvenida: si falla no se interrumpe el registro (queda en el log)
            $this->correos->bienvenida($usuario);

            return $this->json([
                'success' => true,
                'message' => 'Usuario registrado correctamente',
                'usuario' => [
                    'id' => $usuario->getId(),
                    'nombre_completo' => $usuario->getNombreCompleto(),
                    'email' => $usuario->getEmail(),
                    'es_premium' => false,
                ]
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            $this->logger->error('Error en el registro', ['error' => $e->getMessage()]);
            return $this->json([
                'success' => false,
                'error' => 'No se pudo completar el registro. Inténtalo de nuevo.'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
