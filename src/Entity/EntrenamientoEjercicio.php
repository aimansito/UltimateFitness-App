<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;

use App\Repository\EntrenamientoEjercicioRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource]
#[ORM\Entity(repositoryClass: EntrenamientoEjercicioRepository::class)]
#[ORM\Table(name: 'entrenamiento_ejercicios')]
#[ORM\Index(name: 'idx_entrenamiento', columns: ['entrenamiento_id'])]
#[ORM\Index(name: 'idx_ejercicio', columns: ['ejercicio_id'])]
class EntrenamientoEjercicio
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Entrenamiento::class, inversedBy: 'entrenamientoEjercicios')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Entrenamiento $entrenamiento = null;

    #[ORM\ManyToOne(targetEntity: Ejercicio::class, inversedBy: 'entrenamientoEjercicios')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Ejercicio $ejercicio = null;

    #[ORM\Column]
    private ?int $orden = null;

    #[ORM\Column(nullable: true)]
    private ?int $series = null;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $repeticiones = null;

    #[ORM\Column(nullable: true)]
    private ?int $descansoSegundos = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $notas = null;

    public function getId(): ?int
    {
        return $this->id;
    }
    public function getEntrenamiento(): ?Entrenamiento
    {
        return $this->entrenamiento;
    }
    public function setEntrenamiento(?Entrenamiento $entrenamiento): static
    {
        $this->entrenamiento = $entrenamiento;
        return $this;
    }
    public function getEjercicio(): ?Ejercicio
    {
        return $this->ejercicio;
    }
    public function setEjercicio(?Ejercicio $ejercicio): static
    {
        $this->ejercicio = $ejercicio;
        return $this;
    }
    public function getOrden(): ?int
    {
        return $this->orden;
    }
    public function setOrden(int $orden): static
    {
        $this->orden = $orden;
        return $this;
    }
    public function getSeries(): ?int
    {
        return $this->series;
    }
    public function setSeries(?int $series): static
    {
        $this->series = $series;
        return $this;
    }
    public function getRepeticiones(): ?string
    {
        return $this->repeticiones;
    }
    public function setRepeticiones(?string $repeticiones): static
    {
        $this->repeticiones = $repeticiones;
        return $this;
    }
    public function getDescansoSegundos(): ?int
    {
        return $this->descansoSegundos;
    }
    public function setDescansoSegundos(?int $descansoSegundos): static
    {
        $this->descansoSegundos = $descansoSegundos;
        return $this;
    }
    public function getNotas(): ?string
    {
        return $this->notas;
    }
    public function setNotas(?string $notas): static
    {
        $this->notas = $notas;
        return $this;
    }
}
