<?php

namespace App\Security;

use App\Entity\Usuario;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

class JwtAuthenticator extends AbstractAuthenticator
{
    private EntityManagerInterface $entityManager;
    private string $jwtSecret;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
        // ✅ Usar la misma clave secreta del AuthController
        $this->jwtSecret = $_ENV['JWT_SECRET'] ?? 'tu-clave-secreta-super-segura-2024';
    }

    // ============================================
    // VERIFICAR SI LA PETICIÓN TIENE JWT
    // ============================================
    public function supports(Request $request): ?bool
    {
        // Solo procesar si tiene header Authorization
        return $request->headers->has('Authorization');
    }

    // ============================================
    // VALIDAR Y EXTRAER EL JWT
    // ============================================
    public function authenticate(Request $request): Passport
    {
        $authHeader = $request->headers->get('Authorization');
        
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            throw new CustomUserMessageAuthenticationException('No Authorization header found');
        }

        // Extraer el token: "Bearer <token>" → "<token>"
        $token = substr($authHeader, 7);

        try {
            // ✅ Verificar y decodificar el token
            $payload = $this->verifyToken($token);
            
            if (!$payload) {
                throw new CustomUserMessageAuthenticationException('Invalid JWT token');
            }

            // Obtener el usuario desde la BD
            $usuario = $this->entityManager->getRepository(Usuario::class)
                ->findOneBy(['email' => $payload['email']]);

            if (!$usuario) {
                throw new CustomUserMessageAuthenticationException('User not found');
            }

            // ✅ Retornar el usuario autenticado
            return new SelfValidatingPassport(
                new UserBadge($usuario->getEmail(), function() use ($usuario) {
                    return $usuario;
                })
            );

        } catch (\Exception $e) {
            throw new CustomUserMessageAuthenticationException('Invalid token: ' . $e->getMessage());
        }
    }

    // ============================================
    // MANEJAR AUTENTICACIÓN EXITOSA
    // ============================================
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        // No retornar nada aquí, dejar que continúe
        return null;
    }

    // ============================================
    // MANEJAR ERROR DE AUTENTICACIÓN
    // ============================================
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        $data = [
            'success' => false,
            'error' => $exception->getMessageKey(),
            'message' => 'Autenticación fallida'
        ];

        return new \Symfony\Component\HttpFoundation\JsonResponse($data, Response::HTTP_UNAUTHORIZED);
    }

    // ============================================
    // VERIFICAR Y DECODIFICAR JWT
    // ============================================
    private function verifyToken(string $token): ?array
    {
        try {
            // Dividir token en partes: header.payload.signature
            $parts = explode('.', $token);
            
            if (count($parts) !== 3) {
                return null;
            }

            [$header, $payload, $signature] = $parts;

            // ✅ Verificar que la firma es válida
            $expectedSignature = $this->base64UrlEncode(
                hash_hmac('sha256', "$header.$payload", $this->jwtSecret, true)
            );

            if (!hash_equals($signature, $expectedSignature)) {
                return null;
            }

            // ✅ Decodificar el payload
            $decoded = json_decode($this->base64UrlDecode($payload), true);

            if (!$decoded) {
                return null;
            }

            // ✅ Verificar que no ha expirado
            if (isset($decoded['exp']) && $decoded['exp'] < time()) {
                throw new \Exception('Token expired');
            }

            return $decoded;

        } catch (\Exception $e) {
            throw new \Exception('Token verification failed: ' . $e->getMessage());
        }
    }

    // ============================================
    // HELPERS PARA BASE64 URL-SAFE
    // ============================================
    private function base64UrlEncode(string $input): string
    {
        return rtrim(strtr(base64_encode($input), '+/', '-_'), '=');
    }

    private function base64UrlDecode(string $input): string
    {
        $remainder = strlen($input) % 4;
        if ($remainder) {
            $input .= str_repeat('=', 4 - $remainder);
        }
        return base64_decode(strtr($input, '-_', '+/'));
    }
}