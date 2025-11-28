<?php

namespace App\Controller;

use App\Entity\Plato;
use App\Entity\PlatoAlimento;
use App\Entity\Alimento;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Controlador para gestionar el catálogo de platos/recetas
 * 
 * Este controlador maneja todas las operaciones CRUD de platos,
 * incluyendo la gestión de ingredientes y el cálculo automático
 * de valores nutricionales.
 */
#[Route('/api/platos')]
class PlatoController extends AbstractController
{
    // ============================================
    // LISTAR PLATOS PÚBLICOS
    // ============================================
    #[Route('', name: 'platos_listar', methods: ['GET'])]
    public function listar(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $tipo = $request->query->get('tipo'); // Filtrar por tipo_comida
        $dificultad = $request->query->get('dificultad');
        $limite = $request->query->get('limit', 50);

        $queryBuilder = $entityManager->getRepository(Plato::class)
            ->createQueryBuilder('p')
            ->where('p.esPublico = true');

        if ($tipo) {
            $queryBuilder->andWhere('p.tipoComida = :tipo')
                ->setParameter('tipo', $tipo);
        }

        if ($dificultad) {
            $queryBuilder->andWhere('p.dificultad = :dificultad')
                ->setParameter('dificultad', $dificultad);
        }

        $platos = $queryBuilder
            ->orderBy('p.valoracionPromedio', 'DESC')
            ->setMaxResults($limite)
            ->getQuery()
            ->getResult();

        return $this->json([
            'success' => true,
            'total' => count($platos),
            'platos' => array_map(function($plato) {
                return $this->serializePlato($plato, false); // false = sin ingredientes
            }, $platos)
        ]);
    }

    // ============================================
    // OBTENER DETALLE DE UN PLATO
    // ============================================
    #[Route('/{id}', name: 'platos_detalle', methods: ['GET'])]
    public function detalle(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $plato = $entityManager->getRepository(Plato::class)->find($id);

        if (!$plato) {
            return $this->json([
                'success' => false,
                'error' => 'Plato no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'success' => true,
            'plato' => $this->serializePlato($plato, true) // true = con ingredientes
        ]);
    }

    // ============================================
    // CREAR NUEVO PLATO
    // ============================================
    #[Route('', name: 'platos_crear', methods: ['POST'])]
public function crear(
    Request $request,
    EntityManagerInterface $entityManager
): JsonResponse {
    $data = json_decode($request->getContent(), true);

    if (!isset($data['nombre'])) {
        return $this->json([
            'success' => false,
            'error' => 'El nombre es obligatorio'
        ], Response::HTTP_BAD_REQUEST);
    }

    if (!isset($data['ingredientes']) || empty($data['ingredientes'])) {
        return $this->json([
            'success' => false,
            'error' => 'Debes añadir al menos un ingrediente'
        ], Response::HTTP_BAD_REQUEST);
    }

    $plato = new Plato();
    $plato->setNombre($data['nombre']);
    $plato->setDescripcion($data['descripcion'] ?? 'Plato personalizado');
    $plato->setInstrucciones($data['instrucciones'] ?? null);
    $plato->setImagenUrl($data['imagen_url'] ?? null);
    $plato->setTipoComida($data['tipo_comida'] ?? 'almuerzo');
    $plato->setTiempoPreparacion($data['tiempo_preparacion'] ?? null);
    $plato->setDificultad($data['dificultad'] ?? 'media');
    $plato->setEsPublico($data['es_publico'] ?? true);
    $plato->setCreadorId($data['creador_id'] ?? null);

    // Persistir el plato primero
    $entityManager->persist($plato);
    $entityManager->flush();

    // Añadir ingredientes
    foreach ($data['ingredientes'] as $index => $ingredienteData) {
        if (!isset($ingredienteData['alimento_id']) || !isset($ingredienteData['cantidad_gramos'])) {
            continue;
        }

        $alimento = $entityManager->getRepository(Alimento::class)
            ->find($ingredienteData['alimento_id']);

        if (!$alimento) {
            continue;
        }

        $platoAlimento = new PlatoAlimento();
        $platoAlimento->setPlato($plato);
        $platoAlimento->setAlimento($alimento);
        $platoAlimento->setCantidadGramos($ingredienteData['cantidad_gramos']);
        $platoAlimento->setOrden($index + 1);

        $entityManager->persist($platoAlimento);
        $plato->addIngrediente($platoAlimento);
    }

    // Calcular valores nutricionales
    $plato->calcularValoresNutricionales();
    
    $entityManager->flush();

    return $this->json([
        'success' => true,
        'message' => 'Plato creado exitosamente',
        'plato' => $this->serializePlato($plato, true)
    ], Response::HTTP_CREATED);
}

    // ============================================
    // ACTUALIZAR PLATO
    // ============================================
    #[Route('/{id}', name: 'platos_actualizar', methods: ['PUT', 'PATCH'])]
    public function actualizar(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $plato = $entityManager->getRepository(Plato::class)->find($id);

        if (!$plato) {
            return $this->json([
                'success' => false,
                'error' => 'Plato no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['nombre'])) $plato->setNombre($data['nombre']);
        if (isset($data['descripcion'])) $plato->setDescripcion($data['descripcion']);
        if (isset($data['instrucciones'])) $plato->setInstrucciones($data['instrucciones']);
        if (isset($data['imagen_url'])) $plato->setImagenUrl($data['imagen_url']);
        if (isset($data['tipo_comida'])) $plato->setTipoComida($data['tipo_comida']);
        if (isset($data['tiempo_preparacion'])) $plato->setTiempoPreparacion($data['tiempo_preparacion']);
        if (isset($data['dificultad'])) $plato->setDificultad($data['dificultad']);
        if (isset($data['es_publico'])) $plato->setEsPublico($data['es_publico']);

        // Actualizar ingredientes si vienen en el request
        if (isset($data['ingredientes'])) {
            // Eliminar ingredientes actuales
            foreach ($plato->getIngredientes() as $ingrediente) {
                $entityManager->remove($ingrediente);
            }

            // Añadir nuevos ingredientes
            foreach ($data['ingredientes'] as $index => $ingredienteData) {
                if (!isset($ingredienteData['alimento_id']) || !isset($ingredienteData['cantidad_gramos'])) {
                    continue;
                }

                $alimento = $entityManager->getRepository(Alimento::class)
                    ->find($ingredienteData['alimento_id']);

                if (!$alimento) {
                    continue;
                }

                $platoAlimento = new PlatoAlimento();
                $platoAlimento->setAlimento($alimento);
                $platoAlimento->setCantidadGramos($ingredienteData['cantidad_gramos']);
                $platoAlimento->setOrden($index + 1);

                $plato->addIngrediente($platoAlimento);
            }

            // Recalcular valores nutricionales
            $plato->calcularValoresNutricionales();
        }

        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => 'Plato actualizado exitosamente',
            'plato' => $this->serializePlato($plato, true)
        ]);
    }

    // ============================================
    // ELIMINAR PLATO
    // ============================================
    #[Route('/{id}', name: 'platos_eliminar', methods: ['DELETE'])]
    public function eliminar(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $plato = $entityManager->getRepository(Plato::class)->find($id);

        if (!$plato) {
            return $this->json([
                'success' => false,
                'error' => 'Plato no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        $entityManager->remove($plato);
        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => 'Plato eliminado exitosamente'
        ]);
    }

    // ============================================
    // BUSCAR PLATOS
    // ============================================
    #[Route('/buscar', name: 'platos_buscar', methods: ['GET'])]
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

        $platos = $entityManager->getRepository(Plato::class)
            ->createQueryBuilder('p')
            ->where('p.esPublico = true')
            ->andWhere('p.nombre LIKE :query OR p.descripcion LIKE :query')
            ->setParameter('query', '%' . $query . '%')
            ->orderBy('p.valoracionPromedio', 'DESC')
            ->setMaxResults(20)
            ->getQuery()
            ->getResult();

        return $this->json([
            'success' => true,
            'total' => count($platos),
            'platos' => array_map(function($plato) {
                return $this->serializePlato($plato, false);
            }, $platos)
        ]);
    }

    // ============================================
    // VALORAR PLATO
    // ============================================
    #[Route('/{id}/valorar', name: 'platos_valorar', methods: ['POST'])]
    public function valorar(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $plato = $entityManager->getRepository(Plato::class)->find($id);

        if (!$plato) {
            return $this->json([
                'success' => false,
                'error' => 'Plato no encontrado'
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

        $totalValoraciones = $plato->getTotalValoraciones();
        $valoracionActual = (float)$plato->getValoracionPromedio();

        $nuevoTotal = $totalValoraciones + 1;
        $nuevoPromedio = (($valoracionActual * $totalValoraciones) + $puntuacion) / $nuevoTotal;

        $plato->setValoracionPromedio(number_format($nuevoPromedio, 2, '.', ''));
        $plato->setTotalValoraciones($nuevoTotal);

        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => 'Valoración registrada',
            'plato' => $this->serializePlato($plato, false)
        ]);
    }

    // ============================================
    // HELPER: SERIALIZAR PLATO
    // ============================================
    private function serializePlato(Plato $plato, bool $incluirIngredientes = false): array
    {
        $data = [
            'id' => $plato->getId(),
            'nombre' => $plato->getNombre(),
            'descripcion' => $plato->getDescripcion(),
            'instrucciones' => $plato->getInstrucciones(),
            'imagen_url' => $plato->getImagenUrl(),
            'tipo_comida' => $plato->getTipoComida(),
            'tiempo_preparacion' => $plato->getTiempoPreparacion(),
            'dificultad' => $plato->getDificultad(),
            'calorias_totales' => (float)$plato->getCaloriasTotales(),
            'proteinas_totales' => (float)$plato->getProteinasTotales(),
            'carbohidratos_totales' => (float)$plato->getCarbohidratosTotales(),
            'grasas_totales' => (float)$plato->getGrasasTotales(),
            'es_publico' => $plato->isEsPublico(),
            'valoracion_promedio' => (float)$plato->getValoracionPromedio(),
            'total_valoraciones' => $plato->getTotalValoraciones(),
            'fecha_creacion' => $plato->getFechaCreacion()?->format('Y-m-d H:i:s')
        ];

        if ($incluirIngredientes) {
            $data['ingredientes'] = [];
            foreach ($plato->getIngredientes() as $ingrediente) {
                $alimento = $ingrediente->getAlimento();
                $data['ingredientes'][] = [
                    'id' => $ingrediente->getId(),
                    'alimento' => [
                        'id' => $alimento->getId(),
                        'nombre' => $alimento->getNombre(),
                        'tipo_alimento' => $alimento->getTipoAlimento()
                    ],
                    'cantidad_gramos' => (float)$ingrediente->getCantidadGramos(),
                    'calorias' => round($ingrediente->getCalorias(), 2),
                    'proteinas' => round($ingrediente->getProteinas(), 2),
                    'carbohidratos' => round($ingrediente->getCarbohidratos(), 2),
                    'grasas' => round($ingrediente->getGrasas(), 2),
                    'orden' => $ingrediente->getOrden()
                ];
            }
        }

        return $data;
    }
}