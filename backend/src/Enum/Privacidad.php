<?php

namespace App\Enum;

enum Privacidad: string
{
    case Publico = 'publico';
    case Seguidores = 'seguidores';
    case Privado = 'privado';
}
