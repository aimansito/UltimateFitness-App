<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;

use App\Repository\SuscripcionRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource]
#[ORM\Entity(repositoryClass: SuscripcionRepository::class)]
#[ORM\Table(name: 'suscripciones')]
#[ORM\Index(name: 'idx_usuario', columns: ['usuario_id'])]
#[ORM\Index(name: 'idx_estado', columns: ['estado'])]
class Suscripcion
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Usuario::class, inversedBy: 'suscripciones')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Usuario $usuario = null;

    #[ORM\ManyToOne(targetEntity: Servicio::class, inversedBy: 'suscripciones')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'RESTRICT')]
    private ?Servicio $servicio = null;

    #[ORM\ManyToOne(targetEntity: Entrenador::class)]
    #[ORM\JoinColumn(name: 'entrenador_asignado_id', nullable: true, onDelete: 'SET NULL')]
    private ?Entrenador $entrenadorAsignado = null;

    #[ORM\Column(options: ['default' => false])]
    private bool $entrenamientoPresencial = false;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $fechaInicio = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $fechaFin = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 8, scale: 2, options: ['default' => '0.00'])]
    private string $precioMensual = '0.00';

    #[ORM\Column(length: 20, options: ['default' => 'activo'])]
    private string $estado = 'activo';

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $metodoPago = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeInterface $fechaCreacion = null;

    public function __construct()
    {
        $this->fechaCreacion = new \DateTime();
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
    public function getServicio(): ?Servicio
    {
        return $this->servicio;
    }
    public function setServicio(?Servicio $servicio): static
    {
        $this->servicio = $servicio;
        return $this;
    }
    public function getEntrenadorAsignado(): ?Entrenador
    {
        return $this->entrenadorAsignado;
    }
    public function setEntrenadorAsignado(?Entrenador $entrenadorAsignado): static
    {
        $this->entrenadorAsignado = $entrenadorAsignado;
        return $this;
    }
    public function isEntrenamientoPresencial(): bool
    {
        return $this->entrenamientoPresencial;
    }
    public function setEntrenamientoPresencial(bool $entrenamientoPresencial): static
    {
        $this->entrenamientoPresencial = $entrenamientoPresencial;
        return $this;
    }
    public function getFechaInicio(): ?\DateTimeInterface
    {
        return $this->fechaInicio;
    }
    public function setFechaInicio(\DateTimeInterface $fechaInicio): static
    {
        $this->fechaInicio = $fechaInicio;
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
    public function getPrecioMensual(): string
    {
        return $this->precioMensual;
    }
    public function setPrecioMensual(string $precioMensual): static
    {
        $this->precioMensual = $precioMensual;
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
    public function getMetodoPago(): ?string
    {
        return $this->metodoPago;
    }
    public function setMetodoPago(?string $metodoPago): static
    {
        $this->metodoPago = $metodoPago;
        return $this;
    }
    public function getFechaCreacion(): ?\DateTimeInterface
    {
        return $this->fechaCreacion;
    }
    public function setFechaCreacion(\DateTimeInterface $fechaCreacion): static
    {
        $this->fechaCreacion = $fechaCreacion;
        return $this;
    }
    public function isActiva(): bool
    {
        return $this->estado === 'activo';
    }
}
