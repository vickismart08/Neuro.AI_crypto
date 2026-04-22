import Link from 'next/link';
import { Menu } from 'lucide-react';

export default function AuthHeader() {
  return (
    <header className="relative z-10 flex items-center justify-between border-b border-white/5 bg-[#080f20]/80 px-4 py-4 backdrop-blur-xl sm:px-6">
      <Link href="/" className="shrink-0" aria-label="Home">
        <span className="text-[22px] font-bold tracking-tight text-white sm:text-2xl">
          Neuro<span className="gradient-cyan">.AI</span>
        </span>
      </Link>
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/50 transition hover:border-white/15 hover:bg-white/8 hover:text-white/80"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" strokeWidth={1.8} />
      </button>
    </header>
  );
}
