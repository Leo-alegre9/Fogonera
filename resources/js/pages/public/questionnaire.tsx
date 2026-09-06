import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { isOtroOption } from '@/lib/utils';
import { QuestionField, isQuestionAnswered, type LocalAnswer } from '@/components/public/question-field';
import { SectionSidebar } from '@/components/public/section-sidebar';
import { CompletionDialog } from '@/components/public/completion-dialog';
import { CriticalityTag } from '@/components/criticality-tag';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import type { Answer, Module, Question, Submission } from '@/types/models';

interface Props {
    module: Module;
    submission: Submission;
    questions: Question[];
    answers: Answer[];
}

const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
const SAVE_DELAY_MS = 500;

export default function Questionnaire({ module, submission, questions, answers }: Props) {
    const [status, setStatus] = useState(submission.status);
    const [respondentName, setRespondentName] = useState(submission.respondent_name ?? '');
    const [respondentRole, setRespondentRole] = useState(submission.respondent_role ?? '');
    const [localAnswers, setLocalAnswers] = useState<Record<number, LocalAnswer>>(() => {
        const map: Record<number, LocalAnswer> = {};
        for (const question of questions) {
            const existing = answers.find((a) => a.question_id === question.id);
            map[question.id] = {
                selected_options: existing?.selected_options ?? [],
                other_text: existing?.other_text ?? '',
            };
        }
        return map;
    });

    // step 0 = intro screen (name/role), 1..N = questions[step - 1]
    const [step, setStep] = useState(0);
    const [completionOpen, setCompletionOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const readOnly = status === 'completed';
    const currentQuestion: Question | null = step >= 1 ? questions[step - 1] : null;

    const answerTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
    const respondentTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    function saveAnswerNow(questionId: number, value: LocalAnswer) {
        apiRequest(route('public.answers.store', submission.token), 'POST', {
            question_id: questionId,
            selected_options: value.selected_options,
            other_text: value.other_text,
        }).catch(() => {});
    }

    function updateAnswer(questionId: number, value: LocalAnswer) {
        setLocalAnswers((prev) => ({ ...prev, [questionId]: value }));
        clearTimeout(answerTimers.current[questionId]);
        answerTimers.current[questionId] = setTimeout(() => saveAnswerNow(questionId, value), SAVE_DELAY_MS);
    }

    function flushAnswer(questionId: number) {
        const timer = answerTimers.current[questionId];
        if (timer) {
            clearTimeout(timer);
            delete answerTimers.current[questionId];
            saveAnswerNow(questionId, localAnswers[questionId]);
        }
    }

    function updateRespondent(name: string, role: string) {
        setRespondentName(name);
        setRespondentRole(role);
        clearTimeout(respondentTimer.current);
        respondentTimer.current = setTimeout(() => {
            apiRequest(route('public.update', submission.token), 'PATCH', {
                respondent_name: name,
                respondent_role: role,
            }).catch(() => {});
        }, SAVE_DELAY_MS);
    }

    function goTo(nextStep: number) {
        if (currentQuestion) {
            flushAnswer(currentQuestion.id);
        }
        setStep(Math.max(0, Math.min(questions.length, nextStep)));
    }

    function jumpToQuestionId(questionId: number) {
        const index = questions.findIndex((q) => q.id === questionId);
        if (index !== -1) {
            goTo(index + 1);
            setCompletionOpen(false);
        }
    }

    const sections = useMemo(() => {
        const order: string[] = [];
        const map = new Map<string, { answered: number; total: number; firstIndex: number }>();

        questions.forEach((question, index) => {
            if (!map.has(question.section)) {
                map.set(question.section, { answered: 0, total: 0, firstIndex: index });
                order.push(question.section);
            }
            const entry = map.get(question.section)!;
            entry.total += 1;
            if (isQuestionAnswered(question, localAnswers[question.id])) {
                entry.answered += 1;
            }
        });

        return order.map((section) => ({ section, ...map.get(section)! }));
    }, [questions, localAnswers]);

    const answeredCount = questions.filter((q) => isQuestionAnswered(q, localAnswers[q.id])).length;
    const overallProgress = questions.length === 0 ? 0 : Math.round((answeredCount / questions.length) * 100);

    const pendingAlta = useMemo(
        () => questions.filter((q) => q.criticality === 'ALTA' && !isQuestionAnswered(q, localAnswers[q.id])),
        [questions, localAnswers],
    );

    useEffect(() => {
        if (readOnly) return;

        function handler(event: KeyboardEvent) {
            const active = document.activeElement as HTMLElement | null;
            const isTyping =
                active?.tagName === 'TEXTAREA' ||
                (active?.tagName === 'INPUT' && !['radio', 'checkbox'].includes((active as HTMLInputElement).type));

            if (event.key === 'Enter' && !isTyping) {
                event.preventDefault();
                goTo(step + 1);
                return;
            }

            if (isTyping || step === 0 || !currentQuestion || currentQuestion.type === 'open') {
                return;
            }

            const letterIndex = LETTERS.indexOf(event.key.toLowerCase());
            if (letterIndex === -1 || letterIndex >= currentQuestion.options.length) {
                return;
            }

            event.preventDefault();

            const option = currentQuestion.options[letterIndex];
            const current = localAnswers[currentQuestion.id];

            if (currentQuestion.type === 'single') {
                updateAnswer(currentQuestion.id, { selected_options: [option], other_text: isOtroOption(option) ? current.other_text : '' });
            } else {
                const isSelected = current.selected_options.includes(option);
                const nextSelected = isSelected
                    ? current.selected_options.filter((o) => o !== option)
                    : [...current.selected_options, option];
                updateAnswer(currentQuestion.id, {
                    selected_options: nextSelected,
                    other_text: nextSelected.some(isOtroOption) ? current.other_text : '',
                });
            }
        }

        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step, currentQuestion, localAnswers, readOnly]);

    async function confirmCompletion() {
        if (currentQuestion) flushAnswer(currentQuestion.id);
        setSubmitting(true);
        try {
            await apiRequest(route('public.complete', submission.token), 'POST', {});
            setStatus('completed');
            setCompletionOpen(false);
        } finally {
            setSubmitting(false);
        }
    }

    if (readOnly) {
        return <ReadOnlyView module={module} submission={submission} questions={questions} answers={localAnswers} respondentName={respondentName} respondentRole={respondentRole} />;
    }

    return (
        <>
            <Head title={module.name} />
            <div className="mx-auto grid min-h-screen max-w-5xl grid-cols-1 gap-8 px-4 py-8 md:grid-cols-[220px_1fr]">
                <aside className="hidden min-w-0 md:block">
                    <div className="sticky top-8">
                        <div className="mb-4 flex items-center gap-2.5">
                            <img
                                src="/images/logo-gallo-negro.png"
                                alt="Gallo Negro Blacksmith"
                                className="h-9 w-9 rounded-[3px] border border-rule-strong object-cover"
                            />
                            <p className="font-mono text-xs uppercase tracking-wide text-ink-faint">{module.code}</p>
                        </div>
                        <SectionSidebar
                            sections={sections}
                            currentSection={currentQuestion?.section ?? null}
                            onJump={(index) => goTo(index + 1)}
                        />
                        <div className="mt-6 border-t border-rule pt-4">
                            <p className="mb-1.5 font-mono text-xs tabular-nums text-ink-faint">
                                {answeredCount} / {questions.length}
                            </p>
                            <Progress value={overallProgress} />
                        </div>
                        <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => setCompletionOpen(true)}>
                            Finalizar cuestionario
                        </Button>
                    </div>
                </aside>

                <main className="flex flex-col">
                    <div className="mb-6 md:hidden">
                        <p className="font-mono text-xs tabular-nums text-ink-faint">
                            {answeredCount} / {questions.length}
                        </p>
                        <Progress value={overallProgress} className="mt-1.5" />
                    </div>

                    <div className="flex-1">
                        {step === 0 ? (
                            <IntroScreen
                                moduleName={module.name}
                                description={module.description}
                                roleLabel={module.respondent_role_label}
                                name={respondentName}
                                role={respondentRole}
                                onChange={updateRespondent}
                            />
                        ) : currentQuestion ? (
                            <div>
                                <div className="mb-1 flex items-center gap-2">
                                    <span className="font-mono text-xs text-ink-faint">{currentQuestion.code}</span>
                                    <CriticalityTag value={currentQuestion.criticality} />
                                </div>
                                <p className="mb-6 font-mono text-xs text-ink-faint">{currentQuestion.section}</p>
                                <h1 className="mb-6 font-display text-2xl font-medium leading-snug text-ink">{currentQuestion.text}</h1>
                                <QuestionField
                                    question={currentQuestion}
                                    answer={localAnswers[currentQuestion.id]}
                                    onChange={(value) => updateAnswer(currentQuestion.id, value)}
                                />
                            </div>
                        ) : null}
                    </div>

                    <div className="mt-10 flex items-center justify-between border-t border-rule pt-4">
                        <Button variant="outline" onClick={() => goTo(step - 1)} disabled={step === 0}>
                            ← Atrás
                        </Button>
                        {step < questions.length ? (
                            <Button onClick={() => goTo(step + 1)}>Continuar →</Button>
                        ) : (
                            <Button onClick={() => setCompletionOpen(true)}>Finalizar cuestionario</Button>
                        )}
                    </div>
                    <Button variant="ghost" size="sm" className="mt-4 self-center md:hidden" onClick={() => setCompletionOpen(true)}>
                        Finalizar cuestionario
                    </Button>
                </main>
            </div>

            <CompletionDialog
                open={completionOpen}
                onOpenChange={setCompletionOpen}
                pendingAlta={pendingAlta}
                onJumpToQuestion={jumpToQuestionId}
                onConfirm={confirmCompletion}
                submitting={submitting}
            />
        </>
    );
}

function IntroScreen({
    moduleName,
    description,
    roleLabel,
    name,
    role,
    onChange,
}: {
    moduleName: string;
    description: string | null;
    roleLabel: string | null;
    name: string;
    role: string;
    onChange: (name: string, role: string) => void;
}) {
    return (
        <div>
            <img
                src="/images/logo-gallo-negro.png"
                alt="Gallo Negro Blacksmith"
                className="mb-5 h-16 w-16 rounded-md border border-rule-strong object-cover md:hidden"
            />
            <h1 className="mb-2 font-display text-2xl font-medium text-ink">{moduleName}</h1>
            {description && <p className="mb-8 max-w-xl text-ink-soft">{description}</p>}
            <div className="grid max-w-sm gap-4">
                <div className="grid gap-1.5">
                    <Label htmlFor="respondent_name">Tu nombre</Label>
                    <Input
                        id="respondent_name"
                        autoFocus
                        value={name}
                        onChange={(e) => onChange(e.target.value, role)}
                        placeholder="Nombre y apellido"
                    />
                </div>
                {roleLabel && (
                    <div className="grid gap-1.5">
                        <Label htmlFor="respondent_role">{roleLabel}</Label>
                        <Input id="respondent_role" value={role} onChange={(e) => onChange(name, e.target.value)} />
                    </div>
                )}
            </div>
            <p className="mt-8 text-sm text-ink-faint">Tus respuestas se guardan automáticamente. Podés cerrar esta página y volver más tarde.</p>
        </div>
    );
}

function ReadOnlyView({
    module,
    submission,
    questions,
    answers,
    respondentName,
    respondentRole,
}: {
    module: Module;
    submission: Submission;
    questions: Question[];
    answers: Record<number, LocalAnswer>;
    respondentName: string;
    respondentRole: string;
}) {
    const sections = useMemo(() => {
        const order: string[] = [];
        const map = new Map<string, Question[]>();
        questions.forEach((q) => {
            if (!map.has(q.section)) {
                map.set(q.section, []);
                order.push(q.section);
            }
            map.get(q.section)!.push(q);
        });
        return order.map((section) => ({ section, items: map.get(section)! }));
    }, [questions]);

    return (
        <>
            <Head title={module.name} />
            <div className="mx-auto max-w-2xl px-4 py-12">
                <img
                    src="/images/logo-gallo-negro.png"
                    alt="Gallo Negro Blacksmith"
                    className="mb-5 h-14 w-14 rounded-md border border-rule-strong object-cover"
                />
                <p className="font-mono text-xs uppercase tracking-wide text-baja">Envío completado</p>
                <h1 className="mt-1 mb-1 font-display text-2xl font-medium text-ink">{module.name}</h1>
                <p className="mb-10 text-sm text-ink-soft">
                    {respondentName || '(sin nombre)'}
                    {respondentRole ? ` · ${respondentRole}` : ''}
                    {submission.completed_at ? ` · ${new Date(submission.completed_at).toLocaleString('es-AR')}` : ''}
                </p>

                <div className="grid gap-8">
                    {sections.map(({ section, items }) => (
                        <div key={section}>
                            <h2 className="mb-2 font-display text-base font-medium text-ink">{section}</h2>
                            <div className="grid gap-3">
                                {items.map((question) => {
                                    const answer = answers[question.id];
                                    const answered = isQuestionAnswered(question, answer);
                                    return (
                                        <div key={question.id} className="rounded-[3px] border border-rule bg-paper-raised px-4 py-3">
                                            <p className="text-sm text-ink">{question.text}</p>
                                            <p className={`mt-1 text-sm ${answered ? 'text-ink-soft' : 'italic text-ink-faint'}`}>
                                                {answered ? formatReadOnlyAnswer(question, answer) : 'Sin responder'}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

function formatReadOnlyAnswer(question: Question, answer: LocalAnswer): string {
    if (question.type === 'open') {
        return answer.other_text;
    }

    return answer.selected_options
        .map((option) => (isOtroOption(option) && answer.other_text ? `Otro: ${answer.other_text}` : option))
        .join(', ');
}
