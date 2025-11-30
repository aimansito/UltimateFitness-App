<?php

namespace App\Repository;

use App\Entity\DietaPlato;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<DietaPlato>
 */
class DietaPlatoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, DietaPlato::class);
    }

    /**
     * Obtiene todos los platos de una dieta para un día específico
     */
    public function findByDietaAndDia(int $dietaId, string $diaSemana): array
    {
        return $this->createQueryBuilder('dp')
            ->andWhere('dp.dieta = :dietaId')
            ->andWhere('dp.diaSemana = :diaSemana')
            ->setParameter('dietaId', $dietaId)
            ->setParameter('diaSemana', $diaSemana)
            ->orderBy('dp.orden', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Obtiene platos de una dieta filtrados por día y tipo de comida
     */
    public function findByDietaDiaAndTipo(int $dietaId, string $diaSemana, string $tipoComida): array
    {
        return $this->createQueryBuilder('dp')
            ->andWhere('dp.dieta = :dietaId')
            ->andWhere('dp.diaSemana = :diaSemana')
            ->andWhere('dp.tipoComida = :tipoComida')
            ->setParameter('dietaId', $dietaId)
            ->setParameter('diaSemana', $diaSemana)
            ->setParameter('tipoComida', $tipoComida)
            ->orderBy('dp.orden', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
