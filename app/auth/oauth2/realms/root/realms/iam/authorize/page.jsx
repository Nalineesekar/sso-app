'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

function AuthorizeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [tinNo, setTinNo] = useState('');
    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        // Mock validation
        if (tinNo && passcode) {
            // Validate credentials
            if (tinNo !== '123' || passcode !== 'pass') {
                setError('Invalid username or password');
                return;
            }

            const redirectUri = searchParams.get('redirect_uri');
            const state = searchParams.get('state');

            if (!redirectUri || !state) {
                setError('Missing redirection parameters');
                return;
            }

            // Generate a mock auth code
            const code = '53Yhw-' + Math.random().toString(36).substring(7);

            // Redirect back to the client application
            const callbackUrl = `${redirectUri}?code=${code}&state=${state}&iss=${encodeURIComponent('http://localhost:3000/auth/oauth2/realms/root/realms/iam')}&client_id=${searchParams.get('client_id')}`;

            console.log('Redirecting to callback:', callbackUrl);
            router.push(callbackUrl);
        } else {
            setError('Please enter both Username and Password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm border border-zinc-200">
                <div className="text-center mb-6">
                    <h1 className="text-xl font-bold text-zinc-800">IAM Login</h1>
                    <p className="text-sm text-zinc-500">Sign in to your account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Username</label>
                        <input
                            type="text"
                            value={tinNo}
                            onChange={(e) => setTinNo(e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Username"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Password"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors font-semibold"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function AuthorizePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthorizeContent />
        </Suspense>
    )
}
