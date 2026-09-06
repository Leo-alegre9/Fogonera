import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Question } from '@/types/models';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    pendingAlta: Question[];
    onJumpToQuestion: (questionId: number) => void;
    onConfirm: () => void;
    submitting: boolean;
}

export function CompletionDialog({ open, onOpenChange, pendingAlta, onJumpToQuestion, onConfirm, submitting }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Enviar cuestionario</DialogTitle>
                    {pendingAlta.length === 0 ? (
                        <DialogDescription>Respondiste todas las preguntas de criticidad alta. Podés enviar con confianza.</DialogDescription>
                    ) : (
                        <DialogDescription>
                            Quedan {pendingAlta.length} pregunta{pendingAlta.length === 1 ? '' : 's'} de criticidad alta sin responder. Podés
                            completarlas ahora o enviar igual.
                        </DialogDescription>
                    )}
                </DialogHeader>

                {pendingAlta.length > 0 && (
                    <div className="grid max-h-64 gap-2 overflow-y-auto">
                        {pendingAlta.map((question) => (
                            <button
                                key={question.id}
                                onClick={() => onJumpToQuestion(question.id)}
                                className="flex items-start gap-2 rounded-[3px] border border-alta/30 bg-alta-soft px-3 py-2 text-left text-sm text-ink hover:border-alta/60"
                            >
                                <span className="mt-0.5 shrink-0 font-mono text-xs text-alta">{question.code}</span>
                                <span>{question.text}</span>
                            </button>
                        ))}
                    </div>
                )}

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>
                        Seguir respondiendo
                    </Button>
                    <Button onClick={onConfirm} disabled={submitting}>
                        {pendingAlta.length === 0 ? 'Enviar' : 'Enviar de todos modos'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
