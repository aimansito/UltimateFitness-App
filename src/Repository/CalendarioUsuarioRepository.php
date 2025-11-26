<?php

namespace App\Repository;

use App\Entity\CalendarioUsuario;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repository para CalendarioUsuario
 */
class CalendarioUsuarioRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CalendarioUsuario::class);
    }

    public function save(CalendarioUsuario $calendario, bool $flush = true): void
    {
        $this->getEntityManager()->persist($calendario);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(CalendarioUsuario $calendario, bool $flush = true): void
    {
        $this->getEntityManager()->remove($calendario);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Obtener calendario de un usuario
     */
    public function findByUsuario(int $usuarioId): array
    {
        return $this->createQueryBuilder('c')
            ->where('c.usuarioId = :usuario')
            ->setParameter('usuario', $usuarioId)
            ->orderBy('c.diaSemana', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Obtener día específico de un usuario
     */
    public function findByUsuarioYDia(int $usuarioId, string $dia): ?CalendarioUsuario
    {
        return $this->createQueryBuilder('c')
            ->where('c.usuarioId = :usuario')
            ->andWhere('c.diaSemana = :dia')
            ->setParameter('usuario', $usuarioId)
            ->setParameter('dia', $dia)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Obtener eventos completados de un usuario
     */
    public function findCompletadosByUsuario(int $usuarioId): array
    {
        return $this->createQueryBuilder('c')
            ->where('c.usuarioId = :usuario')
            ->andWhere('c.completado = :completado')
            ->setParameter('usuario', $usuarioId)
            ->setParameter('completado', true)
            ->orderBy('c.fechaAsignacion', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Obtener eventos pendientes de un usuario
     */
    public function findPendientesByUsuario(int $usuarioId): array
    {
        return $this->createQueryBuilder('c')
            ->where('c.usuarioId = :usuario')
            ->andWhere('c.completado = :completado')
            ->setParameter('usuario', $usuarioId)
            ->setParameter('completado', false)
            ->orderBy('c.diaSemana', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Contar eventos completados por usuario
     */
    public function countCompletadosByUsuario(int $usuarioId): int
    {
        return $this->createQueryBuilder('c')
            ->select('COUNT(c.id)')
            ->where('c.usuarioId = :usuario')
            ->andWhere('c.completado = :completado')
            ->setParameter('usuario', $usuarioId)
            ->setParameter('completado', true)
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Contar eventos totales por usuario
     */
    public function countByUsuario(int $usuarioId): int
    {
        return $this->createQueryBuilder('c')
            ->select('COUNT(c.id)')
            ->where('c.usuarioId = :usuario')
            ->setParameter('usuario', $usuarioId)
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Obtener progreso de usuario (porcentaje completado)
     */
    public function getProgresoUsuario(int $usuarioId): array
    {
        $total = $this->countByUsuario($usuarioId);
        $completados = $this->countCompletadosByUsuario($usuarioId);

        $porcentaje = $total > 0 ? ($completados / $total) * 100 : 0;

        return [
            'total' => $total,
            'completados' => $completados,
            'pendientes' => $total - $completados,
            'porcentaje' => round($porcentaje, 2),
        ];
    }

    /**
     * Limpiar calendario de usuario (eliminar todo)
     */
    public function limpiarCalendarioUsuario(int $usuarioId): void
    {
        $this->createQueryBuilder('c')
            ->delete()
            ->where('c.usuarioId = :usuario')
            ->setParameter('usuario', $usuarioId)
            ->getQuery()
            ->execute();
    }

    /**
     * Marcar día como completado
     */
    public function marcarComoCompletado(int $calendarioId): void
    {
        $calendario = $this->find($calendarioId);
        if ($calendario) {
            $calendario->setCompletado(true);
            $this->save($calendario);
        }
    }
}