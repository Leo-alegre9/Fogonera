<?php

use App\Http\Controllers\Admin\ModuleController;
use App\Http\Controllers\Admin\QuestionController;
use App\Http\Controllers\Admin\SubmissionController;
use App\Http\Controllers\Public\QuestionnaireController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/admin');

Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [ModuleController::class, 'index'])->name('modules.index');
    Route::post('modules', [ModuleController::class, 'store'])->name('modules.store');
    Route::patch('modules/{module}', [ModuleController::class, 'update'])->name('modules.update');
    Route::delete('modules/{module}', [ModuleController::class, 'destroy'])->name('modules.destroy');

    Route::scopeBindings()->prefix('modules/{module}')->name('modules.')->group(function () {
        Route::get('questions', [QuestionController::class, 'index'])->name('questions.index');
        Route::post('questions', [QuestionController::class, 'store'])->name('questions.store');
        Route::patch('questions/{question}', [QuestionController::class, 'update'])->name('questions.update');
        Route::delete('questions/{question}', [QuestionController::class, 'destroy'])->name('questions.destroy');
        Route::post('questions/{question}/move', [QuestionController::class, 'move'])->name('questions.move');

        Route::post('submissions', [SubmissionController::class, 'store'])->name('submissions.store');
    });

    Route::prefix('submissions/{submission}')->name('submissions.')->group(function () {
        Route::get('/', [SubmissionController::class, 'show'])->name('show');
        Route::delete('/', [SubmissionController::class, 'destroy'])->name('destroy');
        Route::get('export.json', [SubmissionController::class, 'exportJson'])->name('export.json');
        Route::get('export.md', [SubmissionController::class, 'exportMarkdown'])->name('export.md');
    });
});

Route::prefix('c')->name('public.')->group(function () {
    Route::get('{submission:token}', [QuestionnaireController::class, 'show'])->name('show');
    Route::post('{submission:token}/answers', [QuestionnaireController::class, 'storeAnswer'])->name('answers.store');
    Route::patch('{submission:token}', [QuestionnaireController::class, 'updateRespondent'])->name('update');
    Route::post('{submission:token}/complete', [QuestionnaireController::class, 'complete'])->name('complete');
});
