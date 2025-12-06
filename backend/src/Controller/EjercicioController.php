<?php

namespace App\Controller;

use App\Entity\Ejercicio;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/custom')]
class EjercicioController extends AbstractController
{
    // ============================================
    // LISTAR TODOS LOS EJERCICIOS (NUEVO)
    // ============================================
    #[Route('/ejercicios', name: 'ejercicios_listar_todos', methods: ['GET'])]
    public function listarTodos(EntityManagerInterface $entityManager): JsonResponse
    {
        $ejercicios = $entityManager->getRepository(Ejercicio::class)
            ->findBy([], ['nombre' => 'ASC']);

        return $this->json(array_map(function($ejercicio) {
            return $this->serializeEjercicio($ejercicio);
        }, $ejercicios));
    }

    // ============================================
    // BUSCAR EJERCICIOS POR TEXTO
    // ============================================
    #[Route('/ejercicios/buscar', name: 'ejercicios_buscar', methods: ['GET'])]
    public function buscar(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $query = $request->query->get('q', '');
        
        if (strlen($query) < 2) {
            return $this->json([
                'success' => false,
                'error' => 'La búsqueda debe tener al menos 2 caracteres'
            ], Response::HTTP_BAD_REQUEST);
        }

        $ejercicios = $entityManager->getRepository(Ejercicio::class)
            ->createQueryBuilder('e')
            ->where('e.nombre LIKE :query')
            ->orWhere('e.descripcion LIKE :query')
            ->setParameter('query', '%' . $query . '%')
            ->orderBy('e.valoracionPromedio', 'DESC')
            ->setMaxResults(20)
            ->getQuery()
            ->getResult();

        return $this->json([
            'success' => true,
            'total' => count($ejercicios),
            'ejercicios' => array_map(function($ejercicio) {
                return $this->serializeEjercicio($ejercicio);
            }, $ejercicios)
        ]);
    }

    // ============================================
    // FILTRAR POR GRUPO MUSCULAR
    // ============================================
    #[Route('/ejercicios/por-musculo', name: 'ejercicios_por_musculo', methods: ['GET'])]
    public function porMusculo(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $musculo = $request->query->get('musculo');
        
        if (!$musculo) {
            return $this->json([
                'success' => false,
                'error' => 'Parámetro "musculo" requerido'
            ], Response::HTTP_BAD_REQUEST);
        }

        $ejercicios = $entityManager->getRepository(Ejercicio::class)
            ->findBy(['grupoMuscular' => $musculo], ['valoracionPromedio' => 'DESC']);

        return $this->json([
            'success' => true,
            'musculo' => $musculo,
            'total' => count($ejercicios),
            'ejercicios' => array_map(function($ejercicio) {
                return $this->serializeEjercicio($ejercicio);
            }, $ejercicios)
        ]);
    }

    // ============================================
    // EJERCICIOS POPULARES (MÁS VALORADOS)
    // ============================================
    #[Route('/ejercicios/populares', name: 'ejercicios_populares', methods: ['GET'])]
    public function populares(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $limit = $request->query->get('limit', 10);

        $ejercicios = $entityManager->getRepository(Ejercicio::class)
            ->createQueryBuilder('e')
            ->where('e.totalValoraciones > 0')
            ->orderBy('e.valoracionPromedio', 'DESC')
            ->addOrderBy('e.totalValoraciones', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();

        return $this->json([
            'success' => true,
            'total' => count($ejercicios),
            'ejercicios' => array_map(function($ejercicio) {
                return $this->serializeEjercicio($ejercicio);
            }, $ejercicios)
        ]);
    }

    // ============================================
    // FILTRAR POR DIFICULTAD
    // ============================================
    #[Route('/ejercicios/por-dificultad', name: 'ejercicios_por_dificultad', methods: ['GET'])]
    public function porDificultad(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $dificultad = $request->query->get('nivel');
        
        if (!$dificultad) {
            return $this->json([
                'success' => false,
                'error' => 'Parámetro "nivel" requerido (principiante, intermedio, avanzado)'
            ], Response::HTTP_BAD_REQUEST);
        }

        $ejercicios = $entityManager->getRepository(Ejercicio::class)
            ->findBy(['nivelDificultad' => $dificultad], ['nombre' => 'ASC']);

        return $this->json([
            'success' => true,
            'nivel' => $dificultad,
            'total' => count($ejercicios),
            'ejercicios' => array_map(function($ejercicio) {
                return $this->serializeEjercicio($ejercicio);
            }, $ejercicios)
        ]);
    }

    // ============================================
    // VALORAR EJERCICIO
    // ============================================
    #[Route('/ejercicios/{id}/valorar', name: 'ejercicios_valorar', methods: ['POST'])]
    public function valorar(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $ejercicio = $entityManager->getRepository(Ejercicio::class)->find($id);
        
        if (!$ejercicio) {
            return $this->json([
                'success' => false,
                'error' => 'Ejercicio no encontrado'
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
        $totalValoraciones = $ejercicio->getTotalValoraciones();
        $valoracionActual = $ejercicio->getValoracionPromedio();
        
        $nuevoTotal = $totalValoraciones + 1;
        $nuevoPromedio = (($valoracionActual * $totalValoraciones) + $puntuacion) / $nuevoTotal;
        
        $ejercicio->setValoracionPromedio(round($nuevoPromedio, 2));
        $ejercicio->setTotalValoraciones($nuevoTotal);
        
        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => 'Valoración registrada',
            'ejercicio' => $this->serializeEjercicio($ejercicio)
        ]);
    }

    // ============================================
    // HELPER: Serializar ejercicio
    // ============================================
    private function serializeEjercicio(Ejercicio $ejercicio): array
    {
        return [
            'id' => $ejercicio->getId(),
            'nombre' => $ejercicio->getNombre(),
            'descripcion' => $ejercicio->getDescripcion(),
            'grupoMuscular' => $ejercicio->getGrupoMuscular(),
            'tipo' => $ejercicio->getTipo(),
            'nivelDificultad' => $ejercicio->getNivelDificultad(),
            'valoracionPromedio' => $ejercicio->getValoracionPromedio(),
            'totalValoraciones' => $ejercicio->getTotalValoraciones(),
            'videoUrl' => $ejercicio->getVideoUrl()
        ];
    }
}