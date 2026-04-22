'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { TrendingUp, LogOut } from 'lucide-react';
import { useAuth, signOutUser } from '@/components/providers/AuthProvider';
import { APP_NAV } from '@/lib/navConfig';

function initialsFromUser(displayName: string | null, email: string | null) {
  if (displayName?.trim()) {
    const parts = displayName.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return displayName.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return '–';
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const label = user?.displayName || user?.email?.split('@')[0] || 'Account';
  const sub = user?.email || 'Pro Plan';

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[#080f20] border-r border-white/5 fixed top-0 left-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#8b5cf6] flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.35)]">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <span className="text-white font-bold text-xl tracking-tight">
          Neuro<span className="gradient-cyan">.AI</span>
        </span>
      </div>

      {/* Live badge */}
      <div className="mx-4 mt-4 mb-2 px-3 py-2 rounded-xl bg-[rgba(0,255,136,0.06)] border border-[rgba(0,255,136,0.15)] flex items-center gap-2">
        <span className="dot-live" />
        <span className="text-[#00ff88] text-xs font-semibold">AI Trading Active</span>
        <span className="ml-auto text-[#00ff88]/60 text-[10px]">4 bots</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
        {APP_NAV.map((item) => {
          const Icon = item.icon;
          if (item.comingSoon) {
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/30 cursor-not-allowed border-l-2 border-transparent"
                aria-disabled
                aria-label="AI Signal (coming soon)"
              >
                <Icon className="w-4.5 h-4.5 text-white/20" size={18} />
                {item.label}
                <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-white/20 bg-white/5 px-2 py-0.5 rounded-md">
                  Soon
                </span>
              </div>
            );
          }
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                active
                  ? 'nav-active'
                  : 'text-white/45 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
              }`}
            >
              <Icon
                className={`w-4.5 h-4.5 transition-colors ${
                  active ? 'text-[#00d4ff]' : 'text-white/35 group-hover:text-white/70'
                }`}
                size={18}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom user card */}
      <div className="p-4 border-t border-white/5">
        <div className="glass-sm p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#8b5cf6] flex items-center justify-center text-white text-xs font-bold">
            {initialsFromUser(user?.displayName ?? null, user?.email ?? null)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{label}</p>
            <p className="text-white/35 text-[11px] truncate">{sub}</p>
          </div>
          <button
            type="button"
            onClick={async () => {
              await signOutUser();
              router.replace('/login');
              router.refresh();
            }}
            className="text-white/30 hover:text-white/70 transition-colors p-1"
            aria-label="Log out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
