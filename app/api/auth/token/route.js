import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { code } = await req.json();

        if (!code) {
            return NextResponse.json({ message: 'Authorization code is missing' }, { status: 400 });
        }

        const host = process.env.NEXT_PUBLIC_SSO_HOST || 'localhost:3000';
        const realm = process.env.NEXT_PUBLIC_SSO_REALM || 'iam';
        const clientId = process.env.NEXT_PUBLIC_SSO_CLIENT_ID || 'rest-001';
        const clientSecret = process.env.SSO_CLIENT_SECRET || 'xyz';
        const redirectUri = process.env.NEXT_PUBLIC_SSO_REDIRECT_URI || 'http://localhost:3000/auth/callback';

        const tokenEndpoint = `http://${host}/auth/oauth2/realms/root/realms/${realm}/access_token`;

        // Prepare form data
        const formData = new URLSearchParams();
        formData.append('client_id', clientId);
        formData.append('redirect_uri', redirectUri);
        formData.append('code', code);
        formData.append('grant_type', 'authorization_code');
        formData.append('response_type', 'token');
        formData.append('client_secret', clientSecret);

        console.log('Exchanging token at:', tokenEndpoint);

        const res = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        const data = await res.json();

        if (!res.ok) {
            console.error('Token Exchange Failed:', data);
            return NextResponse.json({ message: 'Failed to exchange token', details: data }, { status: 401 });
        }

        // Success: Return token data
        const response = NextResponse.json(data);

        // Set secure HTTP-only cookie for the access token to be used in middleware
        response.cookies.set('access_token', data.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: data.expires_in || 3600,
        });

        // Also set a boolean flag for client-side easy checks if needed
        response.cookies.set('authenticated', 'true', {
            path: '/',
            maxAge: data.expires_in || 3600,
        });

        return response;

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
