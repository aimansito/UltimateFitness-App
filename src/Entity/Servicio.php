<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;

use App\Repository\ServicioRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource]
#[ORM\Entity(repositoryClass: ServicioRepository::class)]
#[ORM\Table(name: 'servicios')]
class Servicio
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 150)]
    private ?string $nombre = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $descripcion = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 8, scale: 2, options: ['default' => '0.00'])]
    private string $precio = '0.00';

    #[ORM\Column(length: 20)]
    private ?string $tipo = null;

    #[ORM\Column(nullable: true)]
    private ?int $duracionDias = null;

    #[ORM\Column(options: ['default' => false])]
    private bool $incluyeEntrenador = false;

    #[ORM\Column(options: ['default' => false])]
    private bool $incluyeDietaPersonalizada = false;

    #[ORM\Column(options: ['default' => false])]
    private bool $incluyeEntrenoPersonalizado = false;

    #[ORM\Column(options: ['default' => true])]
    private bool $activo = true;

    #[ORM\OneToMany(targetEntity: Suscripcion::class, mappedBy: 'servicio')]
    private Collection $suscripciones;

    public function __construct()
    {
        $this->suscripciones = new ArrayCollection();
    }

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
    public function getPrecio(): string
    {
        return $this->precio;
    }
    public function setPrecio(string $precio): static
    {
        $this->precio = $precio;
        return $this;
    }
    public function getTipo(): ?string
    {
        return $this->tipo;
    }
    public function setTipo(string $tipo): static
    {
        $this->tipo = $tipo;
        return $this;
    }
    public function getDuracionDias(): ?int
    {
        return $this->duracionDias;
    }
    public function setDuracionDias(?int $duracionDias): static
    {
        $this->duracionDias = $duracionDias;
        return $this;
    }
    public function isIncluyeEntrenador(): bool
    {
        return $this->incluyeEntrenador;
    }
    public function setIncluyeEntrenador(bool $incluyeEntrenador): static
    {
        $this->incluyeEntrenador = $incluyeEntrenador;
        return $this;
    }
    public function isIncluyeDietaPersonalizada(): bool
    {
        return $this->incluyeDietaPersonalizada;
    }
    public function setIncluyeDietaPersonalizada(bool $incluyeDietaPersonalizada): static
    {
        $this->incluyeDietaPersonalizada = $incluyeDietaPersonalizada;
        return $this;
    }
    public function isIncluyeEntrenoPersonalizado(): bool
    {
        return $this->incluyeEntrenoPersonalizado;
    }
    public function setIncluyeEntrenoPersonalizado(bool $incluyeEntrenoPersonalizado): static
    {
        $this->incluyeEntrenoPersonalizado = $incluyeEntrenoPersonalizado;
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
    public function getSuscripciones(): Collection
    {
        return $this->suscripciones;
    }

    public function addSuscripcione(Suscripcion $suscripcione): static
    {
        if (!$this->suscripciones->contains($suscripcione)) {
            $this->suscripciones->add($suscripcione);
            $suscripcione->setServicio($this);
        }

        return $this;
    }

    public function removeSuscripcione(Suscripcion $suscripcione): static
    {
        if ($this->suscripciones->removeElement($suscripcione)) {
            // set the owning side to null (unless already changed)
            if ($suscripcione->getServicio() === $this) {
                $suscripcione->setServicio(null);
            }
        }

        return $this;
    }
}
