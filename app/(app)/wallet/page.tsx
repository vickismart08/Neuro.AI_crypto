'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownToLine, ArrowUpToLine, DollarSign, TrendingUp, X } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import DepositOptions from '@/components/wallet/DepositOptions';
import { useUserProfileLive } from '@/lib/hooks/useUserProfileLive';
import { formatUsd } from '@/lib/money';

const WITHDRAW_MSG = 'Trade count insufficient for now';

export default function WalletPage() {
  const { profile } = useUserProfileLive();
  const [withdrawNotice, setWithdrawNotice] = useState(false);

  return (
    <div className="w-full min-w-0 max-w-full space-y-6 pb-2 sm:pb-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="Available balance"
          value={formatUsd(profile?.availableBalance)}
          icon={DollarSign}
          iconColor="#00d4ff"
          delay={0}
        />
        <StatCard
          label="Profit made"
          value={formatUsd(profile?.profitBalance)}
          subColor="#00ff88"
          icon={TrendingUp}
          iconColor="#00ff88"
          delay={0.05}
        />
      </div>

      <motion.div
        id="withdraw"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-3 scroll-mt-24 sm:flex-row sm:items-stretch"
      >
        <Link
          href="#deposit"
          className="group flex flex-1 items-center justify-center gap-2.5 rounded-xl border border-[rgba(0,212,255,0.35)] bg-[rgba(0,212,255,0.08)] py-3.5 text-[15px] font-semibold text-[#00d4ff] transition hover:bg-[rgba(0,212,255,0.14)]"
        >
          <ArrowDownToLine className="h-5 w-5" strokeWidth={2} />
          Deposit
        </Link>
        <button
          type="button"
          onClick={() => setWithdrawNotice(true)}
          className="group flex flex-1 items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 py-3.5 text-[15px] font-semibold text-white/90 transition hover:border-white/15 hover:bg-white/8"
        >
          <ArrowUpToLine className="h-5 w-5" strokeWidth={2} />
          Withdraw
        </button>
      </motion.div>

      <AnimatePresence>
        {withdrawNotice && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            role="status"
            aria-live="polite"
            className="flex items-start justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3"
          >
            <p className="text-sm leading-snug text-amber-100/95">{WITHDRAW_MSG}</p>
            <button
              type="button"
              onClick={() => setWithdrawNotice(false)}
              className="shrink-0 rounded-lg p-1 text-amber-200/80 hover:bg-white/10 hover:text-amber-50"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.section
        id="deposit"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
        className="scroll-mt-24 space-y-3"
        aria-label="Choose deposit asset"
      >
        <h2 className="text-sm font-bold tracking-tight text-white">Choose asset to deposit</h2>
        <p className="text-xs text-white/40">Select BTC, USDC, or USDT, then open the row to see the address.</p>
        <DepositOptions />
      </motion.section>
    </div>
  );
}
