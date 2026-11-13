<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Favorito: un entrenamiento, dieta o plato guardado por una cuenta.
 * Las consultas se hacen por SQL en App\Controller\SocialController.
 */
#[ORM\Entity]
#[ORM\Table(name: 'guardados')]
#[ORM\UniqueConstraint(name: 'uniq_guardado', columns: ['propietario_tipo', 'propietario_id', 'item_tipo', 'item_id'])]
class Guardado
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(name: 'propietario_tipo', length: 12)]
    private string $propietarioTipo = 'usuario';

    #[ORM\Column(name: 'propietario_id')]
    private int $propietarioId = 0;

    #[ORM\Column(name: 'item_tipo', length: 15)]
    private string $itemTipo = 'entrenamiento';

    #[ORM\Column(name: 'item_id')]
    private int $itemId = 0;

    #[ORM\Column(name: 'fecha_creacion', type: 'datetime', options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeInterface $fechaCreacion = null;

    public function getId(): ?int
    {
        return $this->id;
    }
}
