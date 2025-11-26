<?php

namespace App\Repository;

use App\Entity\Suscripcion;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repository para Suscripciones
 * Contiene métodos para gestión de suscripciones y estadísticas
 */
class SuscripcionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Suscripcion::class);
    }

    /**
     * Guardar suscripción
     */
    public function save(Suscripcion $suscripcion, bool $flush = true): void
    {
        $this->getEntityManager()->persist($suscripcion);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Eliminar suscripción
     */
    public function remove(Suscripcion $suscripcion, bool $flush = true): void
    {
        $this->getEntityManager()->remove($suscripcion);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    // ============================================
    // BÚSQUEDAS BÁSICAS
    // ============================================

    /**
     * Buscar suscripción activa de un usuario
     */
    public function findSuscripcionActiva(int $usuarioId): ?Suscripcion
    {
        return $this->createQueryBuilder('s')
            ->where('s.usuario = :usuario')
            ->andWhere('s.estado = :estado')
            ->setParameter('usuario', $usuarioId)
            ->setParameter('estado', 'activo')
            ->orderBy('s.fechaInicio', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Buscar todas las suscripciones de un usuario
     */
    public function findByUsuario(int $usuarioId): array
    {
        return $this->createQueryBuilder('s')
            ->where('s.usuario = :usuario')
            ->setParameter('usuario', $usuarioId)
            ->orderBy('s.fechaInicio', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar suscripción por transacción externa
     */
    public function findByTransaccionExterna(string $transaccionId): ?Suscripcion
    {
        return $this->createQueryBuilder('s')
            ->where('s.idTransaccionExterna = :transaccion')
            ->setParameter('transaccion', $transaccionId)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Buscar suscripciones activas
     */
    public function findSuscripcionesActivas(): array
    {
        return $this->createQueryBuilder('s')
            ->where('s.estado = :estado')
            ->setParameter('estado', 'activo')
            ->orderBy('s.fechaInicio', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar suscripciones por método de pago
     */
    public function findByMetodoPago(string $metodoPago): array
    {
        return $this->createQueryBuilder('s')
            ->where('s.metodoPago = :metodo')
            ->setParameter('metodo', $metodoPago)
            ->orderBy('s.fechaInicio', 'DESC')
            ->getQuery()
            ->getResult();
    }

    // ============================================
    // RENOVACIONES Y VENCIMIENTOS
    // ============================================

    /**
     * Buscar suscripciones próximas a vencer
     */
    public function findSuscripcionesPorVencer(int $dias = 7): array
    {
        $fechaLimite = new \DateTime("+{$dias} days");

        return $this->createQueryBuilder('s')
            ->where('s.estado = :estado')
            ->andWhere('s.fechaProximoPago <= :fecha')
            ->andWhere('s.fechaProximoPago IS NOT NULL')
            ->setParameter('estado', 'activo')
            ->setParameter('fecha', $fechaLimite)
            ->orderBy('s.fechaProximoPago', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar suscripciones con auto-renovación activa
     */
    public function findConAutoRenovacion(): array
    {
        return $this->createQueryBuilder('s')
            ->where('s.autoRenovacion = :auto')
            ->andWhere('s.estado = :estado')
            ->setParameter('auto', true)
            ->setParameter('estado', 'activo')
            ->orderBy('s.fechaProximoPago', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar suscripciones expiradas
     */
    public function findSuscripcionesExpiradas(): array
    {
        return $this->createQueryBuilder('s')
            ->where('s.estado = :estado')
            ->setParameter('estado', 'expirado')
            ->orderBy('s.fechaFin', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar suscripciones canceladas
     */
    public function findSuscripcionesCanceladas(): array
    {
        return $this->createQueryBuilder('s')
            ->where('s.estado = :estado')
            ->setParameter('estado', 'cancelado')
            ->orderBy('s.fechaFin', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Próximas renovaciones (próximos N días)
     */
    public function findProximasRenovaciones(int $dias = 30): array
    {
        $hoy = new \DateTime();
        $fechaLimite = new \DateTime("+{$dias} days");

        return $this->createQueryBuilder('s')
            ->where('s.estado = :estado')
            ->andWhere('s.autoRenovacion = :auto')
            ->andWhere('s.fechaProximoPago >= :hoy')
            ->andWhere('s.fechaProximoPago <= :limite')
            ->setParameter('estado', 'activo')
            ->setParameter('auto', true)
            ->setParameter('hoy', $hoy)
            ->setParameter('limite', $fechaLimite)
            ->orderBy('s.fechaProximoPago', 'ASC')
            ->getQuery()
            ->getResult();
    }

    // ============================================
    // ESTADÍSTICAS
    // ============================================

    /**
     * Contar suscripciones activas
     */
    public function countSuscripcionesActivas(): int
    {
        return $this->createQueryBuilder('s')
            ->select('COUNT(s.id)')
            ->where('s.estado = :estado')
            ->setParameter('estado', 'activo')
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Contar por estado
     */
    public function countByEstado(string $estado): int
    {
        return $this->createQueryBuilder('s')
            ->select('COUNT(s.id)')
            ->where('s.estado = :estado')
            ->setParameter('estado', $estado)
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Obtener MRR (Monthly Recurring Revenue)
     * Ingresos mensuales recurrentes
     */
    public function getMRR(): float
    {
        $result = $this->createQueryBuilder('s')
            ->select('SUM(s.precioMensual)')
            ->where('s.estado = :estado')
            ->andWhere('s.autoRenovacion = :auto')
            ->setParameter('estado', 'activo')
            ->setParameter('auto', true)
            ->getQuery()
            ->getSingleScalarResult();

        return $result ? (float) $result : 0.0;
    }

    /**
     * Obtener estadísticas generales
     */
    public function getEstadisticas(): array
    {
        $total = $this->createQueryBuilder('s')
            ->select('COUNT(s.id)')
            ->getQuery()
            ->getSingleScalarResult();

        $activas = $this->createQueryBuilder('s')
            ->select('COUNT(s.id)')
            ->where('s.estado = :estado')
            ->setParameter('estado', 'activo')
            ->getQuery()
            ->getSingleScalarResult();

        $canceladas = $this->createQueryBuilder('s')
            ->select('COUNT(s.id)')
            ->where('s.estado = :estado')
            ->setParameter('estado', 'cancelado')
            ->getQuery()
            ->getSingleScalarResult();

        $expiradas = $this->createQueryBuilder('s')
            ->select('COUNT(s.id)')
            ->where('s.estado = :estado')
            ->setParameter('estado', 'expirado')
            ->getQuery()
            ->getSingleScalarResult();

        return [
            'total' => $total,
            'activas' => $activas,
            'canceladas' => $canceladas,
            'expiradas' => $expiradas,
        ];
    }

    /**
     * Buscar suscripciones con filtros y paginación
     */
    public function searchSuscripciones(
        ?string $estado = null,
        ?int $usuarioId = null,
        ?int $entrenadorId = null,
        ?string $metodoPago = null,
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

        if ($metodoPago) {
            $qb->andWhere('s.metodoPago = :metodo')
               ->setParameter('metodo', $metodoPago);
        }

        $offset = ($page - 1) * $limit;

        return $qb->orderBy('s.fechaInicio', 'DESC')
                  ->setMaxResults($limit)
                  ->setFirstResult($offset)
                  ->getQuery()
                  ->getResult();
    }

    /**
     * Contar suscripciones con filtros
     */
    public function countSuscripciones(
        ?string $estado = null,
        ?int $usuarioId = null,
        ?int $entrenadorId = null
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

        return $qb->getQuery()->getSingleScalarResult();
    }

    /**
     * Total de suscripciones
     */
    public function countTotal(): int
    {
        return $this->createQueryBuilder('s')
            ->select('COUNT(s.id)')
            ->getQuery()
            ->getSingleScalarResult();
    }
}