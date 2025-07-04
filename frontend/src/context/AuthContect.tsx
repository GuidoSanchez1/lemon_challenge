// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../lib/api'; // tu instancia axios configurada

type User = {
    id: number;
    email: string;
    // otros campos que devuelva tu esquema UserRead
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Al montar, intenta obtener el usuario actual
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/users/me', { withCredentials: true });
                setUser(response.data);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const login = async (email: string, password: string) => {
        const form = new URLSearchParams();
        form.append('username', email);
        form.append('password', password);

        await api.post('/users/login', form, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            withCredentials: true,
        });

        // Si login exitoso, obtener usuario actual
        const response = await api.get('/users/me', { withCredentials: true });
        setUser(response.data);
    };

    const logout = async () => {
        await api.post('/users/logout', {}, { withCredentials: true });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
}
