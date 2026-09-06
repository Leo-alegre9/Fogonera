import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { FormEvent } from 'react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post(route('login.store'));
    }

    return (
        <>
            <Head title="Ingresar" />
            <div className="flex min-h-screen flex-col items-center justify-center px-4">
                <div className="mb-8 flex flex-col items-center text-center">
                    <img
                        src="/images/logo-gallo-negro.png"
                        alt="Gallo Negro Blacksmith"
                        className="mb-4 h-24 w-24 rounded-md border border-rule-strong object-cover shadow-sm"
                    />
                    <p className="font-mono text-xs uppercase tracking-wide text-ink-faint">Panel de relevamiento</p>
                    <h1 className="font-display text-2xl font-medium text-ink">Registro de cuestionarios</h1>
                </div>
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle>Ingresar</CardTitle>
                        <CardDescription>Acceso exclusivo para el equipo administrador.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="grid gap-4">
                            <div className="grid gap-1.5">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoFocus
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                {errors.email && <p className="text-xs text-alta">{errors.email}</p>}
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                {errors.password && <p className="text-xs text-alta">{errors.password}</p>}
                            </div>
                            <Button type="submit" disabled={processing} className="mt-2">
                                Ingresar
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
