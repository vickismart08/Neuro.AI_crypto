import type { Metadata } from 'next';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot password — Neuro.AI',
  description: 'Request a link to reset your Neuro.AI password',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
