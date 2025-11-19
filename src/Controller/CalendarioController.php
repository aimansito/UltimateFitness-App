<?php

namespace App\Controller;

use App\Entity\CalendarioUsuario;
use App\Entity\Usuario;
use App\Entity\Entrenamiento;
use App\Entity\Dieta;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/custom')]
class CalendarioController extends AbstractController
{
    // ============================================
    // VER CALENDARIO DEL USUARIO
    // ============================================
    #[Route('/calendario/{userId}', name: 'calendario_usuario', methods: ['GET'])]
    public function ver(
        int $userId,
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $usuario = $entityManager->getRepository(Usuario::class)->find($userId);
        
        if (!$usuario) {
            return $this->json([
                'success' => false,
                'error' => 'Usuario no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        $year = $request->query->get('year', date('Y'));
        $month = $request->query->get('month', date('m'));

        $calendarios = $entityManager->getRepository(CalendarioUsuario::class)
            ->findBy(['usuario' => $usuario]);

        return $this->json([
            'success' => true,
            'year' => $year,
            'month' => $month,
            'total' => count($calendarios),
            'eventos' => array_map(function($calendario) {
                return $this->serializeCalendario($calendario);
            }, $calendarios)
        ]);
    }

    // ============================================
    // AGENDAR ENTRENAMIENTO
    // ============================================
    #[Route('/calendario/agendar', name: 'calendario_agendar', methods: ['POST'])]
    public function agendar(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        
        $usuarioId = $data['usuarioId'] ?? null;
        $entrenamientoId = $data['entrenamientoId'] ?? null;
        $dietaId = $data['dietaId'] ?? null;
        $diaSemana = $data['diaSemana'] ?? null;

        if (!$usuarioId || !$diaSemana) {
            return $this->json([
                'success' => false,
                'error' => 'Faltan parámetros: usuarioId, diaSemana'
            ], Response::HTTP_BAD_REQUEST);
        }

        $usuario = $entityManager->getRepository(Usuario::class)->find($usuarioId);
        if (!$usuario) {
            return $this->json([
                'success' => false,
                'error' => 'Usuario no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        $calendario = new CalendarioUsuario();
        $calendario->setUsuario($usuario);
        $calendario->setDiaSemana($diaSemana);
        
        if ($entrenamientoId) {
            $entrenamiento = $entityManager->getRepository(Entrenamiento::class)->find($entrenamientoId);
            if ($entrenamiento) {
                $calendario->setEntrenamiento($entrenamiento);
            }
        }
        
        if ($dietaId) {
            $dieta = $entityManager->getRepository(Dieta::class)->find($dietaId);
            if ($dieta) {
                $calendario->setDieta($dieta);
            }
        }

        if (isset($data['notas'])) {
            $calendario->setNotas($data['notas']);
        }

        $entityManager->persist($calendario);
        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => 'Evento agendado correctamente',
            'evento' => $this->serializeCalendario($calendario)
        ], Response::HTTP_CREATED);
    }

    // ============================================
    // MARCAR COMO COMPLETADO
    // ============================================
    #[Route('/calendario/{id}/completar', name: 'calendario_completar', methods: ['PUT', 'PATCH'])]
    public function completar(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $calendario = $entityManager->getRepository(CalendarioUsuario::class)->find($id);
        
        if (!$calendario) {
            return $this->json([
                'success' => false,
                'error' => 'Evento no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        $calendario->setCompletado(!$calendario->isCompletado());
        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => $calendario->isCompletado() ? 'Marcado como completado' : 'Marcado como pendiente',
            'evento' => $this->serializeCalendario($calendario)
        ]);
    }

    // ============================================
    // ELIMINAR EVENTO
    // ============================================
    #[Route('/calendario/{id}', name: 'calendario_eliminar', methods: ['DELETE'])]
    public function eliminar(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $calendario = $entityManager->getRepository(CalendarioUsuario::class)->find($id);
        
        if (!$calendario) {
            return $this->json([
                'success' => false,
                'error' => 'Evento no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        $entityManager->remove($calendario);
        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => 'Evento eliminado'
        ]);
    }

    // ============================================
    // HELPER
    // ============================================
    private function serializeCalendario(CalendarioUsuario $calendario): array
    {
        $entrenamiento = $calendario->getEntrenamiento();
        $dieta = $calendario->getDieta();

        return [
            'id' => $calendario->getId(),
            'diaSemana' => $calendario->getDiaSemana(),
            'completado' => $calendario->isCompletado(),
            'notas' => $calendario->getNotas(),
            'entrenamiento' => $entrenamiento ? [
                'id' => $entrenamiento->getId(),
                'nombre' => $entrenamiento->getNombre()
            ] : null,
            'dieta' => $dieta ? [
                'id' => $dieta->getId(),
                'nombre' => $dieta->getNombre()
            ] : null
        ];
    }
}