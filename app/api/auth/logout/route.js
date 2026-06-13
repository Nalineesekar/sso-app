import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ message: 'Logged out successfully' });

    // Clear auth cookies
    response.cookies.delete('access_token');
    response.cookies.delete('authenticated');
    response.cookies.delete('user'); // Clean up legacy cookie if present

    return response;
}
