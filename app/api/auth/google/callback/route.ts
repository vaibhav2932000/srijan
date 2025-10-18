import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return NextResponse.json({ error: 'API URL not configured' }, { status: 500 });
  }
  const origin = request.nextUrl.origin;
  const code = request.nextUrl.searchParams.get('code');
  const token = request.nextUrl.searchParams.get('token');

  // If backend sent token directly
  if (token) {
    const res = NextResponse.redirect(new URL('/account', origin));
    res.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  }

  // Otherwise exchange code for token via backend
  if (code) {
    const exchange = await fetch(`${apiUrl}/auth/google/callback?code=${encodeURIComponent(code)}&redirect_uri=${encodeURIComponent(origin + '/api/auth/google/callback')}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (exchange.ok) {
      const data = await exchange.json(); // { token, user }
      const res = NextResponse.redirect(new URL('/account', origin));
      res.cookies.set('auth_token', data.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
      return res;
    }
  }

  return NextResponse.redirect(new URL('/login?error=google_auth_failed', origin));
}


