<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Una serie hecha de un ejercicio: repeticiones y peso, en una fecha.
 * Las consultas se hacen por SQL en App\Controller\ProgresoController.
 */
#[ORM\Entity]
#[ORM\Table(name: 'registros_series')]
#[ORM\Index(name: 'idx_registro_usuario_ejercicio', columns: ['usuario_id', 'ejercicio_id', 'fecha'])]
class RegistroSerie
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Usuario::class)]
    #[ORM\JoinColumn(name: 'usuario_id', nullable: false, onDelete: 'CASCADE')]
    private ?Usuario $usuario = null;

    #[ORM\ManyToOne(targetEntity: Ejercicio::class)]
    #[ORM\JoinColumn(name: 'ejercicio_id', nullable: false, onDelete: 'CASCADE')]
    private ?Ejercicio $ejercicio = null;

    #[ORM\Column(name: 'entrenamiento_id', nullable: true)]
    private ?int $entrenamientoId = null;

    #[ORM\Column(type: 'date')]
    private ?\DateTimeInterface $fecha = null;

    #[ORM\Column(type: 'smallint')]
    private int $serie = 1;

    #[ORM\Column(type: 'smallint')]
    private int $repeticiones = 0;

    #[ORM\Column(name: 'peso_kg', type: 'decimal', precision: 6, scale: 2, nullable: true)]
    private ?string $pesoKg = null;

    #[ORM\Column(name: 'fecha_creacion', type: 'datetime', options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeInterface $fechaCreacion = null;

    public function getId(): ?int
    {
        return $this->id;
    }
}
