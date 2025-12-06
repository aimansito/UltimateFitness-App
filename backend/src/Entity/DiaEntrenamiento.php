<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\DiaEntrenamientoRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource]
#[ORM\Entity(repositoryClass: DiaEntrenamientoRepository::class)]
#[ORM\Table(name: 'dias_entrenamiento')]
#[ORM\Index(name: 'idx_entrenamiento', columns: ['entrenamiento_id'])]
#[ORM\Index(name: 'idx_dia_semana', columns: ['dia_semana'])]
class DiaEntrenamiento
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Entrenamiento::class, inversedBy: 'dias')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Entrenamiento $entrenamiento = null;

    #[ORM\Column(type: Types::INTEGER)]
    private ?int $diaSemana = null; // 1=Lunes, 2=Martes, ..., 7=Domingo

    #[ORM\Column(length: 100, nullable: true)]
    private ?string $concepto = null; // "Pecho y Tríceps", "Pierna", etc.

    #[ORM\Column(type: Types::BOOLEAN, options: ['default' => false])]
    private bool $esDescanso = false;

    #[ORM\Column(type: Types::INTEGER, options: ['default' => 0])]
    private int $orden = 0;

    #[ORM\OneToMany(targetEntity: DiaEjercicio::class, mappedBy: 'diaEntrenamiento', orphanRemoval: true, cascade: ['persist', 'remove'])]
    #[ORM\OrderBy(['orden' => 'ASC'])]
    private Collection $ejercicios;

    public function __construct()
    {
        $this->ejercicios = new ArrayCollection();
    }

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

    public function getDiaSemana(): ?int
    {
        return $this->diaSemana;
    }

    public function setDiaSemana(int $diaSemana): static
    {
        $this->diaSemana = $diaSemana;
        return $this;
    }

    public function getConcepto(): ?string
    {
        return $this->concepto;
    }

    public function setConcepto(?string $concepto): static
    {
        $this->concepto = $concepto;
        return $this;
    }

    public function isEsDescanso(): bool
    {
        return $this->esDescanso;
    }

    public function setEsDescanso(bool $esDescanso): static
    {
        $this->esDescanso = $esDescanso;
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

    /**
     * @return Collection<int, DiaEjercicio>
     */
    public function getEjercicios(): Collection
    {
        return $this->ejercicios;
    }

    public function addEjercicio(DiaEjercicio $ejercicio): static
    {
        if (!$this->ejercicios->contains($ejercicio)) {
            $this->ejercicios->add($ejercicio);
            $ejercicio->setDiaEntrenamiento($this);
        }

        return $this;
    }

    public function removeEjercicio(DiaEjercicio $ejercicio): static
    {
        if ($this->ejercicios->removeElement($ejercicio)) {
            if ($ejercicio->getDiaEntrenamiento() === $this) {
                $ejercicio->setDiaEntrenamiento(null);
            }
        }

        return $this;
    }
}
