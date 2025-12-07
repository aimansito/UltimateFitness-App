<?php

namespace App\Security;

use App\Repository\EntrenadorRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class EntrenadorLoginSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    private $inner;
    private EntrenadorRepository $repo;

    public function __construct($inner, EntrenadorRepository $repo)
    {
        $this->inner = $inner;
        $this->repo = $repo;
    }

    public function onAuthenticationSuccess($request, TokenInterface $token): JsonResponse
    {
        // 1) Llamamos al handler original de Lexik
        $original = $this->inner->onAuthenticationSuccess($request, $token);
        $data = json_decode($original->getContent(), true);

        // 2) JWT generado
        $jwt = $data['token'] ?? null;

        // 3) Usuario (solo email)
        $user = $token->getUser();

        // 4) Buscar entrenador completo
        $entrenador = $this->repo->findOneBy([
            'email' => $user->getUserIdentifier()
        ]);

        // 5) Devolver respuesta personalizada SOLO PARA ENTRENADORES
        if ($entrenador) {
            return new JsonResponse([
                'success' => true,
                'token' => $jwt,
                'entrenador' => [
                    'id' => $entrenador->getId(),
                    'email' => $entrenador->getEmail(),
                    'nombre' => $entrenador->getNombre(),
                    'apellidos' => $entrenador->getApellidos(),
                    'rol' => 'entrenador'
                ]
            ]);
        }

        // Si NO es entrenador → devolver lo mismo que Lexik
        return $original;
    }
}
