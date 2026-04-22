'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { Eye, EyeOff } from 'lucide-react';
import AuthField from './AuthField';
import { auth as t } from './authTheme';
import { getFirebaseAuth, isFirebaseConfigured } from '@/lib/firebase/client';
import { getFirebaseAuthErrorMessage } from '@/lib/firebase/authErrors';

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get('oobCode') ?? searchParams.get('oobcode');

  const [emailHint, setEmailHint] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(!!oobCode);
  const [codeInvalid, setCodeInvalid] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!oobCode || !isFirebaseConfigured()) {
      setVerifying(false);
      if (!oobCode) setCodeInvalid(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const email = await verifyPasswordResetCode(getFirebaseAuth(), oobCode);
        if (!cancelled) setEmailHint(email);
      } catch {
        if (!cancelled) {
          setCodeInvalid(true);
        }
      } finally {
        if (!cancelled) setVerifying(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [oobCode]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!oobCode) {
      setError('Your reset link is missing a code. Open the link from the email, or request a new reset.');
      return;
    }
    if (!isFirebaseConfigured()) {
      setError('Firebase is not configured. Add your keys to .env.local and restart the dev server.');
      return;
    }
    const form = e.currentTarget;
    const data = new FormData(form);
    const password = String(data.get('password') ?? '');
    const password2 = String(data.get('password2') ?? '');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== password2) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await confirmPasswordReset(getFirebaseAuth(), oobCode, password);
      setSuccess(true);
    } catch (err) {
      setError(getFirebaseAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md space-y-4">
        <h1 className={t.pageTitle}>Password updated</h1>
        <p className={`${t.pageSubtitle} leading-relaxed`}>
          Your new password is saved. You can sign in with it now.
        </p>
        <Link href="/login" className={`${t.primaryBtn} inline-block w-full text-center`}>
          Log in
        </Link>
      </div>
    );
  }

  if (!isFirebaseConfigured()) {
    return (
      <div className="w-full max-w-md space-y-4">
        <h1 className={t.pageTitle}>Reset password</h1>
        <p className={t.error}>Firebase is not configured. Add your keys to .env.local and restart the dev server.</p>
        <Link href="/login" className={`text-sm ${t.link}`}>
          Back to log in
        </Link>
      </div>
    );
  }

  if (verifying) {
    return (
      <div className="w-full max-w-md space-y-2">
        <h1 className={t.pageTitle}>Reset password</h1>
        <p className="text-sm text-white/50">Verifying your link…</p>
      </div>
    );
  }

  if (codeInvalid || !oobCode) {
    return (
      <div className="w-full max-w-md space-y-4">
        <h1 className={t.pageTitle}>Link invalid or expired</h1>
        <p className={`${t.pageSubtitle} leading-relaxed`}>
          This reset link is missing, invalid, or has already been used. Request a new link below.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/forgot-password" className={t.primaryBtn + ' text-center'}>
            Get new link
          </Link>
          <Link href="/login" className={t.secondaryBtn + ' text-center'}>
            Log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md space-y-4">
      <div>
        <h1 className={t.pageTitle}>Set new password</h1>
        {emailHint && (
          <p className={`${t.pageSubtitle} mt-2`}>
            For <span className="text-white/70">{emailHint}</span>
          </p>
        )}
        {!emailHint && <p className={`${t.pageSubtitle} mt-2`}>Choose a new password for your account.</p>}
      </div>

      {error && (
        <div role="alert" className={t.error}>
          {error}
        </div>
      )}

      <div>
        <div className="mb-1.5 flex items-start justify-between gap-2">
          <label htmlFor="reset-password" className={t.label}>
            New password
          </label>
        </div>
        <div className="relative">
          <input
            id="reset-password"
            name="password"
            type={showPw ? 'text' : 'password'}
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="At least 6 characters"
            className={`${t.input} py-2.5 pl-3.5 pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPw((p) => !p)}
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 ${t.iconBtn}`}
            tabIndex={-1}
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-start justify-between gap-2">
          <label htmlFor="reset-password2" className={t.label}>
            Confirm new password
          </label>
        </div>
        <div className="relative">
          <input
            id="reset-password2"
            name="password2"
            type={showPw2 ? 'text' : 'password'}
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="Repeat password"
            className={`${t.input} py-2.5 pl-3.5 pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPw2((p) => !p)}
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 ${t.iconBtn}`}
            tabIndex={-1}
            aria-label={showPw2 ? 'Hide password' : 'Show password'}
          >
            {showPw2 ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={loading} className={t.primaryBtn}>
        {loading ? 'Saving…' : 'Update password'}
      </button>

      <p className="text-center text-sm text-white/45">
        <Link href="/login" className={t.link}>
          Back to log in
        </Link>
      </p>
    </form>
  );
}
