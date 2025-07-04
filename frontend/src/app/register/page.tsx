'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '@/lib/api';

const schema = z.object({
    email: z.string().email({ message: 'Correo inválido' }),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            await api.post('/users/register', data);
            router.push('/login');
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'detail' in err.response.data) {
                setError((err as { response: { data: { detail?: string } } }).response.data.detail || 'Error al registrar');
            } else {
                setError('Error al registrar');
            }
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Crear cuenta</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label>Email</label>
                    <input type="email" {...register('email')} className="w-full border p-2" />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>
                <div>
                    <label>Contraseña</label>
                    <input type="password" {...register('password')} className="w-full border p-2" />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <button type="submit" className="w-full bg-blue-600 text-white py-2 cursor-pointer rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Registrarse
                </button>
            </form>
        </div>
    );
}
