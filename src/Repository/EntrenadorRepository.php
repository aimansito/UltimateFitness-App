<?php

namespace App\Repository;

use App\Entity\Entrenador;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repository para Entrenadores
 * Contiene métodos para gestión de entrenadores y aplicaciones
 */
class EntrenadorRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Entrenador::class);
    }

    /**
     * Guardar entrenador
     */
    public function save(Entrenador $entrenador, bool $flush = true): void
    {
        $this->getEntityManager()->persist($entrenador);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Eliminar entrenador
     */
    public function remove(Entrenador $entrenador, bool $flush = true): void
    {
        $this->getEntityManager()->remove($entrenador);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    // ============================================
    // BÚSQUEDAS BÁSICAS
    // ============================================

    /**
     * Buscar entrenador por email
     */
    public function findByEmail(string $email): ?Entrenador
    {
        return $this->createQueryBuilder('e')
            ->where('e.email = :email')
            ->setParameter('email', $email)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Buscar entrenadores activos
     */
    public function findActivos(): array
    {
        return $this->createQueryBuilder('e')
            ->where('e.activo = :activo')
            ->andWhere('e.estadoAplicacion = :estado')
            ->setParameter('activo', true)
            ->setParameter('estado', 'aprobado')
            ->orderBy('e.nombre', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar entrenadores por especialidad
     */
    public function findByEspecialidad(string $especialidad): array
    {
        return $this->createQueryBuilder('e')
            ->where('e.especialidad = :especialidad')
            ->andWhere('e.activo = :activo')
            ->setParameter('especialidad', $especialidad)
            ->setParameter('activo', true)
            ->orderBy('e.valoracionPromedio', 'DESC')
            ->getQuery()
            ->getResult();
    }

    // ============================================
    // APLICACIONES DE ENTRENADORES
    // ============================================

    /**
     * Buscar aplicaciones pendientes
     */
    public function findAplicacionesPendientes(): array
    {
        return $this->createQueryBuilder('e')
            ->where('e.estadoAplicacion = :estado')
            ->setParameter('estado', 'pendiente')
            ->orderBy('e.fechaAplicacion', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar aplicaciones aprobadas
     */
    public function findAplicacionesAprobadas(): array
    {
        return $this->createQueryBuilder('e')
            ->where('e.estadoAplicacion = :estado')
            ->setParameter('estado', 'aprobado')
            ->orderBy('e.fechaRegistro', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar aplicaciones rechazadas
     */
    public function findAplicacionesRechazadas(): array
    {
        return $this->createQueryBuilder('e')
            ->where('e.estadoAplicacion = :estado')
            ->setParameter('estado', 'rechazado')
            ->orderBy('e.fechaAplicacion', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Contar aplicaciones pendientes
     */
    public function countAplicacionesPendientes(): int
    {
        return $this->createQueryBuilder('e')
            ->select('COUNT(e.id)')
            ->where('e.estadoAplicacion = :estado')
            ->setParameter('estado', 'pendiente')
            ->getQuery()
            ->getSingleScalarResult();
    }

    // ============================================
    // BÚSQUEDAS AVANZADAS
    // ============================================

    /**
     * Buscar entrenadores mejor valorados
     */
    public function findMejorValorados(int $limit = 10): array
    {
        return $this->createQueryBuilder('e')
            ->where('e.activo = :activo')
            ->andWhere('e.totalValoraciones > :minValoraciones')
            ->setParameter('activo', true)
            ->setParameter('minValoraciones', 5)
            ->orderBy('e.valoracionPromedio', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar entrenadores por años de experiencia
     */
    public function findByExperienciaMinima(int $anosMinimos): array
    {
        return $this->createQueryBuilder('e')
            ->where('e.anosExperiencia >= :anos')
            ->andWhere('e.activo = :activo')
            ->setParameter('anos', $anosMinimos)
            ->setParameter('activo', true)
            ->orderBy('e.anosExperiencia', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar entrenadores con filtros
     */
    public function searchEntrenadores(
        ?string $nombre = null,
        ?string $especialidad = null,
        ?bool $activo = null,
        ?string $estadoAplicacion = null
    ): array {
        $qb = $this->createQueryBuilder('e');

        if ($nombre) {
            $qb->andWhere('e.nombre LIKE :nombre OR e.apellidos LIKE :nombre OR e.email LIKE :nombre')
               ->setParameter('nombre', '%' . $nombre . '%');
        }

        if ($especialidad) {
            $qb->andWhere('e.especialidad = :especialidad')
               ->setParameter('especialidad', $especialidad);
        }

        if ($activo !== null) {
            $qb->andWhere('e.activo = :activo')
               ->setParameter('activo', $activo);
        }

        if ($estadoAplicacion) {
            $qb->andWhere('e.estadoAplicacion = :estado')
               ->setParameter('estado', $estadoAplicacion);
        }

        return $qb->orderBy('e.nombre', 'ASC')
                  ->getQuery()
                  ->getResult();
    }

    // ============================================
    // ESTADÍSTICAS
    // ============================================

    /**
     * Obtener estadísticas generales de entrenadores
     */
    public function getEstadisticas(): array
    {
        $totalQb = $this->createQueryBuilder('e1');
        $total = $totalQb->select('COUNT(e1.id)')
            ->getQuery()
            ->getSingleScalarResult();

        $activosQb = $this->createQueryBuilder('e2');
        $activos = $activosQb->select('COUNT(e2.id)')
            ->where('e2.activo = :activo')
            ->setParameter('activo', true)
            ->getQuery()
            ->getSingleScalarResult();

        $pendientesQb = $this->createQueryBuilder('e3');
        $pendientes = $pendientesQb->select('COUNT(e3.id)')
            ->where('e3.estadoAplicacion = :estado')
            ->setParameter('estado', 'pendiente')
            ->getQuery()
            ->getSingleScalarResult();

        $nutricionQb = $this->createQueryBuilder('e4');
        $nutricion = $nutricionQb->select('COUNT(e4.id)')
            ->where('e4.especialidad = :esp')
            ->setParameter('esp', 'nutricion')
            ->getQuery()
            ->getSingleScalarResult();

        $entrenamientoQb = $this->createQueryBuilder('e5');
        $entrenamiento = $entrenamientoQb->select('COUNT(e5.id)')
            ->where('e5.especialidad = :esp')
            ->setParameter('esp', 'entrenamiento')
            ->getQuery()
            ->getSingleScalarResult();

        $ambosQb = $this->createQueryBuilder('e6');
        $ambos = $ambosQb->select('COUNT(e6.id)')
            ->where('e6.especialidad = :esp')
            ->setParameter('esp', 'ambos')
            ->getQuery()
            ->getSingleScalarResult();

        return [
            'total' => (int) $total,
            'activos' => (int) $activos,
            'pendientes' => (int) $pendientes,
            'nutricion' => (int) $nutricion,
            'entrenamiento' => (int) $entrenamiento,
            'ambos' => (int) $ambos,
        ];
    }

    /**
     * Contar entrenadores activos
     */
    public function countActivos(): int
    {
        return $this->createQueryBuilder('e')
            ->select('COUNT(e.id)')
            ->where('e.activo = :activo')
            ->setParameter('activo', true)
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Obtener valoración promedio global
     */
    public function getValoracionPromedioGlobal(): float
    {
        $result = $this->createQueryBuilder('e')
            ->select('AVG(e.valoracionPromedio)')
            ->where('e.activo = :activo')
            ->andWhere('e.totalValoraciones > 0')
            ->setParameter('activo', true)
            ->getQuery()
            ->getSingleScalarResult();

        return $result ? (float) $result : 0.0;
    }

    // ============================================
    // PARA PANEL DE ADMIN
    // ============================================

    /**
     * Listar todos los entrenadores con paginación
     */
    public function findAllPaginated(int $page = 1, int $limit = 20): array
    {
        $offset = ($page - 1) * $limit;

        return $this->createQueryBuilder('e')
            ->orderBy('e.fechaRegistro', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();
    }

    /**
     * Contar total de entrenadores
     */
    public function countTotal(): int
    {
        return $this->createQueryBuilder('e')
            ->select('COUNT(e.id)')
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Últimos entrenadores registrados
     */
    public function findUltimosRegistros(int $limit = 10): array
    {
        return $this->createQueryBuilder('e')
            ->orderBy('e.fechaRegistro', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}