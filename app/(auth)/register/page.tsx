import { Suspense } from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create an account — Neuro.AI',
  description: 'Register for Neuro.AI',
};

function RegisterLoading() {
  return (
    <div className="mx-auto w-full max-w-md py-12 text-center text-sm text-white/45" aria-busy>
      Loading form…
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterLoading />}>
      <RegisterForm />
    </Suspense>
  );
}
