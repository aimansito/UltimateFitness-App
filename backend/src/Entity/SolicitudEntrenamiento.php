<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\SolicitudEntrenamientoRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource(operations: [])]  // Deshabilitado - usar controladores personalizados
#[ORM\Entity(repositoryClass: SolicitudEntrenamientoRepository::class)]
#[ORM\Table(name: 'solicitudes_entrenamiento')]
#[ORM\Index(name: 'idx_usuario', columns: ['usuario_id'])]
#[ORM\Index(name: 'idx_entrenador', columns: ['entrenador_id'])]
#[ORM\Index(name: 'idx_estado', columns: ['estado'])]
class SolicitudEntrenamiento
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Usuario::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Usuario $usuario = null;

    #[ORM\ManyToOne(targetEntity: Entrenador::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Entrenador $entrenador = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $mensaje = null;

    #[ORM\Column(length: 20, options: ['default' => 'pendiente'])]
    private string $estado = 'pendiente';

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $motivoRechazo = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $fechaSolicitud = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $fechaRespuesta = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $fechaFin = null;

    public function __construct()
    {
        $this->fechaSolicitud = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsuario(): ?Usuario
    {
        return $this->usuario;
    }

    public function setUsuario(?Usuario $usuario): static
    {
        $this->usuario = $usuario;
        return $this;
    }

    public function getEntrenador(): ?Entrenador
    {
        return $this->entrenador;
    }

    public function setEntrenador(?Entrenador $entrenador): static
    {
        $this->entrenador = $entrenador;
        return $this;
    }

    public function getMensaje(): ?string
    {
        return $this->mensaje;
    }

    public function setMensaje(?string $mensaje): static
    {
        $this->mensaje = $mensaje;
        return $this;
    }

    public function getEstado(): string
    {
        return $this->estado;
    }

    public function setEstado(string $estado): static
    {
        $this->estado = $estado;
        return $this;
    }

    public function getMotivoRechazo(): ?string
    {
        return $this->motivoRechazo;
    }

    public function setMotivoRechazo(?string $motivoRechazo): static
    {
        $this->motivoRechazo = $motivoRechazo;
        return $this;
    }

    public function getFechaSolicitud(): ?\DateTimeInterface
    {
        return $this->fechaSolicitud;
    }

    public function setFechaSolicitud(\DateTimeInterface $fechaSolicitud): static
    {
        $this->fechaSolicitud = $fechaSolicitud;
        return $this;
    }

    public function getFechaRespuesta(): ?\DateTimeInterface
    {
        return $this->fechaRespuesta;
    }

    public function setFechaRespuesta(?\DateTimeInterface $fechaRespuesta): static
    {
        $this->fechaRespuesta = $fechaRespuesta;
        return $this;
    }

    public function getFechaFin(): ?\DateTimeInterface
    {
        return $this->fechaFin;
    }

    public function setFechaFin(?\DateTimeInterface $fechaFin): static
    {
        $this->fechaFin = $fechaFin;
        return $this;
    }

    // ============================================
    // ESTADOS
    // ============================================

    public function estaPendiente(): bool
    {
        return $this->estado === 'pendiente';
    }

    public function estaAceptada(): bool
    {
        return $this->estado === 'aceptada';
    }
}
