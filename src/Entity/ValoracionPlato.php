<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;

use App\Repository\ValoracionPlatoRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource]
#[ORM\Entity(repositoryClass: ValoracionPlatoRepository::class)]
#[ORM\Table(name: 'valoraciones_plato')]
#[ORM\Index(name: 'idx_plato', columns: ['dieta_alimento_id'])]
#[ORM\Index(name: 'idx_usuario', columns: ['usuario_id'])]
class ValoracionPlato
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: DietaAlimento::class, inversedBy: 'valoraciones')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?DietaAlimento $dietaAlimento = null;

    #[ORM\ManyToOne(targetEntity: Usuario::class, inversedBy: 'valoracionesPlatos')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Usuario $usuario = null;

    #[ORM\Column]
    private ?int $estrellas = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $comentario = null;

    #[ORM\Column(nullable: true)]
    private ?int $facilidadPreparacion = null;

    #[ORM\Column(nullable: true)]
    private ?int $sabor = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeInterface $fecha = null;

    public function __construct()
    {
        $this->fecha = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }
    public function getDietaAlimento(): ?DietaAlimento
    {
        return $this->dietaAlimento;
    }
    public function setDietaAlimento(?DietaAlimento $dietaAlimento): static
    {
        $this->dietaAlimento = $dietaAlimento;
        return $this;
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
    public function getEstrellas(): ?int
    {
        return $this->estrellas;
    }
    public function setEstrellas(int $estrellas): static
    {
        $this->estrellas = $estrellas;
        return $this;
    }
    public function getComentario(): ?string
    {
        return $this->comentario;
    }
    public function setComentario(?string $comentario): static
    {
        $this->comentario = $comentario;
        return $this;
    }
    public function getFacilidadPreparacion(): ?int
    {
        return $this->facilidadPreparacion;
    }
    public function setFacilidadPreparacion(?int $facilidadPreparacion): static
    {
        $this->facilidadPreparacion = $facilidadPreparacion;
        return $this;
    }
    public function getSabor(): ?int
    {
        return $this->sabor;
    }
    public function setSabor(?int $sabor): static
    {
        $this->sabor = $sabor;
        return $this;
    }
    public function getFecha(): ?\DateTimeInterface
    {
        return $this->fecha;
    }
    public function setFecha(\DateTimeInterface $fecha): static
    {
        $this->fecha = $fecha;
        return $this;
    }
}
