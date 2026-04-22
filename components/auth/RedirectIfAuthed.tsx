'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

/** On login/register, send already-signed-in users to the app. */
export default function RedirectIfAuthed() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace('/dashboard');
      router.refresh();
    }
  }, [user, loading, router]);

  return null;
}
