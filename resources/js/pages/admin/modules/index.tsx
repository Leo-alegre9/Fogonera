import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { Module, Submission } from '@/types/models';

interface Props {
    modules: (Module & {
        questions_count: number;
        submissions_count: number;
        completed_submissions_count: number;
        submissions: Submission[];
    })[];
}

export default function ModulesIndex({ modules }: Props) {
    const [editing, setEditing] = useState<Module | null>(null);
    const [creating, setCreating] = useState(false);

    return (
        <AdminLayout>
            <Head title="Módulos" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-medium text-ink">Módulos</h1>
                    <p className="text-sm text-ink-soft">Un módulo agrupa las preguntas de un cuestionario para una audiencia.</p>
                </div>
                <Button onClick={() => setCreating(true)}>Nuevo módulo</Button>
            </div>

            {modules.length === 0 && (
                <div className="rounded-[3px] border border-dashed border-rule-strong px-6 py-10 text-center text-sm text-ink-soft">
                    Todavía no hay módulos. Importalos con <code className="font-mono">php artisan cuestionario:importar</code> o creá uno acá.
                </div>
            )}

            <div className="grid gap-4">
                {modules.map((module) => (
                    <ModuleRow key={module.id} module={module} onEdit={() => setEditing(module)} />
                ))}
            </div>

            <ModuleFormDialog
                open={creating}
                onOpenChange={setCreating}
                mode="create"
            />
            <ModuleFormDialog
                open={editing !== null}
                onOpenChange={(open) => !open && setEditing(null)}
                mode="edit"
                module={editing ?? undefined}
            />
        </AdminLayout>
    );
}

function ModuleRow({
    module,
    onEdit,
}: {
    module: Props['modules'][number];
    onEdit: () => void;
}) {
    const [showSubmissions, setShowSubmissions] = useState(false);

    function generateSubmission() {
        router.post(route('admin.modules.submissions.store', module.id));
    }

    function destroyModule() {
        if (confirm(`¿Eliminar el módulo "${module.name}"? Se borrarán también sus preguntas y envíos.`)) {
            router.delete(route('admin.modules.destroy', module.id));
        }
    }

    return (
        <div className="rounded-[3px] border border-rule bg-paper-raised">
            <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-medium text-accent">{module.code}</span>
                        <h2 className="font-display text-base font-medium text-ink">{module.name}</h2>
                    </div>
                    {module.description && <p className="mt-1 max-w-xl text-sm text-ink-soft">{module.description}</p>}
                    <p className="mt-2 font-mono text-xs text-ink-faint">
                        {module.questions_count} pregunta{module.questions_count === 1 ? '' : 's'} · {module.completed_submissions_count}/
                        {module.submissions_count} envíos completados
                    </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Link href={route('admin.modules.questions.index', module.id)}>
                        <Button variant="outline" size="sm">
                            Preguntas
                        </Button>
                    </Link>
                    <Button size="sm" onClick={generateSubmission}>
                        Generar envío
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onEdit}>
                        Editar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={destroyModule}>
                        Eliminar
                    </Button>
                </div>
            </div>

            <button
                className="w-full border-t border-rule px-5 py-2 text-left text-xs text-ink-faint hover:bg-paper"
                onClick={() => setShowSubmissions((v) => !v)}
            >
                {showSubmissions ? 'Ocultar envíos' : `Ver envíos (${module.submissions.length})`}
            </button>

            {showSubmissions && (
                <div className="border-t border-rule">
                    {module.submissions.length === 0 && (
                        <p className="px-5 py-3 text-sm text-ink-faint">Todavía no se generó ningún envío.</p>
                    )}
                    {module.submissions.map((submission) => (
                        <Link
                            key={submission.id}
                            href={route('admin.submissions.show', submission.token)}
                            className="flex items-center justify-between gap-4 border-b border-rule px-5 py-2.5 text-sm last:border-b-0 hover:bg-paper"
                        >
                            <span className="font-mono text-xs text-ink-faint">{submission.token.slice(0, 10)}…</span>
                            <span className="flex-1 truncate text-ink">{submission.respondent_name || '(sin nombre)'}</span>
                            <span
                                className={
                                    submission.status === 'completed'
                                        ? 'font-mono text-[11px] text-baja'
                                        : 'font-mono text-[11px] text-ink-faint'
                                }
                            >
                                {submission.status === 'completed' ? 'completado' : 'borrador'}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

function ModuleFormDialog({
    open,
    onOpenChange,
    mode,
    module,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'create' | 'edit';
    module?: Module;
}) {
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        code: module?.code ?? '',
        name: module?.name ?? '',
        slug: module?.slug ?? '',
        description: module?.description ?? '',
        respondent_role_label: module?.respondent_role_label ?? '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();

        const onSuccess = () => {
            reset();
            onOpenChange(false);
        };

        if (mode === 'create') {
            post(route('admin.modules.store'), { onSuccess });
        } else if (module) {
            patch(route('admin.modules.update', module.id), { onSuccess });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{mode === 'create' ? 'Nuevo módulo' : `Editar ${module?.code}`}</DialogTitle>
                    <DialogDescription>
                        El código es la clave estable del módulo. Si el rol del respondente no aplica, dejalo vacío.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="grid gap-3">
                    <div className="grid gap-1.5">
                        <Label htmlFor="code">Código</Label>
                        <Input id="code" value={data.code} onChange={(e) => setData('code', e.target.value.toUpperCase())} />
                        {errors.code && <p className="text-xs text-alta">{errors.code}</p>}
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="name">Nombre</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        {errors.name && <p className="text-xs text-alta">{errors.name}</p>}
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="slug">Slug (opcional)</Label>
                        <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="respondent_role_label">Etiqueta de rol del respondente (opcional)</Label>
                        <Input
                            id="respondent_role_label"
                            placeholder='Ej: "Tu especialidad"'
                            value={data.respondent_role_label}
                            onChange={(e) => setData('respondent_role_label', e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Guardar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
