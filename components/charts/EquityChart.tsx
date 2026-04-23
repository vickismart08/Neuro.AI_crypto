'use client';

import { useId, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type Point = { date: string; value: number };

type Props = {
  data: Point[];
  trend?: 'up' | 'down';
};

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (active && payload?.length) {
    return (
      <div className="glass p-3 text-xs">
        <p className="text-white/50 mb-1">{label}</p>
        <p className="text-white font-bold">
          {typeof payload[0].value === 'number'
            ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                payload[0].value
              )
            : '—'}
        </p>
      </div>
    );
  }
  return null;
};

export default function EquityChart({ data, trend = 'up' }: Props) {
  const id = useId();
  const gradientId = `equityGrad-${id.replace(/[:]/g, '')}`;
  const stroke = trend === 'down' ? '#f87171' : '#00ff88';
  const { domainMax, tickFormatter } = useMemo(() => {
    const maxVal = data.reduce((m, d) => Math.max(m, d.value), 0);
    const top = maxVal > 0 ? maxVal * 1.12 : 100;
    const fmt = (v: number) => {
      if (v === 0) return '$0';
      if (v < 1000) return `$${Math.round(v)}`;
      return `$${(v / 1000).toFixed(v >= 10_000 ? 0 : 1)}k`;
    };
    return { domainMax: top, tickFormatter: fmt };
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity={0.28} />
            <stop offset="100%" stopColor={stroke} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={tickFormatter}
          domain={[0, domainMax]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          isAnimationActive
          animationDuration={400}
          stroke={stroke}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
