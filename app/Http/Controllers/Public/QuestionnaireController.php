<?php

namespace App\Http\Controllers\Public;

use App\Enums\SubmissionStatus;
use App\Http\Controllers\Controller;
use App\Models\Answer;
use App\Models\Submission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Inertia\Inertia;
use Inertia\Response;

class QuestionnaireController extends Controller
{
    public function show(Submission $submission): Response
    {
        if ($submission->status === SubmissionStatus::Draft && ! $submission->started_at) {
            $submission->update(['started_at' => Date::now()]);
        }

        $submission->load(['module.questions', 'answers']);

        return Inertia::render('public/questionnaire', [
            'module' => $submission->module,
            'submission' => $submission,
            'questions' => $submission->module->questions,
            'answers' => $submission->answers,
        ]);
    }

    public function storeAnswer(Request $request, Submission $submission): JsonResponse
    {
        $this->guardEditable($submission);

        $data = $request->validate([
            'question_id' => ['required', 'integer', 'exists:questions,id'],
            'selected_options' => ['nullable', 'array'],
            'selected_options.*' => ['string'],
            'other_text' => ['nullable', 'string'],
        ]);

        $answer = Answer::updateOrCreate(
            ['submission_id' => $submission->id, 'question_id' => $data['question_id']],
            [
                'selected_options' => $data['selected_options'] ?? [],
                'other_text' => $data['other_text'] ?? null,
            ]
        );

        return response()->json(['saved' => true, 'answer' => $answer]);
    }

    public function updateRespondent(Request $request, Submission $submission): JsonResponse
    {
        $this->guardEditable($submission);

        $data = $request->validate([
            'respondent_name' => ['nullable', 'string', 'max:255'],
            'respondent_role' => ['nullable', 'string', 'max:255'],
        ]);

        $submission->update($data);

        return response()->json(['saved' => true]);
    }

    public function complete(Submission $submission): JsonResponse
    {
        if ($submission->status === SubmissionStatus::Draft) {
            $submission->update([
                'status' => SubmissionStatus::Completed,
                'completed_at' => Date::now(),
            ]);
        }

        return response()->json(['status' => $submission->status->value]);
    }

    private function guardEditable(Submission $submission): void
    {
        abort_if($submission->status === SubmissionStatus::Completed, 409, 'Este envío ya fue completado y no admite ediciones.');
    }
}
