'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { doc, getFirestore, writeBatch } from 'firebase/firestore';
import { Inbox } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import AccountMessagesList from '@/components/messages/AccountMessagesList';
import { getFirebaseApp, isFirebaseConfigured } from '@/lib/firebase/client';
import { useUserNotificationsLive } from '@/lib/hooks/useUserNotificationsLive';

function useMarkNotificationsRead(
  userId: string | undefined,
  loading: boolean,
  items: { id: string; read: boolean }[]
) {
  const lastBatch = useRef<string>('');

  useEffect(() => {
    if (!isFirebaseConfigured() || !userId || loading) return;
    const unread = items.filter((i) => !i.read);
    if (unread.length === 0) return;

    const key = `${userId}:${unread.map((u) => u.id).join(',')}`;
    if (lastBatch.current === key) return;
    lastBatch.current = key;

    const db = getFirestore(getFirebaseApp());
    const batch = writeBatch(db);
    for (const n of unread) {
      batch.update(doc(db, 'users', userId, 'notifications', n.id), { read: true });
    }
    void batch.commit().catch(() => {
      lastBatch.current = '';
    });
  }, [userId, loading, items]);
}

export default function MessagesPage() {
  const { user } = useAuth();
  const { items, loading } = useUserNotificationsLive();
  useMarkNotificationsRead(user?.uid, loading, items);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6"
      >
        <div className="mb-1 flex items-center gap-2">
          <Inbox className="h-5 w-5 text-[#8b5cf6]" />
          <h1 className="text-lg font-bold text-white">Messages</h1>
        </div>
        <p className="mb-5 text-sm text-white/40">Updates sent by the Neuro.AI team from the admin console.</p>
        <AccountMessagesList items={items} loading={loading} showHeader={false} />
      </motion.div>
    </div>
  );
}
