import { cn } from '@/lib/utils';

interface SectionSummary {
    section: string;
    answered: number;
    total: number;
    firstIndex: number;
}

interface Props {
    sections: SectionSummary[];
    currentSection: string | null;
    onJump: (index: number) => void;
}

export function SectionSidebar({ sections, currentSection, onJump }: Props) {
    return (
        <nav className="grid gap-0.5" aria-label="Secciones">
            {sections.map((section) => (
                <button
                    key={section.section}
                    onClick={() => onJump(section.firstIndex)}
                    className={cn(
                        'flex w-full min-w-0 items-center justify-between gap-3 rounded-[3px] px-3 py-2 text-left text-sm transition-colors',
                        section.section === currentSection ? 'bg-accent-soft text-ink' : 'text-ink-soft hover:bg-paper',
                    )}
                >
                    <span className="min-w-0 truncate">{section.section}</span>
                    <span className="shrink-0 font-mono text-[11px] tabular-nums text-ink-faint">
                        {section.answered}/{section.total}
                    </span>
                </button>
            ))}
        </nav>
    );
}
