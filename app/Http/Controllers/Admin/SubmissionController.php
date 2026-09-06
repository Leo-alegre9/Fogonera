<?php

namespace App\Http\Controllers\Admin;

use App\Enums\QuestionType;
use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Submission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SubmissionController extends Controller
{
    public function store(Module $module): RedirectResponse
    {
        do {
            $token = Str::random(32);
        } while (Submission::where('token', $token)->exists());

        $submission = $module->submissions()->create([
            'token' => $token,
        ]);

        $link = url("/c/{$submission->token}");

        return back()->with('success', 'Envío generado.')->with('link', $link);
    }

    public function show(Submission $submission): Response
    {
        $submission->load(['module.questions', 'answers']);

        $answersByQuestion = $submission->answers->keyBy('question_id');

        $sections = $submission->module->questions
            ->groupBy('section')
            ->map(function ($questions) use ($answersByQuestion) {
                return $questions->map(function ($question) use ($answersByQuestion) {
                    $answer = $answersByQuestion->get($question->id);

                    return [
                        'question' => $question,
                        'answer' => $answer,
                        'answered' => $this->isAnswered($question, $answer),
                    ];
                })->values();
            })
            ->map(fn ($items, $section) => ['section' => $section, 'items' => $items])
            ->values();

        return Inertia::render('admin/submissions/show', [
            'submission' => $submission,
            'module' => $submission->module,
            'sections' => $sections,
        ]);
    }

    public function destroy(Submission $submission): RedirectResponse
    {
        $submission->delete();

        return redirect()->route('admin.modules.index')->with('success', 'Envío eliminado.');
    }

    public function exportJson(Submission $submission): JsonResponse
    {
        $submission->load(['module', 'answers.question']);

        $payload = [
            'module' => $submission->module->code,
            'token' => $submission->token,
            'respondent_name' => $submission->respondent_name,
            'respondent_role' => $submission->respondent_role,
            'status' => $submission->status->value,
            'completed_at' => $submission->completed_at?->toIso8601String(),
            'answers' => $submission->answers->map(fn ($answer) => [
                'question_code' => $answer->question->code,
                'section' => $answer->question->section,
                'text' => $answer->question->text,
                'selected_options' => $answer->selected_options,
                'other_text' => $answer->other_text,
            ])->values(),
        ];

        $filename = "{$submission->module->code}-{$submission->token}.json";

        return response()->json($payload, 200, [
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

    public function exportMarkdown(Submission $submission): HttpResponse
    {
        $submission->load(['module.questions', 'answers']);

        $answersByQuestion = $submission->answers->keyBy('question_id');

        $lines = [];
        $lines[] = "# {$submission->module->name}";
        $lines[] = '';
        $lines[] = '- **Respondente:** '.($submission->respondent_name ?: '_sin nombre_');

        if ($submission->module->respondent_role_label) {
            $lines[] = "- **{$submission->module->respondent_role_label}:** ".($submission->respondent_role ?: '_sin especificar_');
        }

        $lines[] = '- **Estado:** '.$submission->status->value;
        $lines[] = '- **Completado el:** '.($submission->completed_at?->format('Y-m-d H:i') ?? '_no completado_');
        $lines[] = '';

        foreach ($submission->module->questions->groupBy('section') as $section => $questions) {
            $lines[] = "## {$section}";
            $lines[] = '';

            foreach ($questions as $question) {
                $answer = $answersByQuestion->get($question->id);
                $lines[] = "**{$question->text}** _(código: {$question->code}, criticidad: {$question->criticality->value})_";
                $lines[] = '';
                $lines[] = $this->formatAnswerForMarkdown($question, $answer);
                $lines[] = '';
            }
        }

        $markdown = implode("\n", $lines);
        $filename = "{$submission->module->code}-{$submission->token}.md";

        return response($markdown, 200, [
            'Content-Type' => 'text/markdown; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    private function isAnswered($question, $answer): bool
    {
        if (! $answer) {
            return false;
        }

        if ($question->type === QuestionType::Open) {
            return filled($answer->other_text);
        }

        return $answer->selected_options->isNotEmpty();
    }

    private function formatAnswerForMarkdown($question, $answer): string
    {
        if (! $this->isAnswered($question, $answer)) {
            return '_Sin responder._';
        }

        if ($question->type === QuestionType::Open) {
            return $answer->other_text;
        }

        $selected = $answer->selected_options->all();
        $isOtro = fn ($option) => Str::startsWith(Str::lower(trim((string) $option)), ['otro', 'otra']);

        $parts = [];
        foreach ($selected as $option) {
            if ($isOtro($option) && filled($answer->other_text)) {
                $parts[] = "Otro: {$answer->other_text}";
            } else {
                $parts[] = $option;
            }
        }

        return implode(', ', $parts);
    }
}
