'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { APP_NAV } from '@/lib/navConfig';

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#080f20]/95 backdrop-blur-xl border-t border-white/5 flex items-stretch">
      {APP_NAV.map((item) => {
        const Icon = item.icon;

        if (item.comingSoon) {
          return (
            <div
              key={item.label}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-white/25 cursor-not-allowed select-none"
              aria-label="AI Signal (coming soon)"
              aria-disabled
            >
              <Icon size={20} strokeWidth={1.6} className="opacity-60" />
              <span className="text-[9px] font-semibold tracking-wide leading-tight text-center px-0.5">
                {item.shortLabel}
              </span>
              <span className="text-[7px] font-bold uppercase tracking-wider text-white/20">Soon</span>
            </div>
          );
        }

        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-all duration-200 relative ${
              active ? 'text-[#00d4ff]' : 'text-white/35 hover:text-white/70'
            }`}
          >
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[#00d4ff] shadow-[0_0_8px_rgba(0,212,255,0.7)]" />
            )}
            <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
            <span className="text-[9px] font-semibold tracking-wide leading-none text-center px-0.5">
              {item.shortLabel}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
