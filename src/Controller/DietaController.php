<?php

namespace App\Controller;

use App\Entity\Dieta;
use App\Entity\Alimento;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/custom')]
class DietaController extends AbstractController
{
    // ============================================
    // DIETAS RECOMENDADAS POR OBJETIVO
    // ============================================
    #[Route('/dietas/por-objetivo', name: 'dietas_por_objetivo', methods: ['GET'])]
    public function porObjetivo(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $objetivo = $request->query->get('objetivo');
        
        if (!$objetivo) {
            return $this->json([
                'success' => false,
                'error' => 'Parámetro "objetivo" requerido (perder_peso, ganar_masa, mantener, tonificar)'
            ], Response::HTTP_BAD_REQUEST);
        }

        $dietas = $entityManager->getRepository(Dieta::class)
            ->createQueryBuilder('d')
            ->where('d.esPublica = true')
            ->orderBy('d.valoracionPromedio', 'DESC')
            ->setMaxResults(20)
            ->getQuery()
            ->getResult();

        return $this->json([
            'success' => true,
            'objetivo' => $objetivo,
            'total' => count($dietas),
            'dietas' => array_map(function($dieta) {
                return $this->serializeDieta($dieta);
            }, $dietas)
        ]);
    }

    // ============================================
    // DIETAS POPULARES
    // ============================================
    #[Route('/dietas/populares', name: 'dietas_populares', methods: ['GET'])]
    public function populares(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $limit = $request->query->get('limit', 10);

        $dietas = $entityManager->getRepository(Dieta::class)
            ->createQueryBuilder('d')
            ->where('d.esPublica = true')
            ->andWhere('d.totalValoraciones > 0')
            ->orderBy('d.valoracionPromedio', 'DESC')
            ->addOrderBy('d.totalValoraciones', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();

        return $this->json([
            'success' => true,
            'total' => count($dietas),
            'dietas' => array_map(function($dieta) {
                return $this->serializeDieta($dieta);
            }, $dietas)
        ]);
    }

    // ============================================
    // BUSCAR ALIMENTOS
    // ============================================
    #[Route('/alimentos/buscar', name: 'alimentos_buscar', methods: ['GET'])]
    public function buscarAlimentos(
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

        $alimentos = $entityManager->getRepository(Alimento::class)
            ->createQueryBuilder('a')
            ->where('a.nombre LIKE :query')
            ->orWhere('a.descripcion LIKE :query')
            ->setParameter('query', '%' . $query . '%')
            ->orderBy('a.nombre', 'ASC')
            ->setMaxResults(50)
            ->getQuery()
            ->getResult();

        return $this->json([
            'success' => true,
            'total' => count($alimentos),
            'alimentos' => array_map(function($alimento) {
                return $this->serializeAlimento($alimento);
            }, $alimentos)
        ]);
    }

    // ============================================
    // FILTRAR ALIMENTOS POR TIPO
    // ============================================
    #[Route('/alimentos/por-tipo', name: 'alimentos_por_tipo', methods: ['GET'])]
    public function alimentosPorTipo(
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

        $alimentos = $entityManager->getRepository(Alimento::class)
            ->findBy(['tipoAlimento' => $tipo], ['nombre' => 'ASC']);

        return $this->json([
            'success' => true,
            'tipo' => $tipo,
            'total' => count($alimentos),
            'alimentos' => array_map(function($alimento) {
                return $this->serializeAlimento($alimento);
            }, $alimentos)
        ]);
    }

    // ============================================
    // CALCULAR CALORÍAS NECESARIAS
    // ============================================
    #[Route('/dietas/calcular-calorias', name: 'calcular_calorias', methods: ['POST'])]
    public function calcularCalorias(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        $peso = $data['peso'] ?? null;
        $altura = $data['altura'] ?? null;
        $edad = $data['edad'] ?? null;
        $sexo = $data['sexo'] ?? null;
        $actividad = $data['actividad'] ?? 'sedentario';
        $objetivo = $data['objetivo'] ?? 'mantener';

        if (!$peso || !$altura || !$edad || !$sexo) {
            return $this->json([
                'success' => false,
                'error' => 'Faltan parámetros: peso, altura, edad, sexo'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Fórmula Harris-Benedict
        if ($sexo === 'hombre') {
            $tmb = 88.362 + (13.397 * $peso) + (4.799 * $altura) - (5.677 * $edad);
        } else {
            $tmb = 447.593 + (9.247 * $peso) + (3.098 * $altura) - (4.330 * $edad);
        }

        // Factor de actividad
        $factores = [
            'sedentario' => 1.2,
            'ligero' => 1.375,
            'moderado' => 1.55,
            'activo' => 1.725,
            'muy_activo' => 1.9
        ];
        
        $factor = $factores[$actividad] ?? 1.2;
        $caloriasMantenimiento = $tmb * $factor;

        // Ajustar por objetivo
        $ajustes = [
            'perder_peso' => -500,
            'ganar_masa' => 500,
            'mantener' => 0,
            'tonificar' => -200
        ];
        
        $ajuste = $ajustes[$objetivo] ?? 0;
        $caloriasObjetivo = $caloriasMantenimiento + $ajuste;

        // Macros recomendados
        $proteinas = round(($caloriasObjetivo * 0.30) / 4); // gramos
        $carbohidratos = round(($caloriasObjetivo * 0.40) / 4); // gramos
        $grasas = round(($caloriasObjetivo * 0.30) / 9); // gramos

        return $this->json([
            'success' => true,
            'tmb' => round($tmb),
            'caloriasMantenimiento' => round($caloriasMantenimiento),
            'caloriasObjetivo' => round($caloriasObjetivo),
            'macros' => [
                'proteinas' => $proteinas,
                'carbohidratos' => $carbohidratos,
                'grasas' => $grasas
            ]
        ]);
    }

    // ============================================
    // VALORAR DIETA
    // ============================================
    #[Route('/dietas/{id}/valorar', name: 'dietas_valorar', methods: ['POST'])]
    public function valorar(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $dieta = $entityManager->getRepository(Dieta::class)->find($id);
        
        if (!$dieta) {
            return $this->json([
                'success' => false,
                'error' => 'Dieta no encontrada'
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

        $totalValoraciones = $dieta->getTotalValoraciones();
        $valoracionActual = $dieta->getValoracionPromedio();
        
        $nuevoTotal = $totalValoraciones + 1;
        $nuevoPromedio = (($valoracionActual * $totalValoraciones) + $puntuacion) / $nuevoTotal;
        
        $dieta->setValoracionPromedio(round($nuevoPromedio, 2));
        $dieta->setTotalValoraciones($nuevoTotal);
        
        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => 'Valoración registrada',
            'dieta' => $this->serializeDieta($dieta)
        ]);
    }

    // ============================================
    // HELPERS
    // ============================================
    private function serializeDieta(Dieta $dieta): array
    {
        return [
            'id' => $dieta->getId(),
            'nombre' => $dieta->getNombre(),
            'descripcion' => $dieta->getDescripcion(),
            'valoracionPromedio' => $dieta->getValoracionPromedio(),
            'totalValoraciones' => $dieta->getTotalValoraciones(),
            'esPublica' => $dieta->isEsPublica(),
            'fechaCreacion' => $dieta->getFechaCreacion()?->format('Y-m-d H:i:s')
        ];
    }

    private function serializeAlimento(Alimento $alimento): array
    {
        return [
            'id' => $alimento->getId(),
            'nombre' => $alimento->getNombre(),
            'tipoAlimento' => $alimento->getTipoAlimento(),
            'calorias' => $alimento->getCalorias(),
            'proteinas' => $alimento->getProteinas(),
            'carbohidratos' => $alimento->getCarbohidratos(),
            'grasas' => $alimento->getGrasas(),
            'descripcion' => $alimento->getDescripcion()
        ];
    }
}