import { cn } from '@/lib/utils';
import type { Criticality } from '@/types/models';

const STYLES: Record<Criticality, string> = {
    ALTA: 'text-alta border-alta/40 bg-alta-soft',
    MEDIA: 'text-media border-media/40 bg-media-soft',
    BAJA: 'text-baja border-baja/40 bg-baja-soft',
};

const LABELS: Record<Criticality, string> = {
    ALTA: 'Alta',
    MEDIA: 'Media',
    BAJA: 'Baja',
};

export function CriticalityTag({ value, className }: { value: Criticality; className?: string }) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-[3px] border px-1.5 py-0.5 font-mono text-[11px] font-medium leading-none',
                STYLES[value],
                className,
            )}
        >
            {LABELS[value]}
        </span>
    );
}
