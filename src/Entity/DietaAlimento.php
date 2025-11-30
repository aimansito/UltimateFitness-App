<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;

use App\Repository\DietaAlimentoRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource]
#[ORM\Entity(repositoryClass: DietaAlimentoRepository::class)]
#[ORM\Table(name: 'dieta_alimentos')]
#[ORM\Index(name: 'idx_dieta', columns: ['dieta_id'])]
#[ORM\Index(name: 'idx_alimento', columns: ['alimento_id'])]
class DietaAlimento
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Dieta::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Dieta $dieta = null;

    #[ORM\ManyToOne(targetEntity: Alimento::class, inversedBy: 'dietaAlimentos')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Alimento $alimento = null;

    #[ORM\Column(length: 20)]
    private ?string $diaSemana = null;

    #[ORM\Column(length: 20)]
    private ?string $tipoComida = null;

    #[ORM\Column(length: 150)]
    private ?string $nombrePlato = null;

    #[ORM\Column]
    private ?int $cantidadGramos = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 3, scale: 2, options: ['default' => '0.00'])]
    private string $valoracionPromedio = '0.00';

    #[ORM\Column(options: ['default' => 0])]
    private int $totalValoraciones = 0;

    #[ORM\Column(options: ['default' => 1])]
    private int $orden = 1;

    #[ORM\OneToMany(targetEntity: ValoracionPlato::class, mappedBy: 'dietaAlimento', orphanRemoval: true)]
    private Collection $valoraciones;

    #[ORM\Column(length: 50, options: ['default' => 'comida'])]
    private string $momentoDia = 'comida';

    #[ORM\ManyToOne(targetEntity: Plato::class)]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    private ?Plato $plato = null;

    public function __construct()
    {
        $this->valoraciones = new ArrayCollection();
    }

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
    public function getAlimento(): ?Alimento
    {
        return $this->alimento;
    }
    public function setAlimento(?Alimento $alimento): static
    {
        $this->alimento = $alimento;
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
    public function getNombrePlato(): ?string
    {
        return $this->nombrePlato;
    }
    public function setNombrePlato(string $nombrePlato): static
    {
        $this->nombrePlato = $nombrePlato;
        return $this;
    }
    public function getCantidadGramos(): ?int
    {
        return $this->cantidadGramos;
    }
    public function setCantidadGramos(int $cantidadGramos): static
    {
        $this->cantidadGramos = $cantidadGramos;
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
    public function getOrden(): int
    {
        return $this->orden;
    }
    public function setOrden(int $orden): static
    {
        $this->orden = $orden;
        return $this;
    }
    public function getValoraciones(): Collection
    {
        return $this->valoraciones;
    }
    public function getMomentoDia(): string
    {
        return $this->momentoDia;
    }

    public function setMomentoDia(string $momentoDia): static
    {
        $this->momentoDia = $momentoDia;
        return $this;
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

    public function addValoracione(ValoracionPlato $valoracione): static
    {
        if (!$this->valoraciones->contains($valoracione)) {
            $this->valoraciones->add($valoracione);
            $valoracione->setDietaAlimento($this);
        }

        return $this;
    }

    public function removeValoracione(ValoracionPlato $valoracione): static
    {
        if ($this->valoraciones->removeElement($valoracione)) {
            // set the owning side to null (unless already changed)
            if ($valoracione->getDietaAlimento() === $this) {
                $valoracione->setDietaAlimento(null);
            }
        }

        return $this;
    }
}
