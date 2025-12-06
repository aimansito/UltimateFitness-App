<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\DiaEjercicioRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource]
#[ORM\Entity(repositoryClass: DiaEjercicioRepository::class)]
#[ORM\Table(name: 'dias_ejercicios')]
#[ORM\Index(name: 'idx_dia_entrenamiento', columns: ['dia_entrenamiento_id'])]
#[ORM\Index(name: 'idx_ejercicio', columns: ['ejercicio_id'])]
class DiaEjercicio
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: DiaEntrenamiento::class, inversedBy: 'ejercicios')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?DiaEntrenamiento $diaEntrenamiento = null;

    #[ORM\ManyToOne(targetEntity: Ejercicio::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Ejercicio $ejercicio = null;

    #[ORM\Column(type: Types::INTEGER, options: ['default' => 3])]
    private int $series = 3;

    #[ORM\Column(type: Types::INTEGER, options: ['default' => 12])]
    private int $repeticiones = 12;

    #[ORM\Column(type: Types::INTEGER, options: ['default' => 60])]
    private int $descansoSegundos = 60;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $notas = null;

    #[ORM\Column(type: Types::INTEGER, options: ['default' => 0])]
    private int $orden = 0;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDiaEntrenamiento(): ?DiaEntrenamiento
    {
        return $this->diaEntrenamiento;
    }

    public function setDiaEntrenamiento(?DiaEntrenamiento $diaEntrenamiento): static
    {
        $this->diaEntrenamiento = $diaEntrenamiento;
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

    public function getSeries(): int
    {
        return $this->series;
    }

    public function setSeries(int $series): static
    {
        $this->series = $series;
        return $this;
    }

    public function getRepeticiones(): int
    {
        return $this->repeticiones;
    }

    public function setRepeticiones(int $repeticiones): static
    {
        $this->repeticiones = $repeticiones;
        return $this;
    }

    public function getDescansoSegundos(): int
    {
        return $this->descansoSegundos;
    }

    public function setDescansoSegundos(int $descansoSegundos): static
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

    public function getOrden(): int
    {
        return $this->orden;
    }

    public function setOrden(int $orden): static
    {
        $this->orden = $orden;
        return $this;
    }
}
