<?php

namespace App\Service;

use App\Entity\Entrenador;
use App\Entity\SolicitudEntrenamiento;
use App\Entity\Usuario;
use App\Repository\SolicitudEntrenamientoRepository;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Reglas de negocio de las solicitudes de entrenamiento (cliente -> entrenador).
 *
 * Modelo unidireccional: el cliente solicita, el entrenador acepta o rechaza.
 * Un cliente solo puede tener un entrenador activo (Usuario::entrenadorAsignado)
 * y una solicitud pendiente a la vez.
 */
class SolicitudEntrenamientoService
{
    public function __construct(
        private SolicitudEntrenamientoRepository $solicitudRepository,
        private EntityManagerInterface $entityManager
    ) {
    }

    /**
     * @throws \DomainException si el usuario ya tiene entrenador o solicitud pendiente
     */
    public function solicitar(Usuario $usuario, Entrenador $entrenador, ?string $mensaje): SolicitudEntrenamiento
    {
        if ($usuario->getEntrenadorAsignado()) {
            throw new \DomainException('Ya tienes un entrenador activo. Finaliza esa relación antes de solicitar otro.');
        }

        if ($this->solicitudRepository->findPendienteDeUsuario($usuario)) {
            throw new \DomainException('Ya tienes una solicitud pendiente. Espera respuesta o cancélala antes de solicitar a otro entrenador.');
        }

        $solicitud = new SolicitudEntrenamiento();
        $solicitud->setUsuario($usuario);
        $solicitud->setEntrenador($entrenador);
        $solicitud->setMensaje($mensaje);
        $solicitud->setEstado('pendiente');

        $this->solicitudRepository->save($solicitud);

        return $solicitud;
    }

    /**
     * @throws \DomainException si la solicitud ya no está pendiente
     */
    public function aceptar(SolicitudEntrenamiento $solicitud): void
    {
        if (!$solicitud->estaPendiente()) {
            throw new \DomainException('Esta solicitud ya no está pendiente.');
        }

        $usuario = $solicitud->getUsuario();

        $solicitud->setEstado('aceptada');
        $solicitud->setFechaRespuesta(new \DateTime());
        $usuario->setEntrenadorAsignado($solicitud->getEntrenador());

        // Por seguridad: cancelar cualquier otra solicitud pendiente que pudiera existir
        $otraPendiente = $this->solicitudRepository->findPendienteDeUsuario($usuario);
        if ($otraPendiente && $otraPendiente->getId() !== $solicitud->getId()) {
            $otraPendiente->setEstado('cancelada');
            $otraPendiente->setFechaRespuesta(new \DateTime());
        }

        $this->entityManager->flush();
    }

    /**
     * @throws \DomainException si la solicitud ya no está pendiente
     */
    public function rechazar(SolicitudEntrenamiento $solicitud, ?string $motivo): void
    {
        if (!$solicitud->estaPendiente()) {
            throw new \DomainException('Esta solicitud ya no está pendiente.');
        }

        $solicitud->setEstado('rechazada');
        $solicitud->setMotivoRechazo($motivo);
        $solicitud->setFechaRespuesta(new \DateTime());

        $this->entityManager->flush();
    }

    /**
     * @throws \DomainException si la solicitud ya no está pendiente
     */
    public function cancelar(SolicitudEntrenamiento $solicitud): void
    {
        if (!$solicitud->estaPendiente()) {
            throw new \DomainException('Esta solicitud ya no está pendiente.');
        }

        $solicitud->setEstado('cancelada');
        $solicitud->setFechaRespuesta(new \DateTime());

        $this->entityManager->flush();
    }

    /**
     * Termina la relación activa de un usuario (si la tiene).
     *
     * @throws \DomainException si el usuario no tiene entrenador asignado
     */
    public function finalizar(Usuario $usuario): void
    {
        if (!$usuario->getEntrenadorAsignado()) {
            throw new \DomainException('No tienes ninguna relación activa que finalizar.');
        }

        $solicitud = $this->solicitudRepository->findAceptadaDeUsuario($usuario);
        if ($solicitud) {
            $solicitud->setEstado('finalizada');
            $solicitud->setFechaFin(new \DateTime());
        }

        $usuario->setEntrenadorAsignado(null);

        $this->entityManager->flush();
    }
}
