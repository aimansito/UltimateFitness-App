<?php

namespace App\Controller;

use App\Entity\Ejercicio;
use App\Entity\Entrenador;
use App\Entity\Usuario;
use Doctrine\DBAL\Exception\ForeignKeyConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\QueryBuilder;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Biblioteca de ejercicios. Los ejercicios del catálogo (sin creador) los ve todo el mundo;
 * los que crea un usuario solo los ve él.
 */
#[Route('/api/custom')]
class EjercicioController extends AbstractController
{
    public const GRUPOS = ['pecho', 'espalda', 'piernas', 'hombros', 'biceps', 'triceps', 'core', 'gluteos', 'brazos', 'cardio', 'fullbody'];
    private const TIPOS = ['fuerza', 'compuesto', 'aislamiento', 'cardio', 'core', 'workout'];
    private const NIVELES = ['principiante', 'intermedio', 'avanzado'];
    private const MAX_PROPIOS = 100;

    public function __construct(private EntityManagerInterface $em)
    {
    }

    // ============================================
    // LISTAR (catálogo + los míos)
    // ============================================
    #[Route('/ejercicios', name: 'ejercicios_listar_todos', methods: ['GET'])]
    public function listarTodos(Request $request): JsonResponse
    {
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = (int) $request->query->get('limit', 20);
        $limit = $limit > 0 && $limit <= 300 ? $limit : 20;

        $qb = $this->visibles()->orderBy('e.nombre', 'ASC');
        $total = (int) (clone $qb)->select('COUNT(e.id)')->getQuery()->getSingleScalarResult();
        $ejercicios = $qb->setFirstResult(($page - 1) * $limit)->setMaxResults($limit)->getQuery()->getResult();

        return $this->json([
            'success' => true,
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'total_pages' => (int) ceil($total / $limit),
            'ejercicios' => $this->serializarLista($ejercicios),
        ]);
    }

    // ============================================
    // FAVORITOS DEL USUARIO
    // ============================================
    #[Route('/ejercicios/favoritos', name: 'ejercicios_favoritos', methods: ['GET'])]
    public function favoritos(): JsonResponse
    {
        $ids = $this->idsGuardados();
        if ($ids === []) {
            return $this->json(['success' => true, 'total' => 0, 'ejercicios' => []]);
        }
        $ejercicios = $this->visibles()
            ->andWhere('e.id IN (:ids)')->setParameter('ids', $ids)
            ->orderBy('e.nombre', 'ASC')
            ->getQuery()->getResult();

        return $this->json([
            'success' => true,
            'total' => \count($ejercicios),
            'ejercicios' => $this->serializarLista($ejercicios, $ids),
        ]);
    }

    // ============================================
    // BUSCAR POR TEXTO
    // ============================================
    #[Route('/ejercicios/buscar', name: 'ejercicios_buscar', methods: ['GET'])]
    public function buscar(Request $request): JsonResponse
    {
        $query = trim((string) $request->query->get('q', ''));
        if (mb_strlen($query) < 2) {
            return $this->json(['success' => false, 'error' => 'La búsqueda debe tener al menos 2 caracteres'], Response::HTTP_BAD_REQUEST);
        }

        $ejercicios = $this->visibles()
            ->andWhere('e.nombre LIKE :q OR e.descripcion LIKE :q')
            ->setParameter('q', '%' . $query . '%')
            ->orderBy('e.valoracionPromedio', 'DESC')
            ->setMaxResults(20)
            ->getQuery()->getResult();

        return $this->json(['success' => true, 'total' => \count($ejercicios), 'ejercicios' => $this->serializarLista($ejercicios)]);
    }

    // ============================================
    // FILTRAR POR GRUPO MUSCULAR
    // ============================================
    #[Route('/ejercicios/por-musculo', name: 'ejercicios_por_musculo', methods: ['GET'])]
    public function porMusculo(Request $request): JsonResponse
    {
        $musculo = $request->query->get('musculo');
        if (!$musculo) {
            return $this->json(['success' => false, 'error' => 'Parámetro "musculo" requerido'], Response::HTTP_BAD_REQUEST);
        }

        $ejercicios = $this->visibles()
            ->andWhere('e.grupoMuscular = :m')->setParameter('m', $musculo)
            ->orderBy('e.valoracionPromedio', 'DESC')
            ->getQuery()->getResult();

        return $this->json(['success' => true, 'musculo' => $musculo, 'total' => \count($ejercicios), 'ejercicios' => $this->serializarLista($ejercicios)]);
    }

    // ============================================
    // POPULARES
    // ============================================
    #[Route('/ejercicios/populares', name: 'ejercicios_populares', methods: ['GET'])]
    public function populares(Request $request): JsonResponse
    {
        $limit = min(50, max(1, (int) $request->query->get('limit', 10)));
        $ejercicios = $this->visibles()
            ->andWhere('e.totalValoraciones > 0')
            ->orderBy('e.valoracionPromedio', 'DESC')->addOrderBy('e.totalValoraciones', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()->getResult();

        return $this->json(['success' => true, 'total' => \count($ejercicios), 'ejercicios' => $this->serializarLista($ejercicios)]);
    }

    // ============================================
    // FILTRAR POR DIFICULTAD
    // ============================================
    #[Route('/ejercicios/por-dificultad', name: 'ejercicios_por_dificultad', methods: ['GET'])]
    public function porDificultad(Request $request): JsonResponse
    {
        $nivel = $request->query->get('nivel');
        if (!$nivel) {
            return $this->json(['success' => false, 'error' => 'Parámetro "nivel" requerido (principiante, intermedio, avanzado)'], Response::HTTP_BAD_REQUEST);
        }

        $ejercicios = $this->visibles()
            ->andWhere('e.nivelDificultad = :n')->setParameter('n', $nivel)
            ->orderBy('e.nombre', 'ASC')
            ->getQuery()->getResult();

        return $this->json(['success' => true, 'nivel' => $nivel, 'total' => \count($ejercicios), 'ejercicios' => $this->serializarLista($ejercicios)]);
    }

    // ============================================
    // CREAR EJERCICIO PROPIO
    // ============================================
    #[Route('/ejercicios', name: 'ejercicios_crear', methods: ['POST'])]
    public function crear(Request $request): JsonResponse
    {
        $usuario = $this->getUser();
        if (!$usuario instanceof Usuario) {
            return $this->json(['success' => false, 'error' => 'Solo los usuarios pueden crear ejercicios propios'], Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true) ?: [];
        $nombre = trim((string) ($data['nombre'] ?? ''));
        $grupo = mb_strtolower(trim((string) ($data['grupoMuscular'] ?? '')));
        $tipo = mb_strtolower(trim((string) ($data['tipo'] ?? 'fuerza')));
        $nivel = mb_strtolower(trim((string) ($data['nivelDificultad'] ?? 'intermedio')));
        $descripcion = trim((string) ($data['descripcion'] ?? ''));

        if (mb_strlen($nombre) < 3 || mb_strlen($nombre) > 150) {
            return $this->json(['success' => false, 'error' => 'El nombre debe tener entre 3 y 150 caracteres'], Response::HTTP_BAD_REQUEST);
        }
        if (!\in_array($grupo, self::GRUPOS, true)) {
            return $this->json(['success' => false, 'error' => 'Grupo muscular no válido'], Response::HTTP_BAD_REQUEST);
        }
        if (!\in_array($tipo, self::TIPOS, true) || !\in_array($nivel, self::NIVELES, true)) {
            return $this->json(['success' => false, 'error' => 'Tipo o nivel no válido'], Response::HTTP_BAD_REQUEST);
        }
        if (mb_strlen($descripcion) > 1000) {
            return $this->json(['success' => false, 'error' => 'La descripción es demasiado larga (máximo 1000 caracteres)'], Response::HTTP_BAD_REQUEST);
        }

        $repo = $this->em->getRepository(Ejercicio::class);
        if ($repo->count(['creadorUsuario' => $usuario]) >= self::MAX_PROPIOS) {
            return $this->json(['success' => false, 'error' => 'Has llegado al máximo de ejercicios propios'], Response::HTTP_BAD_REQUEST);
        }
        if ($repo->findOneBy(['creadorUsuario' => $usuario, 'nombre' => $nombre])) {
            return $this->json(['success' => false, 'error' => 'Ya tienes un ejercicio con ese nombre'], Response::HTTP_CONFLICT);
        }

        $ejercicio = (new Ejercicio())
            ->setNombre($nombre)
            ->setGrupoMuscular($grupo)
            ->setTipo($tipo)
            ->setNivelDificultad($nivel)
            ->setDescripcion($descripcion !== '' ? $descripcion : null)
            ->setCreadorUsuario($usuario);

        $this->em->persist($ejercicio);
        $this->em->flush();

        return $this->json(['success' => true, 'ejercicio' => $this->serializar($ejercicio, false, true)], Response::HTTP_CREATED);
    }

    // ============================================
    // BORRAR EJERCICIO PROPIO
    // ============================================
    #[Route('/ejercicios/{id}', name: 'ejercicios_eliminar', requirements: ['id' => '\d+'], methods: ['DELETE'])]
    public function eliminar(int $id): JsonResponse
    {
        $usuario = $this->getUser();
        $ejercicio = $this->em->getRepository(Ejercicio::class)->find($id);
        if (!$usuario instanceof Usuario || !$ejercicio || $ejercicio->getCreadorUsuario()?->getId() !== $usuario->getId()) {
            return $this->json(['success' => false, 'error' => 'Ejercicio no encontrado'], Response::HTTP_NOT_FOUND);
        }

        try {
            $this->em->remove($ejercicio);
            $this->em->flush();
        } catch (ForeignKeyConstraintViolationException) {
            return $this->json(['success' => false, 'error' => 'Este ejercicio está en una rutina; quítalo de ella antes de borrarlo'], Response::HTTP_CONFLICT);
        }
        $this->em->getConnection()->executeStatement("DELETE FROM guardados WHERE item_tipo = 'ejercicio' AND item_id = ?", [$id]);

        return $this->json(['success' => true]);
    }

    // ============================================
    // VALORAR EJERCICIO
    // ============================================
    #[Route('/ejercicios/{id}/valorar', name: 'ejercicios_valorar', requirements: ['id' => '\d+'], methods: ['POST'])]
    public function valorar(int $id, Request $request): JsonResponse
    {
        if (!$this->getUser()) {
            return $this->json(['success' => false, 'error' => 'Debes iniciar sesión para valorar un ejercicio'], Response::HTTP_UNAUTHORIZED);
        }

        $ejercicio = $this->em->getRepository(Ejercicio::class)->find($id);
        if (!$ejercicio) {
            return $this->json(['success' => false, 'error' => 'Ejercicio no encontrado'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        $puntuacion = $data['puntuacion'] ?? null;
        if (!$puntuacion || $puntuacion < 1 || $puntuacion > 5) {
            return $this->json(['success' => false, 'error' => 'Puntuación debe estar entre 1 y 5'], Response::HTTP_BAD_REQUEST);
        }

        $total = $ejercicio->getTotalValoraciones();
        $nuevoTotal = $total + 1;
        $nuevoPromedio = (((float) $ejercicio->getValoracionPromedio() * $total) + $puntuacion) / $nuevoTotal;

        $ejercicio->setValoracionPromedio((string) round($nuevoPromedio, 2));
        $ejercicio->setTotalValoraciones($nuevoTotal);
        $this->em->flush();

        return $this->json(['success' => true, 'message' => 'Valoración registrada', 'ejercicio' => $this->serializar($ejercicio)]);
    }

    // ============================================
    // HELPERS
    // ============================================

    /** Catálogo (sin creador) más los ejercicios propios del usuario autenticado */
    private function visibles(): QueryBuilder
    {
        $qb = $this->em->getRepository(Ejercicio::class)->createQueryBuilder('e');
        $usuario = $this->getUser();
        if ($usuario instanceof Usuario) {
            $qb->where('e.creadorUsuario IS NULL OR e.creadorUsuario = :yo')->setParameter('yo', $usuario);
        } else {
            $qb->where('e.creadorUsuario IS NULL');
        }
        return $qb;
    }

    /** Ids de ejercicios guardados como favoritos por la cuenta autenticada */
    private function idsGuardados(): array
    {
        $usuario = $this->getUser();
        if (!$usuario instanceof Usuario && !$usuario instanceof Entrenador) {
            return [];
        }
        $ids = $this->em->getConnection()->fetchFirstColumn(
            "SELECT item_id FROM guardados WHERE propietario_tipo = ? AND propietario_id = ? AND item_tipo = 'ejercicio'",
            [$usuario instanceof Usuario ? 'usuario' : 'entrenador', $usuario->getId()]
        );
        return array_map('intval', $ids);
    }

    /** @param Ejercicio[] $ejercicios */
    private function serializarLista(array $ejercicios, ?array $guardados = null): array
    {
        $guardados ??= $this->idsGuardados();
        $usuario = $this->getUser();
        $miId = $usuario instanceof Usuario ? $usuario->getId() : null;

        return array_map(
            fn (Ejercicio $e) => $this->serializar(
                $e,
                \in_array($e->getId(), $guardados, true),
                $miId !== null && $e->getCreadorUsuario()?->getId() === $miId
            ),
            $ejercicios
        );
    }

    private function serializar(Ejercicio $ejercicio, bool $guardado = false, bool $esMio = false): array
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
            'videoUrl' => $ejercicio->getVideoUrl(),
            'imagenUrl' => $ejercicio->getImagenUrl(),
            'guardado' => $guardado,
            'esMio' => $esMio,
        ];
    }
}
