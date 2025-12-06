<?php

namespace App\Repository;

use App\Entity\Suscripcion;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repository para Suscripciones simplificadas
 */
class SuscripcionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Suscripcion::class);
    }

    public function save(Suscripcion $suscripcion, bool $flush = true): void
    {
        $this->getEntityManager()->persist($suscripcion);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Suscripcion $suscripcion, bool $flush = true): void
    {
        $this->getEntityManager()->remove($suscripcion);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findSuscripcionActiva(int $usuarioId): ?Suscripcion
    {
        return $this->createQueryBuilder('s')
            ->where('s.usuario = :usuario')
            ->andWhere('s.activa = :activa')
            ->setParameter('usuario', $usuarioId)
            ->setParameter('activa', true)
            ->orderBy('s.fechaInicio', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findByUsuario(int $usuarioId): array
    {
        return $this->createQueryBuilder('s')
            ->where('s.usuario = :usuario')
            ->setParameter('usuario', $usuarioId)
            ->orderBy('s.fechaInicio', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findSuscripcionesActivas(): array
    {
        return $this->createQueryBuilder('s')
            ->where('s.activa = :activa')
            ->setParameter('activa', true)
            ->orderBy('s.fechaInicio', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findSuscripcionesPorVencer(int $dias = 7): array
    {
        $fechaLimite = new \DateTime("+{$dias} days");

        return $this->createQueryBuilder('s')
            ->where('s.activa = :activa')
            ->andWhere('s.fechaFin IS NOT NULL')
            ->andWhere('s.fechaFin <= :limite')
            ->setParameter('activa', true)
            ->setParameter('limite', $fechaLimite)
            ->orderBy('s.fechaFin', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findConAutoRenovacion(): array
    {
        return $this->createQueryBuilder('s')
            ->where('s.autoRenovacion = :auto')
            ->andWhere('s.activa = :activa')
            ->setParameter('auto', true)
            ->setParameter('activa', true)
            ->orderBy('s.fechaFin', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findSuscripcionesExpiradas(): array
    {
        return $this->createQueryBuilder('s')
            ->where('s.estado = :estado')
            ->setParameter('estado', 'expirado')
            ->orderBy('s.fechaFin', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findSuscripcionesCanceladas(): array
    {
        return $this->createQueryBuilder('s')
            ->where('s.estado = :estado')
            ->setParameter('estado', 'cancelado')
            ->orderBy('s.fechaFin', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findProximasRenovaciones(int $dias = 30): array
    {
        $hoy = new \DateTime();
        $limite = new \DateTime("+{$dias} days");

        return $this->createQueryBuilder('s')
            ->where('s.autoRenovacion = :auto')
            ->andWhere('s.activa = :activa')
            ->andWhere('s.fechaFin BETWEEN :hoy AND :limite')
            ->setParameter('auto', true)
            ->setParameter('activa', true)
            ->setParameter('hoy', $hoy)
            ->setParameter('limite', $limite)
            ->orderBy('s.fechaFin', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function countSuscripcionesActivas(): int
    {
        return $this->createQueryBuilder('s')
            ->select('COUNT(s.id)')
            ->where('s.activa = :activa')
            ->setParameter('activa', true)
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function countByEstado(string $estado): int
    {
        return $this->createQueryBuilder('s')
            ->select('COUNT(s.id)')
            ->where('s.estado = :estado')
            ->setParameter('estado', $estado)
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function getMRR(): float
    {
        $result = $this->createQueryBuilder('s')
            ->select('SUM(s.precioMensual)')
            ->where('s.activa = :activa')
            ->andWhere('s.autoRenovacion = :auto')
            ->setParameter('activa', true)
            ->setParameter('auto', true)
            ->getQuery()
            ->getSingleScalarResult();

        return $result ? (float) $result : 0.0;
    }

    public function getEstadisticas(): array
    {
        $total = (int) $this->createQueryBuilder('s')
            ->select('COUNT(s.id)')
            ->getQuery()
            ->getSingleScalarResult();

        $activas = (int) $this->createQueryBuilder('s')
            ->select('COUNT(s.id)')
            ->where('s.activa = :activa')
            ->setParameter('activa', true)
            ->getQuery()
            ->getSingleScalarResult();

        $canceladas = $this->countByEstado('cancelado');
        $expiradas = $this->countByEstado('expirado');

        return [
            'total' => $total,
            'activas' => $activas,
            'canceladas' => $canceladas,
            'expiradas' => $expiradas,
        ];
    }

    public function searchSuscripciones(
        ?string $estado = null,
        ?int $usuarioId = null,
        ?int $entrenadorId = null,
        ?bool $soloActivas = null,
        int $page = 1,
        int $limit = 20
    ): array {
        $qb = $this->createQueryBuilder('s');

        if ($estado) {
            $qb->andWhere('s.estado = :estado')
                ->setParameter('estado', $estado);
        }

        if ($usuarioId) {
            $qb->andWhere('s.usuario = :usuario')
                ->setParameter('usuario', $usuarioId);
        }

        if ($entrenadorId) {
            $qb->andWhere('s.entrenadorAsignado = :entrenador')
                ->setParameter('entrenador', $entrenadorId);
        }

        if ($soloActivas !== null) {
            $qb->andWhere('s.activa = :activa')
                ->setParameter('activa', $soloActivas);
        }

        $offset = ($page - 1) * $limit;

        return $qb->orderBy('s.fechaInicio', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();
    }

    public function countSuscripciones(
        ?string $estado = null,
        ?int $usuarioId = null,
        ?int $entrenadorId = null,
        ?bool $soloActivas = null
    ): int {
        $qb = $this->createQueryBuilder('s')
            ->select('COUNT(s.id)');

        if ($estado) {
            $qb->andWhere('s.estado = :estado')
                ->setParameter('estado', $estado);
        }

        if ($usuarioId) {
            $qb->andWhere('s.usuario = :usuario')
                ->setParameter('usuario', $usuarioId);
        }

        if ($entrenadorId) {
            $qb->andWhere('s.entrenadorAsignado = :entrenador')
                ->setParameter('entrenador', $entrenadorId);
        }

        if ($soloActivas !== null) {
            $qb->andWhere('s.activa = :activa')
                ->setParameter('activa', $soloActivas);
        }

        return (int) $qb->getQuery()->getSingleScalarResult();
    }

    public function countTotal(): int
    {
        return (int) $this->createQueryBuilder('s')
            ->select('COUNT(s.id)')
            ->getQuery()
            ->getSingleScalarResult();
    }
}
