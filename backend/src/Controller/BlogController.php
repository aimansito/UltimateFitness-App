<?php

namespace App\Controller;

use App\Entity\BlogPost;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/blog', name: 'api_blog_')]
class BlogController extends AbstractController
{
    /**
     * GET /api/blog/posts/public-preview
     * Preview de 2 posts aleatorios para usuarios no autenticados
     */
    #[Route('/posts/public-preview', name: 'public_preview', methods: ['GET'])]
    public function publicPreview(EntityManagerInterface $em): JsonResponse
    {
        // Obtener 2 posts gratuitos aleatorios
        $qb = $em->getRepository(BlogPost::class)
            ->createQueryBuilder('bp')
            ->where('bp.fechaPublicacion IS NOT NULL')
            ->andWhere('bp.fechaPublicacion <= :now')
            ->andWhere('bp.esPremium = 0')
            ->setParameter('now', new \DateTime())
            ->orderBy('RAND()')
            ->setMaxResults(2);

        $posts = $qb->getQuery()->getResult();

        return $this->json([
            'success' => true,
            'posts' => array_map(fn($post) => $this->serializePost($post, false), $posts),
            'total' => count($posts)
        ]);
    }

    /**
     * GET /api/blog/posts
     * Lista posts según el usuario (premium o free) con paginación
     */
    #[Route('/posts', name: 'list', methods: ['GET'])]
    public function listarPosts(
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        // Obtener usuario actual (puede ser null si no está logueado)
        $user = $this->getUser();
        $esPremium = $user && method_exists($user, 'isEsPremium') && $user->isEsPremium();

        // Parámetros de paginación
        $page = max(1, (int)$request->query->get('page', 1));
        $limit = min(50, max(1, (int)$request->query->get('limit', 12)));
        $offset = ($page - 1) * $limit;

        // Parámetros de filtro
        $categoria = $request->query->get('categoria');
        $destacados = $request->query->get('destacados', false);

        // Query base
        $qb = $em->getRepository(BlogPost::class)
            ->createQueryBuilder('bp')
            ->where('bp.fechaPublicacion IS NOT NULL')
            ->andWhere('bp.fechaPublicacion <= :now')
            ->setParameter('now', new \DateTime());

        // 🔒 FILTRO PREMIUM: Clave de la solución
        if (!$esPremium) {
            // Si NO es premium, solo mostrar posts gratuitos
            $qb->andWhere('bp.esPremium = 0');
        }
        // Si ES premium, mostrar TODOS (gratuitos + premium)

        // Filtros adicionales
        if ($categoria) {
            $qb->andWhere('bp.categoria = :categoria')
               ->setParameter('categoria', $categoria);
        }

        if ($destacados) {
            $qb->andWhere('bp.destacado = 1');
        }

        // Contar total antes de paginar
        $countQb = clone $qb;
        $total = $countQb->select('COUNT(bp.id)')->getQuery()->getSingleScalarResult();

        // Aplicar paginación
        $posts = $qb->orderBy('bp.fechaPublicacion', 'DESC')
                    ->setFirstResult($offset)
                    ->setMaxResults($limit)
                    ->getQuery()
                    ->getResult();

        return $this->json([
            'success' => true,
            'posts' => array_map(fn($post) => $this->serializePost($post, $esPremium), $posts),
            'usuario_premium' => $esPremium,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => (int)$total,
                'total_pages' => ceil($total / $limit)
            ]
        ]);
    }

    /**
     * GET /api/blog/posts/premium
     * Lista solo posts premium con paginación
     */
    #[Route('/posts/premium', name: 'premium_list', methods: ['GET'])]
    public function listarPostsPremium(
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        // Verificar que el usuario sea premium
        $user = $this->getUser();
        $esPremium = $user && method_exists($user, 'isEsPremium') && $user->isEsPremium();

        if (!$esPremium) {
            return $this->json([
                'success' => false,
                'error' => 'Acceso denegado. Se requiere suscripción Premium.'
            ], 403);
        }

        // Parámetros de paginación
        $page = max(1, (int)$request->query->get('page', 1));
        $limit = min(50, max(1, (int)$request->query->get('limit', 12)));
        $offset = ($page - 1) * $limit;

        // Query para posts premium
        $qb = $em->getRepository(BlogPost::class)
            ->createQueryBuilder('bp')
            ->where('bp.fechaPublicacion IS NOT NULL')
            ->andWhere('bp.fechaPublicacion <= :now')
            ->andWhere('bp.esPremium = 1')
            ->setParameter('now', new \DateTime());

        // Contar total
        $countQb = clone $qb;
        $total = $countQb->select('COUNT(bp.id)')->getQuery()->getSingleScalarResult();

        // Aplicar paginación
        $posts = $qb->orderBy('bp.fechaPublicacion', 'DESC')
                    ->setFirstResult($offset)
                    ->setMaxResults($limit)
                    ->getQuery()
                    ->getResult();

        return $this->json([
            'success' => true,
            'posts' => array_map(fn($post) => $this->serializePost($post, true), $posts),
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => (int)$total,
                'total_pages' => ceil($total / $limit)
            ]
        ]);
    }

    /**
     * GET /api/blog/search
     * Búsqueda de posts por término
     */
    #[Route('/search', name: 'search', methods: ['GET'])]
    public function buscarPosts(
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        $user = $this->getUser();
        $esPremium = $user && method_exists($user, 'isEsPremium') && $user->isEsPremium();

        // Parámetros
        $searchTerm = $request->query->get('q', '');
        $page = max(1, (int)$request->query->get('page', 1));
        $limit = min(50, max(1, (int)$request->query->get('limit', 12)));
        $offset = ($page - 1) * $limit;

        if (empty($searchTerm)) {
            return $this->json([
                'success' => false,
                'error' => 'Se requiere un término de búsqueda'
            ], 400);
        }

        // Query base con búsqueda
        $qb = $em->getRepository(BlogPost::class)
            ->createQueryBuilder('bp')
            ->where('bp.fechaPublicacion IS NOT NULL')
            ->andWhere('bp.fechaPublicacion <= :now')
            ->andWhere('(bp.titulo LIKE :search OR bp.extracto LIKE :search OR bp.contenido LIKE :search)')
            ->setParameter('now', new \DateTime())
            ->setParameter('search', '%' . $searchTerm . '%');

        // Filtro premium
        if (!$esPremium) {
            $qb->andWhere('bp.esPremium = 0');
        }

        // Contar total
        $countQb = clone $qb;
        $total = $countQb->select('COUNT(bp.id)')->getQuery()->getSingleScalarResult();

        // Aplicar paginación
        $posts = $qb->orderBy('bp.fechaPublicacion', 'DESC')
                    ->setFirstResult($offset)
                    ->setMaxResults($limit)
                    ->getQuery()
                    ->getResult();

        return $this->json([
            'success' => true,
            'posts' => array_map(fn($post) => $this->serializePost($post, $esPremium), $posts),
            'search_term' => $searchTerm,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => (int)$total,
                'total_pages' => ceil($total / $limit)
            ]
        ]);
    }

    /**
     * GET /api/blog/posts/categoria/{categoria}
     * Lista posts por categoría con paginación
     */
    #[Route('/posts/categoria/{categoria}', name: 'by_category', methods: ['GET'])]
    public function listarPorCategoria(
        string $categoria,
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        $user = $this->getUser();
        $esPremium = $user && method_exists($user, 'isEsPremium') && $user->isEsPremium();

        // Parámetros de paginación
        $page = max(1, (int)$request->query->get('page', 1));
        $limit = min(50, max(1, (int)$request->query->get('limit', 12)));
        $offset = ($page - 1) * $limit;

        // Query base
        $qb = $em->getRepository(BlogPost::class)
            ->createQueryBuilder('bp')
            ->where('bp.fechaPublicacion IS NOT NULL')
            ->andWhere('bp.fechaPublicacion <= :now')
            ->andWhere('bp.categoria = :categoria')
            ->setParameter('now', new \DateTime())
            ->setParameter('categoria', $categoria);

        // Filtro premium
        if (!$esPremium) {
            $qb->andWhere('bp.esPremium = 0');
        }

        // Contar total
        $countQb = clone $qb;
        $total = $countQb->select('COUNT(bp.id)')->getQuery()->getSingleScalarResult();

        // Aplicar paginación
        $posts = $qb->orderBy('bp.fechaPublicacion', 'DESC')
                    ->setFirstResult($offset)
                    ->setMaxResults($limit)
                    ->getQuery()
                    ->getResult();

        return $this->json([
            'success' => true,
            'posts' => array_map(fn($post) => $this->serializePost($post, $esPremium), $posts),
            'categoria' => $categoria,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => (int)$total,
                'total_pages' => ceil($total / $limit)
            ]
        ]);
    }
    
    /**
     * GET /api/blog/posts/{slug}
     * Detalle de un post con control de acceso
     */
    #[Route('/posts/{slug}', name: 'detail', methods: ['GET'])]
    public function detallePost(
        string $slug,
        EntityManagerInterface $em
    ): JsonResponse {
        $post = $em->getRepository(BlogPost::class)
                   ->findOneBy(['slug' => $slug]);
        
        if (!$post) {
            return $this->json(['success' => false, 'error' => 'Post no encontrado'], 404);
        }
        
        $user = $this->getUser();
        $esPremium = $user && method_exists($user, 'isEsPremium') && $user->isEsPremium();
        
        // 🔒 CONTROL DE ACCESO
        if ($post->isEsPremium() && !$esPremium) {
            return $this->json([
                'success' => false,
                'error' => 'Este contenido es exclusivo para usuarios Premium',
                'requiere_premium' => true,
                'post_preview' => [
                    'titulo' => $post->getTitulo(),
                    'extracto' => $post->getExtracto(),
                    'imagen_portada' => $post->getImagenPortada(),
                    'categoria' => $post->getCategoria()
                ]
            ], 403);
        }
        
        return $this->json([
            'success' => true,
            'post' => $this->serializePost($post, $esPremium, true)
        ]);
    }
    
    /**
     * GET /api/blog/categorias
     * Lista las categorías disponibles
     */
    #[Route('/categorias', name: 'categories', methods: ['GET'])]
    public function listarCategorias(): JsonResponse
    {
        return $this->json([
            'success' => true,
            'categorias' => [
                ['key' => 'noticias', 'nombre' => 'Noticias'],
                ['key' => 'nutricion', 'nombre' => 'Nutrición'],
                ['key' => 'entrenamiento', 'nombre' => 'Entrenamiento'],
                ['key' => 'salud', 'nombre' => 'Salud'],
                ['key' => 'motivacion', 'nombre' => 'Motivación'],
                ['key' => 'recetas', 'nombre' => 'Recetas']
            ]
        ]);
    }
    
    private function serializePost(BlogPost $post, bool $usuarioPremium, bool $incluirContenido = false): array
    {
        $data = [
            'id' => $post->getId(),
            'titulo' => $post->getTitulo(),
            'slug' => $post->getSlug(),
            'extracto' => $post->getExtracto(),
            'imagen_portada' => $post->getImagenPortada(),
            'categoria' => $post->getCategoria(),
            'categoria_formateada' => $post->getCategoriaFormateada(),
            'es_premium' => $post->isEsPremium(),
            'destacado' => $post->isDestacado(),
            'fecha_publicacion' => $post->getFechaPublicacion()?->format('Y-m-d H:i:s'),
            'puede_acceder' => !$post->isEsPremium() || $usuarioPremium
        ];
        
        // Solo incluir contenido completo si tiene acceso
        if ($incluirContenido && (!$post->isEsPremium() || $usuarioPremium)) {
            $data['contenido'] = $post->getContenido();
        }
        
        return $data;
    }
}
