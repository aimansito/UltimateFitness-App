<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;

use App\Repository\DietaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource]
#[ORM\Entity(repositoryClass: DietaRepository::class)]
#[ORM\Table(name: 'dietas')]
#[ORM\Index(name: 'idx_creador', columns: ['creador_id'])]
#[ORM\Index(name: 'idx_publica', columns: ['es_publica'])]
class Dieta
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 150)]
    private ?string $nombre = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $descripcion = null;

    #[ORM\ManyToOne(targetEntity: Entrenador::class, inversedBy: 'dietas')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Entrenador $creador = null;

    #[ORM\Column(nullable: true)]
    private ?int $caloriasTotales = null;

    #[ORM\Column(options: ['default' => true])]
    private bool $esPublica = true;

    #[ORM\Column(type: Types::DECIMAL, precision: 3, scale: 2, options: ['default' => '0.00'])]
    private string $valoracionPromedio = '0.00';

    #[ORM\Column(options: ['default' => 0])]
    private int $totalValoraciones = 0;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeInterface $fechaCreacion = null;

    #[ORM\OneToMany(targetEntity: DietaAlimento::class, mappedBy: 'dieta', orphanRemoval: true)]
    private Collection $dietaAlimentos;

    #[ORM\OneToMany(targetEntity: CalendarioUsuario::class, mappedBy: 'dieta')]
    private Collection $calendarios;

    public function __construct()
    {
        $this->dietaAlimentos = new ArrayCollection();
        $this->calendarios = new ArrayCollection();
        $this->fechaCreacion = new \DateTime();
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
    public function getCreador(): ?Entrenador
    {
        return $this->creador;
    }
    public function setCreador(?Entrenador $creador): static
    {
        $this->creador = $creador;
        return $this;
    }
    public function getCaloriasTotales(): ?int
    {
        return $this->caloriasTotales;
    }
    public function setCaloriasTotales(?int $caloriasTotales): static
    {
        $this->caloriasTotales = $caloriasTotales;
        return $this;
    }
    public function isEsPublica(): bool
    {
        return $this->esPublica;
    }
    public function setEsPublica(bool $esPublica): static
    {
        $this->esPublica = $esPublica;
        return $this;
    }
    public function getValoracionPromedio(): string
    {
        return $this->valoracionPromedio;
    }
    public function setValoracionPromedio(string $valoracionPromedio): static
    {
        $this->valoracionPromedio = $valoracionPromedio;
        return $this;
    }
    public function getTotalValoraciones(): int
    {
        return $this->totalValoraciones;
    }
    public function setTotalValoraciones(int $totalValoraciones): static
    {
        $this->totalValoraciones = $totalValoraciones;
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
    public function getDietaAlimentos(): Collection
    {
        return $this->dietaAlimentos;
    }
    public function getCalendarios(): Collection
    {
        return $this->calendarios;
    }

    public function addDietaAlimento(DietaAlimento $dietaAlimento): static
    {
        if (!$this->dietaAlimentos->contains($dietaAlimento)) {
            $this->dietaAlimentos->add($dietaAlimento);
            $dietaAlimento->setDieta($this);
        }

        return $this;
    }

    public function removeDietaAlimento(DietaAlimento $dietaAlimento): static
    {
        if ($this->dietaAlimentos->removeElement($dietaAlimento)) {
            // set the owning side to null (unless already changed)
            if ($dietaAlimento->getDieta() === $this) {
                $dietaAlimento->setDieta(null);
            }
        }

        return $this;
    }

    public function addCalendario(CalendarioUsuario $calendario): static
    {
        if (!$this->calendarios->contains($calendario)) {
            $this->calendarios->add($calendario);
            $calendario->setDieta($this);
        }

        return $this;
    }

    public function removeCalendario(CalendarioUsuario $calendario): static
    {
        if ($this->calendarios->removeElement($calendario)) {
            // set the owning side to null (unless already changed)
            if ($calendario->getDieta() === $this) {
                $calendario->setDieta(null);
            }
        }

        return $this;
    }
}
