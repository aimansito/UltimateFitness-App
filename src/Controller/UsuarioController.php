<?php

namespace App\Controller;

use App\Entity\Usuario;
use App\Entity\CalendarioUsuario;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/custom')]
class UsuarioController extends AbstractController
{
    // ============================================
    // ENTRENAMIENTOS AGENDADOS DEL USUARIO
    // ============================================
    #[Route('/usuarios/{id}/entrenamientos', name: 'usuarios_entrenamientos', methods: ['GET'])]
    public function entrenamientos(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $usuario = $entityManager->getRepository(Usuario::class)->find($id);
        
        if (!$usuario) {
            return $this->json([
                'success' => false,
                'error' => 'Usuario no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        // Obtener entrenamientos del calendario del usuario
        $calendarios = $entityManager->getRepository(CalendarioUsuario::class)
            ->findBy(['usuario' => $usuario]);

        $entrenamientos = [];
        foreach ($calendarios as $calendario) {
            if ($entrenamiento = $calendario->getEntrenamiento()) {
                $entrenamientos[] = [
                    'id' => $entrenamiento->getId(),
                    'nombre' => $entrenamiento->getNombre(),
                    'descripcion' => $entrenamiento->getDescripcion(),
                    'tipo' => $entrenamiento->getTipo(),
                    'nivelDificultad' => $entrenamiento->getNivelDificultad(),
                    'duracionMinutos' => $entrenamiento->getDuracionMinutos(),
                    'diaSemana' => $calendario->getDiaSemana(),
                    'completado' => $calendario->isCompletado(),
                    'calendarioId' => $calendario->getId()
                ];
            }
        }

        return $this->json([
            'success' => true,
            'total' => count($entrenamientos),
            'entrenamientos' => $entrenamientos
        ]);
    }

    // ============================================
    // DIETAS AGENDADAS DEL USUARIO
    // ============================================
     #[Route('/usuarios/{id}/dietas', name: 'usuarios_dietas', methods: ['GET'])]
    public function dietas(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $usuario = $entityManager->getRepository(Usuario::class)->find($id);
        
        if (!$usuario) {
            return $this->json([
                'success' => false,
                'error' => 'Usuario no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        // Obtener dietas del calendario del usuario
        $calendarios = $entityManager->getRepository(CalendarioUsuario::class)
            ->findBy(['usuario' => $usuario]);

        $dietas = [];
        foreach ($calendarios as $calendario) {
            if ($dieta = $calendario->getDieta()) {
                $dietas[] = [
                    'id' => $dieta->getId(),
                    'nombre' => $dieta->getNombre(),
                    'descripcion' => $dieta->getDescripcion(),
                    'diaSemana' => $calendario->getDiaSemana(),
                    'completado' => $calendario->isCompletado(),
                    'calendarioId' => $calendario->getId()
                ];
            }
        }

        return $this->json([
            'success' => true,
            'total' => count($dietas),
            'dietas' => $dietas
        ]);
    }

    // ============================================
    // PROGRESO DEL USUARIO
    // ============================================
    #[Route('/usuarios/{id}/progreso', name: 'usuarios_progreso', methods: ['GET'])]
    public function progreso(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $usuario = $entityManager->getRepository(Usuario::class)->find($id);
        
        if (!$usuario) {
            return $this->json([
                'success' => false,
                'error' => 'Usuario no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        // Contar eventos agendados
        $totalAgendados = $entityManager->getRepository(CalendarioUsuario::class)
            ->count(['usuario' => $usuario]);

        // Contar completados
        $totalCompletados = $entityManager->getRepository(CalendarioUsuario::class)
            ->count(['usuario' => $usuario, 'completado' => true]);

        // Calcular porcentaje
        $porcentajeCompletado = $totalAgendados > 0 
            ? round(($totalCompletados / $totalAgendados) * 100, 2)
            : 0;

        return $this->json([
            'success' => true,
            'usuario' => [
                'id' => $usuario->getId(),
                'nombre' => $usuario->getNombreCompleto(),
                'objetivo' => $usuario->getObjetivo(),
                'esPremium' => $usuario->isEsPremium(),
                'fechaRegistro' => $usuario->getFechaRegistro()?->format('Y-m-d H:i:s')
            ],
            'estadisticas' => [
                'totalAgendados' => $totalAgendados,
                'totalCompletados' => $totalCompletados,
                'porcentajeCompletado' => $porcentajeCompletado,
                'diasActivo' => $this->calcularDiasActivo($usuario)
            ]
        ]);
    }

    // ============================================
    // ACTUALIZAR PERFIL
    // ============================================
    #[Route('/usuarios/{id}/actualizar', name: 'usuarios_actualizar', methods: ['PUT', 'PATCH'])]
    public function actualizar(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $usuario = $entityManager->getRepository(Usuario::class)->find($id);
        
        if (!$usuario) {
            return $this->json([
                'success' => false,
                'error' => 'Usuario no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['nombre'])) {
            $usuario->setNombre($data['nombre']);
        }
        if (isset($data['apellidos'])) {
            $usuario->setApellidos($data['apellidos']);
        }
        if (isset($data['telefono'])) {
            $usuario->setTelefono($data['telefono']);
        }
        if (isset($data['objetivo'])) {
            $usuario->setObjetivo($data['objetivo']);
        }
        if (isset($data['observaciones'])) {
            $usuario->setObservaciones($data['observaciones']);
        }

        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => 'Perfil actualizado',
            'usuario' => [
                'id' => $usuario->getId(),
                'nombre' => $usuario->getNombre(),
                'apellidos' => $usuario->getApellidos(),
                'email' => $usuario->getEmail(),
                'telefono' => $usuario->getTelefono(),
                'objetivo' => $usuario->getObjetivo(),
                'observaciones' => $usuario->getObservaciones()
            ]
        ]);
    }

    // ============================================
    // UPGRADE A PREMIUM
    // ============================================
    #[Route('/usuarios/{id}/upgrade-premium', name: 'usuarios_upgrade_premium', methods: ['POST'])]
    public function upgradePremium(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $usuario = $entityManager->getRepository(Usuario::class)->find($id);
        
        if (!$usuario) {
            return $this->json([
                'success' => false,
                'error' => 'Usuario no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        if ($usuario->isEsPremium()) {
            return $this->json([
                'success' => false,
                'error' => 'El usuario ya es Premium'
            ], Response::HTTP_BAD_REQUEST);
        }

        $usuario->setEsPremium(true);
        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => '¡Felicidades! Ahora eres usuario Premium',
            'usuario' => [
                'id' => $usuario->getId(),
                'nombre' => $usuario->getNombreCompleto(),
                'esPremium' => true
            ]
        ]);
    }

    // ============================================
    // ESTADÍSTICAS GENERALES
    // ============================================
    #[Route('/usuarios/{id}/estadisticas', name: 'usuarios_estadisticas', methods: ['GET'])]
    public function estadisticas(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $usuario = $entityManager->getRepository(Usuario::class)->find($id);
        
        if (!$usuario) {
            return $this->json([
                'success' => false,
                'error' => 'Usuario no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        // Días de la semana con actividad
        $calendarios = $entityManager->getRepository(CalendarioUsuario::class)
            ->findBy(['usuario' => $usuario]);

        $diasConActividad = [];
        foreach ($calendarios as $calendario) {
            $dia = $calendario->getDiaSemana();
            if (!in_array($dia, $diasConActividad)) {
                $diasConActividad[] = $dia;
            }
        }

        return $this->json([
            'success' => true,
            'estadisticas' => [
                'diasActivo' => $this->calcularDiasActivo($usuario),
                'diasConActividad' => count($diasConActividad),
                'totalEventos' => count($calendarios),
                'racha' => 0 // Implementar lógica de racha si es necesario
            ]
        ]);
    }

    // ============================================
    // HELPER: Calcular días activo
    // ============================================
    private function calcularDiasActivo(Usuario $usuario): int
    {
        $fechaRegistro = $usuario->getFechaRegistro();
        if (!$fechaRegistro) {
            return 0;
        }

        $ahora = new \DateTime();
        $diferencia = $ahora->diff($fechaRegistro);
        
        return $diferencia->days;
    }
}