import { useEffect, useMemo, useRef } from 'react';

export function useDebouncedCallback<Args extends unknown[]>(callback: (...args: Args) => void, delayMs: number) {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => {
        return () => clearTimeout(timeoutRef.current);
    }, []);

    return useMemo(() => {
        return (...args: Args) => {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => callbackRef.current(...args), delayMs);
        };
    }, [delayMs]);
}
