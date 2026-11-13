<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Relación "sigue a" entre cuentas (usuario o entrenador en ambos lados).
 * Las consultas se hacen por SQL en App\Service\VisibilidadService.
 */
#[ORM\Entity]
#[ORM\Table(name: 'seguimientos')]
#[ORM\UniqueConstraint(name: 'uniq_seguimiento', columns: ['seguidor_tipo', 'seguidor_id', 'seguido_tipo', 'seguido_id'])]
#[ORM\Index(name: 'idx_seguido', columns: ['seguido_tipo', 'seguido_id'])]
class Seguimiento
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(name: 'seguidor_tipo', length: 12)]
    private string $seguidorTipo = 'usuario';

    #[ORM\Column(name: 'seguidor_id')]
    private int $seguidorId = 0;

    #[ORM\Column(name: 'seguido_tipo', length: 12)]
    private string $seguidoTipo = 'usuario';

    #[ORM\Column(name: 'seguido_id')]
    private int $seguidoId = 0;

    #[ORM\Column(name: 'fecha_creacion', type: 'datetime', options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeInterface $fechaCreacion = null;

    public function getId(): ?int
    {
        return $this->id;
    }
}
