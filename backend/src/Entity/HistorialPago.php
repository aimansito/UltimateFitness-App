<?php

namespace App\Entity;

use App\Repository\HistorialPagoRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * HistorialPago - Registra todos los pagos realizados
 */
#[ORM\Entity(repositoryClass: HistorialPagoRepository::class)]
#[ORM\Table(name: 'historial_pagos')]
#[ORM\Index(name: 'idx_usuario', columns: ['usuario_id'])]
#[ORM\Index(name: 'idx_transaccion', columns: ['id_transaccion_externa'])]
#[ORM\Index(name: 'idx_estado', columns: ['estado'])]
#[ORM\Index(name: 'idx_fecha', columns: ['fecha_pago'])]
class HistorialPago
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Usuario::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Usuario $usuario = null;

    #[ORM\ManyToOne(targetEntity: Suscripcion::class)]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    private ?Suscripcion $suscripcion = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    private ?string $monto = null;

    #[ORM\Column(type: Types::STRING, length: 3, options: ['default' => 'EUR'])]
    private string $moneda = 'EUR';

    #[ORM\Column(type: Types::STRING, length: 50)]
    private ?string $metodoPago = null;

    #[ORM\Column(type: Types::STRING, length: 255)]
    private ?string $idTransaccionExterna = null;

    #[ORM\Column(type: Types::STRING, length: 20, options: ['default' => 'pendiente'])]
    private string $estado = 'pendiente';

    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    private ?string $descripcion = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $metadata = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $fechaPago = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $fechaActualizacion = null;

    public function __construct()
    {
        $this->fechaPago = new \DateTime();
        $this->fechaActualizacion = new \DateTime();
    }

    // Getters y Setters

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsuario(): ?Usuario
    {
        return $this->usuario;
    }

    public function setUsuario(?Usuario $usuario): static
    {
        $this->usuario = $usuario;
        return $this;
    }

    public function getSuscripcion(): ?Suscripcion
    {
        return $this->suscripcion;
    }

    public function setSuscripcion(?Suscripcion $suscripcion): static
    {
        $this->suscripcion = $suscripcion;
        return $this;
    }

    public function getMonto(): ?string
    {
        return $this->monto;
    }

    public function setMonto(string $monto): static
    {
        $this->monto = $monto;
        return $this;
    }

    public function getMoneda(): string
    {
        return $this->moneda;
    }

    public function setMoneda(string $moneda): static
    {
        $this->moneda = $moneda;
        return $this;
    }

    public function getMetodoPago(): ?string
    {
        return $this->metodoPago;
    }

    public function setMetodoPago(string $metodoPago): static
    {
        $this->metodoPago = $metodoPago;
        return $this;
    }

    public function getIdTransaccionExterna(): ?string
    {
        return $this->idTransaccionExterna;
    }

    public function setIdTransaccionExterna(string $idTransaccionExterna): static
    {
        $this->idTransaccionExterna = $idTransaccionExterna;
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

    public function getDescripcion(): ?string
    {
        return $this->descripcion;
    }

    public function setDescripcion(?string $descripcion): static
    {
        $this->descripcion = $descripcion;
        return $this;
    }

    public function getMetadata(): ?array
    {
        return $this->metadata;
    }

    public function setMetadata(?array $metadata): static
    {
        $this->metadata = $metadata;
        return $this;
    }

    public function getFechaPago(): ?\DateTimeInterface
    {
        return $this->fechaPago;
    }

    public function setFechaPago(\DateTimeInterface $fechaPago): static
    {
        $this->fechaPago = $fechaPago;
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

    // Métodos auxiliares

    public function marcarComoCompletado(): static
    {
        $this->estado = 'completado';
        $this->fechaActualizacion = new \DateTime();
        return $this;
    }

    public function marcarComoFallido(): static
    {
        $this->estado = 'fallido';
        $this->fechaActualizacion = new \DateTime();
        return $this;
    }

    public function estaPendiente(): bool
    {
        return $this->estado === 'pendiente';
    }

    public function estaCompletado(): bool
    {
        return $this->estado === 'completado';
    }
}