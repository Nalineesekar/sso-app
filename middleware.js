import { NextResponse } from 'next/server';

export function middleware(req) {
  const token = req.cookies.get('access_token') || req.cookies.get('authenticated');

  if (!token && req.nextUrl.pathname.startsWith('/home')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}
