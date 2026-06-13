'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('Verifying authentication...');
    const [error, setError] = useState('');

    useEffect(() => {
        async function handleCallback() {
            const code = searchParams.get('code');
            const state = searchParams.get('state');
            const clientId = searchParams.get('client_id');
            const iss = searchParams.get('iss');

            // 1. Validation
            if (!code) {
                setError('Authorization code missing.');
                return;
            }

            // Validate Client ID if present
            const envClientId = process.env.NEXT_PUBLIC_SSO_CLIENT_ID || 'rest-001';
            if (clientId && clientId !== envClientId) {
                setError(`Invalid Client ID. Expected: ${envClientId}, Received: ${clientId}`);
                return;
            }

            // Validate State 
            if (state !== 'KZq') {
                console.warn('State mismatch warning (ignoring for this demo)');
            
            }

            try {
                setStatus('Exchanging token...');

                // 2. Token Exchange
                const res = await fetch('/api/auth/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || 'Token exchange failed');
                }

                console.log('Token acquired:', data);
                setStatus('Login successful! Redirecting...');

                // 3. Redirect to Home
                setTimeout(() => {
                    router.replace('/home');
                }, 1000);

            } catch (err) {
                console.error(err);
                setError(err.message || 'Authentication failed');
            }
        }

        handleCallback();
    }, [searchParams, router]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <div className="bg-white p-8 rounded-lg shadow-lg border border-red-100 max-w-md w-full text-center">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h1 className="text-xl font-bold text-red-700 mb-2">Login Failed</h1>
                    <p className="text-red-600 mb-6">{error}</p>
                    <a href="/" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">Return to Login</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-700">{status}</h2>
            </div>
        </div>
    );
}

export default function CallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CallbackContent />
        </Suspense>
    );
}
