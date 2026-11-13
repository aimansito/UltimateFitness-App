<?php

namespace App\Entity;

use App\Enum\Privacidad;
use Doctrine\ORM\Mapping as ORM;

/**
 * Ajustes de perfil público compartidos por Usuario y Entrenador.
 */
trait PerfilSocialTrait
{
    #[ORM\Column(name: 'perfil_publico', options: ['default' => true])]
    private bool $perfilPublico = true;

    #[ORM\Column(name: 'privacidad_entrenamientos', length: 12, enumType: Privacidad::class, options: ['default' => 'publico'])]
    private Privacidad $privacidadEntrenamientos = Privacidad::Publico;

    #[ORM\Column(name: 'privacidad_dietas', length: 12, enumType: Privacidad::class, options: ['default' => 'publico'])]
    private Privacidad $privacidadDietas = Privacidad::Publico;

    #[ORM\Column(name: 'privacidad_favoritos', length: 12, enumType: Privacidad::class, options: ['default' => 'publico'])]
    private Privacidad $privacidadFavoritos = Privacidad::Publico;

    public function isPerfilPublico(): bool
    {
        return $this->perfilPublico;
    }

    public function setPerfilPublico(bool $perfilPublico): static
    {
        $this->perfilPublico = $perfilPublico;
        return $this;
    }

    public function getPrivacidadEntrenamientos(): Privacidad
    {
        return $this->privacidadEntrenamientos;
    }

    public function setPrivacidadEntrenamientos(Privacidad $privacidad): static
    {
        $this->privacidadEntrenamientos = $privacidad;
        return $this;
    }

    public function getPrivacidadDietas(): Privacidad
    {
        return $this->privacidadDietas;
    }

    public function setPrivacidadDietas(Privacidad $privacidad): static
    {
        $this->privacidadDietas = $privacidad;
        return $this;
    }

    public function getPrivacidadFavoritos(): Privacidad
    {
        return $this->privacidadFavoritos;
    }

    public function setPrivacidadFavoritos(Privacidad $privacidad): static
    {
        $this->privacidadFavoritos = $privacidad;
        return $this;
    }
}
