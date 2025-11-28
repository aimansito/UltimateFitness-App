<?php

namespace App\Repository;

use App\Entity\Usuario;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repository para Usuarios
 * Contiene métodos para gestión de usuarios y estadísticas
 */
class UsuarioRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Usuario::class);
    }

    /**
     * Guardar usuario
     */
    public function save(Usuario $usuario, bool $flush = true): void
    {
        $this->getEntityManager()->persist($usuario);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Eliminar usuario
     */
    public function remove(Usuario $usuario, bool $flush = true): void
    {
        $this->getEntityManager()->remove($usuario);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    // ============================================
    // BÚSQUEDAS BÁSICAS
    // ============================================

    /**
     * Buscar usuario por email
     */
    public function findByEmail(string $email): ?Usuario
    {
        return $this->createQueryBuilder('u')
            ->where('u.email = :email')
            ->setParameter('email', $email)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Verificar si existe un email
     */
    public function emailExists(string $email): bool
    {
        $count = $this->createQueryBuilder('u')
            ->select('COUNT(u.id)')
            ->where('u.email = :email')
            ->setParameter('email', $email)
            ->getQuery()
            ->getSingleScalarResult();

        return $count > 0;
    }

    /**
     * Buscar usuarios premium
     */
    public function findUsuariosPremium(): array
    {
        return $this->createQueryBuilder('u')
            ->where('u.esPremium = :premium')
            ->setParameter('premium', true)
            ->orderBy('u.fechaPremium', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar usuarios por rol
     */
    public function findByRol(string $rol): array
    {
        return $this->createQueryBuilder('u')
            ->where('u.rol = :rol')
            ->setParameter('rol', $rol)
            ->orderBy('u.nombre', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar administradores
     */
    public function findAdministradores(): array
    {
        return $this->findByRol('admin');
    }

    /**
     * Buscar clientes
     */
    public function findClientes(): array
    {
        return $this->findByRol('cliente');
    }

    // ============================================
    // ESTADÍSTICAS
    // ============================================

    /**
     * Contar usuarios premium
     */
    public function countUsuariosPremium(): int
    {
        return $this->createQueryBuilder('u')
            ->select('COUNT(u.id)')
            ->where('u.esPremium = :premium')
            ->setParameter('premium', true)
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Contar usuarios por rol
     */
    public function countByRol(string $rol): int
    {
        return $this->createQueryBuilder('u')
            ->select('COUNT(u.id)')
            ->where('u.rol = :rol')
            ->setParameter('rol', $rol)
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Contar nuevos premium en rango de fechas
     */
    public function findNuevosPremiumEnRango(\DateTime $inicio, \DateTime $fin): array
    {
        return $this->createQueryBuilder('u')
            ->where('u.fechaPremium >= :inicio')
            ->andWhere('u.fechaPremium <= :fin')
            ->setParameter('inicio', $inicio)
            ->setParameter('fin', $fin)
            ->orderBy('u.fechaPremium', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Obtener estadísticas generales
     */
    public function getEstadisticasUsuarios(): array
    {
        $totalQb = $this->createQueryBuilder('u1');
        $total = $totalQb->select('COUNT(u1.id)')
            ->getQuery()
            ->getSingleScalarResult();

        $premiumQb = $this->createQueryBuilder('u2');
        $premium = $premiumQb->select('COUNT(u2.id)')
            ->where('u2.esPremium = :premium')
            ->setParameter('premium', true)
            ->getQuery()
            ->getSingleScalarResult();

        $gratuitosQb = $this->createQueryBuilder('u3');
        $gratuitos = $gratuitosQb->select('COUNT(u3.id)')
            ->where('u3.esPremium = :premium')
            ->setParameter('premium', false)
            ->getQuery()
            ->getSingleScalarResult();

        $adminsQb = $this->createQueryBuilder('u4');
        $admins = $adminsQb->select('COUNT(u4.id)')
            ->where('u4.rol = :rol')
            ->setParameter('rol', 'admin')
            ->getQuery()
            ->getSingleScalarResult();

        $clientesQb = $this->createQueryBuilder('u5');
        $clientes = $clientesQb->select('COUNT(u5.id)')
            ->where('u5.rol = :rol')
            ->setParameter('rol', 'cliente')
            ->getQuery()
            ->getSingleScalarResult();

        return [
            'total' => (int) $total,
            'premium' => (int) $premium,
            'gratuitos' => (int) $gratuitos,
            'admins' => (int) $admins,
            'clientes' => (int) $clientes,
        ];
    }

    // ============================================
    // BÚSQUEDAS AVANZADAS
    // ============================================

    /**
     * Buscar usuarios con filtros
     */
    public function searchUsuarios(
        ?string $search = null,
        ?bool $esPremium = null,
        ?string $rol = null,
        ?string $objetivo = null,
        int $page = 1,
        int $limit = 20
    ): array {
        $qb = $this->createQueryBuilder('u');

        if ($search) {
            $qb->andWhere(
                $qb->expr()->orX(
                    $qb->expr()->like('u.nombre', ':search'),
                    $qb->expr()->like('u.apellidos', ':search'),
                    $qb->expr()->like('u.email', ':search')
                )
            )->setParameter('search', '%' . $search . '%');
        }

        if ($esPremium !== null) {
            $qb->andWhere('u.esPremium = :premium')
               ->setParameter('premium', $esPremium);
        }

        if ($rol) {
            $qb->andWhere('u.rol = :rol')
               ->setParameter('rol', $rol);
        }

        if ($objetivo) {
            $qb->andWhere('u.objetivo = :objetivo')
               ->setParameter('objetivo', $objetivo);
        }

        $offset = ($page - 1) * $limit;

        return $qb->orderBy('u.fechaRegistro', 'DESC')
                  ->setMaxResults($limit)
                  ->setFirstResult($offset)
                  ->getQuery()
                  ->getResult();
    }

    /**
     * Contar usuarios con filtros
     */
    public function countUsuarios(
        ?string $search = null,
        ?bool $esPremium = null,
        ?string $rol = null
    ): int {
        $qb = $this->createQueryBuilder('u')
            ->select('COUNT(u.id)');

        if ($search) {
            $qb->andWhere(
                $qb->expr()->orX(
                    $qb->expr()->like('u.nombre', ':search'),
                    $qb->expr()->like('u.apellidos', ':search'),
                    $qb->expr()->like('u.email', ':search')
                )
            )->setParameter('search', '%' . $search . '%');
        }

        if ($esPremium !== null) {
            $qb->andWhere('u.esPremium = :premium')
               ->setParameter('premium', $esPremium);
        }

        if ($rol) {
            $qb->andWhere('u.rol = :rol')
               ->setParameter('rol', $rol);
        }

        return $qb->getQuery()->getSingleScalarResult();
    }

    /**
     * Últimos registros
     */
    public function findUltimosRegistros(int $limit = 10): array
    {
        return $this->createQueryBuilder('u')
            ->orderBy('u.fechaRegistro', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
    // ============================================
    // ACTIVIDAD DE USUARIOS
    // ============================================

    /**
     * Usuarios activos (con última conexión reciente)
     */
    public function findUsuariosActivos(int $diasInactividad = 30): array
    {
        $fechaLimite = new \DateTime("-{$diasInactividad} days");

        return $this->createQueryBuilder('u')
            ->where('u.ultimaConexion >= :fecha')
            ->setParameter('fecha', $fechaLimite)
            ->orderBy('u.ultimaConexion', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Usuarios inactivos
     */
    public function findUsuariosInactivos(int $diasInactividad = 30): array
    {
        $fechaLimite = new \DateTime("-{$diasInactividad} days");

        return $this->createQueryBuilder('u')
            ->where('u.ultimaConexion < :fecha OR u.ultimaConexion IS NULL')
            ->setParameter('fecha', $fechaLimite)
            ->orderBy('u.fechaRegistro', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Usuarios registrados en el último mes
     */
    public function findRegistradosUltimoMes(): array
    {
        $fechaInicio = new \DateTime('-1 month');

        return $this->createQueryBuilder('u')
            ->where('u.fechaRegistro >= :fecha')
            ->setParameter('fecha', $fechaInicio)
            ->orderBy('u.fechaRegistro', 'DESC')
            ->getQuery()
            ->getResult();
    }

    // ============================================
    // ESTADÍSTICAS DETALLADAS
    // ============================================

    /**
     * Estadísticas por objetivo
     */
    public function getEstadisticasPorObjetivo(): array
    {
        $qb = $this->createQueryBuilder('u');
        
        $result = $qb->select('u.objetivo, COUNT(u.id) as total')
            ->groupBy('u.objetivo')
            ->getQuery()
            ->getResult();

        $stats = [];
        foreach ($result as $row) {
            $objetivo = $row['objetivo'] ?? 'sin_objetivo';
            $stats[$objetivo] = (int) $row['total'];
        }

        return $stats;
    }

    /**
     * Contar nuevos premium en rango
     */
    public function countNuevosPremiumEnRango(\DateTime $inicio, \DateTime $fin): int
    {
        return $this->createQueryBuilder('u')
            ->select('COUNT(u.id)')
            ->where('u.fechaPremium >= :inicio')
            ->andWhere('u.fechaPremium <= :fin')
            ->setParameter('inicio', $inicio)
            ->setParameter('fin', $fin)
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Total de usuarios
     */
    public function countTotal(): int
    {
        return $this->createQueryBuilder('u')
            ->select('COUNT(u.id)')
            ->getQuery()
            ->getSingleScalarResult();
    }
}