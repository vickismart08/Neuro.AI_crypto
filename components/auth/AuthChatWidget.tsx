'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function AuthChatWidget() {
  const [open, setOpen] = useState(true);

  return (
    <div className="fixed bottom-4 left-4 z-30 flex items-end gap-2 sm:bottom-6 sm:left-6">
      {open && (
        <div className="relative max-w-[200px] rounded-2xl border border-white/10 bg-[#080f20]/95 px-3.5 py-2.5 text-sm text-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm">
          <p>Hi. Need any help?</p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#0a1628] text-white/50 shadow-sm transition hover:text-white"
            aria-label="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      <button
        type="button"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#8b5cf6] text-white shadow-[0_0_20px_rgba(0,212,255,0.25)] transition hover:opacity-90"
        aria-label="Open chat"
      >
        <MessageCircle className="h-5 w-5" />
      </button>
    </div>
  );
}
