'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LandingPage() {
  const router = useRouter();

  const handleSSOLogin = () => {
    // Construct the SSO Authorization URL
   

    const host = process.env.NEXT_PUBLIC_SSO_HOST || 'localhost:3000';
    const realm = process.env.NEXT_PUBLIC_SSO_REALM || 'iam';
    const clientId = process.env.NEXT_PUBLIC_SSO_CLIENT_ID || 'rest-001';
    const redirectUri = process.env.NEXT_PUBLIC_SSO_REDIRECT_URI || 'http://localhost:3000/auth/callback';

    const state = 'KZq';
    const scope = 'openid';

    const ssoUrl = `http://${host}/auth/oauth2/realms/root/realms/${realm}/authorize?_ig=true&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${state}`;

    // Validate keys check (Mock validation as requested)
    console.log('Redirecting to SSO:', ssoUrl);

    window.location.href = ssoUrl;
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="mb-8">
        <Image src="/logo.png" width={200} height={200} alt="Enterprise Logo" className="drop-shadow-sm" />
      </div>
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome</h1>
        <p className="text-gray-500 mb-8">Please login to access the Enterprise Portal.</p>

        <div className="space-y-4">
          <button
            onClick={handleSSOLogin}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-600 text-white font-semibold rounded-lg transition duration-200 flex justify-center items-center gap-2"
          >
            <span>Login with SSO</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-400">
        <p>Protected by Enterprise Identity</p>
      </div>
    </div>
  );
}
