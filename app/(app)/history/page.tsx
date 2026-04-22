'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, History, Loader2 } from 'lucide-react';
import { useUserHistoryLive } from '@/lib/hooks/useUserHistoryLive';

const strategyColors: Record<string, string> = {
  'Momentum AI': '#00d4ff',
  'Breakout AI': '#8b5cf6',
  'Mean Revert': '#f59e0b',
  'Trend Follow': '#00ff88',
  'Sentiment AI': '#ff4d6d',
};

export default function HistoryPage() {
  const { items: tradeHistory, loading } = useUserHistoryLive();

  return (
    <div className="space-y-6">
      {/* Table card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass overflow-hidden"
      >
        {/* Table header */}
        <div className="flex items-center gap-2 border-b border-white/5 p-5">
          <History size={15} className="text-[#8b5cf6]" />
          <h3 className="text-sm font-bold text-white">History</h3>
          <span className="text-xs text-white/35">({loading ? '…' : tradeHistory.length})</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-white/50">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading history…</span>
          </div>
        ) : tradeHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center sm:py-24">
            <div
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]"
              aria-hidden
            >
              <History className="h-7 w-7 text-white/20" strokeWidth={1.5} />
            </div>
            <p className="text-base font-semibold text-white/90">No history available yet</p>
            <p className="mt-1.5 max-w-sm text-sm text-white/40">
              Your closed trades and activity will show up here once you start trading.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Date', 'Pair', 'Type', 'Entry', 'Exit', 'Size', 'P&L', 'Duration', 'Strategy'].map((h) => (
                      <th key={h} className="text-left text-white/30 text-[11px] font-semibold uppercase tracking-wider px-5 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tradeHistory.map((t, i) => (
                    <motion.tr
                      key={t.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25 + i * 0.04 }}
                      className="tr-hover border-b border-white/4 last:border-0"
                    >
                      <td className="px-5 py-3.5 text-white/50 text-xs whitespace-nowrap">{t.date}</td>
                      <td className="px-5 py-3.5 text-white font-bold">{t.pair}</td>
                      <td className="px-5 py-3.5">
                        <span className={`badge ${t.type === 'BUY' ? 'badge-buy' : 'badge-sell'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-white/70 font-mono text-xs">${t.entry.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-white/70 font-mono text-xs">${t.exit.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-white/50 text-xs">{t.size}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className="flex items-center gap-0.5 font-bold text-sm"
                          style={{ color: t.pnl >= 0 ? '#00ff88' : '#ff4d6d' }}
                        >
                          {t.pnl >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                          {t.pnl >= 0 ? '+' : ''}${t.pnl}
                          <span className="text-[10px] font-normal opacity-70 ml-1">({t.pnlPct >= 0 ? '+' : ''}{t.pnlPct}%)</span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-white/45 text-xs">{t.duration}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                          style={{
                            background: `${strategyColors[t.strategy] ?? '#00d4ff'}15`,
                            color: strategyColors[t.strategy] ?? '#00d4ff',
                          }}
                        >
                          {t.strategy}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-white/5">
              {tradeHistory.map((t, i) => {
                const stratColor = strategyColors[t.strategy] ?? '#00d4ff';
                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.04 }}
                    className="p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-black text-base">{t.pair}</span>
                        <span className={`badge ${t.type === 'BUY' ? 'badge-buy' : 'badge-sell'}`}>{t.type}</span>
                      </div>
                      <span
                        className="flex items-center gap-0.5 font-bold text-sm"
                        style={{ color: t.pnl >= 0 ? '#00ff88' : '#ff4d6d' }}
                      >
                        {t.pnl >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                        {t.pnl >= 0 ? '+' : ''}${t.pnl}
                        <span className="text-[10px] font-normal opacity-70 ml-0.5">({t.pnlPct >= 0 ? '+' : ''}{t.pnlPct}%)</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="glass-sm p-2">
                        <p className="text-white/35 text-[10px] mb-0.5">Entry</p>
                        <p className="text-white font-semibold text-xs">${t.entry.toLocaleString()}</p>
                      </div>
                      <div className="glass-sm p-2">
                        <p className="text-white/35 text-[10px] mb-0.5">Exit</p>
                        <p className="text-white font-semibold text-xs">${t.exit.toLocaleString()}</p>
                      </div>
                      <div className="glass-sm p-2">
                        <p className="text-white/35 text-[10px] mb-0.5">Size</p>
                        <p className="text-white font-semibold text-xs">{t.size}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/40 text-[11px]">{t.date} · {t.duration}</span>
                      <span
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                        style={{ background: `${stratColor}15`, color: stratColor }}
                      >
                        {t.strategy}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
