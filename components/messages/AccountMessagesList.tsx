'use client';

import { Inbox, Loader2 } from 'lucide-react';
import type { UserNotification } from '@/lib/hooks/useUserNotificationsLive';

type Props = {
  items: UserNotification[];
  loading: boolean;
  showHeader?: boolean;
};

export default function AccountMessagesList({ items, loading, showHeader = true }: Props) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 py-4 text-sm text-white/45">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading messages…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-white/40">No messages yet. The team can send you updates from the admin panel.</p>
    );
  }

  const list = (
    <ul className="space-y-4">
      {items.map((m) => (
        <li
          key={m.id}
          className={`border-b border-white/6 pb-4 last:border-0 last:pb-0 ${!m.read ? 'border-l-2 border-l-[#00d4ff] pl-3' : ''}`}
        >
          <p className="text-sm font-semibold text-white">{m.title}</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-white/60">{m.message}</p>
          <p className="mt-1.5 text-[11px] text-white/30">
            {m.createdAt && typeof m.createdAt.toDate === 'function' ? m.createdAt.toDate().toLocaleString() : '—'}
          </p>
        </li>
      ))}
    </ul>
  );

  if (!showHeader) {
    return list;
  }

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <Inbox size={15} className="text-[#8b5cf6]" />
        <h3 className="font-bold text-white">Messages</h3>
      </div>
      {list}
    </div>
  );
}
