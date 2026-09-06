<?php

namespace App\Http\Controllers\Admin;

use App\Enums\SubmissionStatus;
use App\Http\Controllers\Controller;
use App\Models\Module;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ModuleController extends Controller
{
    public function index(): Response
    {
        $modules = Module::query()
            ->withCount('questions')
            ->withCount('submissions')
            ->withCount(['submissions as completed_submissions_count' => function ($query) {
                $query->where('status', SubmissionStatus::Completed);
            }])
            ->with(['submissions' => fn ($query) => $query->latest()])
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/modules/index', [
            'modules' => $modules,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        Module::create($data);

        return back()->with('success', 'Módulo creado.');
    }

    public function update(Request $request, Module $module): RedirectResponse
    {
        $data = $this->validated($request, $module);

        $module->update($data);

        return back()->with('success', 'Módulo actualizado.');
    }

    public function destroy(Module $module): RedirectResponse
    {
        $module->delete();

        return back()->with('success', 'Módulo eliminado.');
    }

    private function validated(Request $request, ?Module $module = null): array
    {
        $data = $request->validate([
            'code' => ['required', 'string', 'max:50', Rule::unique('modules', 'code')->ignore($module)],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('modules', 'slug')->ignore($module)],
            'description' => ['nullable', 'string'],
            'respondent_role_label' => ['nullable', 'string', 'max:255'],
        ]);

        $data['code'] = Str::upper($data['code']);
        $data['slug'] = $data['slug'] ?: Str::slug($data['name']);

        return $data;
    }
}
