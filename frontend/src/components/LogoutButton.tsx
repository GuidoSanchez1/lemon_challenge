'use client';

import { useRouter } from 'next/navigation';
import useSWRMutation from 'swr/mutation';
import { logoutUser } from '@/lib/api';

export default function LogoutButton() {
    const router = useRouter();

    const { trigger, isMutating } = useSWRMutation('/users/logout', logoutUser);

    const handleLogout = async () => {
        try {
            await trigger();
            router.push('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            disabled={isMutating}
        >
            {isMutating ? 'Cerrando sesión...' : 'Cerrar sesión'}
        </button>
    );
}
