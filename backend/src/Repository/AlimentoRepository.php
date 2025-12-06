<?php

namespace App\Repository;

use App\Entity\Alimento;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repository para Alimentos
 */
class AlimentoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Alimento::class);
    }

    public function save(Alimento $alimento, bool $flush = true): void
    {
        $this->getEntityManager()->persist($alimento);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Alimento $alimento, bool $flush = true): void
    {
        $this->getEntityManager()->remove($alimento);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Buscar por tipo de alimento
     */
    public function findByTipo(string $tipo): array
    {
        return $this->createQueryBuilder('a')
            ->where('a.tipoAlimento = :tipo')
            ->setParameter('tipo', $tipo)
            ->orderBy('a.nombre', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar por macronutriente principal
     */
    public function findByMacronutriente(string $macro): array
    {
        $qb = $this->createQueryBuilder('a');

        switch ($macro) {
            case 'proteina':
                $qb->where('a.proteinas > :minProteinas')
                   ->setParameter('minProteinas', 15);
                break;
            case 'carbohidrato':
                $qb->where('a.carbohidratos > :minCarbos')
                   ->setParameter('minCarbos', 20);
                break;
            case 'grasa':
                $qb->where('a.grasas > :minGrasas')
                   ->setParameter('minGrasas', 10);
                break;
        }

        return $qb->orderBy('a.nombre', 'ASC')
                  ->getQuery()
                  ->getResult();
    }

    /**
     * Buscar alimentos bajos en calorías
     */
    public function findBajosEnCalorias(int $maxCalorias = 100): array
    {
        return $this->createQueryBuilder('a')
            ->where('a.calorias <= :max')
            ->setParameter('max', $maxCalorias)
            ->orderBy('a.calorias', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar alimentos altos en proteínas
     */
    public function findAltosEnProteinas(int $minProteinas = 20): array
    {
        return $this->createQueryBuilder('a')
            ->where('a.proteinas >= :min')
            ->setParameter('min', $minProteinas)
            ->orderBy('a.proteinas', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar con filtros
     */
    public function searchAlimentos(
        ?string $search = null,
        ?string $tipo = null,
        ?string $macronutriente = null,
        int $page = 1,
        int $limit = 20
    ): array {
        $qb = $this->createQueryBuilder('a');

        if ($search) {
            $qb->andWhere('a.nombre LIKE :search OR a.descripcion LIKE :search')
               ->setParameter('search', '%' . $search . '%');
        }

        if ($tipo) {
            $qb->andWhere('a.tipoAlimento = :tipo')
               ->setParameter('tipo', $tipo);
        }

        if ($macronutriente) {
            switch ($macronutriente) {
                case 'proteina':
                    $qb->andWhere('a.proteinas > :minProteinas')
                       ->setParameter('minProteinas', 15);
                    break;
                case 'carbohidrato':
                    $qb->andWhere('a.carbohidratos > :minCarbos')
                       ->setParameter('minCarbos', 20);
                    break;
                case 'grasa':
                    $qb->andWhere('a.grasas > :minGrasas')
                       ->setParameter('minGrasas', 10);
                    break;
            }
        }

        $offset = ($page - 1) * $limit;

        return $qb->orderBy('a.nombre', 'ASC')
                  ->setMaxResults($limit)
                  ->setFirstResult($offset)
                  ->getQuery()
                  ->getResult();
    }

    /**
     * Contar total
     */
    public function countTotal(): int
    {
        return $this->createQueryBuilder('a')
            ->select('COUNT(a.id)')
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Contar por tipo
     */
    public function countByTipo(string $tipo): int
    {
        return $this->createQueryBuilder('a')
            ->select('COUNT(a.id)')
            ->where('a.tipoAlimento = :tipo')
            ->setParameter('tipo', $tipo)
            ->getQuery()
            ->getSingleScalarResult();
    }
}