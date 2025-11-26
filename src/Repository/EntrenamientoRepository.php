<?php

namespace App\Repository;

use App\Entity\Entrenamiento;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repository para Entrenamientos
 */
class EntrenamientoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Entrenamiento::class);
    }

    public function save(Entrenamiento $entrenamiento, bool $flush = true): void
    {
        $this->getEntityManager()->persist($entrenamiento);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Entrenamiento $entrenamiento, bool $flush = true): void
    {
        $this->getEntityManager()->remove($entrenamiento);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Buscar entrenamientos públicos
     */
    public function findEntrenamientosPublicos(): array
    {
        return $this->createQueryBuilder('e')
            ->where('e.esPublico = :publico')
            ->setParameter('publico', true)
            ->orderBy('e.valoracionPromedio', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar por tipo
     */
    public function findByTipo(string $tipo): array
    {
        return $this->createQueryBuilder('e')
            ->where('e.tipo = :tipo')
            ->andWhere('e.esPublico = :publico')
            ->setParameter('tipo', $tipo)
            ->setParameter('publico', true)
            ->orderBy('e.nombre', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar por creador
     */
    public function findByCreador(int $creadorId): array
    {
        return $this->createQueryBuilder('e')
            ->where('e.creadorId = :creador')
            ->setParameter('creador', $creadorId)
            ->orderBy('e.fechaCreacion', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar por nivel
     */
    public function findByNivel(string $nivel): array
    {
        return $this->createQueryBuilder('e')
            ->where('e.nivelDificultad = :nivel')
            ->andWhere('e.esPublico = :publico')
            ->setParameter('nivel', $nivel)
            ->setParameter('publico', true)
            ->orderBy('e.nombre', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar mejor valorados
     */
    public function findMejorValorados(int $limit = 10): array
    {
        return $this->createQueryBuilder('e')
            ->where('e.esPublico = :publico')
            ->andWhere('e.totalValoraciones > :min')
            ->setParameter('publico', true)
            ->setParameter('min', 5)
            ->orderBy('e.valoracionPromedio', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar con filtros
     */
    public function searchEntrenamientos(
        ?string $search = null,
        ?string $tipo = null,
        ?string $nivel = null,
        ?bool $esPublico = null,
        int $page = 1,
        int $limit = 20
    ): array {
        $qb = $this->createQueryBuilder('e');

        if ($search) {
            $qb->andWhere('e.nombre LIKE :search OR e.descripcion LIKE :search')
               ->setParameter('search', '%' . $search . '%');
        }

        if ($tipo) {
            $qb->andWhere('e.tipo = :tipo')
               ->setParameter('tipo', $tipo);
        }

        if ($nivel) {
            $qb->andWhere('e.nivelDificultad = :nivel')
               ->setParameter('nivel', $nivel);
        }

        if ($esPublico !== null) {
            $qb->andWhere('e.esPublico = :publico')
               ->setParameter('publico', $esPublico);
        }

        $offset = ($page - 1) * $limit;

        return $qb->orderBy('e.fechaCreacion', 'DESC')
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
        return $this->createQueryBuilder('e')
            ->select('COUNT(e.id)')
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Contar públicos
     */
    public function countPublicos(): int
    {
        return $this->createQueryBuilder('e')
            ->select('COUNT(e.id)')
            ->where('e.esPublico = :publico')
            ->setParameter('publico', true)
            ->getQuery()
            ->getSingleScalarResult();
    }
}