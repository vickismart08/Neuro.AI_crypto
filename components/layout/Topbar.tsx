'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Bell, LogOut, TrendingUp } from 'lucide-react';
import { useAuth, signOutUser } from '@/components/providers/AuthProvider';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Real-time portfolio overview' },
  '/signals': { title: 'AI Signals', subtitle: 'Live trade recommendations' },
  '/wallet': { title: 'Wallet', subtitle: 'Balances & transactions' },
  '/portfolio': { title: 'Portfolio', subtitle: 'Asset allocation & performance' },
  '/history': { title: 'History', subtitle: 'All executed trades' },
  '/settings': { title: 'Settings', subtitle: 'Account & deposit management' },
};

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const firstName = user?.displayName?.split(/\s+/)[0] ?? user?.email?.split('@')[0] ?? 'there';
  const page = pageTitles[pathname] ?? { title: 'Neuro.AI', subtitle: '' };

  return (
    <header className="min-h-16 h-auto py-3 lg:py-0 lg:h-16 border-b border-white/5 bg-[#080f20]/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      {/* Mobile logo + welcome */}
      <div className="flex items-center gap-3 min-w-0 lg:hidden">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#8b5cf6] flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <span className="text-white font-bold text-lg block leading-tight">
            Neuro<span className="gradient-cyan">.AI</span>
          </span>
          <p className="text-white/50 text-xs mt-0.5 truncate">
            Welcome back, <span className="text-white/80 font-medium">{firstName}</span>
          </p>
        </div>
      </div>

      {/* Desktop page title */}
      <div className="hidden lg:block">
        <h1 className="text-white font-bold text-lg leading-tight">{page.title}</h1>
        <p className="text-white/35 text-xs">{page.subtitle}</p>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8 transition-all">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00d4ff]" />
        </button>

        <button
          type="button"
          className="lg:hidden w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8 transition-all"
          aria-label="Log out"
          onClick={async () => {
            await signOutUser();
            router.replace('/login');
            router.refresh();
          }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
