// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Redirigir si ya está autenticado
    if ((pathname === '/login' || pathname === '/register') && token) {
        return NextResponse.redirect(new URL('/tasks', request.url));
    }

    // Proteger rutas privadas
    if (pathname.startsWith('/tasks') && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}
