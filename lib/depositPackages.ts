/** USDT deposit tiers (min / max per package). */
export type DepositPackage = {
  id: string;
  name: string;
  min: number;
  max: number;
  currency: 'USDT';
};

export const depositPackages: DepositPackage[] = [
  { id: 'basic', name: 'Basic', min: 100, max: 300, currency: 'USDT' },
  { id: 'standard', name: 'Standard', min: 300, max: 999.99, currency: 'USDT' },
  { id: 'comfort', name: 'Comfort', min: 1000, max: 2500, currency: 'USDT' },
  { id: 'optimal', name: 'Optimal', min: 2500, max: 5000, currency: 'USDT' },
  { id: 'vip', name: 'VIP', min: 5000, max: 10_000, currency: 'USDT' },
  { id: 'luxury', name: 'Luxury', min: 10_000, max: 30_000, currency: 'USDT' },
  { id: 'ultima', name: 'Ultima', min: 300_000, max: 900_000, currency: 'USDT' },
];

function formatUsdt(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatPackageRange(pkg: DepositPackage): string {
  return `${formatUsdt(pkg.min)} – ${formatUsdt(pkg.max)} ${pkg.currency}`;
}
