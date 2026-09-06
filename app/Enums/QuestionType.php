<?php

namespace App\Enums;

enum QuestionType: string
{
    case Single = 'single';
    case Multiple = 'multiple';
    case Open = 'open';
}
