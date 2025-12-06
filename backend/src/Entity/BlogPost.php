<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\BlogPostRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource]
#[ORM\Entity(repositoryClass: BlogPostRepository::class)]
#[ORM\Table(name: 'blog_posts')]
#[ORM\Index(name: 'idx_categoria', columns: ['categoria'])]
#[ORM\Index(name: 'idx_premium', columns: ['es_premium'])]
#[ORM\Index(name: 'idx_destacado', columns: ['destacado'])]
#[ORM\Index(name: 'idx_fecha_publicacion', columns: ['fecha_publicacion'])]
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

    #[ORM\Column(options: ['default' => false])]
    private bool $esPremium = false;

    #[ORM\Column(options: ['default' => false])]
    private bool $destacado = false;

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

    public function isEsPremium(): bool
    {
        return $this->esPremium;
    }

    public function setEsPremium(bool $esPremium): static
    {
        $this->esPremium = $esPremium;
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
        return $this->fechaPublicacion !== null && $this->fechaPublicacion <= new \DateTime();
    }

    public function publicar(): void
    {
        if (!$this->fechaPublicacion) {
            $this->fechaPublicacion = new \DateTime();
        }
    }

    public function getCategoriaFormateada(): string
    {
        $categorias = [
            'nutricion' => 'Nutrición',
            'entrenamiento' => 'Entrenamiento',
            'salud' => 'Salud',
            'motivacion' => 'Motivación',
            'recetas' => 'Recetas',
            'noticias' => 'Noticias'
        ];

        return $categorias[$this->categoria] ?? ucfirst($this->categoria);
    }

    /**
     * Genera un slug automáticamente desde el título
     */
    public function generarSlug(): void
    {
        $slug = strtolower($this->titulo);
        // Reemplazar caracteres especiales españoles
        $slug = str_replace(['á', 'é', 'í', 'ó', 'ú', 'ñ'], ['a', 'e', 'i', 'o', 'u', 'n'], $slug);
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
        $slug = trim($slug, '-');
        $this->slug = $slug;
    }
}