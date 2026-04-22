'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { assets } from '@/lib/data';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const d = payload[0].payload;
    return (
      <div className="glass p-3 text-xs">
        <p className="text-white font-semibold">{d.name}</p>
        <p style={{ color: d.color }}>{d.allocation}% — ${d.value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function PortfolioPie() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={assets}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
          nameKey="name"
        >
          {assets.map((a) => (
            <Cell key={a.symbol} fill={a.color} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
