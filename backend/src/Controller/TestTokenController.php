<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/debug')]
class TestTokenController extends AbstractController
{
    #[Route('/test-token', name: 'test_token_debug', methods: ['GET'])]
    public function testToken(Request $request): JsonResponse
    {
        $authHeader = $request->headers->get('Authorization');
        $allHeaders = $request->headers->all();

        return $this->json([
            'success' => true,
            'authorization_header' => $authHeader,
            'has_authorization' => $authHeader !== null,
            'all_headers' => $allHeaders,
            'token_in_localStorage' => 'Check browser console'
        ]);
    }
}
