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
#[ORM\Index(name: 'idx_dieta_asignado', columns: ['asignado_a_usuario_id'])]
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
    #[ORM\JoinColumn(nullable: true, onDelete: 'CASCADE')]
    private ?Entrenador $creador = null;

    #[ORM\ManyToOne(targetEntity: Usuario::class, inversedBy: 'dietasAsignadas')]
    #[ORM\JoinColumn(name: 'asignado_a_usuario_id', nullable: true, onDelete: 'CASCADE')]
    private ?Usuario $asignadoAUsuario = null;

    #[ORM\Column(nullable: true)]
    private ?int $caloriasTotales = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 6, scale: 2, nullable: true)]
    private ?string $proteinasTotales = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 6, scale: 2, nullable: true)]
    private ?string $carbohidratosTotales = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 6, scale: 2, nullable: true)]
    private ?string $grasasTotales = null;

    #[ORM\Column(options: ['default' => true])]
    private bool $esPublica = true;

    #[ORM\Column(type: Types::DECIMAL, precision: 3, scale: 2, options: ['default' => '0.00'])]
    private string $valoracionPromedio = '0.00';

    #[ORM\Column(options: ['default' => 0])]
    private int $totalValoraciones = 0;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeInterface $fechaCreacion = null;

    #[ORM\OneToMany(targetEntity: DietaPlato::class, mappedBy: 'dieta', orphanRemoval: true)]
    private Collection $dietaPlatos;

    #[ORM\OneToMany(targetEntity: CalendarioUsuario::class, mappedBy: 'dieta')]
    private Collection $calendarios;

    public function __construct()
    {
        $this->dietaPlatos = new ArrayCollection();
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

    public function getAsignadoAUsuario(): ?Usuario
    {
        return $this->asignadoAUsuario;
    }

    public function setAsignadoAUsuario(?Usuario $asignadoAUsuario): static
    {
        $this->asignadoAUsuario = $asignadoAUsuario;
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

    public function getProteinasTotales(): ?string
    {
        return $this->proteinasTotales;
    }
    public function setProteinasTotales(?string $proteinasTotales): static
    {
        $this->proteinasTotales = $proteinasTotales;
        return $this;
    }

    public function getCarbohidratosTotales(): ?string
    {
        return $this->carbohidratosTotales;
    }
    public function setCarbohidratosTotales(?string $carbohidratosTotales): static
    {
        $this->carbohidratosTotales = $carbohidratosTotales;
        return $this;
    }

    public function getGrasasTotales(): ?string
    {
        return $this->grasasTotales;
    }
    public function setGrasasTotales(?string $grasasTotales): static
    {
        $this->grasasTotales = $grasasTotales;
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
    public function getDietaPlatos(): Collection
    {
        return $this->dietaPlatos;
    }

    public function getCalendarios(): Collection
    {
        return $this->calendarios;
    }

    public function addDietaPlato(DietaPlato $dietaPlato): static
    {
        if (!$this->dietaPlatos->contains($dietaPlato)) {
            $this->dietaPlatos->add($dietaPlato);
            $dietaPlato->setDieta($this);
        }

        return $this;
    }

    public function removeDietaPlato(DietaPlato $dietaPlato): static
    {
        if ($this->dietaPlatos->removeElement($dietaPlato)) {
            // set the owning side to null (unless already changed)
            if ($dietaPlato->getDieta() === $this) {
                $dietaPlato->setDieta(null);
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
