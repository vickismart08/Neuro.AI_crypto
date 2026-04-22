'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, PieChart } from 'lucide-react';
import dynamic from 'next/dynamic';
import { assets, portfolioStats } from '@/lib/data';

const PortfolioPie = dynamic(() => import('@/components/charts/PortfolioPie'), { ssr: false });

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Value', value: `$${portfolioStats.totalValue.toLocaleString()}`, sub: `Deposited $${portfolioStats.totalDeposited.toLocaleString()}`, color: '#00d4ff' },
          { label: 'Total Profit', value: `+$${portfolioStats.totalPnl.toLocaleString()}`, sub: `+${portfolioStats.totalPnlPct}% ROI`, color: '#00ff88' },
          { label: "Today's P&L", value: `+$${portfolioStats.dailyPnl}`, sub: `+${portfolioStats.dailyPnlPct}% today`, color: '#8b5cf6' },
          { label: 'Win Rate', value: `${portfolioStats.winRate}%`, sub: `${portfolioStats.totalTrades.toLocaleString()} trades`, color: '#f59e0b' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass p-5"
          >
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">{card.label}</p>
            <p className="text-white font-black text-2xl mb-1">{card.value}</p>
            <p className="text-xs font-semibold" style={{ color: card.color }}>{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Pie + Table */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Pie chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <PieChart size={15} className="text-[#8b5cf6]" />
            <h3 className="text-white font-bold text-sm">Allocation</h3>
          </div>
          <PortfolioPie />

          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
            {assets.map((a) => (
              <div key={a.symbol} className="flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full" style={{ background: a.color }} />
                <span className="text-white/50">{a.symbol}</span>
                <span className="text-white/80 font-semibold">{a.allocation}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Assets table */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-3 glass overflow-hidden"
        >
          <div className="p-5 border-b border-white/5">
            <h3 className="text-white font-bold text-sm">Holdings</h3>
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/35 text-[11px] font-semibold uppercase tracking-wider px-5 py-3">Asset</th>
                  <th className="text-right text-white/35 text-[11px] font-semibold uppercase tracking-wider px-5 py-3">Price</th>
                  <th className="text-right text-white/35 text-[11px] font-semibold uppercase tracking-wider px-5 py-3">Amount</th>
                  <th className="text-right text-white/35 text-[11px] font-semibold uppercase tracking-wider px-5 py-3">Value</th>
                  <th className="text-right text-white/35 text-[11px] font-semibold uppercase tracking-wider px-5 py-3">24h</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((a, i) => (
                  <motion.tr
                    key={a.symbol}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="tr-hover border-b border-white/4 last:border-0"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white"
                          style={{ background: `${a.color}25`, border: `1.5px solid ${a.color}40` }}
                        >
                          {a.symbol.slice(0, 1)}
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{a.symbol}</p>
                          <p className="text-white/35 text-[11px]">{a.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right text-white/80 text-sm font-medium">
                      ${a.price.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-right text-white/60 text-sm">
                      {a.amount}
                    </td>
                    <td className="px-5 py-3.5 text-right text-white font-bold text-sm">
                      ${a.value.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span
                        className="flex items-center justify-end gap-0.5 text-sm font-semibold"
                        style={{ color: a.change24h >= 0 ? '#00ff88' : '#ff4d6d' }}
                      >
                        {a.change24h >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                        {Math.abs(a.change24h)}%
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-white/5">
            {assets.map((a, i) => (
              <motion.div
                key={a.symbol}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="p-4 flex items-center gap-3"
              >
                <div
                  className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-black text-white"
                  style={{ background: `${a.color}25`, border: `1.5px solid ${a.color}40` }}
                >
                  {a.symbol.slice(0, 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-white font-bold text-sm">{a.symbol}</span>
                    <span className="text-white font-bold text-sm">${a.value.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-xs">{a.amount} · ${a.price.toLocaleString()}</span>
                    <span
                      className="flex items-center gap-0.5 text-xs font-semibold"
                      style={{ color: a.change24h >= 0 ? '#00ff88' : '#ff4d6d' }}
                    >
                      {a.change24h >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {Math.abs(a.change24h)}%
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
