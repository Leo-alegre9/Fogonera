import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CriticalityTag } from '@/components/criticality-tag';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { isOtroOption } from '@/lib/utils';
import type { Criticality, Module, Question, QuestionType } from '@/types/models';

interface Props {
    module: Module;
    questions: Question[];
}

const TYPE_LABELS: Record<QuestionType, string> = {
    single: 'Opción única',
    multiple: 'Opción múltiple',
    open: 'Texto libre',
};

export default function QuestionsIndex({ module, questions }: Props) {
    const [editing, setEditing] = useState<Question | null>(null);
    const [creating, setCreating] = useState(false);

    function move(question: Question, direction: 'up' | 'down') {
        router.post(route('admin.modules.questions.move', [module.id, question.id]), { direction }, { preserveScroll: true });
    }

    function destroy(question: Question) {
        if (confirm(`¿Eliminar la pregunta ${question.code}? Se perderán las respuestas asociadas.`)) {
            router.delete(route('admin.modules.questions.destroy', [module.id, question.id]), { preserveScroll: true });
        }
    }

    return (
        <AdminLayout>
            <Head title={`Preguntas · ${module.code}`} />

            <Link href={route('admin.modules.index')} className="text-sm text-accent hover:underline">
                ← Módulos
            </Link>

            <div className="mt-3 mb-6 flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-medium text-ink">
                        <span className="font-mono text-lg text-accent">{module.code}</span> — {module.name}
                    </h1>
                    <p className="text-sm text-ink-soft">{questions.length} pregunta(s), en orden de presentación.</p>
                </div>
                <Button onClick={() => setCreating(true)}>Nueva pregunta</Button>
            </div>

            <div className="overflow-hidden rounded-[3px] border border-rule">
                {questions.length === 0 && <p className="px-5 py-8 text-center text-sm text-ink-soft">Todavía no hay preguntas.</p>}
                {questions.map((question, index) => (
                    <div key={question.id} className="flex items-start gap-4 border-b border-rule bg-paper-raised px-5 py-3 last:border-b-0">
                        <div className="flex flex-col gap-0.5 pt-0.5">
                            <button
                                className="text-ink-faint hover:text-ink disabled:opacity-30"
                                disabled={index === 0}
                                onClick={() => move(question, 'up')}
                                aria-label="Subir"
                            >
                                ▲
                            </button>
                            <button
                                className="text-ink-faint hover:text-ink disabled:opacity-30"
                                disabled={index === questions.length - 1}
                                onClick={() => move(question, 'down')}
                                aria-label="Bajar"
                            >
                                ▼
                            </button>
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="font-mono text-ink-faint">{question.code}</span>
                                <CriticalityTag value={question.criticality} />
                                <span className="text-ink-faint">{TYPE_LABELS[question.type]}</span>
                                <span className="text-ink-faint">· {question.section}</span>
                            </div>
                            <p className="mt-1 text-sm text-ink">{question.text}</p>
                            {question.type !== 'open' && question.options.length > 0 && (
                                <p className="mt-1 text-xs text-ink-faint">{question.options.join(' · ')}</p>
                            )}
                        </div>
                        <div className="flex shrink-0 gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setEditing(question)}>
                                Editar
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => destroy(question)}>
                                Eliminar
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <QuestionFormDialog open={creating} onOpenChange={setCreating} module={module} mode="create" />
            <QuestionFormDialog
                open={editing !== null}
                onOpenChange={(open) => !open && setEditing(null)}
                module={module}
                mode="edit"
                question={editing ?? undefined}
            />
        </AdminLayout>
    );
}

function QuestionFormDialog({
    open,
    onOpenChange,
    module,
    mode,
    question,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    module: Module;
    mode: 'create' | 'edit';
    question?: Question;
}) {
    const { data, setData, transform, post, patch, processing, errors, reset } = useForm({
        code: question?.code ?? '',
        section: question?.section ?? '',
        criticality: (question?.criticality ?? 'MEDIA') as Criticality,
        type: (question?.type ?? 'single') as QuestionType,
        text: question?.text ?? '',
        optionsText: question?.options?.join('\n') ?? '',
    });

    const optionLines = data.optionsText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
    const lastOptionIsOtro = optionLines.length === 0 || isOtroOption(optionLines[optionLines.length - 1]);

    transform((formData) => ({
        code: formData.code,
        section: formData.section,
        criticality: formData.criticality,
        type: formData.type,
        text: formData.text,
        options: formData.type === 'open' ? [] : optionLines,
    }));

    function submit(e: FormEvent) {
        e.preventDefault();

        const onSuccess = () => {
            reset();
            onOpenChange(false);
        };

        if (mode === 'create') {
            post(route('admin.modules.questions.store', module.id), { onSuccess });
        } else if (question) {
            patch(route('admin.modules.questions.update', [module.id, question.id]), { onSuccess });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{mode === 'create' ? 'Nueva pregunta' : `Editar ${question?.code}`}</DialogTitle>
                    <DialogDescription>El código es la clave de trazabilidad hacia el origen de la pregunta; no se renumera.</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="grid gap-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-1.5">
                            <Label htmlFor="code">Código</Label>
                            <Input id="code" value={data.code} onChange={(e) => setData('code', e.target.value)} />
                            {errors.code && <p className="text-xs text-alta">{errors.code}</p>}
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="section">Sección</Label>
                            <Input
                                id="section"
                                placeholder="1. Nombre de la sección"
                                value={data.section}
                                onChange={(e) => setData('section', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-1.5">
                            <Label htmlFor="criticality">Criticidad</Label>
                            <select
                                id="criticality"
                                className="h-9 rounded-[3px] border border-rule-strong bg-paper-raised px-2 text-sm"
                                value={data.criticality}
                                onChange={(e) => setData('criticality', e.target.value as Criticality)}
                            >
                                <option value="ALTA">Alta</option>
                                <option value="MEDIA">Media</option>
                                <option value="BAJA">Baja</option>
                            </select>
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="type">Tipo</Label>
                            <select
                                id="type"
                                className="h-9 rounded-[3px] border border-rule-strong bg-paper-raised px-2 text-sm"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value as QuestionType)}
                            >
                                <option value="single">Opción única</option>
                                <option value="multiple">Opción múltiple</option>
                                <option value="open">Texto libre</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="text">Enunciado</Label>
                        <Textarea id="text" value={data.text} onChange={(e) => setData('text', e.target.value)} />
                        {errors.text && <p className="text-xs text-alta">{errors.text}</p>}
                    </div>
                    {data.type !== 'open' && (
                        <div className="grid gap-1.5">
                            <Label htmlFor="options">Opciones (una por línea, la última debe ser "Otro")</Label>
                            <Textarea
                                id="options"
                                rows={5}
                                value={data.optionsText}
                                onChange={(e) => setData('optionsText', e.target.value)}
                            />
                            {!lastOptionIsOtro && (
                                <p className="text-xs text-media">La última opción debería ser "Otro" (o empezar con "Otra").</p>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Guardar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
