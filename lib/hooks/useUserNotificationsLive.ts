'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, limit } from 'firebase/firestore';
import type { Timestamp } from 'firebase/firestore';
import { useAuth } from '@/components/providers/AuthProvider';
import { getFirebaseDb, isFirebaseConfigured } from '@/lib/firebase/client';

export type UserNotification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Timestamp | null;
};

type State = { items: UserNotification[]; loading: boolean };

export function useUserNotificationsLive(): State {
  const { user } = useAuth();
  const [state, setState] = useState<State>({ items: [], loading: true });

  useEffect(() => {
    if (!user?.uid || !isFirebaseConfigured()) {
      setState({ items: [], loading: false });
      return;
    }
    const q = query(
      collection(getFirebaseDb(), 'users', user.uid, 'notifications'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items: UserNotification[] = snap.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            title: typeof d.title === 'string' ? d.title : 'Message',
            message: typeof d.message === 'string' ? d.message : '',
            read: Boolean(d.read),
            createdAt: d.createdAt ?? null,
          };
        });
        setState({ items, loading: false });
      },
      () => setState({ items: [], loading: false })
    );
    return () => unsub();
  }, [user?.uid]);

  return state;
}
