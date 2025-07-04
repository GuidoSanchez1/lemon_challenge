'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth({
    redirectTo = '/login',
    protect = false,
    redirectIfAuthenticated = false,
    redirectAuthenticatedTo = '/',
} = {}) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setIsAuthenticated(false);
            if (protect) {
                router.replace(redirectTo);
            }
        } else {
            setIsAuthenticated(true);
            if (redirectIfAuthenticated) {
                router.replace(redirectAuthenticatedTo);
            }
        }
    }, [protect, redirectTo, redirectIfAuthenticated, redirectAuthenticatedTo, router]);

    return {
        isAuthenticated,
        isLoading: isAuthenticated === null,
    };
}
