'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useSWRMutation from 'swr/mutation';
import { loginUser } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

const schema = z.object({
    email: z.string().email({ message: 'Correo inválido' }),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState('');

    const { isLoading } = useAuth({
        redirectIfAuthenticated: true,
        redirectAuthenticatedTo: '/home',
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const { trigger, isMutating } = useSWRMutation('/users/login', loginUser);

    const onSubmit = async (data: FormData) => {
        setError('');
        try {
            await trigger(data); // No guardamos token, ya está seteado en cookie
            router.push('/home');
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'detail' in err.response.data) {
                //     console.log(err);
                //     setError((err as { response: { data: { detail?: string } } }).response.data.detail || 'Error al registrar');
                // } else {
                setError('Error al registrar');
            }
        }
    };

    if (isLoading) return null;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="max-w-md w-lg mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Email
                        </label>
                        <input
                            type="email"
                            {...register('email')}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            {...register('password')}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password.message}</p>
                        )}
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 rounded-lg text-white mt-4 py-2 cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                        disabled={isMutating}
                    >
                        {isMutating ? 'Ingresando...' : 'Entrar'}
                    </button>
                    <span className='mt-3 flex items-center justify-center'>¿No tienes usuario?
                        <a href="/register" className="text-blue-500 hover:underline ml-2">
                            Regístrate aquí
                        </a>
                    </span>
                </form>
            </div>
        </div>
    );
}