<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Criticality;
use App\Enums\QuestionType;
use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Question;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class QuestionController extends Controller
{
    public function index(Module $module): Response
    {
        return Inertia::render('admin/modules/questions', [
            'module' => $module,
            'questions' => $module->questions()->get(),
        ]);
    }

    public function store(Request $request, Module $module): RedirectResponse
    {
        $data = $this->validated($request);
        $data['order'] = $module->questions()->max('order') + 1;

        $module->questions()->create($data);

        return back()->with('success', 'Pregunta creada.');
    }

    public function update(Request $request, Module $module, Question $question): RedirectResponse
    {
        $question->update($this->validated($request, $question));

        return back()->with('success', 'Pregunta actualizada.');
    }

    public function destroy(Module $module, Question $question): RedirectResponse
    {
        $question->delete();

        return back()->with('success', 'Pregunta eliminada.');
    }

    public function move(Request $request, Module $module, Question $question): RedirectResponse
    {
        $direction = $request->validate([
            'direction' => ['required', Rule::in(['up', 'down'])],
        ])['direction'];

        $sibling = $module->questions()
            ->where('order', $direction === 'up' ? '<' : '>', $question->order)
            ->orderBy('order', $direction === 'up' ? 'desc' : 'asc')
            ->first();

        if ($sibling) {
            [$questionOrder, $siblingOrder] = [$question->order, $sibling->order];
            $question->update(['order' => $siblingOrder]);
            $sibling->update(['order' => $questionOrder]);
        }

        return back();
    }

    private function validated(Request $request, ?Question $question = null): array
    {
        $data = $request->validate([
            'code' => ['required', 'string', 'max:100', Rule::unique('questions', 'code')->ignore($question)],
            'section' => ['required', 'string', 'max:255'],
            'criticality' => ['required', Rule::enum(Criticality::class)],
            'text' => ['required', 'string'],
            'type' => ['required', Rule::enum(QuestionType::class)],
            'options' => ['nullable', 'array'],
            'options.*' => ['string'],
        ]);

        $type = QuestionType::from($data['type']);

        $data['options'] = $type === QuestionType::Open ? [] : ($data['options'] ?? []);

        return $data;
    }
}
