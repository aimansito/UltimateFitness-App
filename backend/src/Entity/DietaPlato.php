<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\DietaPlatoRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * DietaPlato - Relación entre Dietas y Platos
 * 
 * Esta entidad conecta una dieta con platos específicos para cada día
 * de la semana y momento del día (desayuno, almuerzo, etc.).
 * Reemplaza la antigua relación dieta-alimento individual.
 */
#[ApiResource]
#[ORM\Entity(repositoryClass: DietaPlatoRepository::class)]
#[ORM\Table(name: 'dieta_platos')]
#[ORM\UniqueConstraint(name: 'unique_dieta_dia_comida_orden', columns: ['dieta_id', 'dia_semana', 'tipo_comida', 'orden'])]
#[ORM\Index(name: 'idx_dieta', columns: ['dieta_id'])]
#[ORM\Index(name: 'idx_plato', columns: ['plato_id'])]
#[ORM\Index(name: 'idx_dia_tipo', columns: ['dia_semana', 'tipo_comida'])]
class DietaPlato
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Dieta::class, inversedBy: 'dietaPlatos')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Dieta $dieta = null;

    #[ORM\ManyToOne(targetEntity: Plato::class, inversedBy: 'dietaPlatos')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Plato $plato = null;

    #[ORM\Column(length: 20, columnDefinition: "enum('lunes','martes','miercoles','jueves','viernes','sabado','domingo')")]
    private ?string $diaSemana = null;

    #[ORM\Column(length: 20, columnDefinition: "enum('desayuno','media_manana','almuerzo','merienda','cena','post_entreno')")]
    private ?string $tipoComida = null;

    #[ORM\Column(options: ['default' => 1])]
    private int $orden = 1;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $notas = null;

    // ============================================
    // GETTERS Y SETTERS
    // ============================================

    public function getId(): ?int
    {
        return $this->id;
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

    public function getPlato(): ?Plato
    {
        return $this->plato;
    }

    public function setPlato(?Plato $plato): static
    {
        $this->plato = $plato;
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

    public function getTipoComida(): ?string
    {
        return $this->tipoComida;
    }

    public function setTipoComida(string $tipoComida): static
    {
        $this->tipoComida = $tipoComida;
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
