<?php

namespace App\Repository;

use App\Entity\Servicio;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repository para Servicios
 */
class ServicioRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Servicio::class);
    }

    public function save(Servicio $servicio, bool $flush = true): void
    {
        $this->getEntityManager()->persist($servicio);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Servicio $servicio, bool $flush = true): void
    {
        $this->getEntityManager()->remove($servicio);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Buscar servicios activos
     */
    public function findServiciosActivos(): array
    {
        return $this->createQueryBuilder('s')
            ->where('s.activo = :activo')
            ->setParameter('activo', true)
            ->orderBy('s.precio', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar servicios por tipo
     */
    public function findByTipo(string $tipo): array
    {
        return $this->createQueryBuilder('s')
            ->where('s.tipo = :tipo')
            ->andWhere('s.activo = :activo')
            ->setParameter('tipo', $tipo)
            ->setParameter('activo', true)
            ->orderBy('s.precio', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar servicios gratuitos
     */
    public function findServiciosGratuitos(): array
    {
        return $this->findByTipo('gratuito');
    }

    /**
     * Buscar servicios de suscripción
     */
    public function findServiciosSuscripcion(): array
    {
        return $this->findByTipo('suscripcion');
    }

    /**
     * Buscar servicios extras
     */
    public function findServiciosExtras(): array
    {
        return $this->findByTipo('extra');
    }

    /**
     * Buscar servicios que incluyen entrenador
     */
    public function findConEntrenador(): array
    {
        return $this->createQueryBuilder('s')
            ->where('s.incluyeEntrenador = :incluye')
            ->andWhere('s.activo = :activo')
            ->setParameter('incluye', true)
            ->setParameter('activo', true)
            ->orderBy('s.precio', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar por nombre
     */
    public function findByNombre(string $nombre): ?Servicio
    {
        return $this->createQueryBuilder('s')
            ->where('s.nombre = :nombre')
            ->setParameter('nombre', $nombre)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Contar servicios activos
     */
    public function countActivos(): int
    {
        return $this->createQueryBuilder('s')
            ->select('COUNT(s.id)')
            ->where('s.activo = :activo')
            ->setParameter('activo', true)
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Contar por tipo
     */
    public function countByTipo(string $tipo): int
    {
        return $this->createQueryBuilder('s')
            ->select('COUNT(s.id)')
            ->where('s.tipo = :tipo')
            ->setParameter('tipo', $tipo)
            ->getQuery()
            ->getSingleScalarResult();
    }
}