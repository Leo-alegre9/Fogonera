import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { CriticalityTag } from '@/components/criticality-tag';
import { isOtroOption } from '@/lib/utils';
import type { Answer, Module, Question, Submission } from '@/types/models';

interface SectionItem {
    question: Question;
    answer: Answer | null;
    answered: boolean;
}

interface Props {
    submission: Submission;
    module: Module;
    sections: { section: string; items: SectionItem[] }[];
}

export default function SubmissionShow({ submission, module, sections }: Props) {
    function destroy() {
        if (confirm('¿Eliminar este envío y todas sus respuestas?')) {
            router.delete(route('admin.submissions.destroy', submission.token));
        }
    }

    return (
        <AdminLayout>
            <Head title={`Envío · ${module.code}`} />

            <Link href={route('admin.modules.index')} className="text-sm text-accent hover:underline">
                ← Módulos
            </Link>

            <div className="mt-3 mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl font-medium text-ink">
                        <span className="font-mono text-lg text-accent">{module.code}</span> — {module.name}
                    </h1>
                    <p className="mt-1 text-sm text-ink-soft">
                        {submission.respondent_name || '(sin nombre)'}
                        {submission.respondent_role ? ` · ${submission.respondent_role}` : ''}
                    </p>
                    <p className="mt-1 font-mono text-xs text-ink-faint">
                        {submission.status === 'completed' ? 'Completado' : 'Borrador'}
                        {submission.completed_at ? ` el ${new Date(submission.completed_at).toLocaleString('es-AR')}` : ''}
                    </p>
                </div>
                <div className="flex shrink-0 gap-2">
                    <a href={route('admin.submissions.export.json', submission.token)}>
                        <Button variant="outline" size="sm">
                            Exportar JSON
                        </Button>
                    </a>
                    <a href={route('admin.submissions.export.md', submission.token)}>
                        <Button variant="outline" size="sm">
                            Exportar Markdown
                        </Button>
                    </a>
                    <Button variant="ghost" size="sm" onClick={destroy}>
                        Eliminar
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                {sections.map(({ section, items }) => (
                    <div key={section}>
                        <h2 className="font-display text-base font-medium text-ink">{section}</h2>
                        <div className="mt-2 overflow-hidden rounded-[3px] border border-rule">
                            {items.map(({ question, answer, answered }) => (
                                <div key={question.id} className="border-b border-rule bg-paper-raised px-5 py-3 last:border-b-0">
                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                        <span className="font-mono text-ink-faint">{question.code}</span>
                                        <CriticalityTag value={question.criticality} />
                                    </div>
                                    <p className="mt-1 text-sm text-ink">{question.text}</p>
                                    <p className={`mt-1.5 text-sm ${answered ? 'text-ink' : 'text-ink-faint italic'}`}>
                                        {answered ? formatAnswer(question, answer!) : 'Sin responder'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}

function formatAnswer(question: Question, answer: Answer): string {
    if (question.type === 'open') {
        return answer.other_text ?? '';
    }

    const parts = answer.selected_options.map((option) => {
        if (isOtroOption(option) && answer.other_text) {
            return `Otro: ${answer.other_text}`;
        }
        return option;
    });

    return parts.join(', ');
}
