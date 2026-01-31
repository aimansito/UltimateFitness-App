<?php

namespace App\Controller;

use App\Entity\BlogPost;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

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

    /**
     * POST /api/blog/upload-image
     * Subir imagen de portada para el blog
     * Requiere rol ADMIN
     */
    /**
     * POST /api/blog/upload-image
     * Subir imagen de portada para el blog
     * Requiere rol ADMIN
     */
    #[Route('/upload-image', name: 'upload_image', methods: ['POST'])]
    public function uploadImage(Request $request, SluggerInterface $slugger, \League\Flysystem\FilesystemOperator $defaultStorage): JsonResponse
    {
        // Verificar autenticación y rol ADMIN
        $user = $this->getUser();
        if (!$user || !in_array('ROLE_ADMIN', $user->getRoles())) {
            return $this->json([
                'success' => false,
                'error' => 'Acceso denegado. Se requiere rol de administrador.'
            ], 403);
        }

        /** @var UploadedFile $imageFile */
        $imageFile = $request->files->get('image');
        
        if (!$imageFile) {
            return $this->json([
                'success' => false,
                'error' => 'No se recibió ninguna imagen'
            ], 400);
        }

        // Validar tipo de archivo
        $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($imageFile->getMimeType(), $allowedMimeTypes)) {
            return $this->json([
                'success' => false,
                'error' => 'Tipo de archivo no permitido. Solo se aceptan imágenes (JPEG, PNG, GIF, WEBP)'
            ], 400);
        }

        // Validar tamaño (máximo 5MB)
        $maxSize = 5 * 1024 * 1024; // 5MB en bytes
        if ($imageFile->getSize() > $maxSize) {
            return $this->json([
                'success' => false,
                'error' => 'La imagen es demasiado grande. Tamaño máximo: 5MB'
            ], 400);
        }

        $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $slugger->slug($originalFilename);
        $newFilename = 'blog/' . $safeFilename.'-'.uniqid().'.'.$imageFile->guessExtension();

        try {
            // Usar Flysystem para subir a Supabase
            $stream = fopen($imageFile->getPathname(), 'r');
            $defaultStorage->writeStream($newFilename, $stream);
            if (is_resource($stream)) {
                fclose($stream);
            }
            
            // Supabase Public URL construction
            // URL Pública: https://<project_id>.supabase.co/storage/v1/object/public/<bucket>/<filename>
            $publicUrl = '/storage/v1/object/public/uploads/' . $newFilename;
            // Nota: El frontend debe añadir el dominio de Supabase si la URL no es completa,
            // o podemos devolver la URL completa aquí si tenemos la variable de entorno accesible.
            // Para mantener compatibilidad, devolveremos una ruta relativa que el frontend pueda manejar
            // o mejor aún, la URL absoluta completa para evitar líos.
            
            // Hack para obtener URL absoluta rápido sin inyectar params extra ahora mismo
            $supabaseProject = 'ozdmncejywgylyjbboip'; // Hardcoded por seguridad de despliegue rápido
            $fullUrl = "https://{$supabaseProject}.supabase.co/storage/v1/object/public/uploads/{$newFilename}";

            return $this->json([
                'success' => true,
                'imagen_url' => $fullUrl,
                'filename' => $newFilename
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al subir la imagen: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /api/blog/posts
     * Crear un nuevo post del blog
     * Requiere rol ADMIN
     */
    #[Route('/posts', name: 'create', methods: ['POST'])]
    public function crearPost(Request $request, EntityManagerInterface $em): JsonResponse
    {
        // Verificar autenticación y rol ADMIN
        $user = $this->getUser();
        if (!$user || !in_array('ROLE_ADMIN', $user->getRoles())) {
            return $this->json([
                'success' => false,
                'error' => 'Acceso denegado. Se requiere rol de administrador.'
            ], 403);
        }

        $data = json_decode($request->getContent(), true);

        // Validaciones
        if (empty($data['titulo'])) {
            return $this->json(['success' => false, 'error' => 'El título es obligatorio'], 400);
        }
        if (empty($data['contenido'])) {
            return $this->json(['success' => false, 'error' => 'El contenido es obligatorio'], 400);
        }

        try {
            $post = new BlogPost();
            $post->setTitulo($data['titulo']);
            $post->setContenido($data['contenido']);
            $post->setExtracto($data['extracto'] ?? null);
            $post->setImagenPortada($data['imagen_portada'] ?? null);
            $post->setCategoria($data['categoria'] ?? 'noticias');
            $post->setEsPremium($data['es_premium'] ?? false);
            $post->setDestacado($data['destacado'] ?? false);

            // Generar slug automáticamente
            $post->generarSlug();

            // Si se marca para publicar ahora
            if (isset($data['publicar_ahora']) && $data['publicar_ahora']) {
                $post->setFechaPublicacion(new \DateTime());
            }

            $em->persist($post);
            $em->flush();

            return $this->json([
                'success' => true,
                'message' => 'Post creado exitosamente',
                'post' => $this->serializePost($post, true, true)
            ], 201);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al crear el post: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * PUT /api/blog/posts/{id}
     * Actualizar un post existente
     * Requiere rol ADMIN
     */
    #[Route('/posts/{id}', name: 'update', methods: ['PUT'])]
    public function actualizarPost(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        // Verificar autenticación y rol ADMIN
        $user = $this->getUser();
        if (!$user || !in_array('ROLE_ADMIN', $user->getRoles())) {
            return $this->json([
                'success' => false,
                'error' => 'Acceso denegado. Se requiere rol de administrador.'
            ], 403);
        }

        $post = $em->getRepository(BlogPost::class)->find($id);

        if (!$post) {
            return $this->json(['success' => false, 'error' => 'Post no encontrado'], 404);
        }

        $data = json_decode($request->getContent(), true);

        try {
            if (isset($data['titulo'])) {
                $post->setTitulo($data['titulo']);
                $post->generarSlug();
            }
            if (isset($data['contenido'])) {
                $post->setContenido($data['contenido']);
            }
            if (isset($data['extracto'])) {
                $post->setExtracto($data['extracto']);
            }
            if (isset($data['imagen_portada'])) {
                $post->setImagenPortada($data['imagen_portada']);
            }
            if (isset($data['categoria'])) {
                $post->setCategoria($data['categoria']);
            }
            if (isset($data['es_premium'])) {
                $post->setEsPremium($data['es_premium']);
            }
            if (isset($data['destacado'])) {
                $post->setDestacado($data['destacado']);
            }

            $post->setFechaActualizacion(new \DateTime());

            $em->flush();

            return $this->json([
                'success' => true,
                'message' => 'Post actualizado exitosamente',
                'post' => $this->serializePost($post, true, true)
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al actualizar el post: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * DELETE /api/blog/posts/{id}
     * Eliminar un post
     * Requiere rol ADMIN
     */
    #[Route('/posts/{id}', name: 'delete', methods: ['DELETE'])]
    public function eliminarPost(int $id, EntityManagerInterface $em): JsonResponse
    {
        // Verificar autenticación y rol ADMIN
        $user = $this->getUser();
        if (!$user || !in_array('ROLE_ADMIN', $user->getRoles())) {
            return $this->json([
                'success' => false,
                'error' => 'Acceso denegado. Se requiere rol de administrador.'
            ], 403);
        }

        $post = $em->getRepository(BlogPost::class)->find($id);

        if (!$post) {
            return $this->json(['success' => false, 'error' => 'Post no encontrado'], 404);
        }

        try {
            // Opcionalmente, eliminar la imagen del servidor
            if ($post->getImagenPortada()) {
                $imagePath = $this->getParameter('kernel.project_dir').'/public'.$post->getImagenPortada();
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }

            $em->remove($post);
            $em->flush();

            return $this->json([
                'success' => true,
                'message' => 'Post eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Error al eliminar el post: ' . $e->getMessage()
            ], 500);
        }
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
