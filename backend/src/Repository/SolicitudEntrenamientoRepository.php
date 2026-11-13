<?php

namespace App\Repository;

use App\Entity\Entrenador;
use App\Entity\SolicitudEntrenamiento;
use App\Entity\Usuario;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repository para Solicitudes de entrenamiento (cliente -> entrenador)
 */
class SolicitudEntrenamientoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SolicitudEntrenamiento::class);
    }

    public function save(SolicitudEntrenamiento $solicitud, bool $flush = true): void
    {
        $this->getEntityManager()->persist($solicitud);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Solicitud pendiente actual de un usuario (si la tiene)
     */
    public function findPendienteDeUsuario(Usuario $usuario): ?SolicitudEntrenamiento
    {
        return $this->createQueryBuilder('s')
            ->where('s.usuario = :usuario')
            ->andWhere('s.estado = :estado')
            ->setParameter('usuario', $usuario)
            ->setParameter('estado', 'pendiente')
            ->orderBy('s.fechaSolicitud', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Solicitud aceptada (relación activa) de un usuario
     */
    public function findAceptadaDeUsuario(Usuario $usuario): ?SolicitudEntrenamiento
    {
        return $this->createQueryBuilder('s')
            ->where('s.usuario = :usuario')
            ->andWhere('s.estado = :estado')
            ->setParameter('usuario', $usuario)
            ->setParameter('estado', 'aceptada')
            ->orderBy('s.fechaRespuesta', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Solicitudes pendientes recibidas por un entrenador
     */
    public function findPendientesDeEntrenador(Entrenador $entrenador): array
    {
        return $this->createQueryBuilder('s')
            ->where('s.entrenador = :entrenador')
            ->andWhere('s.estado = :estado')
            ->setParameter('entrenador', $entrenador)
            ->setParameter('estado', 'pendiente')
            ->orderBy('s.fechaSolicitud', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
