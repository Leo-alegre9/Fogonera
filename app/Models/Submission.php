<?php

namespace App\Models;

use App\Enums\SubmissionStatus;
use Database\Factories\SubmissionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Submission extends Model
{
    /** @use HasFactory<SubmissionFactory> */
    use HasFactory;

    protected $fillable = [
        'module_id',
        'token',
        'respondent_name',
        'respondent_role',
        'status',
        'started_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => SubmissionStatus::class,
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'token';
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
