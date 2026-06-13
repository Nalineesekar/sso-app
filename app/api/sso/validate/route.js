import { NextResponse } from 'next/server';

export async function POST(req) {
  const { token } = await req.json();

  // Mock validation
  if (!token || token.length < 10) {
    return NextResponse.json(
      { message: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  const response = NextResponse.json({
    user: { id: 1, name: 'SSO User' }
  });

  // Set cookie for middleware detection
  response.cookies.set('user', 'true', {
    httpOnly: true,
    path: '/',
    maxAge: 86400 // 1 day
  });

  return response;
}
