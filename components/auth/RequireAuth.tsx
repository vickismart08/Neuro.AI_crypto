'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { isFirebaseConfigured } from '@/lib/firebase/client';

/**
 * Renders `children` only when Firebase reports a signed-in user.
 * Redirects to `/login` if unauthenticated (after init).
 */
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      router.replace('/login');
      return;
    }
    if (loading) return;
    if (!user) router.replace('/login');
  }, [user, loading, router]);

  if (!isFirebaseConfigured()) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#050b18] px-4 text-center text-sm text-white/70">
        Add Firebase keys to <code className="text-cyan-300">.env.local</code> and restart the dev server.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-2 bg-[#050b18] text-white/80">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-cyan-400" />
        <p className="text-sm">Loading…</p>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
