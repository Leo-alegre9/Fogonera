import { useEffect, useRef, type ReactNode } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isOtroOption } from '@/lib/utils';
import type { Question } from '@/types/models';

export interface LocalAnswer {
    selected_options: string[];
    other_text: string;
}

interface Props {
    question: Question;
    answer: LocalAnswer;
    onChange: (answer: LocalAnswer) => void;
    readOnly?: boolean;
}

const LETTERS = 'abcdefghijklmnopqrstuvwxyz';

export function QuestionField({ question, answer, onChange, readOnly }: Props) {
    const otroInputRef = useRef<HTMLInputElement>(null);

    const hasOtroSelected = answer.selected_options.some(isOtroOption);

    useEffect(() => {
        if (hasOtroSelected) {
            otroInputRef.current?.focus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasOtroSelected]);

    if (question.type === 'open') {
        return (
            <Textarea
                autoFocus
                rows={6}
                disabled={readOnly}
                value={answer.other_text}
                onChange={(e) => onChange({ selected_options: [], other_text: e.target.value })}
                placeholder="Escribí tu respuesta…"
                className="text-base"
            />
        );
    }

    if (question.type === 'single') {
        return (
            <RadioGroup
                value={answer.selected_options[0] ?? ''}
                onValueChange={(value) => onChange({ selected_options: [value], other_text: isOtroOption(value) ? answer.other_text : '' })}
            >
                {question.options.map((option, index) => (
                    <OptionRow key={option} letter={LETTERS[index]} disabled={readOnly}>
                        <RadioGroupItem value={option} id={`opt-${question.id}-${index}`} disabled={readOnly} />
                        <Label htmlFor={`opt-${question.id}-${index}`} className="flex-1 cursor-pointer font-normal text-ink">
                            {option}
                        </Label>
                        {isOtroOption(option) && answer.selected_options[0] === option && (
                            <Input
                                ref={otroInputRef}
                                disabled={readOnly}
                                placeholder="Especificá…"
                                value={answer.other_text}
                                onChange={(e) => onChange({ selected_options: answer.selected_options, other_text: e.target.value })}
                                className="ml-2 max-w-xs"
                            />
                        )}
                    </OptionRow>
                ))}
            </RadioGroup>
        );
    }

    // multiple
    function toggle(option: string) {
        const isSelected = answer.selected_options.includes(option);
        const nextSelected = isSelected
            ? answer.selected_options.filter((o) => o !== option)
            : [...answer.selected_options, option];

        onChange({
            selected_options: nextSelected,
            other_text: nextSelected.some(isOtroOption) ? answer.other_text : '',
        });
    }

    return (
        <div className="grid gap-2">
            {question.options.map((option, index) => (
                <OptionRow key={option} letter={LETTERS[index]} disabled={readOnly}>
                    <Checkbox
                        checked={answer.selected_options.includes(option)}
                        onCheckedChange={() => toggle(option)}
                        id={`opt-${question.id}-${index}`}
                        disabled={readOnly}
                    />
                    <Label htmlFor={`opt-${question.id}-${index}`} className="flex-1 cursor-pointer font-normal text-ink">
                        {option}
                    </Label>
                    {isOtroOption(option) && answer.selected_options.includes(option) && (
                        <Input
                            ref={otroInputRef}
                            disabled={readOnly}
                            placeholder="Especificá…"
                            value={answer.other_text}
                            onChange={(e) => onChange({ selected_options: answer.selected_options, other_text: e.target.value })}
                            className="ml-2 max-w-xs"
                        />
                    )}
                </OptionRow>
            ))}
        </div>
    );
}

function OptionRow({ letter, disabled, children }: { letter: string; disabled?: boolean; children: ReactNode }) {
    return (
        <div
            className={`flex items-center gap-3 rounded-[3px] border border-rule bg-paper-raised px-3 py-2.5 has-[[data-state=checked]]:border-accent ${disabled ? 'opacity-70' : ''}`}
        >

            <span className="font-mono text-xs text-ink-faint" aria-hidden>
                {letter}
            </span>
            {children}
        </div>
    );
}

export function isQuestionAnswered(question: Question, answer: LocalAnswer): boolean {
    if (question.type === 'open') {
        return answer.other_text.trim().length > 0;
    }

    return answer.selected_options.length > 0;
}
