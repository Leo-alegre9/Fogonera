import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isOtroOption(option: string): boolean {
    const normalized = option.trim().toLowerCase();

    return normalized.startsWith('otro') || normalized.startsWith('otra');
}
