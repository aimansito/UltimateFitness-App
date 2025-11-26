<?php

namespace App\Repository;

use App\Entity\HistorialPago;
use App\Entity\Usuario;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repositorio para gestionar Historial de Pagos
 */
class HistorialPagoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, HistorialPago::class);
    }

    /**
     * Guardar un pago
     */
    public function save(HistorialPago $pago, bool $flush = false): void
    {
        $this->getEntityManager()->persist($pago);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Eliminar un pago
     */
    public function remove(HistorialPago $pago, bool $flush = false): void
    {
        $this->getEntityManager()->remove($pago);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Obtener historial de pagos de un usuario
     */
    public function findByUsuario(Usuario $usuario, int $limit = 10): array
    {
        return $this->createQueryBuilder('hp')
            ->where('hp.usuario = :usuario')
            ->setParameter('usuario', $usuario)
            ->orderBy('hp.fechaPago', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar pago por ID de transacción externa
     */
    public function findByTransaccionExterna(string $idTransaccion): ?HistorialPago
    {
        return $this->createQueryBuilder('hp')
            ->where('hp.idTransaccionExterna = :id')
            ->setParameter('id', $idTransaccion)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Obtener pagos completados de un usuario
     */
    public function findPagosCompletados(Usuario $usuario): array
    {
        return $this->createQueryBuilder('hp')
            ->where('hp.usuario = :usuario')
            ->andWhere('hp.estado = :estado')
            ->setParameter('usuario', $usuario)
            ->setParameter('estado', 'completado')
            ->orderBy('hp.fechaPago', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Obtener pagos pendientes
     */
    public function findPagosPendientes(): array
    {
        return $this->createQueryBuilder('hp')
            ->where('hp.estado = :estado')
            ->setParameter('estado', 'pendiente')
            ->orderBy('hp.fechaPago', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Obtener total pagado por un usuario
     */
    public function getTotalPagadoPorUsuario(Usuario $usuario): float
    {
        $result = $this->createQueryBuilder('hp')
            ->select('SUM(hp.monto)')
            ->where('hp.usuario = :usuario')
            ->andWhere('hp.estado = :estado')
            ->setParameter('usuario', $usuario)
            ->setParameter('estado', 'completado')
            ->getQuery()
            ->getSingleScalarResult();

        return $result ?? 0.0;
    }

    /**
     * Obtener pagos por rango de fechas
     */
    public function findByFechaRange(\DateTime $fechaInicio, \DateTime $fechaFin): array
    {
        return $this->createQueryBuilder('hp')
            ->where('hp.fechaPago >= :inicio')
            ->andWhere('hp.fechaPago <= :fin')
            ->setParameter('inicio', $fechaInicio)
            ->setParameter('fin', $fechaFin)
            ->orderBy('hp.fechaPago', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Obtener últimos pagos (para admin)
     */
    public function findUltimosPagos(int $limit = 20): array
    {
        return $this->createQueryBuilder('hp')
            ->orderBy('hp.fechaPago', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Contar pagos por estado
     */
    public function countByEstado(string $estado): int
    {
        return $this->createQueryBuilder('hp')
            ->select('COUNT(hp.id)')
            ->where('hp.estado = :estado')
            ->setParameter('estado', $estado)
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Estadísticas de pagos del mes actual
     */
    public function getEstadisticasMesActual(): array
    {
        $primerDiaMes = new \DateTime('first day of this month');
        $ultimoDiaMes = new \DateTime('last day of this month');

        $qb = $this->createQueryBuilder('hp')
            ->select('COUNT(hp.id) as total_pagos')
            ->addSelect('SUM(hp.monto) as total_monto')
            ->addSelect('AVG(hp.monto) as promedio_monto')
            ->where('hp.fechaPago >= :inicio')
            ->andWhere('hp.fechaPago <= :fin')
            ->andWhere('hp.estado = :estado')
            ->setParameter('inicio', $primerDiaMes)
            ->setParameter('fin', $ultimoDiaMes)
            ->setParameter('estado', 'completado');

        return $qb->getQuery()->getSingleResult();
    }
}