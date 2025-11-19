<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;

use App\Repository\UsuarioRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ApiResource]
#[ORM\Entity(repositoryClass: UsuarioRepository::class)]
#[ORM\Table(name: 'usuarios')]
#[ORM\Index(name: 'idx_email', columns: ['email'])]
#[ORM\Index(name: 'idx_premium', columns: ['es_premium'])]
#[ORM\Index(name: 'idx_objetivo', columns: ['objetivo'])]
class Usuario implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    private ?string $nombre = null;

    #[ORM\Column(length: 150)]
    private ?string $apellidos = null;

    #[ORM\Column(length: 255, unique: true)]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $passwordHash = null;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $telefono = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $observaciones = null;

    #[ORM\Column(length: 25, options: ['default' => 'cuidar_alimentacion'])]
    private string $objetivo = 'cuidar_alimentacion';

    #[ORM\Column(options: ['default' => false])]
    private bool $esPremium = false;

    #[ORM\ManyToOne(targetEntity: Entrenador::class)]
    #[ORM\JoinColumn(name: 'entrenador_id', nullable: true, onDelete: 'SET NULL')]
    private ?Entrenador $entrenador = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeInterface $fechaRegistro = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $ultimaConexion = null;

    #[ORM\OneToMany(targetEntity: Suscripcion::class, mappedBy: 'usuario', orphanRemoval: true)]
    private Collection $suscripciones;

    #[ORM\OneToMany(targetEntity: CalendarioUsuario::class, mappedBy: 'usuario', orphanRemoval: true)]
    private Collection $calendarios;

    #[ORM\OneToMany(targetEntity: ValoracionEntrenador::class, mappedBy: 'cliente', orphanRemoval: true)]
    private Collection $valoracionesHechas;

    #[ORM\OneToMany(targetEntity: ValoracionPlato::class, mappedBy: 'usuario', orphanRemoval: true)]
    private Collection $valoracionesPlatos;

    public function __construct()
    {
        $this->suscripciones = new ArrayCollection();
        $this->calendarios = new ArrayCollection();
        $this->valoracionesHechas = new ArrayCollection();
        $this->valoracionesPlatos = new ArrayCollection();
        $this->fechaRegistro = new \DateTime();
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
    public function getApellidos(): ?string
    {
        return $this->apellidos;
    }
    public function setApellidos(string $apellidos): static
    {
        $this->apellidos = $apellidos;
        return $this;
    }
    public function getNombreCompleto(): string
    {
        return $this->nombre . ' ' . $this->apellidos;
    }
    public function getEmail(): ?string
    {
        return $this->email;
    }
    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }
    public function getPasswordHash(): ?string
    {
        return $this->passwordHash;
    }
    public function setPasswordHash(string $passwordHash): static
    {
        $this->passwordHash = $passwordHash;
        return $this;
    }
    public function getTelefono(): ?string
    {
        return $this->telefono;
    }
    public function setTelefono(?string $telefono): static
    {
        $this->telefono = $telefono;
        return $this;
    }
    public function getObservaciones(): ?string
    {
        return $this->observaciones;
    }
    public function setObservaciones(?string $observaciones): static
    {
        $this->observaciones = $observaciones;
        return $this;
    }
    public function getObjetivo(): string
    {
        return $this->objetivo;
    }
    public function setObjetivo(string $objetivo): static
    {
        $this->objetivo = $objetivo;
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
    public function getEntrenador(): ?Entrenador
    {
        return $this->entrenador;
    }
    public function setEntrenador(?Entrenador $entrenador): static
    {
        $this->entrenador = $entrenador;
        return $this;
    }
    public function getFechaRegistro(): ?\DateTimeInterface
    {
        return $this->fechaRegistro;
    }
    public function setFechaRegistro(\DateTimeInterface $fechaRegistro): static
    {
        $this->fechaRegistro = $fechaRegistro;
        return $this;
    }
    public function getUltimaConexion(): ?\DateTimeInterface
    {
        return $this->ultimaConexion;
    }
    public function setUltimaConexion(?\DateTimeInterface $ultimaConexion): static
    {
        $this->ultimaConexion = $ultimaConexion;
        return $this;
    }
    public function getSuscripciones(): Collection
    {
        return $this->suscripciones;
    }
    public function getCalendarios(): Collection
    {
        return $this->calendarios;
    }
    public function getValoracionesHechas(): Collection
    {
        return $this->valoracionesHechas;
    }
    public function getValoracionesPlatos(): Collection
    {
        return $this->valoracionesPlatos;
    }

    // Symfony Security
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }
    public function getRoles(): array
    {
        $roles = ['ROLE_USER'];

        if ($this->esPremium) {
            $roles[] = 'ROLE_PREMIUM';
        }

        if ($this->entrenador) {
            $roles[] = 'ROLE_TRAINER';
        }

        return array_unique($roles);
    }

    public function getPassword(): string
    {
        return $this->passwordHash;
    }
    public function setPassword(string $password): static
    {
        $this->passwordHash = $password;
        return $this;
    }
    public function eraseCredentials(): void {}

    public function addSuscripcione(Suscripcion $suscripcione): static
    {
        if (!$this->suscripciones->contains($suscripcione)) {
            $this->suscripciones->add($suscripcione);
            $suscripcione->setUsuario($this);
        }

        return $this;
    }

    public function removeSuscripcione(Suscripcion $suscripcione): static
    {
        if ($this->suscripciones->removeElement($suscripcione)) {
            // set the owning side to null (unless already changed)
            if ($suscripcione->getUsuario() === $this) {
                $suscripcione->setUsuario(null);
            }
        }

        return $this;
    }

    public function addCalendario(CalendarioUsuario $calendario): static
    {
        if (!$this->calendarios->contains($calendario)) {
            $this->calendarios->add($calendario);
            $calendario->setUsuario($this);
        }

        return $this;
    }

    public function removeCalendario(CalendarioUsuario $calendario): static
    {
        if ($this->calendarios->removeElement($calendario)) {
            // set the owning side to null (unless already changed)
            if ($calendario->getUsuario() === $this) {
                $calendario->setUsuario(null);
            }
        }

        return $this;
    }

    public function addValoracionesHecha(ValoracionEntrenador $valoracionesHecha): static
    {
        if (!$this->valoracionesHechas->contains($valoracionesHecha)) {
            $this->valoracionesHechas->add($valoracionesHecha);
            $valoracionesHecha->setCliente($this);
        }

        return $this;
    }

    public function removeValoracionesHecha(ValoracionEntrenador $valoracionesHecha): static
    {
        if ($this->valoracionesHechas->removeElement($valoracionesHecha)) {
            // set the owning side to null (unless already changed)
            if ($valoracionesHecha->getCliente() === $this) {
                $valoracionesHecha->setCliente(null);
            }
        }

        return $this;
    }

    public function addValoracionesPlato(ValoracionPlato $valoracionesPlato): static
    {
        if (!$this->valoracionesPlatos->contains($valoracionesPlato)) {
            $this->valoracionesPlatos->add($valoracionesPlato);
            $valoracionesPlato->setUsuario($this);
        }

        return $this;
    }

    public function removeValoracionesPlato(ValoracionPlato $valoracionesPlato): static
    {
        if ($this->valoracionesPlatos->removeElement($valoracionesPlato)) {
            // set the owning side to null (unless already changed)
            if ($valoracionesPlato->getUsuario() === $this) {
                $valoracionesPlato->setUsuario(null);
            }
        }

        return $this;
    }
}
