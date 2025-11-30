<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\EntrenamientoRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource]
#[ORM\Entity(repositoryClass: EntrenamientoRepository::class)]
#[ORM\Table(name: 'entrenamientos')]
#[ORM\Index(name: 'idx_creador', columns: ['creador_id'])]
#[ORM\Index(name: 'idx_tipo', columns: ['tipo'])]
#[ORM\Index(name: 'idx_publico', columns: ['es_publico'])]
class Entrenamiento
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 150)]
    private ?string $nombre = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $descripcion = null;

    #[ORM\Column(length: 20)]
    private ?string $tipo = null;

    #[ORM\ManyToOne(targetEntity: Entrenador::class, inversedBy: 'entrenamientos')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'CASCADE')]
    private ?Entrenador $creador = null;

    #[ORM\ManyToOne(targetEntity: Usuario::class, inversedBy: 'entrenamientosCreados')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'CASCADE')]
    private ?Usuario $creadorUsuario = null;

    #[ORM\ManyToOne(targetEntity: Usuario::class, inversedBy: 'entrenamientosAsignados')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'CASCADE')]
    private ?Usuario $asignadoAUsuario = null;

    #[ORM\Column(nullable: true)]
    private ?int $duracionMinutos = null;

    #[ORM\Column(length: 20, options: ['default' => 'intermedio'])]
    private string $nivelDificultad = 'intermedio';

    #[ORM\Column(options: ['default' => true])]
    private bool $esPublico = true;

    #[ORM\Column(type: Types::DECIMAL, precision: 3, scale: 2, options: ['default' => '0.00'])]
    private string $valoracionPromedio = '0.00';

    #[ORM\Column(options: ['default' => 0])]
    private int $totalValoraciones = 0;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeInterface $fechaCreacion = null;

    #[ORM\OneToMany(targetEntity: EntrenamientoEjercicio::class, mappedBy: 'entrenamiento', orphanRemoval: true)]
    private Collection $entrenamientoEjercicios;

    #[ORM\OneToMany(targetEntity: CalendarioUsuario::class, mappedBy: 'entrenamiento')]
    private Collection $calendarios;

    public function __construct()
    {
        $this->entrenamientoEjercicios = new ArrayCollection();
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

    public function getTipo(): ?string
    {
        return $this->tipo;
    }

    public function setTipo(string $tipo): static
    {
        $this->tipo = $tipo;
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

    public function getCreadorUsuario(): ?Usuario
    {
        return $this->creadorUsuario;
    }

    public function setCreadorUsuario(?Usuario $creadorUsuario): static
    {
        $this->creadorUsuario = $creadorUsuario;
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

    public function getDuracionMinutos(): ?int
    {
        return $this->duracionMinutos;
    }

    public function setDuracionMinutos(?int $duracionMinutos): static
    {
        $this->duracionMinutos = $duracionMinutos;
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

    public function isEsPublico(): bool
    {
        return $this->esPublico;
    }

    public function setEsPublico(bool $esPublico): static
    {
        $this->esPublico = $esPublico;
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

    public function getEntrenamientoEjercicios(): Collection
    {
        return $this->entrenamientoEjercicios;
    }

    public function getCalendarios(): Collection
    {
        return $this->calendarios;
    }

    public function addEntrenamientoEjercicio(EntrenamientoEjercicio $entrenamientoEjercicio): static
    {
        if (!$this->entrenamientoEjercicios->contains($entrenamientoEjercicio)) {
            $this->entrenamientoEjercicios->add($entrenamientoEjercicio);
            $entrenamientoEjercicio->setEntrenamiento($this);
        }

        return $this;
    }

    public function removeEntrenamientoEjercicio(EntrenamientoEjercicio $entrenamientoEjercicio): static
    {
        if ($this->entrenamientoEjercicios->removeElement($entrenamientoEjercicio)) {
            if ($entrenamientoEjercicio->getEntrenamiento() === $this) {
                $entrenamientoEjercicio->setEntrenamiento(null);
            }
        }

        return $this;
    }

    public function addCalendario(CalendarioUsuario $calendario): static
    {
        if (!$this->calendarios->contains($calendario)) {
            $this->calendarios->add($calendario);
            $calendario->setEntrenamiento($this);
        }

        return $this;
    }

    public function removeCalendario(CalendarioUsuario $calendario): static
    {
        if ($this->calendarios->removeElement($calendario)) {
            if ($calendario->getEntrenamiento() === $this) {
                $calendario->setEntrenamiento(null);
            }
        }

        return $this;
    }
}
