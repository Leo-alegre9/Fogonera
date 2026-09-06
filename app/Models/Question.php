<?php

namespace App\Models;

use App\Enums\Criticality;
use App\Enums\QuestionType;
use Database\Factories\QuestionFactory;
use Illuminate\Database\Eloquent\Casts\AsCollection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    /** @use HasFactory<QuestionFactory> */
    use HasFactory;

    protected $fillable = [
        'module_id',
        'code',
        'section',
        'criticality',
        'text',
        'type',
        'options',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'criticality' => Criticality::class,
            'type' => QuestionType::class,
            'options' => AsCollection::class,
        ];
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class);
    }
}
