<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;

use App\Repository\ValoracionEntrenadorRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource]
#[ORM\Entity(repositoryClass: ValoracionEntrenadorRepository::class)]
#[ORM\Table(name: 'valoraciones_entrenador')]
#[ORM\Index(name: 'idx_entrenador', columns: ['entrenador_id'])]
#[ORM\Index(name: 'idx_cliente', columns: ['cliente_id'])]
class ValoracionEntrenador
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Entrenador::class, inversedBy: 'valoraciones')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Entrenador $entrenador = null;

    #[ORM\ManyToOne(targetEntity: Usuario::class, inversedBy: 'valoracionesHechas')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Usuario $cliente = null;

    #[ORM\Column]
    private ?int $estrellas = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $comentario = null;

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
    public function getEntrenador(): ?Entrenador
    {
        return $this->entrenador;
    }
    public function setEntrenador(?Entrenador $entrenador): static
    {
        $this->entrenador = $entrenador;
        return $this;
    }
    public function getCliente(): ?Usuario
    {
        return $this->cliente;
    }
    public function setCliente(?Usuario $cliente): static
    {
        $this->cliente = $cliente;
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
