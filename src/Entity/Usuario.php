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
#[ORM\Index(name: 'idx_rol', columns: ['rol'])]
#[ORM\Index(name: 'idx_sexo', columns: ['sexo'])]
#[ORM\Index(name: 'idx_edad', columns: ['edad'])]
#[ORM\Index(name: 'idx_nivel_actividad', columns: ['nivel_actividad'])]
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

    // ============================================
    // CAMPOS - DATOS FÍSICOS
    // ============================================

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $sexo = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $fechaNacimiento = null;

    #[ORM\Column(nullable: true)]
    private ?int $edad = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 5, scale: 2, nullable: true)]
    private ?string $pesoActual = null;

    #[ORM\Column(nullable: true)]
    private ?int $altura = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 5, scale: 2, nullable: true)]
    private ?string $pesoObjetivo = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 4, scale: 2, nullable: true)]
    private ?string $porcentajeGrasa = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 4, scale: 2, nullable: true)]
    private ?string $imc = null;

    #[ORM\Column(length: 20, options: ['default' => 'ligero'])]
    private string $nivelActividad = 'ligero';

    #[ORM\Column(nullable: true)]
    private ?int $caloriasDiarias = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $notasSalud = null;

    // ============================================
    // CAMPOS PREMIUM Y ROL
    // ============================================

    #[ORM\Column(options: ['default' => false])]
    private bool $esPremium = false;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $fechaPremium = null;

    #[ORM\Column(length: 50, options: ['default' => 'cliente'])]
    private string $rol = 'cliente';

    // ============================================
    // CAMPOS DE AUDITORÍA
    // ============================================

    #[ORM\Column(type: Types::DATETIME_MUTABLE, options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeInterface $fechaRegistro = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $ultimaConexion = null;

    // ============================================
    // RELACIONES
    // ============================================

    #[ORM\OneToMany(targetEntity: Entrenamiento::class, mappedBy: 'creadorUsuario')]
    private Collection $entrenamientosCreados;

    #[ORM\OneToMany(targetEntity: Entrenamiento::class, mappedBy: 'asignadoAUsuario')]
    private Collection $entrenamientosAsignados;

    #[ORM\OneToMany(targetEntity: Dieta::class, mappedBy: 'asignadoAUsuario')]
    private Collection $dietasAsignadas;

    #[ORM\OneToMany(targetEntity: Suscripcion::class, mappedBy: 'usuario')]
    private Collection $suscripciones;

    #[ORM\OneToMany(targetEntity: CalendarioUsuario::class, mappedBy: 'usuario')]
    private Collection $calendarios;

    public function __construct()
    {
        $this->entrenamientosCreados = new ArrayCollection();
        $this->entrenamientosAsignados = new ArrayCollection();
        $this->dietasAsignadas = new ArrayCollection();
        $this->suscripciones = new ArrayCollection();
        $this->calendarios = new ArrayCollection();
        $this->fechaRegistro = new \DateTime();
    }

    // ============================================
    // GETTERS Y SETTERS BÁSICOS
    // ============================================

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

    // ============================================
    // GETTERS Y SETTERS - DATOS FÍSICOS
    // ============================================

    public function getSexo(): ?string
    {
        return $this->sexo;
    }

    public function setSexo(?string $sexo): static
    {
        $this->sexo = $sexo;
        return $this;
    }

    public function getFechaNacimiento(): ?\DateTimeInterface
    {
        return $this->fechaNacimiento;
    }

    public function setFechaNacimiento(?\DateTimeInterface $fechaNacimiento): static
    {
        $this->fechaNacimiento = $fechaNacimiento;
        if ($fechaNacimiento) {
            $hoy = new \DateTime();
            $this->edad = $hoy->diff($fechaNacimiento)->y;
        }
        return $this;
    }

    public function getEdad(): ?int
    {
        return $this->edad;
    }

    public function setEdad(?int $edad): static
    {
        $this->edad = $edad;
        return $this;
    }

    public function getPesoActual(): ?string
    {
        return $this->pesoActual;
    }

    public function setPesoActual(?string $pesoActual): static
    {
        $this->pesoActual = $pesoActual;
        $this->calcularIMC();
        return $this;
    }

    public function getAltura(): ?int
    {
        return $this->altura;
    }

    public function setAltura(?int $altura): static
    {
        $this->altura = $altura;
        $this->calcularIMC();
        return $this;
    }

    public function getPesoObjetivo(): ?string
    {
        return $this->pesoObjetivo;
    }

    public function setPesoObjetivo(?string $pesoObjetivo): static
    {
        $this->pesoObjetivo = $pesoObjetivo;
        return $this;
    }

    public function getPorcentajeGrasa(): ?string
    {
        return $this->porcentajeGrasa;
    }

    public function setPorcentajeGrasa(?string $porcentajeGrasa): static
    {
        $this->porcentajeGrasa = $porcentajeGrasa;
        return $this;
    }

    public function getImc(): ?string
    {
        return $this->imc;
    }

    public function setImc(?string $imc): static
    {
        $this->imc = $imc;
        return $this;
    }

    public function getNivelActividad(): string
    {
        return $this->nivelActividad;
    }

    public function setNivelActividad(string $nivelActividad): static
    {
        $this->nivelActividad = $nivelActividad;
        $this->calcularCaloriasDiarias();
        return $this;
    }

    public function getCaloriasDiarias(): ?int
    {
        return $this->caloriasDiarias;
    }

    public function setCaloriasDiarias(?int $caloriasDiarias): static
    {
        $this->caloriasDiarias = $caloriasDiarias;
        return $this;
    }

    public function getNotasSalud(): ?string
    {
        return $this->notasSalud;
    }

    public function setNotasSalud(?string $notasSalud): static
    {
        $this->notasSalud = $notasSalud;
        return $this;
    }

    // ============================================
    // GETTERS Y SETTERS - PREMIUM Y ROL
    // ============================================

    public function isEsPremium(): bool
    {
        return $this->esPremium;
    }

    public function setEsPremium(bool $esPremium): static
    {
        $this->esPremium = $esPremium;
        return $this;
    }

    public function getFechaPremium(): ?\DateTimeInterface
    {
        return $this->fechaPremium;
    }

    public function setFechaPremium(?\DateTimeInterface $fechaPremium): static
    {
        $this->fechaPremium = $fechaPremium;
        return $this;
    }

    public function getRol(): string
    {
        return $this->rol;
    }

    public function setRol(string $rol): static
    {
        $this->rol = $rol;
        return $this;
    }

    public function isAdmin(): bool
    {
        return $this->rol === 'admin';
    }

    // ============================================
    // GETTERS Y SETTERS - AUDITORÍA
    // ============================================

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

    // ============================================
    // MÉTODOS DE RELACIONES - SUSCRIPCIONES
    // ============================================

    public function getSuscripciones(): Collection
    {
        return $this->suscripciones;
    }

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
            if ($suscripcione->getUsuario() === $this) {
                $suscripcione->setUsuario(null);
            }
        }
        return $this;
    }

    // ============================================
    // MÉTODOS DE RELACIONES - CALENDARIOS
    // ============================================

    public function getCalendarios(): Collection
    {
        return $this->calendarios;
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
            if ($calendario->getUsuario() === $this) {
                $calendario->setUsuario(null);
            }
        }
        return $this;
    }

    // ============================================
    // MÉTODOS DE RELACIONES - DIETAS
    // ============================================

    public function getDietasAsignadas(): Collection
    {
        return $this->dietasAsignadas;
    }

    public function addDietaAsignada(Dieta $dieta): static
    {
        if (!$this->dietasAsignadas->contains($dieta)) {
            $this->dietasAsignadas->add($dieta);
            $dieta->setAsignadoAUsuario($this);
        }
        return $this;
    }

    public function removeDietaAsignada(Dieta $dieta): static
    {
        if ($this->dietasAsignadas->removeElement($dieta)) {
            if ($dieta->getAsignadoAUsuario() === $this) {
                $dieta->setAsignadoAUsuario(null);
            }
        }
        return $this;
    }

    // ============================================
    // MÉTODOS DE RELACIONES - ENTRENAMIENTOS
    // ============================================

    public function getEntrenamientosCreados(): Collection
    {
        return $this->entrenamientosCreados;
    }

    public function addEntrenamientosCreado(Entrenamiento $entrenamiento): static
    {
        if (!$this->entrenamientosCreados->contains($entrenamiento)) {
            $this->entrenamientosCreados->add($entrenamiento);
            $entrenamiento->setCreadorUsuario($this);
        }
        return $this;
    }

    public function removeEntrenamientosCreado(Entrenamiento $entrenamiento): static
    {
        if ($this->entrenamientosCreados->removeElement($entrenamiento)) {
            if ($entrenamiento->getCreadorUsuario() === $this) {
                $entrenamiento->setCreadorUsuario(null);
            }
        }
        return $this;
    }

    public function getEntrenamientosAsignados(): Collection
    {
        return $this->entrenamientosAsignados;
    }

    public function addEntrenamientosAsignado(Entrenamiento $entrenamiento): static
    {
        if (!$this->entrenamientosAsignados->contains($entrenamiento)) {
            $this->entrenamientosAsignados->add($entrenamiento);
            $entrenamiento->setAsignadoAUsuario($this);
        }
        return $this;
    }

    public function removeEntrenamientosAsignado(Entrenamiento $entrenamiento): static
    {
        if ($this->entrenamientosAsignados->removeElement($entrenamiento)) {
            if ($entrenamiento->getAsignadoAUsuario() === $this) {
                $entrenamiento->setAsignadoAUsuario(null);
            }
        }
        return $this;
    }

    // ============================================
    // MÉTODOS AUXILIARES - CÁLCULOS
    // ============================================

    private function calcularIMC(): void
    {
        if ($this->pesoActual && $this->altura) {
            $peso = (float) $this->pesoActual;
            $alturaMetros = $this->altura / 100;
            $imc = $peso / ($alturaMetros * $alturaMetros);
            $this->imc = number_format($imc, 2, '.', '');
        }
    }

    private function calcularCaloriasDiarias(): void
    {
        if (!$this->pesoActual || !$this->altura || !$this->edad || !$this->sexo) {
            return;
        }

        $peso = (float) $this->pesoActual;
        $altura = $this->altura;
        $edad = $this->edad;

        if ($this->sexo === 'masculino') {
            $tmb = 88.362 + (13.397 * $peso) + (4.799 * $altura) - (5.677 * $edad);
        } else {
            $tmb = 447.593 + (9.247 * $peso) + (3.098 * $altura) - (4.330 * $edad);
        }

        $multiplicadores = [
            'sedentario' => 1.2,
            'ligero' => 1.375,
            'moderado' => 1.55,
            'activo' => 1.725,
            'muy_activo' => 1.9
        ];

        $multiplicador = $multiplicadores[$this->nivelActividad] ?? 1.375;
        $this->caloriasDiarias = (int) round($tmb * $multiplicador);
    }

    public function getClasificacionIMC(): ?string
    {
        if (!$this->imc) {
            return null;
        }

        $imc = (float) $this->imc;

        if ($imc < 18.5) return 'Bajo peso';
        if ($imc < 25) return 'Peso normal';
        if ($imc < 30) return 'Sobrepeso';
        if ($imc < 35) return 'Obesidad I';
        if ($imc < 40) return 'Obesidad II';
        return 'Obesidad III';
    }

    // ============================================
    // IMPLEMENTACIÓN DE UserInterface
    // ============================================

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

        if ($this->rol === 'admin') {
            $roles[] = 'ROLE_ADMIN';
        }

        return array_unique($roles);
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->passwordHash;
    }

    public function setPassword(string $password): static
    {
        $this->passwordHash = $password;
        return $this;
    }

    public function eraseCredentials(): void
    {
        // Si almacenas datos temporales sensibles en el usuario, límpialos aquí
        // $this->plainPassword = null;
    }
}