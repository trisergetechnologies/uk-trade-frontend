import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_TOKEN_COOKIE } from '@/lib/auth.constants';

function apiBase() {
  return (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000').replace(/\/$/, '');
}

/** Ask the gateway/backend who this token is — no JWT secret in Next.js. */
async function fetchSessionRole(token: string): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${apiBase()}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { success?: boolean; data?: { role?: string } };
    const role = body.data?.role;
    return typeof role === 'string' && role ? role : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;

  const isUserDash = pathname === '/userdashboard' || pathname.startsWith('/userdashboard/');
  const isAdminDash = pathname === '/admindashboard' || pathname.startsWith('/admindashboard/');
  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (!isUserDash && !isAdminDash && !isAuthPage) {
    return NextResponse.next();
  }

  if (isAuthPage) {
    if (!token) {
      return NextResponse.next();
    }
    const role = await fetchSessionRole(token);
    if (!role) {
      const res = NextResponse.next();
      res.cookies.set(AUTH_TOKEN_COOKIE, '', { maxAge: 0, path: '/' });
      return res;
    }
    const url = request.nextUrl.clone();
    url.pathname = role === 'admin' ? '/admindashboard' : '/userdashboard';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  const role = await fetchSessionRole(token);
  if (!role) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname);
    const res = NextResponse.redirect(url);
    res.cookies.set(AUTH_TOKEN_COOKIE, '', { maxAge: 0, path: '/' });
    return res;
  }

  if (isAdminDash && role !== 'admin') {
    return NextResponse.redirect(new URL('/userdashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/userdashboard',
    '/userdashboard/:path*',
    '/admindashboard',
    '/admindashboard/:path*',
    '/login',
    '/register',
  ],
};
