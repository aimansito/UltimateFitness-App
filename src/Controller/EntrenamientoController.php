<?php

namespace App\Controller;

use App\Entity\Entrenamiento;
use App\Entity\Usuario;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/custom')]
class EntrenamientoController extends AbstractController
{
    // ============================================
    // ENTRENAMIENTOS RECOMENDADOS POR OBJETIVO
    // ============================================
    #[Route('/entrenamientos/recomendados', name: 'entrenamientos_recomendados', methods: ['GET'])]
    public function recomendados(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $objetivo = $request->query->get('objetivo');

        if (!$objetivo) {
            return $this->json([
                'success' => false,
                'error' => 'Parámetro "objetivo" requerido (ganar_masa, perder_peso, tonificar, resistencia)'
            ], Response::HTTP_BAD_REQUEST);
        }

        $entrenamientos = $entityManager->getRepository(Entrenamiento::class)
            ->createQueryBuilder('e')
            ->where('e.tipo = :objetivo')
            ->setParameter('objetivo', $objetivo)
            ->andWhere('e.esPublico = true')
            ->orderBy('e.valoracionPromedio', 'DESC')
            ->setMaxResults(20)
            ->getQuery()
            ->getResult();

        return $this->json([
            'success' => true,
            'objetivo' => $objetivo,
            'total' => count($entrenamientos),
            'entrenamientos' => array_map(function ($entrenamiento) {
                return $this->serializeEntrenamiento($entrenamiento);
            }, $entrenamientos)
        ]);
    }

    // ============================================
    // FILTRAR POR TIPO (gym, casa, cardio, etc)
    // ============================================
    #[Route('/entrenamientos/por-tipo', name: 'entrenamientos_por_tipo', methods: ['GET'])]
    public function porTipo(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $tipo = $request->query->get('tipo');

        if (!$tipo) {
            return $this->json([
                'success' => false,
                'error' => 'Parámetro "tipo" requerido'
            ], Response::HTTP_BAD_REQUEST);
        }

        $entrenamientos = $entityManager->getRepository(Entrenamiento::class)
            ->findBy(
                ['tipo' => $tipo, 'esPublico' => true],
                ['valoracionPromedio' => 'DESC']
            );

        return $this->json([
            'success' => true,
            'tipo' => $tipo,
            'total' => count($entrenamientos),
            'entrenamientos' => array_map(function ($entrenamiento) {
                return $this->serializeEntrenamiento($entrenamiento);
            }, $entrenamientos)
        ]);
    }

    // ============================================
    // FILTRAR POR NIVEL DE DIFICULTAD
    // ============================================
    #[Route('/entrenamientos/por-nivel', name: 'entrenamientos_por_nivel', methods: ['GET'])]
    public function porNivel(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $nivel = $request->query->get('nivel');

        if (!$nivel) {
            return $this->json([
                'success' => false,
                'error' => 'Parámetro "nivel" requerido (principiante, intermedio, avanzado)'
            ], Response::HTTP_BAD_REQUEST);
        }

        $entrenamientos = $entityManager->getRepository(Entrenamiento::class)
            ->findBy(
                ['nivelDificultad' => $nivel, 'esPublico' => true],
                ['nombre' => 'ASC']
            );

        return $this->json([
            'success' => true,
            'nivel' => $nivel,
            'total' => count($entrenamientos),
            'entrenamientos' => array_map(function ($entrenamiento) {
                return $this->serializeEntrenamiento($entrenamiento);
            }, $entrenamientos)
        ]);
    }

    // ============================================
    // ENTRENAMIENTOS POPULARES
    // ============================================
    #[Route('/entrenamientos/populares', name: 'entrenamientos_populares', methods: ['GET'])]
    public function populares(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $limit = $request->query->get('limit', 10);

        $entrenamientos = $entityManager->getRepository(Entrenamiento::class)
            ->createQueryBuilder('e')
            ->where('e.esPublico = true')
            ->andWhere('e.totalValoraciones > 0')
            ->orderBy('e.valoracionPromedio', 'DESC')
            ->addOrderBy('e.totalValoraciones', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();

        return $this->json([
            'success' => true,
            'total' => count($entrenamientos),
            'entrenamientos' => array_map(function ($entrenamiento) {
                return $this->serializeEntrenamiento($entrenamiento);
            }, $entrenamientos)
        ]);
    }

    // ============================================
    // CLONAR ENTRENAMIENTO (requiere autenticación)
    // ============================================
    #[Route('/entrenamientos/{id}/clonar', name: 'entrenamientos_clonar', methods: ['POST'])]
    public function clonar(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $user = $this->getUser();

        if (!$user) {
            return $this->json([
                'success' => false,
                'error' => 'Debe estar autenticado para clonar entrenamientos'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $entrenamientoOriginal = $entityManager->getRepository(Entrenamiento::class)->find($id);

        if (!$entrenamientoOriginal) {
            return $this->json([
                'success' => false,
                'error' => 'Entrenamiento no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        // Crear copia
        $entrenamientoClon = new Entrenamiento();
        $entrenamientoClon->setNombre($entrenamientoOriginal->getNombre() . ' (Copia)');
        $entrenamientoClon->setDescripcion($entrenamientoOriginal->getDescripcion());
        $entrenamientoClon->setTipo($entrenamientoOriginal->getTipo());
        $entrenamientoClon->setNivelDificultad($entrenamientoOriginal->getNivelDificultad());
        $entrenamientoClon->setDuracionMinutos($entrenamientoOriginal->getDuracionMinutos());
        $entrenamientoClon->setCreador($entrenamientoOriginal->getCreador()); // Mantener el creador original
        $entrenamientoClon->setEsPublico(false); // El clon es privado

        $entityManager->persist($entrenamientoClon);
        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => 'Entrenamiento clonado exitosamente',
            'entrenamiento' => $this->serializeEntrenamiento($entrenamientoClon)
        ], Response::HTTP_CREATED);
    }
    // ============================================
    // VALORAR ENTRENAMIENTO
    // ============================================
    #[Route('/entrenamientos/{id}/valorar', name: 'entrenamientos_valorar', methods: ['POST'])]
    public function valorar(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $entrenamiento = $entityManager->getRepository(Entrenamiento::class)->find($id);

        if (!$entrenamiento) {
            return $this->json([
                'success' => false,
                'error' => 'Entrenamiento no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        $puntuacion = $data['puntuacion'] ?? null;

        if (!$puntuacion || $puntuacion < 1 || $puntuacion > 5) {
            return $this->json([
                'success' => false,
                'error' => 'Puntuación debe estar entre 1 y 5'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Calcular nueva valoración promedio
        $totalValoraciones = $entrenamiento->getTotalValoraciones();
        $valoracionActual = $entrenamiento->getValoracionPromedio();

        $nuevoTotal = $totalValoraciones + 1;
        $nuevoPromedio = (($valoracionActual * $totalValoraciones) + $puntuacion) / $nuevoTotal;

        $entrenamiento->setValoracionPromedio(round($nuevoPromedio, 2));
        $entrenamiento->setTotalValoraciones($nuevoTotal);

        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => 'Valoración registrada',
            'entrenamiento' => $this->serializeEntrenamiento($entrenamiento)
        ]);
    }

    // ============================================
    // HELPER: Serializar entrenamiento
    // ============================================
    private function serializeEntrenamiento(Entrenamiento $entrenamiento): array
    {
        return [
            'id' => $entrenamiento->getId(),
            'nombre' => $entrenamiento->getNombre(),
            'descripcion' => $entrenamiento->getDescripcion(),
            'tipo' => $entrenamiento->getTipo(),
            'nivelDificultad' => $entrenamiento->getNivelDificultad(),
            'duracionMinutos' => $entrenamiento->getDuracionMinutos(),
            'valoracionPromedio' => $entrenamiento->getValoracionPromedio(),
            'totalValoraciones' => $entrenamiento->getTotalValoraciones(),
            'esPublico' => $entrenamiento->isEsPublico(),
            'fechaCreacion' => $entrenamiento->getFechaCreacion()?->format('Y-m-d H:i:s'),
            'creador' => $entrenamiento->getCreador() ? [
                'id' => $entrenamiento->getCreador()->getId(),
                'nombre' => $entrenamiento->getCreador()->getNombre()
            ] : null
        ];
    }
}
