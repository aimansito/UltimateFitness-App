<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class AuthController extends AbstractController
{
    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(): JsonResponse
    {
        // Este método NUNCA se ejecuta
        // json_login del firewall lo intercepta antes.
        return new JsonResponse([
            'error' => 'Este endpoint es manejado por json_login.'
        ], 400);
    }
}
