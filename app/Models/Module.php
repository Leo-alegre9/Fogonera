<?php

namespace App\Models;

use Database\Factories\ModuleFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Module extends Model
{
    /** @use HasFactory<ModuleFactory> */
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'slug',
        'description',
        'respondent_role_label',
    ];

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class)->orderBy('order');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class);
    }
}
