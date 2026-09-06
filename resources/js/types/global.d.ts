export {};

declare global {
    function route(name?: string, params?: Record<string, unknown> | unknown[] | string | number, absolute?: boolean): string;
}
