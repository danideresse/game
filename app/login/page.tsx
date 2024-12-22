'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PhoneIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function Login() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Temporarily skip validation and just redirect
    try {
      localStorage.setItem('user', JSON.stringify({ 
        phone: phone || '+251912345678',
        isLoggedIn: true 
      }));
      router.push('/');
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 card p-6 md:p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">Welcome Back!</h2>
          <p className="mt-2 text-theme-secondary">Sign in to continue playing</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-500/10 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm text-theme-secondary block mb-2">
                Phone Number
              </label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-secondary" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/5 rounded-lg p-3 pl-10 text-white"
                  placeholder="+251XXXXXXXXX"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-theme-secondary block mb-2">
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-secondary" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 rounded-lg p-3 pl-10 text-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`
              w-full py-3 rounded-lg font-bold transition-all duration-300
              bg-gradient-to-r from-primary to-orange-500
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
            `}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center text-sm">
            <Link 
              href="/forgot-password"
              className="text-primary hover:text-orange-500 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="text-center text-sm text-theme-secondary">
            Don't have an account?{' '}
            <Link 
              href="/signup"
              className="text-primary hover:text-orange-500 transition-colors font-semibold"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 