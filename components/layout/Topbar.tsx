'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, LogOut, TrendingUp } from 'lucide-react';
import { useAuth, signOutUser } from '@/components/providers/AuthProvider';
import { useUserNotificationsLive } from '@/lib/hooks/useUserNotificationsLive';
import { isFirebaseConfigured } from '@/lib/firebase/client';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Real-time portfolio overview' },
  '/signals': { title: 'AI Signals', subtitle: 'Live trade recommendations' },
  '/wallet': { title: 'Wallet', subtitle: 'Balances & transactions' },
  '/portfolio': { title: 'Portfolio', subtitle: 'Asset allocation & performance' },
  '/history': { title: 'History', subtitle: 'All executed trades' },
  '/messages': { title: 'Messages', subtitle: 'Team updates & announcements' },
  '/settings': { title: 'Settings', subtitle: 'Account & deposit management' },
};

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { items: notifications } = useUserNotificationsLive();
  const unreadCount = isFirebaseConfigured() ? notifications.filter((n) => !n.read).length : 0;
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
        <Link
          href="/messages"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-white/50 transition-all hover:bg-white/8 hover:text-white"
          aria-label={unreadCount > 0 ? `Messages, ${unreadCount} unread` : 'Messages'}
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex min-w-[18px] items-center justify-center rounded-full bg-[#00d4ff] px-1 text-[10px] font-bold text-[#050b18]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

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
