import { Link, router, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: PropsWithChildren) {
    const { props } = usePage<{ flash?: { success?: string; link?: string } }>();
    const [banner, setBanner] = useState<{ success?: string; link?: string } | null>(null);

    useEffect(() => {
        if (props.flash?.success || props.flash?.link) {
            setBanner(props.flash);
        }
    }, [props.flash]);

    return (
        <div className="min-h-screen">
            <header className="border-b border-rule bg-paper-raised">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                    <Link href={route('admin.modules.index')} className="flex items-center gap-3">
                        <img
                            src="/images/logo-gallo-negro.png"
                            alt="Gallo Negro Blacksmith"
                            className="h-9 w-9 rounded-[3px] border border-rule-strong object-cover"
                        />
                        <span className="flex items-baseline gap-2">
                            <span className="font-display text-lg font-medium text-ink">Registro de cuestionarios</span>
                            <span className="font-mono text-[11px] text-ink-faint">/admin</span>
                        </span>
                    </Link>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.post(route('logout'))}
                    >
                        Salir
                    </Button>
                </div>
            </header>

            {banner && (
                <div className="mx-auto mt-4 max-w-5xl px-6">
                    <div className="flex items-center justify-between gap-4 rounded-[3px] border border-baja/40 bg-baja-soft px-4 py-2 text-sm text-ink">
                        <span>{banner.success ?? 'Envío generado.'}</span>
                        {banner.link && (
                            <div className="flex items-center gap-2">
                                <code className="rounded-[3px] bg-paper px-2 py-1 font-mono text-xs">{banner.link}</code>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        navigator.clipboard?.writeText(banner.link!);
                                    }}
                                >
                                    Copiar
                                </Button>
                            </div>
                        )}
                        <button
                            className="text-ink-faint hover:text-ink"
                            onClick={() => setBanner(null)}
                            aria-label="Cerrar aviso"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
        </div>
    );
}
