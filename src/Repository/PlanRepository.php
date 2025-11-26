<?php

namespace App\Repository;

use App\Entity\Plan;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repositorio para gestionar Planes
 */
class PlanRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Plan::class);
    }

    /**
     * Guardar un plan
     */
    public function save(Plan $plan, bool $flush = false): void
    {
        $this->getEntityManager()->persist($plan);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Eliminar un plan
     */
    public function remove(Plan $plan, bool $flush = false): void
    {
        $this->getEntityManager()->remove($plan);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Obtener todos los planes activos ordenados
     */
    public function findPlanesActivos(): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.activo = :activo')
            ->setParameter('activo', true)
            ->orderBy('p.orden', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Obtener planes mensuales activos
     */
    public function findPlanesMensuales(): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.activo = :activo')
            ->andWhere('p.duracionDias = :dias')
            ->setParameter('activo', true)
            ->setParameter('dias', 30)
            ->orderBy('p.precioMensual', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Obtener planes anuales activos
     */
    public function findPlanesAnuales(): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.activo = :activo')
            ->andWhere('p.duracionDias = :dias')
            ->setParameter('activo', true)
            ->setParameter('dias', 365)
            ->orderBy('p.precioAnual', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar plan por nombre
     */
    public function findByNombre(string $nombre): ?Plan
    {
        return $this->createQueryBuilder('p')
            ->where('p.nombre = :nombre')
            ->setParameter('nombre', $nombre)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Obtener plan más económico
     */
    public function findPlanMasEconomico(): ?Plan
    {
        return $this->createQueryBuilder('p')
            ->where('p.activo = :activo')
            ->setParameter('activo', true)
            ->orderBy('p.precioMensual', 'ASC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Contar planes activos
     */
    public function countPlanesActivos(): int
    {
        return $this->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->where('p.activo = :activo')
            ->setParameter('activo', true)
            ->getQuery()
            ->getSingleScalarResult();
    }
}