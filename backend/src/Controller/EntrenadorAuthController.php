<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class EntrenadorAuthController extends AbstractController
{
    #[Route('/api/entrenador/login', name: 'api_entrenador_login', methods: ['POST'])]
    public function login(): JsonResponse
    {
        // Nunca se ejecutará, lo manejará json_login automáticamente.
        return new JsonResponse(['error' => 'Login handled by json_login'], 400);
    }
}
