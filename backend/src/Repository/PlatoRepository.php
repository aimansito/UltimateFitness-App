<?php

namespace App\Repository;

use App\Entity\Plato;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repository para Platos
 */
class PlatoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Plato::class);
    }

    public function save(Plato $plato, bool $flush = true): void
    {
        $this->getEntityManager()->persist($plato);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Plato $plato, bool $flush = true): void
    {
        $this->getEntityManager()->remove($plato);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Buscar platos públicos
     */
    public function findPlatosPublicos(): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.esPublico = :publico')
            ->setParameter('publico', true)
            ->orderBy('p.valoracionPromedio', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar por tipo de comida
     */
    public function findByTipoComida(string $tipo): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.tipoComida = :tipo')
            ->andWhere('p.esPublico = :publico')
            ->setParameter('tipo', $tipo)
            ->setParameter('publico', true)
            ->orderBy('p.nombre', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar por creador
     */
    public function findByCreador(int $creadorId): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.creadorId = :creador')
            ->setParameter('creador', $creadorId)
            ->orderBy('p.fechaCreacion', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar platos mejor valorados
     */
    public function findMejorValorados(int $limit = 10): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.esPublico = :publico')
            ->andWhere('p.totalValoraciones > :min')
            ->setParameter('publico', true)
            ->setParameter('min', 5)
            ->orderBy('p.valoracionPromedio', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar platos bajos en calorías
     */
    public function findBajosEnCalorias(int $maxCalorias = 500): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.esPublico = :publico')
            ->andWhere('p.caloriasTotales <= :max')
            ->setParameter('publico', true)
            ->setParameter('max', $maxCalorias)
            ->orderBy('p.caloriasTotales', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar platos altos en proteínas
     */
    public function findAltosEnProteinas(int $minProteinas = 30): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.esPublico = :publico')
            ->andWhere('p.proteinasTotales >= :min')
            ->setParameter('publico', true)
            ->setParameter('min', $minProteinas)
            ->orderBy('p.proteinasTotales', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar platos por dificultad
     */
    public function findByDificultad(string $dificultad): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.dificultad = :dificultad')
            ->andWhere('p.esPublico = :publico')
            ->setParameter('dificultad', $dificultad)
            ->setParameter('publico', true)
            ->orderBy('p.nombre', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Buscar con filtros
     */
    public function searchPlatos(
        ?string $search = null,
        ?string $tipoComida = null,
        ?string $dificultad = null,
        ?bool $esPublico = null,
        int $page = 1,
        int $limit = 20
    ): array {
        $qb = $this->createQueryBuilder('p');

        if ($search) {
            $qb->andWhere('p.nombre LIKE :search OR p.descripcion LIKE :search')
               ->setParameter('search', '%' . $search . '%');
        }

        if ($tipoComida) {
            $qb->andWhere('p.tipoComida = :tipo')
               ->setParameter('tipo', $tipoComida);
        }

        if ($dificultad) {
            $qb->andWhere('p.dificultad = :dificultad')
               ->setParameter('dificultad', $dificultad);
        }

        if ($esPublico !== null) {
            $qb->andWhere('p.esPublico = :publico')
               ->setParameter('publico', $esPublico);
        }

        $offset = ($page - 1) * $limit;

        return $qb->orderBy('p.fechaCreacion', 'DESC')
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
        return $this->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Contar públicos
     */
    public function countPublicos(): int
    {
        return $this->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->where('p.esPublico = :publico')
            ->setParameter('publico', true)
            ->getQuery()
            ->getSingleScalarResult();
    }
}