'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

type Props = {
  label: string;
  value: string;
  sub?: string;
  subColor?: string;
  /** Replaces default `text-white` on the value line (e.g. green/red for trends). */
  valueClassName?: string;
  icon: LucideIcon;
  iconColor: string;
  delay?: number;
};

export default function StatCard({
  label,
  value,
  sub,
  subColor = '#00ff88',
  valueClassName,
  icon: Icon,
  iconColor,
  delay = 0,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass p-5 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-white/45 text-xs font-semibold uppercase tracking-wider">{label}</span>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${iconColor}15`, border: `1px solid ${iconColor}25` }}
        >
          <Icon size={16} style={{ color: iconColor }} />
        </div>
      </div>
      <div>
        <p
          className={`font-black text-xl sm:text-2xl leading-none mb-1 truncate ${
            valueClassName ?? 'text-white'
          }`}
        >
          {value}
        </p>
        {sub && (
          <p className="text-xs font-semibold" style={{ color: subColor }}>
            {sub}
          </p>
        )}
      </div>
    </motion.div>
  );
}
