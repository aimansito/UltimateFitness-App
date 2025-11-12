<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;

use App\Repository\EjercicioRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource]
#[ORM\Entity(repositoryClass: EjercicioRepository::class)]
#[ORM\Table(name: 'ejercicios')]
#[ORM\Index(name: 'idx_tipo', columns: ['tipo'])]
#[ORM\Index(name: 'idx_nivel', columns: ['nivel_dificultad'])]
class Ejercicio
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 150)]
    private ?string $nombre = null;

    #[ORM\Column(length: 20)]
    private ?string $tipo = null;

    #[ORM\Column(length: 100, nullable: true)]
    private ?string $grupoMuscular = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $descripcion = null;

    #[ORM\Column(length: 500, nullable: true)]
    private ?string $videoUrl = null;

    #[ORM\Column(length: 20, options: ['default' => 'intermedio'])]
    private string $nivelDificultad = 'intermedio';

    #[ORM\Column(type: Types::DECIMAL, precision: 3, scale: 2, options: ['default' => '0.00'])]
    private string $valoracionPromedio = '0.00';

    #[ORM\Column(options: ['default' => 0])]
    private int $totalValoraciones = 0;

    #[ORM\OneToMany(targetEntity: EntrenamientoEjercicio::class, mappedBy: 'ejercicio')]
    private Collection $entrenamientoEjercicios;

    public function __construct()
    {
        $this->entrenamientoEjercicios = new ArrayCollection();
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
    public function getTipo(): ?string
    {
        return $this->tipo;
    }
    public function setTipo(string $tipo): static
    {
        $this->tipo = $tipo;
        return $this;
    }
    public function getGrupoMuscular(): ?string
    {
        return $this->grupoMuscular;
    }
    public function setGrupoMuscular(?string $grupoMuscular): static
    {
        $this->grupoMuscular = $grupoMuscular;
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
    public function getVideoUrl(): ?string
    {
        return $this->videoUrl;
    }
    public function setVideoUrl(?string $videoUrl): static
    {
        $this->videoUrl = $videoUrl;
        return $this;
    }
    public function getNivelDificultad(): string
    {
        return $this->nivelDificultad;
    }
    public function setNivelDificultad(string $nivelDificultad): static
    {
        $this->nivelDificultad = $nivelDificultad;
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
    public function getEntrenamientoEjercicios(): Collection
    {
        return $this->entrenamientoEjercicios;
    }

    public function addEntrenamientoEjercicio(EntrenamientoEjercicio $entrenamientoEjercicio): static
    {
        if (!$this->entrenamientoEjercicios->contains($entrenamientoEjercicio)) {
            $this->entrenamientoEjercicios->add($entrenamientoEjercicio);
            $entrenamientoEjercicio->setEjercicio($this);
        }

        return $this;
    }

    public function removeEntrenamientoEjercicio(EntrenamientoEjercicio $entrenamientoEjercicio): static
    {
        if ($this->entrenamientoEjercicios->removeElement($entrenamientoEjercicio)) {
            // set the owning side to null (unless already changed)
            if ($entrenamientoEjercicio->getEjercicio() === $this) {
                $entrenamientoEjercicio->setEjercicio(null);
            }
        }

        return $this;
    }
}
