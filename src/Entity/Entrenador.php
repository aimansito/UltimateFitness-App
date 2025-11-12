<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;

use App\Repository\EntrenadorRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource]
#[ORM\Entity(repositoryClass: EntrenadorRepository::class)]
#[ORM\Table(name: 'entrenadores')]
#[ORM\Index(name: 'idx_email', columns: ['email'])]
#[ORM\Index(name: 'idx_activo', columns: ['activo'])]
class Entrenador
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    private ?string $nombre = null;

    #[ORM\Column(length: 150)]
    private ?string $apellidos = null;

    #[ORM\Column(length: 255, unique: true)]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $passwordHash = null;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $telefono = null;

    #[ORM\Column(length: 20, options: ['default' => 'ambos'])]
    private string $especialidad = 'ambos';

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $biografia = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 3, scale: 2, options: ['default' => '0.00'])]
    private string $valoracionPromedio = '0.00';

    #[ORM\Column(options: ['default' => 0])]
    private int $totalValoraciones = 0;

    #[ORM\Column(type: Types::DECIMAL, precision: 6, scale: 2, options: ['default' => '35.00'])]
    private string $precioSesionPresencial = '35.00';

    #[ORM\Column(options: ['default' => true])]
    private bool $activo = true;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeInterface $fechaRegistro = null;

    #[ORM\OneToMany(targetEntity: Dieta::class, mappedBy: 'creador')]
    private Collection $dietas;

    #[ORM\OneToMany(targetEntity: Entrenamiento::class, mappedBy: 'creador')]
    private Collection $entrenamientos;

    #[ORM\OneToMany(targetEntity: ValoracionEntrenador::class, mappedBy: 'entrenador', orphanRemoval: true)]
    private Collection $valoraciones;

    public function __construct()
    {
        $this->dietas = new ArrayCollection();
        $this->entrenamientos = new ArrayCollection();
        $this->valoraciones = new ArrayCollection();
        $this->fechaRegistro = new \DateTime();
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
    public function getApellidos(): ?string
    {
        return $this->apellidos;
    }
    public function setApellidos(string $apellidos): static
    {
        $this->apellidos = $apellidos;
        return $this;
    }
    public function getNombreCompleto(): string
    {
        return $this->nombre . ' ' . $this->apellidos;
    }
    public function getEmail(): ?string
    {
        return $this->email;
    }
    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }
    public function getPasswordHash(): ?string
    {
        return $this->passwordHash;
    }
    public function setPasswordHash(string $passwordHash): static
    {
        $this->passwordHash = $passwordHash;
        return $this;
    }
    public function getTelefono(): ?string
    {
        return $this->telefono;
    }
    public function setTelefono(?string $telefono): static
    {
        $this->telefono = $telefono;
        return $this;
    }
    public function getEspecialidad(): string
    {
        return $this->especialidad;
    }
    public function setEspecialidad(string $especialidad): static
    {
        $this->especialidad = $especialidad;
        return $this;
    }
    public function getBiografia(): ?string
    {
        return $this->biografia;
    }
    public function setBiografia(?string $biografia): static
    {
        $this->biografia = $biografia;
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
    public function getPrecioSesionPresencial(): string
    {
        return $this->precioSesionPresencial;
    }
    public function setPrecioSesionPresencial(string $precioSesionPresencial): static
    {
        $this->precioSesionPresencial = $precioSesionPresencial;
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
    public function getFechaRegistro(): ?\DateTimeInterface
    {
        return $this->fechaRegistro;
    }
    public function setFechaRegistro(\DateTimeInterface $fechaRegistro): static
    {
        $this->fechaRegistro = $fechaRegistro;
        return $this;
    }
    public function getDietas(): Collection
    {
        return $this->dietas;
    }
    public function getEntrenamientos(): Collection
    {
        return $this->entrenamientos;
    }
    public function getValoraciones(): Collection
    {
        return $this->valoraciones;
    }

    public function addDieta(Dieta $dieta): static
    {
        if (!$this->dietas->contains($dieta)) {
            $this->dietas->add($dieta);
            $dieta->setCreador($this);
        }

        return $this;
    }

    public function removeDieta(Dieta $dieta): static
    {
        if ($this->dietas->removeElement($dieta)) {
            // set the owning side to null (unless already changed)
            if ($dieta->getCreador() === $this) {
                $dieta->setCreador(null);
            }
        }

        return $this;
    }

    public function addEntrenamiento(Entrenamiento $entrenamiento): static
    {
        if (!$this->entrenamientos->contains($entrenamiento)) {
            $this->entrenamientos->add($entrenamiento);
            $entrenamiento->setCreador($this);
        }

        return $this;
    }

    public function removeEntrenamiento(Entrenamiento $entrenamiento): static
    {
        if ($this->entrenamientos->removeElement($entrenamiento)) {
            // set the owning side to null (unless already changed)
            if ($entrenamiento->getCreador() === $this) {
                $entrenamiento->setCreador(null);
            }
        }

        return $this;
    }

    public function addValoracione(ValoracionEntrenador $valoracione): static
    {
        if (!$this->valoraciones->contains($valoracione)) {
            $this->valoraciones->add($valoracione);
            $valoracione->setEntrenador($this);
        }

        return $this;
    }

    public function removeValoracione(ValoracionEntrenador $valoracione): static
    {
        if ($this->valoraciones->removeElement($valoracione)) {
            // set the owning side to null (unless already changed)
            if ($valoracione->getEntrenador() === $this) {
                $valoracione->setEntrenador(null);
            }
        }

        return $this;
    }
}
