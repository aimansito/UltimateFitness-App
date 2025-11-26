<?php

namespace App\Repository;

use App\Entity\ValoracionPlato;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repository para ValoracionPlato
 */
class ValoracionPlatoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ValoracionPlato::class);
    }

    public function save(ValoracionPlato $valoracion, bool $flush = true): void
    {
        $this->getEntityManager()->persist($valoracion);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(ValoracionPlato $valoracion, bool $flush = true): void
    {
        $this->getEntityManager()->remove($valoracion);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Buscar valoraciones de un plato (dieta_alimento)
     */
    public function findByPlato(int $dietaAlimentoId): array
    {
        return $this->createQueryBuilder('v')
            ->where('v.dietaAlimentoId = :plato')
            ->setParameter('plato', $dietaAlimentoId)
            ->orderBy('v.fecha', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar valoraciones de un usuario
     */
    public function findByUsuario(int $usuarioId): array
    {
        return $this->createQueryBuilder('v')
            ->where('v.usuarioId = :usuario')
            ->setParameter('usuario', $usuarioId)
            ->orderBy('v.fecha', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar valoración específica
     */
    public function findByPlatoYUsuario(int $dietaAlimentoId, int $usuarioId): ?ValoracionPlato
    {
        return $this->createQueryBuilder('v')
            ->where('v.dietaAlimentoId = :plato')
            ->andWhere('v.usuarioId = :usuario')
            ->setParameter('plato', $dietaAlimentoId)
            ->setParameter('usuario', $usuarioId)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Calcular promedio de un plato
     */
    public function getPromedioPlato(int $dietaAlimentoId): float
    {
        $result = $this->createQueryBuilder('v')
            ->select('AVG(v.estrellas)')
            ->where('v.dietaAlimentoId = :plato')
            ->setParameter('plato', $dietaAlimentoId)
            ->getQuery()
            ->getSingleScalarResult();

        return $result ? (float) $result : 0.0;
    }

    /**
     * Contar valoraciones de un plato
     */
    public function countByPlato(int $dietaAlimentoId): int
    {
        return $this->createQueryBuilder('v')
            ->select('COUNT(v.id)')
            ->where('v.dietaAlimentoId = :plato')
            ->setParameter('plato', $dietaAlimentoId)
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