import { Suspense } from 'react';
import type { Metadata } from 'next';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset password — Neuro.AI',
  description: 'Set a new password for your Neuro.AI account',
};

function ResetFallback() {
  return (
    <div className="w-full max-w-md space-y-2">
      <h1 className="text-2xl font-bold text-white sm:text-[26px]">Reset password</h1>
      <p className="text-sm text-white/50">Loading…</p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
