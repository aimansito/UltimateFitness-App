<?php

namespace App\Controller;

use App\Entity\BlogPost;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * PublicBlogController - Endpoints públicos para usuarios no autenticados
 */
#[Route('/api/public/blog', name: 'api_public_blog_')]
class PublicBlogController extends AbstractController
{
    /**
     * GET /api/public/blog/preview
     * Vista previa de posts para usuarios no autenticados
     */
    #[Route('/preview', name: 'preview', methods: ['GET'])]
    public function preview(EntityManagerInterface $em): JsonResponse
    {
        // Obtener posts gratuitos aleatorios
        $qb = $em->getRepository(BlogPost::class)
            ->createQueryBuilder('bp')
            ->where('bp.fechaPublicacion IS NOT NULL')
            ->andWhere('bp.fechaPublicacion <= :now')
            ->andWhere('bp.esPremium = 0')
            ->setParameter('now', new \DateTime())
            ->orderBy('RAND()')
            ->setMaxResults(6);

        $posts = $qb->getQuery()->getResult();

        return $this->json([
            'success' => true,
            'posts' => array_map(fn($post) => $this->serializePost($post), $posts),
            'total' => count($posts)
        ]);
    }

    /**
     * GET /api/public/blog/posts
     * Lista todos los posts gratuitos
     */
    #[Route('/posts', name: 'list', methods: ['GET'])]
    public function list(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $page = max(1, (int)$request->query->get('page', 1));
        $limit = min(50, max(1, (int)$request->query->get('limit', 12)));
        $offset = ($page - 1) * $limit;

        $qb = $em->getRepository(BlogPost::class)
            ->createQueryBuilder('bp')
            ->where('bp.fechaPublicacion IS NOT NULL')
            ->andWhere('bp.fechaPublicacion <= :now')
            ->andWhere('bp.esPremium = 0')
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
            'posts' => array_map(fn($post) => $this->serializePost($post), $posts),
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => (int)$total,
                'total_pages' => ceil($total / $limit)
            ]
        ]);
    }

    /**
     * GET /api/public/blog/post/{slug}
     * Detalle de un post gratuito
     */
    #[Route('/post/{slug}', name: 'detail', methods: ['GET'])]
    public function detail(string $slug, EntityManagerInterface $em): JsonResponse
    {
        $post = $em->getRepository(BlogPost::class)->findOneBy(['slug' => $slug]);
        
        if (!$post) {
            return $this->json(['success' => false, 'error' => 'Post no encontrado'], 404);
        }
        
        if ($post->isEsPremium()) {
            return $this->json([
                'success' => false,
                'error' => 'Este contenido es exclusivo para usuarios Premium',
                'requiere_premium' => true
            ], 403);
        }
        
        return $this->json([
            'success' => true,
            'post' => $this->serializePost($post, true)
        ]);
    }

    private function serializePost(BlogPost $post, bool $incluirContenido = false): array
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
            'puede_acceder' => !$post->isEsPremium()
        ];
        
        if ($incluirContenido && !$post->isEsPremium()) {
            $data['contenido'] = $post->getContenido();
        }
        
        return $data;
    }
}
