import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/home']
const publicRoutes = ['/login', '/register']
export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.includes(path)
    const isPublicRoute = publicRoutes.includes(path)
    const token = req.cookies.get('token')?.value

    const res = NextResponse.next()
    res.headers.set('x-debug-token', token ?? '')
    console.log('Middleware ejecutado - PATH:', path)
    console.log('TOKEN detectado:', token)
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    if (
        isPublicRoute && token
    ) {
        return NextResponse.redirect(new URL('/home', req.nextUrl))
    }
    return res

}

export const config = {
    matcher: ['/:path*'],
}
