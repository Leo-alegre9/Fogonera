import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, type, ...props }, ref) => (
        <input
            type={type}
            className={cn(
                'flex h-9 w-full rounded-[3px] border border-rule-strong bg-paper-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50',
                className,
            )}
            ref={ref}
            {...props}
        />
    ),
);
Input.displayName = 'Input';

export { Input };
