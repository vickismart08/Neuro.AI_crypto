import LoginForm from '@/components/auth/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Log in — Neuro.AI',
  description: 'Sign in to your Neuro.AI account',
};

export default function LoginPage() {
  return <LoginForm />;
}
