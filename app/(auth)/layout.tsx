import type { ReactNode } from 'react';
import AuthChatWidget from '@/components/auth/AuthChatWidget';
import AuthHeader from '@/components/auth/AuthHeader';
import HexPattern from '@/components/auth/HexPattern';
import RedirectIfAuthed from '@/components/auth/RedirectIfAuthed';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-[#050b18] text-white">
      <RedirectIfAuthed />
      <HexPattern />
      <AuthHeader />
      <main className="relative z-[1] mx-auto max-w-lg px-4 pb-32 pt-6 sm:px-6 sm:pt-8">
        <div className="glass rounded-2xl p-5 sm:p-8">{children}</div>
      </main>
      <AuthChatWidget />
    </div>
  );
}
