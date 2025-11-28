<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\BlogPostRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource]
#[ORM\Entity(repositoryClass: BlogPostRepository::class)]
#[ORM\Table(name: 'blog_posts')]
#[ORM\Index(name: 'idx_estado', columns: ['estado'])]
#[ORM\Index(name: 'idx_categoria', columns: ['categoria'])]
#[ORM\Index(name: 'idx_destacado', columns: ['destacado'])]
#[ORM\Index(name: 'idx_fecha_publicacion', columns: ['fecha_publicacion'])]
#[ORM\Index(name: 'idx_slug', columns: ['slug'])]
class BlogPost
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $titulo = null;

    #[ORM\Column(length: 255, unique: true)]
    private ?string $slug = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $extracto = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $contenido = null;

    #[ORM\Column(length: 500, nullable: true)]
    private ?string $imagenPortada = null;

    #[ORM\Column(length: 20, options: ['default' => 'noticias'])]
    private string $categoria = 'noticias';

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $etiquetas = [];

    #[ORM\Column(length: 160, nullable: true)]
    private ?string $metaDescripcion = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $metaKeywords = null;

    #[ORM\Column(length: 20, options: ['default' => 'borrador'])]
    private string $estado = 'borrador';

    #[ORM\Column(options: ['default' => false])]
    private bool $destacado = false;

    #[ORM\Column(nullable: true)]
    private ?int $autorId = null;

    #[ORM\Column(length: 100, nullable: true)]
    private ?string $autorNombre = null;

    #[ORM\Column(options: ['default' => 0])]
    private int $vistas = 0;

    #[ORM\Column(options: ['default' => 0])]
    private int $meGusta = 0;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $fechaPublicacion = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeInterface $fechaCreacion = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeInterface $fechaActualizacion = null;

    public function __construct()
    {
        $this->fechaCreacion = new \DateTime();
        $this->fechaActualizacion = new \DateTime();
        $this->etiquetas = [];
    }

    // ============================================
    // GETTERS Y SETTERS
    // ============================================

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitulo(): ?string
    {
        return $this->titulo;
    }

    public function setTitulo(string $titulo): static
    {
        $this->titulo = $titulo;
        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;
        return $this;
    }

    public function getExtracto(): ?string
    {
        return $this->extracto;
    }

    public function setExtracto(?string $extracto): static
    {
        $this->extracto = $extracto;
        return $this;
    }

    public function getContenido(): ?string
    {
        return $this->contenido;
    }

    public function setContenido(string $contenido): static
    {
        $this->contenido = $contenido;
        return $this;
    }

    public function getImagenPortada(): ?string
    {
        return $this->imagenPortada;
    }

    public function setImagenPortada(?string $imagenPortada): static
    {
        $this->imagenPortada = $imagenPortada;
        return $this;
    }

    public function getCategoria(): string
    {
        return $this->categoria;
    }

    public function setCategoria(string $categoria): static
    {
        $this->categoria = $categoria;
        return $this;
    }

    public function getEtiquetas(): ?array
    {
        return $this->etiquetas;
    }

    public function setEtiquetas(?array $etiquetas): static
    {
        $this->etiquetas = $etiquetas;
        return $this;
    }

    public function getMetaDescripcion(): ?string
    {
        return $this->metaDescripcion;
    }

    public function setMetaDescripcion(?string $metaDescripcion): static
    {
        $this->metaDescripcion = $metaDescripcion;
        return $this;
    }

    public function getMetaKeywords(): ?string
    {
        return $this->metaKeywords;
    }

    public function setMetaKeywords(?string $metaKeywords): static
    {
        $this->metaKeywords = $metaKeywords;
        return $this;
    }

    public function getEstado(): string
    {
        return $this->estado;
    }

    public function setEstado(string $estado): static
    {
        $this->estado = $estado;
        return $this;
    }

    public function isDestacado(): bool
    {
        return $this->destacado;
    }

    public function setDestacado(bool $destacado): static
    {
        $this->destacado = $destacado;
        return $this;
    }

    public function getAutorId(): ?int
    {
        return $this->autorId;
    }

    public function setAutorId(?int $autorId): static
    {
        $this->autorId = $autorId;
        return $this;
    }

    public function getAutorNombre(): ?string
    {
        return $this->autorNombre;
    }

    public function setAutorNombre(?string $autorNombre): static
    {
        $this->autorNombre = $autorNombre;
        return $this;
    }

    public function getVistas(): int
    {
        return $this->vistas;
    }

    public function setVistas(int $vistas): static
    {
        $this->vistas = $vistas;
        return $this;
    }

    public function incrementarVistas(): static
    {
        $this->vistas++;
        return $this;
    }

    public function getMeGusta(): int
    {
        return $this->meGusta;
    }

    public function setMeGusta(int $meGusta): static
    {
        $this->meGusta = $meGusta;
        return $this;
    }

    public function incrementarMeGusta(): static
    {
        $this->meGusta++;
        return $this;
    }

    public function getFechaPublicacion(): ?\DateTimeInterface
    {
        return $this->fechaPublicacion;
    }

    public function setFechaPublicacion(?\DateTimeInterface $fechaPublicacion): static
    {
        $this->fechaPublicacion = $fechaPublicacion;
        return $this;
    }

    public function getFechaCreacion(): ?\DateTimeInterface
    {
        return $this->fechaCreacion;
    }

    public function setFechaCreacion(\DateTimeInterface $fechaCreacion): static
    {
        $this->fechaCreacion = $fechaCreacion;
        return $this;
    }

    public function getFechaActualizacion(): ?\DateTimeInterface
    {
        return $this->fechaActualizacion;
    }

    public function setFechaActualizacion(\DateTimeInterface $fechaActualizacion): static
    {
        $this->fechaActualizacion = $fechaActualizacion;
        return $this;
    }

    // ============================================
    // MÉTODOS AUXILIARES
    // ============================================

    public function estaPublicado(): bool
    {
        return $this->estado === 'publicado';
    }

    public function esBorrador(): bool
    {
        return $this->estado === 'borrador';
    }

    public function estaArchivado(): bool
    {
        return $this->estado === 'archivado';
    }

    public function publicar(): void
    {
        $this->estado = 'publicado';
        if (!$this->fechaPublicacion) {
            $this->fechaPublicacion = new \DateTime();
        }
    }

    public function archivar(): void
    {
        $this->estado = 'archivado';
    }

    public function convertirABorrador(): void
    {
        $this->estado = 'borrador';
    }

    public function getCategoriaFormateada(): string
    {
        $categorias = [
            'nutricion' => 'Nutrición',
            'entrenamiento' => 'Entrenamiento',
            'salud' => 'Salud',
            'motivacion' => 'Motivación',
            'recetas' => 'Recetas',
            'noticias' => 'Noticias',
            'premium' => 'Premium'
        ];

        return $categorias[$this->categoria] ?? $this->categoria;
    }

    /**
     * Verifica si el post es premium
     */
    public function isPremium(): bool
    {
        return $this->categoria === 'premium';
    }

    /**
     * Genera un slug automáticamente desde el título
     */
    public function generarSlug(): void
    {
        $slug = strtolower($this->titulo);
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
        $slug = trim($slug, '-');
        $this->slug = $slug;
    }
}