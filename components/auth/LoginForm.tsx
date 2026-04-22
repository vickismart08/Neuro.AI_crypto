'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Eye, EyeOff } from 'lucide-react';
import AuthField from './AuthField';
import { auth as t } from './authTheme';
import { getFirebaseAuth, isFirebaseConfigured } from '@/lib/firebase/client';
import { getFirebaseAuthErrorMessage } from '@/lib/firebase/authErrors';

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!isFirebaseConfigured()) {
      setError('Firebase is not configured. Add your keys to .env.local and restart the dev server.');
      return;
    }
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get('email') ?? '').trim();
    const password = String(data.get('password') ?? '');

    setLoading(true);
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      router.replace('/dashboard');
      router.refresh();
    } catch (err) {
      setError(getFirebaseAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md space-y-4">
      <div>
        <h1 className={t.pageTitle}>Welcome Back!</h1>
        <p className={`${t.pageSubtitle} mt-2`}>
          Don&apos;t have an account?{' '}
          <Link href="/register" className={t.link}>
            Sign Up
          </Link>
        </p>
      </div>

      {error && (
        <div role="alert" className={t.error}>
          {error}
        </div>
      )}

      <AuthField label="Email" name="email" type="email" autoComplete="email" placeholder="Email" required />

      <div>
        <div className="mb-1.5 flex items-start justify-between gap-2">
          <label htmlFor="login-password" className={t.label}>
            Password
          </label>
        </div>
        <div className="relative">
          <input
            id="login-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            placeholder="Password"
            className={`${t.input} py-2.5 pl-3.5 pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 ${t.iconBtn}`}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <Link href="/forgot-password" className={`text-sm ${t.link}`}>
          Forgot password?
        </Link>
      </div>

      <button type="submit" disabled={loading} className={t.primaryBtn}>
        {loading ? 'Signing in…' : 'Log In'}
      </button>
    </form>
  );
}
