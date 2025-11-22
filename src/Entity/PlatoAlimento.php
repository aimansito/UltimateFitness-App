<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * PlatoAlimento - Tabla intermedia entre Plato y Alimento
 * 
 * Representa los ingredientes que componen un plato específico,
 * incluyendo la cantidad en gramos de cada alimento.
 */
#[ORM\Entity]
#[ORM\Table(name: 'plato_alimentos')]
#[ORM\Index(name: 'idx_plato', columns: ['plato_id'])]
#[ORM\Index(name: 'idx_alimento', columns: ['alimento_id'])]
class PlatoAlimento
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    /**
     * Relación muchos-a-uno con Plato
     * Varios ingredientes pertenecen a un plato
     */
    #[ORM\ManyToOne(targetEntity: Plato::class, inversedBy: 'ingredientes')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Plato $plato = null;

    /**
     * Relación muchos-a-uno con Alimento
     * Un ingrediente referencia a un alimento del catálogo
     */
    #[ORM\ManyToOne(targetEntity: Alimento::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Alimento $alimento = null;

    #[ORM\Column(type: 'decimal', precision: 8, scale: 2)]
    #[Assert\NotBlank(message: 'La cantidad es obligatoria')]
    #[Assert\Positive(message: 'La cantidad debe ser un número positivo')]
    private ?string $cantidadGramos = null;

    #[ORM\Column(type: 'integer', options: ['default' => 1])]
    private int $orden = 1;

    // ============================================
    // GETTERS Y SETTERS
    // ============================================

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPlato(): ?Plato
    {
        return $this->plato;
    }

    public function setPlato(?Plato $plato): self
    {
        $this->plato = $plato;
        return $this;
    }

    public function getAlimento(): ?Alimento
    {
        return $this->alimento;
    }

    public function setAlimento(?Alimento $alimento): self
    {
        $this->alimento = $alimento;
        return $this;
    }

    public function getCantidadGramos(): ?string
    {
        return $this->cantidadGramos;
    }

    public function setCantidadGramos(string $cantidadGramos): self
    {
        $this->cantidadGramos = $cantidadGramos;
        return $this;
    }

    public function getOrden(): int
    {
        return $this->orden;
    }

    public function setOrden(int $orden): self
    {
        $this->orden = $orden;
        return $this;
    }

    /**
     * Método auxiliar para calcular las calorías de este ingrediente
     */
    public function getCalorias(): float
    {
        if (!$this->alimento) {
            return 0;
        }

        $calorias = (float)$this->alimento->getCalorias();
        $cantidad = (float)$this->cantidadGramos;

        return ($calorias * $cantidad) / 100;
    }

    /**
     * Método auxiliar para calcular las proteínas de este ingrediente
     */
    public function getProteinas(): float
    {
        if (!$this->alimento) {
            return 0;
        }

        $proteinas = (float)$this->alimento->getProteinas();
        $cantidad = (float)$this->cantidadGramos;

        return ($proteinas * $cantidad) / 100;
    }

    /**
     * Método auxiliar para calcular los carbohidratos de este ingrediente
     */
    public function getCarbohidratos(): float
    {
        if (!$this->alimento) {
            return 0;
        }

        $carbohidratos = (float)$this->alimento->getCarbohidratos();
        $cantidad = (float)$this->cantidadGramos;

        return ($carbohidratos * $cantidad) / 100;
    }

    /**
     * Método auxiliar para calcular las grasas de este ingrediente
     */
    public function getGrasas(): float
    {
        if (!$this->alimento) {
            return 0;
        }

        $grasas = (float)$this->alimento->getGrasas();
        $cantidad = (float)$this->cantidadGramos;

        return ($grasas * $cantidad) / 100;
    }
}