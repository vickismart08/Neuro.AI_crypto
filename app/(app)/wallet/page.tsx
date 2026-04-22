'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowDownToLine, ArrowUpToLine, DollarSign, TrendingUp } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import { useUserProfileLive } from '@/lib/hooks/useUserProfileLive';
import { formatUsd } from '@/lib/money';

export default function WalletPage() {
  const { profile } = useUserProfileLive();

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
          href="/dashboard#deposit"
          className="group flex flex-1 items-center justify-center gap-2.5 rounded-xl border border-[rgba(0,212,255,0.35)] bg-[rgba(0,212,255,0.08)] py-3.5 text-[15px] font-semibold text-[#00d4ff] transition hover:bg-[rgba(0,212,255,0.14)]"
        >
          <ArrowDownToLine className="h-5 w-5" strokeWidth={2} />
          Deposit
        </Link>
        <Link
          href="/wallet#withdraw"
          className="group flex flex-1 items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 py-3.5 text-[15px] font-semibold text-white/90 transition hover:border-white/15 hover:bg-white/8"
        >
          <ArrowUpToLine className="h-5 w-5" strokeWidth={2} />
          Withdraw
        </Link>
      </motion.div>
    </div>
  );
}
