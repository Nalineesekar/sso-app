'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SSOPage() {
  const params = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function handleSSO() {
      const token = params.get('token');
      const clientId = params.get('client_id');
      const env = params.get('env');

      // Required param validation
      if (!token || !clientId || !env) {
        setError('Missing SSO parameters');
        setLoading(false);
        return;
      }

      //  Environment validation
      if (
        env !== process.env.NEXT_PUBLIC_SSO_ENV ||
        clientId !== process.env.NEXT_PUBLIC_SSO_CLIENT_ID
      ) {
        setError('Environment mismatch');
        setLoading(false);
        return;
      }

      try {
        //  API call
        const res = await fetch('/api/sso/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        //  Store session
        localStorage.setItem('user', JSON.stringify(data.user));

        //  Redirect
        router.replace('/home');
      } catch (err) {
        setError(err.message || 'SSO failed');
        setLoading(false);
      }
    }

    handleSSO();
  }, [params, router]);

  return (
    <main className="sso-container">
      <div className="sso-card">
        <div className="logo-wrapper">
          <Image
            src="/logo.png"
            width={150}
            height={150}
            alt="Company Logo"
            className="logo"
            priority
          />
        </div>

        <div className="content-wrapper">
          <h1 className="title">Secure Login</h1>
          <p className="description">
            Please wait while we verify your identity and access permissions.
          </p>
        </div>

        {loading ? (
          <div className="status-wrapper">
            <div className="spinner"></div>
            <p className="status-text">Multipass Authorization</p>
          </div>
        ) : (
          <div className="status-wrapper">
            {error && (
              <>
                <div className="error-icon">⚠️</div>
                <p className="error-text">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="retry-button"
                >
                  Retry Login
                </button>
              </>
            )}
          </div>
        )}

        <div className="footer">
          <p>Protected by Enterprise SSO</p>
        </div>
      </div>
    </main>
  );
}
