import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[3px] text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-accent text-paper-raised hover:bg-accent-strong',
                outline: 'border border-rule-strong bg-transparent text-ink hover:bg-paper-raised',
                ghost: 'bg-transparent text-ink-soft hover:bg-paper-raised hover:text-ink',
                destructive: 'bg-alta text-paper-raised hover:opacity-90',
                link: 'text-accent underline underline-offset-4 hover:text-accent-strong',
            },
            size: {
                default: 'h-9 px-4 py-2',
                sm: 'h-8 px-3 text-[13px]',
                lg: 'h-11 px-6 text-base',
                icon: 'h-9 w-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';

        return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
    },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
