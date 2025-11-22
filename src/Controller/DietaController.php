<?php

namespace App\Controller;

use App\Entity\Dieta;
use App\Entity\Alimento;
use App\Entity\DietaAlimento;
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
    // DIETAS PÚBLICAS (todas)
    // ============================================
    #[Route('/dietas/publicas', name: 'dietas_publicas', methods: ['GET'])]
    public function publicas(
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $dietas = $entityManager->getRepository(Dieta::class)
            ->findBy(['esPublica' => true], ['valoracionPromedio' => 'DESC']);

        return $this->json([
            'success' => true,
            'total' => count($dietas),
            'dietas' => array_map(function($dieta) {
                return $this->serializeDieta($dieta);
            }, $dietas)
        ]);
    }

    // ============================================
    // OBTENER DIETA CON COMIDAS ORGANIZADAS
    // ============================================
     #[Route('/dietas/{id}/plan-diario', name: 'dieta_plan_diario', methods: ['GET'])]
    public function planDiario(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $dieta = $entityManager->getRepository(Dieta::class)->find($id);
        
        if (!$dieta) {
            return $this->json([
                'success' => false,
                'error' => 'Dieta no encontrada'
            ], Response::HTTP_NOT_FOUND);
        }

        // Obtener platos de la dieta agrupados por momento del día
        $connection = $entityManager->getConnection();
        
        // SQL modificado para obtener platos en lugar de alimentos individuales
        $sql = 'SELECT 
                    da.id as dieta_alimento_id,
                    da.tipo_comida,
                    da.plato_id,
                    p.nombre as plato_nombre,
                    p.descripcion as plato_descripcion,
                    p.instrucciones as plato_instrucciones,
                    p.imagen_url as plato_imagen,
                    p.tiempo_preparacion,
                    p.dificultad,
                    p.valoracion_promedio as plato_valoracion,
                    p.total_valoraciones as plato_total_valoraciones
                FROM dieta_alimentos da
                LEFT JOIN platos p ON da.plato_id = p.id
                WHERE da.dieta_id = :dietaId
                AND da.plato_id IS NOT NULL
                ORDER BY 
                    FIELD(da.tipo_comida, "desayuno", "media_manana", "almuerzo", "merienda", "cena", "post_entreno"),
                    da.orden ASC';
        
        $stmt = $connection->prepare($sql);
        $result = $stmt->executeQuery(['dietaId' => $id]);
        $dietaPlatos = $result->fetchAllAssociative();

        // Agrupar por momento del día
        $planDiario = [
            'desayuno' => [],
            'media_mañana' => [],
            'comida' => [],
            'merienda' => [],
            'cena' => []
        ];

        $totalesDia = [
            'calorias' => 0,
            'proteinas' => 0,
            'carbohidratos' => 0,
            'grasas' => 0
        ];

        // Mapear tipo_comida
        $mapeoComidas = [
            'desayuno' => 'desayuno',
            'media_manana' => 'media_mañana',
            'almuerzo' => 'comida',
            'merienda' => 'merienda',
            'cena' => 'cena',
            'post_entreno' => 'post_entreno'
        ];

        // Procesar cada plato
        foreach ($dietaPlatos as $dp) {
            $platoId = $dp['plato_id'];
            
            // Obtener ingredientes del plato
            $sqlIngredientes = 'SELECT 
                    pa.cantidad_gramos,
                    a.id as alimento_id,
                    a.nombre as alimento_nombre,
                    a.calorias,
                    a.proteinas,
                    a.carbohidratos,
                    a.grasas
                FROM plato_alimentos pa
                JOIN alimentos a ON pa.alimento_id = a.id
                WHERE pa.plato_id = :platoId
                ORDER BY pa.orden ASC';
            
            $stmtIng = $connection->prepare($sqlIngredientes);
            $resultIng = $stmtIng->executeQuery(['platoId' => $platoId]);
            $ingredientes = $resultIng->fetchAllAssociative();

            // Calcular totales del plato
            $platoTotales = [
                'calorias' => 0,
                'proteinas' => 0,
                'carbohidratos' => 0,
                'grasas' => 0
            ];

            $ingredientesFormateados = [];
            foreach ($ingredientes as $ing) {
                $cantidad = (float)$ing['cantidad_gramos'];
                
                $caloriasIng = round(((float)$ing['calorias'] * $cantidad) / 100, 2);
                $proteinasIng = round(((float)$ing['proteinas'] * $cantidad) / 100, 2);
                $carbohidratosIng = round(((float)$ing['carbohidratos'] * $cantidad) / 100, 2);
                $grasasIng = round(((float)$ing['grasas'] * $cantidad) / 100, 2);

                $ingredientesFormateados[] = [
                    'id' => $ing['alimento_id'],
                    'nombre' => $ing['alimento_nombre'],
                    'cantidad' => $cantidad,
                    'calorias' => $caloriasIng,
                    'proteinas' => $proteinasIng,
                    'carbohidratos' => $carbohidratosIng,
                    'grasas' => $grasasIng
                ];

                $platoTotales['calorias'] += $caloriasIng;
                $platoTotales['proteinas'] += $proteinasIng;
                $platoTotales['carbohidratos'] += $carbohidratosIng;
                $platoTotales['grasas'] += $grasasIng;
            }

            // Formatear plato completo
            $platoData = [
                'id' => $platoId,
                'nombre' => $dp['plato_nombre'],
                'descripcion' => $dp['plato_descripcion'],
                'instrucciones' => $dp['plato_instrucciones'],
                'imagen_url' => $dp['plato_imagen'],
                'tiempo_preparacion' => $dp['tiempo_preparacion'],
                'dificultad' => $dp['dificultad'],
                'valoracion_promedio' => (float)$dp['plato_valoracion'],
                'total_valoraciones' => (int)$dp['plato_total_valoraciones'],
                'ingredientes' => $ingredientesFormateados,
                'totales' => [
                    'calorias' => round($platoTotales['calorias'], 2),
                    'proteinas' => round($platoTotales['proteinas'], 2),
                    'carbohidratos' => round($platoTotales['carbohidratos'], 2),
                    'grasas' => round($platoTotales['grasas'], 2)
                ]
            ];

            // Añadir al momento correspondiente
            $tipoComida = $dp['tipo_comida'];
            $momento = $mapeoComidas[$tipoComida] ?? 'comida';
            
            if (isset($planDiario[$momento])) {
                $planDiario[$momento][] = $platoData;
            }

            // Sumar a totales del día
            $totalesDia['calorias'] += $platoTotales['calorias'];
            $totalesDia['proteinas'] += $platoTotales['proteinas'];
            $totalesDia['carbohidratos'] += $platoTotales['carbohidratos'];
            $totalesDia['grasas'] += $platoTotales['grasas'];
        }

        return $this->json([
            'success' => true,
            'dieta' => [
                'id' => $dieta->getId(),
                'nombre' => $dieta->getNombre(),
                'descripcion' => $dieta->getDescripcion()
            ],
            'planDiario' => $planDiario,
            'totales' => [
                'calorias' => round($totalesDia['calorias'], 2),
                'proteinas' => round($totalesDia['proteinas'], 2),
                'carbohidratos' => round($totalesDia['carbohidratos'], 2),
                'grasas' => round($totalesDia['grasas'], 2)
            ]
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

        $factores = [
            'sedentario' => 1.2,
            'ligero' => 1.375,
            'moderado' => 1.55,
            'activo' => 1.725,
            'muy_activo' => 1.9
        ];
        
        $factor = $factores[$actividad] ?? 1.2;
        $caloriasMantenimiento = $tmb * $factor;

        $ajustes = [
            'perder_peso' => -500,
            'ganar_masa' => 500,
            'mantener' => 0,
            'tonificar' => -200
        ];
        
        $ajuste = $ajustes[$objetivo] ?? 0;
        $caloriasObjetivo = $caloriasMantenimiento + $ajuste;

        $proteinas = round(($caloriasObjetivo * 0.30) / 4);
        $carbohidratos = round(($caloriasObjetivo * 0.40) / 4);
        $grasas = round(($caloriasObjetivo * 0.30) / 9);

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