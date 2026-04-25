'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowDownToLine,
  ArrowUpToLine,
  Bot,
  DollarSign,
  ExternalLink,
  Send,
  TrendingUp,
} from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import dynamic from 'next/dynamic';
import { useAuth } from '@/components/providers/AuthProvider';
import { useUserProfileLive } from '@/lib/hooks/useUserProfileLive';
import { setProfitCycleStart } from '@/lib/firebase/userProfile';
import { formatUsd } from '@/lib/money';
import { depositPackages, formatPackageRange } from '@/lib/depositPackages';
import { portfolioStats } from '@/lib/data';

const EquityChart = dynamic(() => import('@/components/charts/EquityChart'), { ssr: false });

const DEFAULT_TELEGRAM_URL = 'https://t.me/+50SA5b-gbrBkMmNk';
const TELEGRAM_URL =
  process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL?.trim() || DEFAULT_TELEGRAM_URL;

/**
 * Repeating deltas applied to live profit. Each 5 minutes the next step runs; after +12
 * the pattern restarts with +10 while the total keeps climbing (no reset to base+10).
 */
const PROFIT_DELTAS = [10, -2, 12, -3, 12] as const;
const PROFIT_TREND: readonly ('up' | 'down')[] = ['up', 'down', 'up', 'down', 'up'];
const PROFIT_STEP_MS = 5 * 60 * 1000;
const PROFIT_CYCLE_SUM = PROFIT_DELTAS.reduce((sum, d) => sum + d, 0);

const EQUITY_DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

function buildEquityCurve(profit: number, active: boolean): { date: string; value: number }[] {
  return EQUITY_DAY_LABELS.map((date, i) => {
    if (!active || profit <= 0) return { date, value: 0 };
    const t = i / (EQUITY_DAY_LABELS.length - 1);
    const factor = 1 - (1 - t) ** 1.35;
    const wobble = 0.05 * profit * Math.sin(i * 1.1);
    return { date, value: Math.max(0, profit * factor + wobble) };
  });
}

function getProfitBonusFromElapsed(elapsedMs: number): { bonus: number; lastDeltaIdx: number } {
  // At cycle start we apply the first +10 immediately, then continue every interval.
  const stepsApplied = Math.max(1, Math.floor(elapsedMs / PROFIT_STEP_MS) + 1);
  const fullCycles = Math.floor(stepsApplied / PROFIT_DELTAS.length);
  const remainder = stepsApplied % PROFIT_DELTAS.length;

  let bonus = fullCycles * PROFIT_CYCLE_SUM;
  for (let i = 0; i < remainder; i += 1) {
    bonus += PROFIT_DELTAS[i];
  }

  const lastDeltaIdx = (stepsApplied - 1) % PROFIT_DELTAS.length;
  return { bonus, lastDeltaIdx };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { profile } = useUserProfileLive();
  const [nowMs, setNowMs] = useState(() => Date.now());

  const hasDetectedBalance = useMemo(() => {
    if (!profile) return false;
    const a = profile.availableBalance ?? 0;
    const p = profile.profitBalance ?? 0;
    return a > 0 || p > 0;
  }, [profile]);

  useEffect(() => {
    if (!hasDetectedBalance || !user?.uid || profile?.profitCycleStartedAtMs) return;
    void setProfitCycleStart(user.uid, Date.now()).catch(() => {
      // Non-blocking: UI continues using live time until Firestore syncs.
    });
  }, [hasDetectedBalance, user?.uid, profile?.profitCycleStartedAtMs]);

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const available = formatUsd(profile?.availableBalance);

  const baseProfit = profile?.profitBalance ?? 0;
  const cycleStartMs = profile?.profitCycleStartedAtMs ?? nowMs;
  const elapsedMs = Math.max(0, nowMs - cycleStartMs);
  const { bonus: profitBonus, lastDeltaIdx } = hasDetectedBalance
    ? getProfitBonusFromElapsed(elapsedMs)
    : { bonus: 0, lastDeltaIdx: 0 };
  const animatedProfit = hasDetectedBalance ? baseProfit + profitBonus : baseProfit;
  const profit = formatUsd(animatedProfit);
  const profitValueClass = hasDetectedBalance
    ? PROFIT_TREND[lastDeltaIdx] === 'up'
      ? 'text-[#00ff88] transition-colors duration-500'
      : 'text-red-400 transition-colors duration-500'
    : undefined;

  const chartTrend = hasDetectedBalance ? PROFIT_TREND[lastDeltaIdx] : 'up';

  const equityChartData = useMemo(
    () => buildEquityCurve(animatedProfit, hasDetectedBalance),
    [animatedProfit, hasDetectedBalance]
  );

  const profitReturnPct = useMemo(() => {
    const avail = profile?.availableBalance ?? 0;
    if (avail <= 0) return 0;
    return (animatedProfit / avail) * 100;
  }, [profile?.availableBalance, animatedProfit]);

  const analysisValueClass = hasDetectedBalance
    ? chartTrend === 'up'
      ? 'text-[#00ff88] transition-colors duration-500'
      : 'text-red-400 transition-colors duration-500'
    : 'text-white/90';

  const analysisPctClass = hasDetectedBalance
    ? chartTrend === 'up'
      ? 'text-[#00ff88]/90 transition-colors duration-500'
      : 'text-red-400/90 transition-colors duration-500'
    : 'text-white/45';

  return (
    <div className="w-full min-w-0 max-w-full space-y-6 pb-2 sm:pb-4">
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Available balance"
          value={available}
          icon={DollarSign}
          iconColor="#00d4ff"
          delay={0}
        />
        <StatCard
          label="Profit made"
          value={profit}
          subColor="#00ff88"
          valueClassName={profitValueClass}
          icon={TrendingUp}
          iconColor="#00ff88"
          delay={0.05}
        />
        <StatCard
          label="Active Bots"
          value={`${portfolioStats.activeBots}`}
          sub="Running 24/7"
          icon={Bot}
          iconColor="#f59e0b"
          delay={0.1}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
      >
        <Link
          href="/wallet#deposit"
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

      {/* Deposit packages — horizontal scroll (overflows on small screens) */}
      <motion.section
        id="deposit"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
        className="scroll-mt-24 w-full min-w-0 max-w-full space-y-3"
        aria-label="Deposit packages"
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <h2 className="text-white font-bold text-sm tracking-tight">Deposit package</h2>
          <p className="text-white/30 text-[11px] sm:text-right md:hidden sm:text-xs sm:whitespace-nowrap">
            Scroll sideways to see all tiers
          </p>
        </div>
        <div
          className="deposit-packages-scroll -mx-1 flex w-full min-w-0 max-w-full flex-nowrap gap-3 overflow-x-auto py-1 pb-3 pl-1 pr-1 pt-0.5 snap-x snap-mandatory [scrollbar-color:rgba(255,255,255,0.15)_transparent] [scrollbar-width:thin]"
        >
          {depositPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="glass-sm flex h-full min-h-[100px] w-[200px] shrink-0 snap-start flex-col gap-2 rounded-xl border border-white/8 p-3.5 sm:w-[220px] sm:max-w-[240px] sm:p-4"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-[#00d4ff]">{pkg.name}</p>
              <p className="text-[10px] font-medium uppercase tracking-wide text-white/40 sm:text-[11px]">
                Min — Max
              </p>
              <p className="break-words text-xs font-semibold leading-snug text-white sm:text-sm">
                {formatPackageRange(pkg)}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Profit Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="min-w-0 glass p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-bold text-sm">Profit Analysis</h3>
            <p className="text-white/40 text-xs mt-0.5">Equity curve — last 7 days</p>
          </div>
          <div className="text-right">
            <p className={`font-bold text-sm ${analysisValueClass}`}>{profit}</p>
            <p className={`text-xs ${analysisPctClass}`}>
              {hasDetectedBalance
                ? `${profitReturnPct >= 0 ? '+' : ''}${profitReturnPct.toFixed(2)}% on available`
                : '0.00%'}
            </p>
          </div>
        </div>
        <EquityChart data={equityChartData} trend={chartTrend} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24 }}
        className="min-w-0 mb-8 sm:mb-10"
      >
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col gap-4 rounded-2xl border border-[rgba(34,158,217,0.35)] bg-[linear-gradient(135deg,rgba(34,158,217,0.12)_0%,rgba(0,212,255,0.05)_100%)] p-4 transition hover:border-[rgba(34,158,217,0.5)] hover:bg-[linear-gradient(135deg,rgba(34,158,217,0.16)_0%,rgba(0,212,255,0.08)_100%)] sm:flex-row sm:items-center sm:justify-between sm:p-5"
        >
          <div className="flex min-w-0 items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#229ED9]/20 text-[#229ED9]"
              aria-hidden
            >
              <Send className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold tracking-tight text-white">Join our Telegram channel</h3>
              <p className="mt-1 text-xs leading-relaxed text-white/50">
                Get market updates, AI signal announcements, and support from the community.
              </p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center justify-center gap-2 self-stretch rounded-xl bg-[#229ED9] px-4 py-2.5 text-sm font-semibold text-white transition group-hover:bg-[#1b8cc4] sm:self-auto">
            Open in Telegram
            <ExternalLink className="h-4 w-4 opacity-90" strokeWidth={2} />
          </span>
        </a>
      </motion.div>
    </div>
  );
}
