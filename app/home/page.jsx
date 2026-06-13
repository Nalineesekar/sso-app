'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/data');
        if (res.status === 401) {
          // Unauthorized
          router.push('/');
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch data');
        const jsonData = await res.json();
        setData(jsonData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!data) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-10 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4 font-bold text-xl text-slate-800">
          <Image src="/logo.png" width={140} height={140} alt="Logo" />
        </div>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-2 rounded-lg transition-colors focus:outline-none"
          >
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-sm">
              JD
            </div>
            <span className="font-medium text-slate-700">John Doe</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-slate-100 mb-1">
                <p className="text-sm font-medium text-slate-900">Signed in as</p>
                <p className="text-sm text-slate-500 truncate">john.doe@example.com</p>
              </div>
              <a href="#" className="block px-4 py-2 text-sm text-slate-700 transition-colors">Profile Settings</a>
              <a href="#" className="block px-4 py-2 text-sm text-slate-700 transition-colors">Support</a>
              <div className="border-t border-slate-100 my-1"></div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 transition-colors font-medium"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-10 max-w-7xl w-full mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, John!</h1>
          <p className="text-slate-500">Here&apos;s what&apos;s happening in your workspace today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wide">Total Revenue</h3>
            <div className="text-3xl font-bold text-slate-900 mb-2">{data.revenue}</div>
            <div className="text-sm text-green-600 font-medium flex items-center gap-1">
              <span>↑</span> {data.revenueTrend}
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wide">Subscriptions</h3>
            <div className="text-3xl font-bold text-slate-900 mb-2">{data.subscriptions}</div>
            <div className="text-sm text-green-600 font-medium flex items-center gap-1">
              <span>↑</span> {data.subscriptionsTrend}
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wide">Total Sales</h3>
            <div className="text-3xl font-bold text-slate-900 mb-2">{data.sales}</div>
            <div className="text-sm text-green-600 font-medium flex items-center gap-1">
              <span>↑</span> {data.salesTrend}
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wide">Active Now</h3>
            <div className="text-3xl font-bold text-slate-900 mb-2">{data.active}</div>
            <div className="text-sm text-green-600 font-medium flex items-center gap-1">
              <span>↑</span> {data.activeTrend}
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <ul className="divide-y divide-slate-100">
              {data.activity.map((item, index) => (
                <li key={index} className="p-4 flex items-center hover:bg-slate-50 transition-colors">
                  <span className={`w-2.5 h-2.5 rounded-full mr-4 ${item.status === 'success' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                  <span className="text-slate-700">User <strong>{item.user}</strong> {item.action}.</span>
                  <span className="ml-auto text-xs text-slate-400">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-10 flex justify-between items-center text-sm text-slate-500">
        <p>&copy; 2024 Enterprise Corp. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-900 hover:underline">Privacy</a>
          <a href="#" className="hover:text-slate-900 hover:underline">Terms</a>
          <a href="#" className="hover:text-slate-900 hover:underline">Support</a>
        </div>
      </footer>
    </div>
  );
}
