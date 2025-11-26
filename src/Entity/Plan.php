<?php

namespace App\Entity;

use App\Repository\PlanRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Plan - Representa un plan de suscripción disponible
 */
#[ORM\Entity(repositoryClass: PlanRepository::class)]
#[ORM\Table(name: 'planes')]
#[ORM\Index(name: 'idx_activo', columns: ['activo'])]
#[ORM\Index(name: 'idx_orden', columns: ['orden'])]
class Plan
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    private ?int $id = null;

    #[ORM\Column(type: Types::STRING, length: 100)]
    #[Assert\NotBlank(message: 'El nombre del plan es obligatorio')]
    #[Assert\Length(max: 100)]
    private ?string $nombre = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $descripcion = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    #[Assert\NotBlank(message: 'El precio mensual es obligatorio')]
    #[Assert\Positive(message: 'El precio debe ser positivo')]
    private ?string $precioMensual = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    private ?string $precioAnual = null;

    #[ORM\Column(type: Types::INTEGER, options: ['default' => 30])]
    private int $duracionDias = 30;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $caracteristicas = [];

    #[ORM\Column(type: Types::BOOLEAN, options: ['default' => true])]
    private bool $activo = true;

    #[ORM\Column(type: Types::INTEGER, options: ['default' => 0])]
    private int $orden = 0;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $fechaCreacion = null;

    public function __construct()
    {
        $this->fechaCreacion = new \DateTime();
    }

    // Getters y Setters

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombre(): ?string
    {
        return $this->nombre;
    }

    public function setNombre(string $nombre): static
    {
        $this->nombre = $nombre;
        return $this;
    }

    public function getDescripcion(): ?string
    {
        return $this->descripcion;
    }

    public function setDescripcion(?string $descripcion): static
    {
        $this->descripcion = $descripcion;
        return $this;
    }

    public function getPrecioMensual(): ?string
    {
        return $this->precioMensual;
    }

    public function setPrecioMensual(string $precioMensual): static
    {
        $this->precioMensual = $precioMensual;
        return $this;
    }

    public function getPrecioAnual(): ?string
    {
        return $this->precioAnual;
    }

    public function setPrecioAnual(?string $precioAnual): static
    {
        $this->precioAnual = $precioAnual;
        return $this;
    }

    public function getDuracionDias(): int
    {
        return $this->duracionDias;
    }

    public function setDuracionDias(int $duracionDias): static
    {
        $this->duracionDias = $duracionDias;
        return $this;
    }

    public function getCaracteristicas(): ?array
    {
        return $this->caracteristicas;
    }

    public function setCaracteristicas(?array $caracteristicas): static
    {
        $this->caracteristicas = $caracteristicas;
        return $this;
    }

    public function isActivo(): bool
    {
        return $this->activo;
    }

    public function setActivo(bool $activo): static
    {
        $this->activo = $activo;
        return $this;
    }

    public function getOrden(): int
    {
        return $this->orden;
    }

    public function setOrden(int $orden): static
    {
        $this->orden = $orden;
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

    /**
     * Métodos auxiliares
     */
    
    public function esMensual(): bool
    {
        return $this->duracionDias === 30;
    }

    public function esAnual(): bool
    {
        return $this->duracionDias === 365;
    }

    public function getPrecioFormateado(): string
    {
        if ($this->esMensual()) {
            return number_format((float)$this->precioMensual, 2) . '€/mes';
        }
        
        return number_format((float)$this->precioAnual, 2) . '€/año';
    }
}