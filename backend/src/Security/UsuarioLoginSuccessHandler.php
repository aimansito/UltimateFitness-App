<?php

namespace App\Security;

use App\Repository\UsuarioRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class UsuarioLoginSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    private $inner;
    private UsuarioRepository $repo;

    public function __construct($inner, UsuarioRepository $repo)
    {
        $this->inner = $inner;
        $this->repo = $repo;
    }

    public function onAuthenticationSuccess($request, TokenInterface $token): JsonResponse
    {
        // 1) Llamar al handler original de Lexik para generar el JWT
        $original = $this->inner->onAuthenticationSuccess($request, $token);
        $data = json_decode($original->getContent(), true);

        // 2) JWT generado
        $jwt = $data['token'] ?? null;

        // 3) Usuario autenticado
        $user = $token->getUser();

        // 4) Buscar usuario completo en la base de datos
        $usuario = $this->repo->findOneBy([
            'email' => $user->getUserIdentifier()
        ]);

        // 5) Devolver respuesta personalizada con TODOS los datos del usuario
        if ($usuario) {
            return new JsonResponse([
                'success' => true,
                'token' => $jwt,
                'usuario' => [
                    'id' => $usuario->getId(),
                    'email' => $usuario->getEmail(),
                    'nombre' => $usuario->getNombre(),
                    'apellidos' => $usuario->getApellidos(),
                    'telefono' => $usuario->getTelefono(),
                    'rol' => $usuario->getRol(),
                    'es_premium' => $usuario->isEsPremium(),
                    'entrenador_asignado_id' => $usuario->getEntrenadorAsignado()?->getId(),
                    // Datos físicos
                    'peso_actual' => $usuario->getPesoActual(),
                    'altura' => $usuario->getAltura(),
                    'edad' => $usuario->getEdad(),
                    'sexo' => $usuario->getSexo(),
                    'nivel_actividad' => $usuario->getNivelActividad(),
                    'objetivo' => $usuario->getObjetivo()
                ]
            ]);
        }

        // Si NO se encuentra el usuario → devolver respuesta original de Lexik
        return $original;
    }
}
