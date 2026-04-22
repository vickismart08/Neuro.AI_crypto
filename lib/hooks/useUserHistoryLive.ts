'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useAuth } from '@/components/providers/AuthProvider';
import { getFirebaseDb, isFirebaseConfigured } from '@/lib/firebase/client';
import type { TradeHistory } from '@/lib/data';

type State = { items: TradeHistory[]; loading: boolean };

function mapDoc(
  id: string,
  d: {
    date?: string;
    pair?: string;
    type?: 'BUY' | 'SELL';
    entry?: number;
    exit?: number;
    size?: number;
    pnl?: number;
    pnlPct?: number;
    duration?: string;
    strategy?: string;
    status?: 'profit' | 'loss';
  }
): TradeHistory {
  return {
    id,
    date: d.date ?? '—',
    pair: d.pair ?? '—',
    type: d.type === 'SELL' ? 'SELL' : 'BUY',
    entry: typeof d.entry === 'number' ? d.entry : 0,
    exit: typeof d.exit === 'number' ? d.exit : 0,
    size: typeof d.size === 'number' ? d.size : 0,
    pnl: typeof d.pnl === 'number' ? d.pnl : 0,
    pnlPct: typeof d.pnlPct === 'number' ? d.pnlPct : 0,
    duration: d.duration ?? '—',
    strategy: d.strategy ?? '—',
    status: d.status === 'loss' ? 'loss' : 'profit',
  };
}

export function useUserHistoryLive(): State {
  const { user } = useAuth();
  const [state, setState] = useState<State>({ items: [], loading: true });

  useEffect(() => {
    if (!user?.uid || !isFirebaseConfigured()) {
      setState({ items: [], loading: false });
      return;
    }
    setState((s) => ({ ...s, loading: true }));
    const q = query(
      collection(getFirebaseDb(), 'users', user.uid, 'history'),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items: TradeHistory[] = snap.docs.map((docSnap) => mapDoc(docSnap.id, docSnap.data()));
        setState({ items, loading: false });
      },
      () => setState({ items: [], loading: false })
    );
    return () => unsub();
  }, [user?.uid]);

  return state;
}
