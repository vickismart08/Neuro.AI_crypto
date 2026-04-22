'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { pnlData } from '@/lib/data';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass p-3 text-xs">
        <p className="text-white/60 mb-1 font-semibold">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.fill }}>
            {p.name === 'profit' ? 'Profit' : 'Loss'}: {p.value > 0 ? '+' : ''}{p.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function PnLChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={pnlData} barGap={4} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="profit" fill="#00ff88" radius={[4, 4, 0, 0]} />
        <Bar dataKey="loss" fill="#ff4d6d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
