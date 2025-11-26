<?php

namespace App\Repository;

use App\Entity\Dieta;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repository para Dietas
 */
class DietaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Dieta::class);
    }

    public function save(Dieta $dieta, bool $flush = true): void
    {
        $this->getEntityManager()->persist($dieta);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Dieta $dieta, bool $flush = true): void
    {
        $this->getEntityManager()->remove($dieta);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Buscar dietas públicas
     */
    public function findDietasPublicas(): array
    {
        return $this->createQueryBuilder('d')
            ->where('d.esPublica = :publica')
            ->setParameter('publica', true)
            ->orderBy('d.valoracionPromedio', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar dietas por creador
     */
    public function findByCreador(int $creadorId): array
    {
        return $this->createQueryBuilder('d')
            ->where('d.creadorId = :creador')
            ->setParameter('creador', $creadorId)
            ->orderBy('d.fechaCreacion', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar dietas mejor valoradas
     */
    public function findMejorValoradas(int $limit = 10): array
    {
        return $this->createQueryBuilder('d')
            ->where('d.esPublica = :publica')
            ->andWhere('d.totalValoraciones > :min')
            ->setParameter('publica', true)
            ->setParameter('min', 5)
            ->orderBy('d.valoracionPromedio', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar con filtros
     */
    public function searchDietas(
        ?string $search = null,
        ?bool $esPublica = null,
        ?int $creadorId = null,
        int $page = 1,
        int $limit = 20
    ): array {
        $qb = $this->createQueryBuilder('d');

        if ($search) {
            $qb->andWhere('d.nombre LIKE :search OR d.descripcion LIKE :search')
               ->setParameter('search', '%' . $search . '%');
        }

        if ($esPublica !== null) {
            $qb->andWhere('d.esPublica = :publica')
               ->setParameter('publica', $esPublica);
        }

        if ($creadorId) {
            $qb->andWhere('d.creadorId = :creador')
               ->setParameter('creador', $creadorId);
        }

        $offset = ($page - 1) * $limit;

        return $qb->orderBy('d.fechaCreacion', 'DESC')
                  ->setMaxResults($limit)
                  ->setFirstResult($offset)
                  ->getQuery()
                  ->getResult();
    }

    /**
     * Contar total
     */
    public function countTotal(): int
    {
        return $this->createQueryBuilder('d')
            ->select('COUNT(d.id)')
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Contar públicas
     */
    public function countPublicas(): int
    {
        return $this->createQueryBuilder('d')
            ->select('COUNT(d.id)')
            ->where('d.esPublica = :publica')
            ->setParameter('publica', true)
            ->getQuery()
            ->getSingleScalarResult();
    }
}