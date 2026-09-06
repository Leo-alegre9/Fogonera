<?php

namespace App\Console\Commands;

use App\Enums\Criticality;
use App\Enums\QuestionType;
use App\Models\Module;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ImportarCuestionario extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cuestionario:importar {archivo : Ruta al archivo JSON del módulo}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Importa (o actualiza) un módulo de cuestionario y sus preguntas desde un archivo JSON';

    public function handle(): int
    {
        $path = $this->argument('archivo');

        if (! is_file($path)) {
            $this->error("No se encontró el archivo: {$path}");

            return self::FAILURE;
        }

        $data = json_decode(file_get_contents($path), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->error('El archivo no contiene JSON válido: '.json_last_error_msg());

            return self::FAILURE;
        }

        foreach (['code', 'name', 'questions'] as $required) {
            if (! array_key_exists($required, $data)) {
                $this->error("Falta la clave obligatoria \"{$required}\" en el JSON.");

                return self::FAILURE;
            }
        }

        DB::transaction(function () use ($data) {
            $module = Module::updateOrCreate(
                ['code' => $data['code']],
                [
                    'name' => $data['name'],
                    'slug' => $data['slug'] ?? Str::slug($data['name']),
                    'description' => $data['description'] ?? null,
                    'respondent_role_label' => $data['respondent_role_label'] ?? null,
                ]
            );

            foreach (array_values($data['questions']) as $index => $question) {
                $type = QuestionType::from($question['type']);

                $module->questions()->updateOrCreate(
                    ['code' => $question['code']],
                    [
                        'section' => $question['section'],
                        'criticality' => Criticality::from($question['criticality']),
                        'text' => $question['text'],
                        'type' => $type,
                        'options' => $type === QuestionType::Open ? [] : ($question['options'] ?? []),
                        'order' => $question['order'] ?? $index + 1,
                    ]
                );
            }

            $this->info("Módulo \"{$module->name}\" ({$module->code}) importado con ".count($data['questions']).' pregunta(s).');
        });

        return self::SUCCESS;
    }
}
