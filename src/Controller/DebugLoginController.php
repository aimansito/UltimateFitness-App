<?php

namespace App\Controller;

use App\Entity\Usuario;
use App\Entity\Entrenador;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class DebugLoginController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/api/debug-login', name: 'debug_login', methods: ['POST'])]
    public function debugLogin(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        $debug = [
            'paso_1_request_recibido' => true,
            'paso_2_json_parseado' => $data !== null,
            'paso_3_datos_recibidos' => [
                'email' => $data['email'] ?? 'NO RECIBIDO',
                'password' => $data['password'] ?? 'NO RECIBIDO',
                'password_length' => isset($data['password']) ? strlen($data['password']) : 0
            ]
        ];

        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        // Buscar en entrenadores
        $entrenador = $this->entityManager->getRepository(Entrenador::class)->findOneBy(['email' => $email]);

        $debug['paso_4_busqueda_entrenador'] = [
            'encontrado' => $entrenador !== null,
            'email_buscado' => $email
        ];

        if ($entrenador) {
            $hash = $entrenador->getPasswordHash();
            $verificacion = password_verify($password, $hash);
            
            $debug['paso_5_verificacion_password'] = [
                'hash_existe' => $hash !== null,
                'hash_length' => strlen($hash ?? ''),
                'hash_preview' => substr($hash ?? '', 0, 30),
                'password_ingresado' => $password,
                'verificacion_resultado' => $verificacion,
                'datos_entrenador' => [
                    'id' => $entrenador->getId(),
                    'nombre' => $entrenador->getNombre(),
                    'email' => $entrenador->getEmail()
                ]
            ];

            if ($verificacion) {
                $debug['paso_6_login_exitoso'] = true;
                $debug['respuesta_que_se_enviaria'] = [
                    'success' => true,
                    'message' => 'Login exitoso',
                    'usuario' => [
                        'id' => $entrenador->getId(),
                        'email' => $entrenador->getEmail(),
                        'nombre' => $entrenador->getNombre(),
                        'apellidos' => $entrenador->getApellidos(),
                        'rol' => 'entrenador',
                        'tipo_entidad' => 'entrenador'
                    ]
                ];
            } else {
                $debug['paso_6_login_fallido'] = [
                    'razon' => 'password_verify devolvió false',
                    'sugerencia' => 'El hash en BD no corresponde con la contraseña ingresada'
                ];
            }
        } else {
            // Buscar en usuarios
            $usuario = $this->entityManager->getRepository(Usuario::class)->findOneBy(['email' => $email]);
            
            $debug['paso_4b_busqueda_usuario'] = [
                'encontrado' => $usuario !== null,
                'email_buscado' => $email
            ];

            if ($usuario) {
                $hash = $usuario->getPasswordHash();
                $verificacion = password_verify($password, $hash);
                
                $debug['paso_5_verificacion_password_usuario'] = [
                    'hash_existe' => $hash !== null,
                    'hash_length' => strlen($hash ?? ''),
                    'hash_preview' => substr($hash ?? '', 0, 30),
                    'verificacion_resultado' => $verificacion
                ];
            } else {
                $debug['paso_4c_no_encontrado'] = [
                    'mensaje' => 'No existe ni en entrenadores ni en usuarios',
                    'email_buscado' => $email
                ];
            }
        }

        return new JsonResponse($debug, 200);
    }
}