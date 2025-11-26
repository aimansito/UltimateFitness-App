<?php

namespace App\Repository;

use App\Entity\ValoracionEntrenador;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repository para ValoracionEntrenador
 */
class ValoracionEntrenadorRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ValoracionEntrenador::class);
    }

    public function save(ValoracionEntrenador $valoracion, bool $flush = true): void
    {
        $this->getEntityManager()->persist($valoracion);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(ValoracionEntrenador $valoracion, bool $flush = true): void
    {
        $this->getEntityManager()->remove($valoracion);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Buscar valoraciones de un entrenador
     */
    public function findByEntrenador(int $entrenadorId): array
    {
        return $this->createQueryBuilder('v')
            ->where('v.entrenadorId = :entrenador')
            ->setParameter('entrenador', $entrenadorId)
            ->orderBy('v.fecha', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar valoraciones hechas por un cliente
     */
    public function findByCliente(int $clienteId): array
    {
        return $this->createQueryBuilder('v')
            ->where('v.clienteId = :cliente')
            ->setParameter('cliente', $clienteId)
            ->orderBy('v.fecha', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar valoración específica
     */
    public function findByEntrenadorYCliente(int $entrenadorId, int $clienteId): ?ValoracionEntrenador
    {
        return $this->createQueryBuilder('v')
            ->where('v.entrenadorId = :entrenador')
            ->andWhere('v.clienteId = :cliente')
            ->setParameter('entrenador', $entrenadorId)
            ->setParameter('cliente', $clienteId)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Calcular promedio de un entrenador
     */
    public function getPromedioEntrenador(int $entrenadorId): float
    {
        $result = $this->createQueryBuilder('v')
            ->select('AVG(v.estrellas)')
            ->where('v.entrenadorId = :entrenador')
            ->setParameter('entrenador', $entrenadorId)
            ->getQuery()
            ->getSingleScalarResult();

        return $result ? (float) $result : 0.0;
    }

    /**
     * Contar valoraciones de un entrenador
     */
    public function countByEntrenador(int $entrenadorId): int
    {
        return $this->createQueryBuilder('v')
            ->select('COUNT(v.id)')
            ->where('v.entrenadorId = :entrenador')
            ->setParameter('entrenador', $entrenadorId)
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Obtener últimas valoraciones
     */
    public function findUltimas(int $limit = 10): array
    {
        return $this->createQueryBuilder('v')
            ->orderBy('v.fecha', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}