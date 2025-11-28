<?php

namespace App\Controller;

use App\Entity\BlogPost;
use App\Repository\BlogPostRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Controlador público del Blog
 */
#[Route('/api/blog', name: 'api_blog_')]
class BlogController extends AbstractController
{
    private BlogPostRepository $blogPostRepository;
    private EntityManagerInterface $entityManager;

    public function __construct(
        BlogPostRepository $blogPostRepository,
        EntityManagerInterface $entityManager
    ) {
        $this->blogPostRepository = $blogPostRepository;
        $this->entityManager = $entityManager;
    }

    // ============================================
    // ENDPOINTS PÚBLICOS
    // ============================================

    /**
     * Listar posts publicados (paginado)
     * GET /api/blog/posts
     */
    #[Route('/posts', name: 'list', methods: ['GET'])]
    public function listarPosts(Request $request): JsonResponse
    {
        try {
            $page = $request->query->getInt('page', 1);
            $limit = $request->query->getInt('limit', 12);

            $posts = $this->blogPostRepository->findPublicados($page, $limit);
            $total = $this->blogPostRepository->countPublicados();

            $data = array_map([$this, 'serializarPost'], $posts);

            return $this->json([
                'success' => true,
                'posts' => $data,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $total,
                    'pages' => ceil($total / $limit),
                ],
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al obtener posts: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Posts destacados
     * GET /api/blog/posts/destacados
     */
    #[Route('/posts/destacados', name: 'featured', methods: ['GET'])]
    public function postsDestacados(Request $request): JsonResponse
    {
        try {
            $limit = $request->query->getInt('limit', 3);
            $posts = $this->blogPostRepository->findDestacados($limit);

            $data = array_map([$this, 'serializarPost'], $posts);

            return $this->json([
                'success' => true,
                'posts' => $data,
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al obtener posts destacados: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Posts por categoría
     * GET /api/blog/posts/categoria/{categoria}
     */
    #[Route('/posts/categoria/{categoria}', name: 'by_category', methods: ['GET'])]
    public function postsPorCategoria(string $categoria, Request $request): JsonResponse
    {
        try {
            $page = $request->query->getInt('page', 1);
            $limit = $request->query->getInt('limit', 12);

            $posts = $this->blogPostRepository->findByCategoria($categoria, $page, $limit);

            $data = array_map([$this, 'serializarPost'], $posts);

            return $this->json([
                'success' => true,
                'categoria' => $categoria,
                'posts' => $data,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                ],
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al obtener posts: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Ver post individual (incrementa vistas)
     * GET /api/blog/posts/{slug}
     */
    #[Route('/posts/{slug}', name: 'view', methods: ['GET'])]
    public function verPost(string $slug): JsonResponse
    {
        try {
            $post = $this->blogPostRepository->findBySlugPublicado($slug);

            if (!$post) {
                return $this->json([
                    'success' => false,
                    'error' => 'Post no encontrado',
                ], Response::HTTP_NOT_FOUND);
            }

            // Incrementar vistas
            $post->incrementarVistas();
            $this->entityManager->flush();

            // Posts relacionados
            $relacionados = $this->blogPostRepository->findRelacionados(
                $post->getId(),
                $post->getCategoria(),
                3
            );

            return $this->json([
                'success' => true,
                'post' => $this->serializarPostCompleto($post),
                'relacionados' => array_map([$this, 'serializarPost'], $relacionados),
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al obtener post: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Buscar posts
     * GET /api/blog/search?q=texto
     */
    #[Route('/search', name: 'search', methods: ['GET'])]
    public function buscarPosts(Request $request): JsonResponse
    {
        try {
            $query = $request->query->get('q', '');
            $page = $request->query->getInt('page', 1);
            $limit = $request->query->getInt('limit', 12);

            if (empty($query)) {
                return $this->json([
                    'success' => false,
                    'error' => 'Parámetro de búsqueda requerido',
                ], Response::HTTP_BAD_REQUEST);
            }

            $posts = $this->blogPostRepository->searchPublicados($query, $page, $limit);

            $data = array_map([$this, 'serializarPost'], $posts);

            return $this->json([
                'success' => true,
                'query' => $query,
                'posts' => $data,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                ],
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al buscar posts: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Dar me gusta a un post
     * POST /api/blog/posts/{id}/me-gusta
     */
    #[Route('/posts/{id}/me-gusta', name: 'like', methods: ['POST'])]
    public function darMeGusta(int $id): JsonResponse
    {
        try {
            $post = $this->blogPostRepository->find($id);

            if (!$post || !$post->estaPublicado()) {
                return $this->json([
                    'success' => false,
                    'error' => 'Post no encontrado',
                ], Response::HTTP_NOT_FOUND);
            }

            $post->incrementarMeGusta();
            $this->entityManager->flush();

            return $this->json([
                'success' => true,
                'me_gusta' => $post->getMeGusta(),
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al dar me gusta: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Posts más vistos
     * GET /api/blog/posts/populares
     */
    #[Route('/posts/populares', name: 'popular', methods: ['GET'])]
    public function postsPopulares(Request $request): JsonResponse
    {
        try {
            $limit = $request->query->getInt('limit', 5);
            $posts = $this->blogPostRepository->findMasVistos($limit);

            $data = array_map([$this, 'serializarPost'], $posts);

            return $this->json([
                'success' => true,
                'posts' => $data,
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al obtener posts populares: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    #[Route('/posts/public-preview', name: 'public_preview', methods: ['GET'])]
    public function publicPreview(): JsonResponse
    {
        try {
            $posts = $this->blogPostRepository->findRandomPublicados(2);

            $data = array_map([$this, 'serializarPost'], $posts);

            return $this->json([
                'success' => true,
                'posts' => $data,
                'requires_registration' => true,
                'message' => 'Regístrate para acceder a todo el contenido'
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al obtener posts: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Listar posts premium (requiere ser premium)
     * GET /api/blog/posts/premium
     */
    #[Route('/posts/premium', name: 'premium_list', methods: ['GET'])]
    public function postsPremium(Request $request): JsonResponse
    {
        try {
            // TODO: Verificar que el usuario es premium
            // Por ahora devuelve los posts premium

            $page = $request->query->getInt('page', 1);
            $limit = $request->query->getInt('limit', 12);

            $posts = $this->blogPostRepository->findByCategoria('premium', $page, $limit);

            $data = array_map([$this, 'serializarPost'], $posts);

            return $this->json([
                'success' => true,
                'posts' => $data,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                ],
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al obtener posts premium: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Ver post premium (requiere ser premium)
     * GET /api/blog/posts/premium/{slug}
     */
    #[Route('/posts/premium/{slug}', name: 'view_premium', methods: ['GET'])]
    public function verPostPremium(string $slug): JsonResponse
    {
        try {
            // TODO: Verificar que el usuario es premium

            $post = $this->blogPostRepository->findBySlugPublicado($slug);

            if (!$post || $post->getCategoria() !== 'premium') {
                return $this->json([
                    'success' => false,
                    'error' => 'Post premium no encontrado',
                ], Response::HTTP_NOT_FOUND);
            }

            // Incrementar vistas
            $post->incrementarVistas();
            $this->entityManager->flush();

            // Posts relacionados premium
            $relacionados = $this->blogPostRepository->findRelacionados(
                $post->getId(),
                'premium',
                3
            );

            return $this->json([
                'success' => true,
                'post' => $this->serializarPostCompleto($post),
                'relacionados' => array_map([$this, 'serializarPost'], $relacionados),
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al obtener post: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    // ============================================
    // MÉTODOS AUXILIARES DE SERIALIZACIÓN
    // ============================================

    private function serializarPost(BlogPost $post): array
    {
        return [
            'id' => $post->getId(),
            'titulo' => $post->getTitulo(),
            'slug' => $post->getSlug(),
            'extracto' => $post->getExtracto(),
            'imagen_portada' => $post->getImagenPortada(),
            'categoria' => $post->getCategoria(),
            'categoria_formateada' => $post->getCategoriaFormateada(),
            'etiquetas' => $post->getEtiquetas(),
            'autor_nombre' => $post->getAutorNombre(),
            'vistas' => $post->getVistas(),
            'me_gusta' => $post->getMeGusta(),
            'destacado' => $post->isDestacado(),
            'fecha_publicacion' => $post->getFechaPublicacion()?->format('Y-m-d H:i:s'),
        ];
    }

    private function serializarPostCompleto(BlogPost $post): array
    {
        return [
            'id' => $post->getId(),
            'titulo' => $post->getTitulo(),
            'slug' => $post->getSlug(),
            'extracto' => $post->getExtracto(),
            'contenido' => $post->getContenido(),
            'imagen_portada' => $post->getImagenPortada(),
            'categoria' => $post->getCategoria(),
            'categoria_formateada' => $post->getCategoriaFormateada(),
            'etiquetas' => $post->getEtiquetas(),
            'meta_descripcion' => $post->getMetaDescripcion(),
            'meta_keywords' => $post->getMetaKeywords(),
            'autor_id' => $post->getAutorId(),
            'autor_nombre' => $post->getAutorNombre(),
            'vistas' => $post->getVistas(),
            'me_gusta' => $post->getMeGusta(),
            'destacado' => $post->isDestacado(),
            'fecha_publicacion' => $post->getFechaPublicacion()?->format('Y-m-d H:i:s'),
            'fecha_creacion' => $post->getFechaCreacion()?->format('Y-m-d H:i:s'),
        ];
    }
}
