<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;

use App\Repository\CalendarioUsuarioRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource]
#[ORM\Entity(repositoryClass: CalendarioUsuarioRepository::class)]
#[ORM\Table(name: 'calendario_usuario')]
#[ORM\Index(name: 'idx_usuario', columns: ['usuario_id'])]
#[ORM\Index(name: 'idx_dia', columns: ['dia_semana'])]
class CalendarioUsuario
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Usuario::class, inversedBy: 'calendarios')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Usuario $usuario = null;

    #[ORM\ManyToOne(targetEntity: Dieta::class, inversedBy: 'calendarios')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    private ?Dieta $dieta = null;

    #[ORM\ManyToOne(targetEntity: Entrenamiento::class, inversedBy: 'calendarios')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    private ?Entrenamiento $entrenamiento = null;

    #[ORM\Column(length: 20)]
    private ?string $diaSemana = null;

    #[ORM\Column(options: ['default' => false])]
    private bool $completado = false;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $fechaAsignacion = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $notas = null;

    public function getId(): ?int
    {
        return $this->id;
    }
    public function getUsuario(): ?Usuario
    {
        return $this->usuario;
    }
    public function setUsuario(?Usuario $usuario): static
    {
        $this->usuario = $usuario;
        return $this;
    }
    public function getDieta(): ?Dieta
    {
        return $this->dieta;
    }
    public function setDieta(?Dieta $dieta): static
    {
        $this->dieta = $dieta;
        return $this;
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
    public function getDiaSemana(): ?string
    {
        return $this->diaSemana;
    }
    public function setDiaSemana(string $diaSemana): static
    {
        $this->diaSemana = $diaSemana;
        return $this;
    }
    public function isCompletado(): bool
    {
        return $this->completado;
    }
    public function setCompletado(bool $completado): static
    {
        $this->completado = $completado;
        return $this;
    }
    public function getFechaAsignacion(): ?\DateTimeInterface
    {
        return $this->fechaAsignacion;
    }
    public function setFechaAsignacion(\DateTimeInterface $fechaAsignacion): static
    {
        $this->fechaAsignacion = $fechaAsignacion;
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
