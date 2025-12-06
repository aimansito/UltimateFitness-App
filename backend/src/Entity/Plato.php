<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Plato - Representa una receta completa con sus ingredientes
 * 
 * Esta entidad almacena información de platos/recetas que pueden ser
 * reutilizados en múltiples dietas. Cada plato tiene ingredientes
 * (alimentos) asociados a través de la relación con PlatoAlimento.
 */
#[ORM\Entity]
#[ORM\Table(name: 'platos')]
#[ORM\Index(name: 'idx_tipo', columns: ['tipo_comida'])]
#[ORM\Index(name: 'idx_publico', columns: ['es_publico'])]
#[ORM\Index(name: 'idx_valoracion', columns: ['valoracion_promedio'])]
class Plato
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 150)]
    #[Assert\NotBlank(message: 'El nombre del plato es obligatorio')]
    #[Assert\Length(
        max: 150,
        maxMessage: 'El nombre no puede superar {{ limit }} caracteres'
    )]
    private ?string $nombre = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $descripcion = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $instrucciones = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $imagenUrl = null;

    #[ORM\Column(type: 'string', length: 20, columnDefinition: "enum('desayuno','media_manana','almuerzo','merienda','cena','post_entreno')")]
    #[Assert\Choice(
        choices: ['desayuno', 'media_manana', 'almuerzo', 'merienda', 'cena', 'post_entreno'],
        message: 'Tipo de comida inválido'
    )]
    private ?string $tipoComida = null;

    #[ORM\Column(type: 'integer', nullable: true)]
    #[Assert\Positive(message: 'El tiempo de preparación debe ser positivo')]
    private ?int $tiempoPreparacion = null;

    #[ORM\Column(type: 'string', length: 10, columnDefinition: "enum('facil','media','dificil') DEFAULT 'media'")]
    #[Assert\Choice(
        choices: ['facil', 'media', 'dificil'],
        message: 'Dificultad inválida'
    )]
    private string $dificultad = 'media';

    // Valores nutricionales calculados automáticamente
    #[ORM\Column(type: 'decimal', precision: 8, scale: 2, nullable: true)]
    private ?string $caloriasTotales = null;

    #[ORM\Column(type: 'decimal', precision: 8, scale: 2, nullable: true)]
    private ?string $proteinasTotales = null;

    #[ORM\Column(type: 'decimal', precision: 8, scale: 2, nullable: true)]
    private ?string $carbohidratosTotales = null;

    #[ORM\Column(type: 'decimal', precision: 8, scale: 2, nullable: true)]
    private ?string $grasasTotales = null;

    #[ORM\Column(type: 'boolean', options: ['default' => 1])]
    private bool $esPublico = true;

    #[ORM\Column(type: 'decimal', precision: 3, scale: 2, options: ['default' => '0.00'])]
    #[Assert\Range(
        min: 0,
        max: 5,
        notInRangeMessage: 'La valoración debe estar entre {{ min }} y {{ max }}'
    )]
    private string $valoracionPromedio = '0.00';

    #[ORM\Column(type: 'integer', options: ['default' => 0])]
    private int $totalValoraciones = 0;

    #[ORM\Column(type: 'integer', nullable: true)]
    private ?int $creadorId = null;

    #[ORM\Column(type: 'datetime', options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeInterface $fechaCreacion = null;

    /**
     * Relación uno-a-muchos con PlatoAlimento
     * Un plato tiene múltiples ingredientes
     */
    #[ORM\OneToMany(mappedBy: 'plato', targetEntity: PlatoAlimento::class, cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[ORM\OrderBy(['orden' => 'ASC'])]
    private Collection $ingredientes;

    /**
     * Relación uno-a-muchos con DietaPlato
     * Un plato puede aparecer en múltiples dietas
     */
    #[ORM\OneToMany(targetEntity: DietaPlato::class, mappedBy: 'plato')]
    private Collection $dietaPlatos;

    public function __construct()
    {
        $this->ingredientes = new ArrayCollection();
        $this->dietaPlatos = new ArrayCollection();
        $this->fechaCreacion = new \DateTime();
    }

    // ============================================
    // GETTERS Y SETTERS
    // ============================================

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombre(): ?string
    {
        return $this->nombre;
    }

    public function setNombre(string $nombre): self
    {
        $this->nombre = $nombre;
        return $this;
    }

    public function getDescripcion(): ?string
    {
        return $this->descripcion;
    }

    public function setDescripcion(?string $descripcion): self
    {
        $this->descripcion = $descripcion;
        return $this;
    }

    public function getInstrucciones(): ?string
    {
        return $this->instrucciones;
    }

    public function setInstrucciones(?string $instrucciones): self
    {
        $this->instrucciones = $instrucciones;
        return $this;
    }

    public function getImagenUrl(): ?string
    {
        return $this->imagenUrl;
    }

    public function setImagenUrl(?string $imagenUrl): self
    {
        $this->imagenUrl = $imagenUrl;
        return $this;
    }

    public function getTipoComida(): ?string
    {
        return $this->tipoComida;
    }

    public function setTipoComida(string $tipoComida): self
    {
        $this->tipoComida = $tipoComida;
        return $this;
    }

    public function getTiempoPreparacion(): ?int
    {
        return $this->tiempoPreparacion;
    }

    public function setTiempoPreparacion(?int $tiempoPreparacion): self
    {
        $this->tiempoPreparacion = $tiempoPreparacion;
        return $this;
    }

    public function getDificultad(): string
    {
        return $this->dificultad;
    }

    public function setDificultad(string $dificultad): self
    {
        $this->dificultad = $dificultad;
        return $this;
    }

    public function getCaloriasTotales(): ?string
    {
        return $this->caloriasTotales;
    }

    public function setCaloriasTotales(?string $caloriasTotales): self
    {
        $this->caloriasTotales = $caloriasTotales;
        return $this;
    }

    public function getProteinasTotales(): ?string
    {
        return $this->proteinasTotales;
    }

    public function setProteinasTotales(?string $proteinasTotales): self
    {
        $this->proteinasTotales = $proteinasTotales;
        return $this;
    }

    public function getCarbohidratosTotales(): ?string
    {
        return $this->carbohidratosTotales;
    }

    public function setCarbohidratosTotales(?string $carbohidratosTotales): self
    {
        $this->carbohidratosTotales = $carbohidratosTotales;
        return $this;
    }

    public function getGrasasTotales(): ?string
    {
        return $this->grasasTotales;
    }

    public function setGrasasTotales(?string $grasasTotales): self
    {
        $this->grasasTotales = $grasasTotales;
        return $this;
    }

    public function isEsPublico(): bool
    {
        return $this->esPublico;
    }

    public function setEsPublico(bool $esPublico): self
    {
        $this->esPublico = $esPublico;
        return $this;
    }

    public function getValoracionPromedio(): string
    {
        return $this->valoracionPromedio;
    }

    public function setValoracionPromedio(string $valoracionPromedio): self
    {
        $this->valoracionPromedio = $valoracionPromedio;
        return $this;
    }

    public function getTotalValoraciones(): int
    {
        return $this->totalValoraciones;
    }

    public function setTotalValoraciones(int $totalValoraciones): self
    {
        $this->totalValoraciones = $totalValoraciones;
        return $this;
    }

    public function getCreadorId(): ?int
    {
        return $this->creadorId;
    }

    public function setCreadorId(?int $creadorId): self
    {
        $this->creadorId = $creadorId;
        return $this;
    }

    public function getFechaCreacion(): ?\DateTimeInterface
    {
        return $this->fechaCreacion;
    }

    public function setFechaCreacion(\DateTimeInterface $fechaCreacion): self
    {
        $this->fechaCreacion = $fechaCreacion;
        return $this;
    }

    /**
     * @return Collection<int, PlatoAlimento>
     */
    public function getIngredientes(): Collection
    {
        return $this->ingredientes;
    }

    public function addIngrediente(PlatoAlimento $ingrediente): self
    {
        if (!$this->ingredientes->contains($ingrediente)) {
            $this->ingredientes->add($ingrediente);
            $ingrediente->setPlato($this);
        }

        return $this;
    }

    public function removeIngrediente(PlatoAlimento $ingrediente): self
    {
        if ($this->ingredientes->removeElement($ingrediente)) {
            if ($ingrediente->getPlato() === $this) {
                $ingrediente->setPlato(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, DietaPlato>
     */
    public function getDietaPlatos(): Collection
    {
        return $this->dietaPlatos;
    }
    /**
     * Método auxiliar para calcular los valores nutricionales totales
     * basándose en los ingredientes del plato
     */
    public function calcularValoresNutricionales(): void
    {
        $calorias = 0;
        $proteinas = 0;
        $carbohidratos = 0;
        $grasas = 0;

        /** @var PlatoAlimento $ingrediente */
        foreach ($this->ingredientes as $ingrediente) {
            $alimento = $ingrediente->getAlimento();
            
            // Verificar que el alimento existe
            if (!$alimento) {
                continue;
            }
            
            $cantidad = (float)$ingrediente->getCantidadGramos();

            $calorias += ((float)$alimento->getCalorias() * $cantidad) / 100;
            $proteinas += ((float)$alimento->getProteinas() * $cantidad) / 100;
            $carbohidratos += ((float)$alimento->getCarbohidratos() * $cantidad) / 100;
            $grasas += ((float)$alimento->getGrasas() * $cantidad) / 100;
        }

        $this->caloriasTotales = number_format($calorias, 2, '.', '');
        $this->proteinasTotales = number_format($proteinas, 2, '.', '');
        $this->carbohidratosTotales = number_format($carbohidratos, 2, '.', '');
        $this->grasasTotales = number_format($grasas, 2, '.', '');
    }
}