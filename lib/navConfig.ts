import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Zap,
  Wallet,
  History,
  Settings,
} from 'lucide-react';

export type AppNavItem =
  | { href: string; label: string; shortLabel: string; icon: LucideIcon; comingSoon?: false }
  | { href: null; label: string; shortLabel: string; icon: LucideIcon; comingSoon: true };

/**
 * Main app nav order: Dashboard → AI Signal (soon) → Wallet → History → Settings
 */
export const APP_NAV: AppNavItem[] = [
  { href: '/dashboard', label: 'Dashboard', shortLabel: 'Dashboard', icon: LayoutDashboard },
  { href: null, label: 'AI Signal', shortLabel: 'AI Signal', icon: Zap, comingSoon: true },
  { href: '/wallet', label: 'Wallet', shortLabel: 'Wallet', icon: Wallet },
  { href: '/history', label: 'History', shortLabel: 'History', icon: History },
  { href: '/settings', label: 'Settings', shortLabel: 'Settings', icon: Settings },
];
