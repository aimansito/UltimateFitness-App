<?php

namespace App\Repository;

use App\Entity\Ejercicio;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repository para Ejercicios
 */
class EjercicioRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Ejercicio::class);
    }

    public function save(Ejercicio $ejercicio, bool $flush = true): void
    {
        $this->getEntityManager()->persist($ejercicio);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Ejercicio $ejercicio, bool $flush = true): void
    {
        $this->getEntityManager()->remove($ejercicio);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Buscar por tipo
     */
    public function findByTipo(string $tipo): array
    {
        return $this->createQueryBuilder('e')
            ->where('e.tipo = :tipo')
            ->setParameter('tipo', $tipo)
            ->orderBy('e.nombre', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar por grupo muscular
     */
    public function findByGrupoMuscular(string $grupo): array
    {
        return $this->createQueryBuilder('e')
            ->where('e.grupoMuscular = :grupo')
            ->setParameter('grupo', $grupo)
            ->orderBy('e.nombre', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar por nivel de dificultad
     */
    public function findByNivel(string $nivel): array
    {
        return $this->createQueryBuilder('e')
            ->where('e.nivelDificultad = :nivel')
            ->setParameter('nivel', $nivel)
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
            ->where('e.totalValoraciones > :min')
            ->setParameter('min', 5)
            ->orderBy('e.valoracionPromedio', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar con filtros
     */
    public function searchEjercicios(
        ?string $search = null,
        ?string $tipo = null,
        ?string $grupoMuscular = null,
        ?string $nivel = null,
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

        if ($grupoMuscular) {
            $qb->andWhere('e.grupoMuscular = :grupo')
               ->setParameter('grupo', $grupoMuscular);
        }

        if ($nivel) {
            $qb->andWhere('e.nivelDificultad = :nivel')
               ->setParameter('nivel', $nivel);
        }

        $offset = ($page - 1) * $limit;

        return $qb->orderBy('e.nombre', 'ASC')
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
     * Contar por tipo
     */
    public function countByTipo(string $tipo): int
    {
        return $this->createQueryBuilder('e')
            ->select('COUNT(e.id)')
            ->where('e.tipo = :tipo')
            ->setParameter('tipo', $tipo)
            ->getQuery()
            ->getSingleScalarResult();
    }
}