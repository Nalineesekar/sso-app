import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const body = await req.text();
        const params = new URLSearchParams(body);
        const code = params.get('code');
        const grantType = params.get('grant_type');

        // Basic Validation
        if (grantType !== 'authorization_code') {
            return NextResponse.json({ error: 'unsupported_grant_type' }, { status: 400 });
        }

        if (!code) {
            return NextResponse.json({ error: 'invalid_request', error_description: 'Missing code' }, { status: 400 });
        }

        // Mock Token Response
        // In a real scenario, we would validate the code and check against issued codes
        const mockToken = {
            access_token: "abSt4zbWHGQwI2_" + Math.random().toString(36).substring(2),
            scope: "openid",
            id_token: "HeONoDPHyqrSqYjkP_" + Date.now(),
            token_type: "Bearer",
            expires_in: 3599
        };

        console.log('IAM: Token issued for code:', code);

        return NextResponse.json(mockToken);

    } catch (error) {
        console.error('IAM Token Error:', error);
        return NextResponse.json({ error: 'server_error' }, { status: 500 });
    }
}
