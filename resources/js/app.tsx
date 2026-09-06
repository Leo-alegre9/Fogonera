import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import type { ResolvedComponent } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

createInertiaApp({
    title: (title) => (title ? `${title} · Relevamiento` : 'Relevamiento'),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob<{ default: ResolvedComponent }>('./pages/**/*.tsx'),
        ).then((module) => module.default),
    setup({ el, App, props }) {
        if (el) {
            createRoot(el).render(<App {...props} />);
        }
    },
});
