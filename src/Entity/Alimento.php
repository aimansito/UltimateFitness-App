<?php

namespace App\Entity;


use App\Repository\AlimentoRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AlimentoRepository::class)]
#[ORM\Table(name: 'alimentos')]
#[ORM\Index(name: 'idx_nombre', columns: ['nombre'])]
#[ORM\Index(name: 'idx_tipo', columns: ['tipo_alimento'])]
class Alimento
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 150)]
    private ?string $nombre = null;

    #[ORM\Column(length: 20)]
    private ?string $tipoAlimento = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $descripcion = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 8, scale: 2)]
    private ?string $calorias = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 6, scale: 2)]
    private ?string $proteinas = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 6, scale: 2)]
    private ?string $carbohidratos = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 6, scale: 2)]
    private ?string $grasas = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 6, scale: 2)]
    private ?string $precioKg = null;

    #[ORM\Column(length: 500, nullable: true)]
    private ?string $imagenUrl = null;

    #[ORM\OneToMany(targetEntity: DietaAlimento::class, mappedBy: 'alimento')]
    private Collection $dietaAlimentos;

    public function __construct()
    {
        $this->dietaAlimentos = new ArrayCollection();
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
    public function getTipoAlimento(): ?string
    {
        return $this->tipoAlimento;
    }
    public function setTipoAlimento(string $tipoAlimento): static
    {
        $this->tipoAlimento = $tipoAlimento;
        return $this;
    }
    public function getDescripcion(): ?string
    {
        return $this->descripcion;
    }
    public function setDescripcion(?string $descripcion): static
    {
        $this->descripcion = $descripcion;
        return $this;
    }
    public function getCalorias(): ?string
    {
        return $this->calorias;
    }
    public function setCalorias(string $calorias): static
    {
        $this->calorias = $calorias;
        return $this;
    }
    public function getProteinas(): ?string
    {
        return $this->proteinas;
    }
    public function setProteinas(string $proteinas): static
    {
        $this->proteinas = $proteinas;
        return $this;
    }
    public function getCarbohidratos(): ?string
    {
        return $this->carbohidratos;
    }
    public function setCarbohidratos(string $carbohidratos): static
    {
        $this->carbohidratos = $carbohidratos;
        return $this;
    }
    public function getGrasas(): ?string
    {
        return $this->grasas;
    }
    public function setGrasas(string $grasas): static
    {
        $this->grasas = $grasas;
        return $this;
    }
    public function getPrecioKg(): ?string
    {
        return $this->precioKg;
    }
    public function setPrecioKg(string $precioKg): static
    {
        $this->precioKg = $precioKg;
        return $this;
    }
    public function getImagenUrl(): ?string
    {
        return $this->imagenUrl;
    }
    public function setImagenUrl(?string $imagenUrl): static
    {
        $this->imagenUrl = $imagenUrl;
        return $this;
    }
    public function getDietaAlimentos(): Collection
    {
        return $this->dietaAlimentos;
    }

    public function addDietaAlimento(DietaAlimento $dietaAlimento): static
    {
        if (!$this->dietaAlimentos->contains($dietaAlimento)) {
            $this->dietaAlimentos->add($dietaAlimento);
            $dietaAlimento->setAlimento($this);
        }

        return $this;
    }

    public function removeDietaAlimento(DietaAlimento $dietaAlimento): static
    {
        if ($this->dietaAlimentos->removeElement($dietaAlimento)) {
            // set the owning side to null (unless already changed)
            if ($dietaAlimento->getAlimento() === $this) {
                $dietaAlimento->setAlimento(null);
            }
        }

        return $this;
    }
}
