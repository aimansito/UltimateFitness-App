<?php

namespace App\Repository;

use App\Entity\BlogPost;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repository para Blog Posts
 */
class BlogPostRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, BlogPost::class);
    }

    /**
     * Guardar post
     */
    public function save(BlogPost $post, bool $flush = true): void
    {
        $this->getEntityManager()->persist($post);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Eliminar post
     */
    public function remove(BlogPost $post, bool $flush = true): void
    {
        $this->getEntityManager()->remove($post);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    // ============================================
    // BÚSQUEDAS PÚBLICAS
    // ============================================

    /**
     * Buscar posts publicados con paginación
     */
    public function findPublicados(int $page = 1, int $limit = 12): array
    {
        $offset = ($page - 1) * $limit;

        return $this->createQueryBuilder('p')
            ->where('p.estado = :estado')
            ->setParameter('estado', 'publicado')
            ->orderBy('p.fechaPublicacion', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar posts aleatorios publicados
     */
    public function findRandomPublicados(int $limit = 2): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.estado = :estado')
            ->andWhere('p.categoria != :premium')
            ->setParameter('estado', 'publicado')
            ->setParameter('premium', 'premium')
            ->orderBy('RAND()')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar posts publicados excluyendo premium
     */
    public function findPublicadosSinPremium(int $page = 1, int $limit = 12): array
    {
        $offset = ($page - 1) * $limit;

        return $this->createQueryBuilder('p')
            ->where('p.estado = :estado')
            ->andWhere('p.categoria != :premium')
            ->setParameter('estado', 'publicado')
            ->setParameter('premium', 'premium')
            ->orderBy('p.fechaPublicacion', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();
    }

    /**
     * Contar posts publicados sin premium
     */
    public function countPublicadosSinPremium(): int
    {
        return $this->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->where('p.estado = :estado')
            ->andWhere('p.categoria != :premium')
            ->setParameter('estado', 'publicado')
            ->setParameter('premium', 'premium')
            ->getQuery()
            ->getSingleScalarResult();
    }
    /**
     * Contar posts publicados
     */
    public function countPublicados(): int
    {
        return $this->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->where('p.estado = :estado')
            ->setParameter('estado', 'publicado')
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Buscar post por slug (solo publicados)
     */
    public function findBySlugPublicado(string $slug): ?BlogPost
    {
        return $this->createQueryBuilder('p')
            ->where('p.slug = :slug')
            ->andWhere('p.estado = :estado')
            ->setParameter('slug', $slug)
            ->setParameter('estado', 'publicado')
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Buscar posts destacados
     */
    public function findDestacados(int $limit = 3): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.destacado = :destacado')
            ->andWhere('p.estado = :estado')
            ->setParameter('destacado', true)
            ->setParameter('estado', 'publicado')
            ->orderBy('p.fechaPublicacion', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar posts por categoría
     */
    public function findByCategoria(string $categoria, int $page = 1, int $limit = 12): array
    {
        $offset = ($page - 1) * $limit;

        return $this->createQueryBuilder('p')
            ->where('p.categoria = :categoria')
            ->andWhere('p.estado = :estado')
            ->setParameter('categoria', $categoria)
            ->setParameter('estado', 'publicado')
            ->orderBy('p.fechaPublicacion', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar posts relacionados (misma categoría)
     */
    public function findRelacionados(int $postId, string $categoria, int $limit = 3): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.categoria = :categoria')
            ->andWhere('p.estado = :estado')
            ->andWhere('p.id != :postId')
            ->setParameter('categoria', $categoria)
            ->setParameter('estado', 'publicado')
            ->setParameter('postId', $postId)
            ->orderBy('p.fechaPublicacion', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar posts (búsqueda de texto)
     */
    public function searchPublicados(string $query, int $page = 1, int $limit = 12): array
    {
        $offset = ($page - 1) * $limit;

        return $this->createQueryBuilder('p')
            ->where('p.estado = :estado')
            ->andWhere('p.titulo LIKE :query OR p.contenido LIKE :query OR p.extracto LIKE :query')
            ->setParameter('estado', 'publicado')
            ->setParameter('query', '%' . $query . '%')
            ->orderBy('p.fechaPublicacion', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();
    }

    // ============================================
    // BÚSQUEDAS PARA ADMIN
    // ============================================

    /**
     * Buscar todos los posts (incluye borradores) con paginación
     */
    public function findAllPaginated(int $page = 1, int $limit = 20): array
    {
        $offset = ($page - 1) * $limit;

        return $this->createQueryBuilder('p')
            ->orderBy('p.fechaCreacion', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar post por slug (incluye borradores)
     */
    public function findBySlug(string $slug): ?BlogPost
    {
        return $this->findOneBy(['slug' => $slug]);
    }

    /**
     * Buscar posts con filtros (admin)
     */
    public function searchAdmin(
        ?string $search = null,
        ?string $categoria = null,
        ?string $estado = null,
        int $page = 1,
        int $limit = 20
    ): array {
        $qb = $this->createQueryBuilder('p');
        $offset = ($page - 1) * $limit;

        if ($search) {
            $qb->andWhere('p.titulo LIKE :search OR p.contenido LIKE :search')
                ->setParameter('search', '%' . $search . '%');
        }

        if ($categoria) {
            $qb->andWhere('p.categoria = :categoria')
                ->setParameter('categoria', $categoria);
        }

        if ($estado) {
            $qb->andWhere('p.estado = :estado')
                ->setParameter('estado', $estado);
        }

        return $qb->orderBy('p.fechaCreacion', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();
    }

    /**
     * Contar total de posts
     */
    public function countTotal(): int
    {
        return $this->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Contar posts por estado
     */
    public function countByEstado(string $estado): int
    {
        return $this->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->where('p.estado = :estado')
            ->setParameter('estado', $estado)
            ->getQuery()
            ->getSingleScalarResult();
    }

    // ============================================
    // ESTADÍSTICAS
    // ============================================

    /**
     * Posts más vistos
     */
    public function findMasVistos(int $limit = 5): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.estado = :estado')
            ->setParameter('estado', 'publicado')
            ->orderBy('p.vistas', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Posts más gustados
     */
    public function findMasGustados(int $limit = 5): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.estado = :estado')
            ->setParameter('estado', 'publicado')
            ->orderBy('p.meGusta', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Estadísticas generales
     */
    public function getEstadisticas(): array
    {
        return [
            'total' => $this->countTotal(),
            'publicados' => $this->countByEstado('publicado'),
            'borradores' => $this->countByEstado('borrador'),
            'archivados' => $this->countByEstado('archivado'),
            'destacados' => $this->count(['destacado' => true]),
        ];
    }
}
