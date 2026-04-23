'use client';

import { useState } from 'react';
import { Check, Copy, ChevronDown } from 'lucide-react';
import { depositAddresses } from '@/lib/data';

const ASSETS: {
  id: 'BTC' | 'USDC' | 'USDT';
  name: string;
  network: string;
}[] = [
  { id: 'BTC', name: 'Bitcoin', network: 'Bitcoin network' },
  { id: 'USDC', name: 'USD Coin (USDC)', network: 'ERC-20 (Ethereum)' },
  { id: 'USDT', name: 'Tether (USDT)', network: 'ERC-20 (Ethereum)' },
];

function BtcIcon({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F7931A] text-white ${className}`}
      aria-hidden
    >
      <span className="text-lg font-bold leading-none">₿</span>
    </div>
  );
}

function UsdcIcon({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${className}`}
      style={{ background: 'linear-gradient(135deg, #2775CA 0%, #3b82c4 100%)' }}
      aria-hidden
    >
      <span className="pl-0.5 text-sm font-black tracking-tight text-white">$</span>
    </div>
  );
}

function UsdtIcon({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${className}`}
      style={{ background: 'linear-gradient(135deg, #26A17B 0%, #1f8a68 100%)' }}
      aria-hidden
    >
      <span className="text-[12px] font-black tracking-wide text-white">₮</span>
    </div>
  );
}

const iconFor = (id: 'BTC' | 'USDC' | 'USDT') => {
  switch (id) {
    case 'BTC':
      return <BtcIcon />;
    case 'USDC':
      return <UsdcIcon />;
    case 'USDT':
      return <UsdtIcon />;
  }
}

export default function DepositOptions() {
  const [open, setOpen] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (asset: 'BTC' | 'USDC' | 'USDT', value: string) => {
    void navigator.clipboard.writeText(value);
    setCopied(asset);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-2">
      {ASSETS.map((a) => {
        const address = depositAddresses[a.id];
        const isOpen = open === a.id;
        return (
          <div key={a.id} className="overflow-hidden rounded-xl border border-white/8 bg-white/[0.03]">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : a.id)}
              className="flex w-full items-center gap-3 p-3.5 text-left transition hover:bg-white/[0.04] sm:gap-4 sm:p-4"
            >
              {iconFor(a.id)}
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-bold text-white">{a.id}</p>
                <p className="text-xs text-white/45">{a.name}</p>
                <p className="text-[11px] text-white/30">{a.network}</p>
              </div>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-white/35 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isOpen && (
              <div className="border-t border-white/6">
                <div className="p-3.5 sm:p-4">
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                    Deposit address
                  </p>
                  <div className="flex items-start gap-2">
                    <code
                      className="flex-1 break-all font-mono text-xs leading-relaxed"
                      style={{
                        color: a.id === 'BTC' ? '#F7931A' : a.id === 'USDC' ? '#5b9fd4' : '#3ecf8e',
                      }}
                    >
                      {address}
                    </code>
                    <button
                      type="button"
                      onClick={() => copy(a.id, address)}
                      className="shrink-0 rounded-lg border border-white/10 bg-white/5 p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
                      aria-label="Copy address"
                    >
                      {copied === a.id ? <Check className="h-4 w-4 text-[#00ff88]" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-amber-200/80">
                    Only send {a.id} on {a.network}. Wrong asset or network can mean permanent loss.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
