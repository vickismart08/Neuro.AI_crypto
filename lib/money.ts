/** Format a number as USD for UI (2 decimals, en-US). */
export function formatUsd(amount: number | undefined | null): string {
  const n = typeof amount === 'number' && !Number.isNaN(amount) ? amount : 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}
