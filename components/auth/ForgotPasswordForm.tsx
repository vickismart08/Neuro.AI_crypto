'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import AuthField from './AuthField';
import { auth as t } from './authTheme';
import { getFirebaseAuth, isFirebaseConfigured } from '@/lib/firebase/client';
import { getFirebaseAuthErrorMessage } from '@/lib/firebase/authErrors';

export default function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

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
    if (!email) {
      setError('Enter your email address.');
      return;
    }
    setLoading(true);
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      await sendPasswordResetEmail(getFirebaseAuth(), email, {
        url: `${origin}/reset-password`,
        handleCodeInApp: false,
      });
      setSent(true);
    } catch (err) {
      setError(getFirebaseAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="w-full max-w-md space-y-4">
        <h1 className={t.pageTitle}>Check your email</h1>
        <p className={`${t.pageSubtitle} leading-relaxed`}>
          If an account exists for that address, we sent a link to reset your password. It may take a minute to
          arrive. You can close this tab and use the link from your inbox.
        </p>
        <Link href="/login" className={`inline-block text-sm ${t.link}`}>
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md space-y-4">
      <div>
        <h1 className={t.pageTitle}>Forgot password</h1>
        <p className={`${t.pageSubtitle} mt-2`}>
          Enter the email for your account. We&apos;ll send a link to set a new password.
        </p>
      </div>

      {error && (
        <div role="alert" className={t.error}>
          {error}
        </div>
      )}

      <AuthField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        required
      />

      <button type="submit" disabled={loading} className={t.primaryBtn}>
        {loading ? 'Sending…' : 'Send reset link'}
      </button>

      <p className="text-center text-sm text-white/45">
        <Link href="/login" className={t.link}>
          Back to log in
        </Link>
      </p>
    </form>
  );
}
