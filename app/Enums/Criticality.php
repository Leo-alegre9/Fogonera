<?php

namespace App\Enums;

enum Criticality: string
{
    case Alta = 'ALTA';
    case Media = 'MEDIA';
    case Baja = 'BAJA';

    public function label(): string
    {
        return match ($this) {
            self::Alta => 'Alta',
            self::Media => 'Media',
            self::Baja => 'Baja',
        };
    }
}
