export type Signal = {
  id: string;
  time: string;
  pair: string;
  signal: 'BUY' | 'SELL';
  price: number;
  target: number;
  stopLoss: number;
  confidence: number;
  pnl: string;
  pnlNum: number;
  status: 'open' | 'closed' | 'cancelled';
  strategy: string;
};

export type Asset = {
  name: string;
  symbol: string;
  value: number;
  amount: number;
  price: number;
  change24h: number;
  color: string;
  allocation: number;
};

export type TradeHistory = {
  id: string;
  date: string;
  pair: string;
  type: 'BUY' | 'SELL';
  entry: number;
  exit: number;
  size: number;
  pnl: number;
  pnlPct: number;
  duration: string;
  strategy: string;
  status: 'profit' | 'loss';
};

export const portfolioStats = {
  totalValue: 28_450.72,
  totalDeposited: 20_000,
  totalPnl: 8_450.72,
  totalPnlPct: 42.25,
  dailyPnl: 342.18,
  dailyPnlPct: 1.22,
  winRate: 78.4,
  totalTrades: 1_847,
  activeBots: 4,
};

export const assets: Asset[] = [
  { name: 'Bitcoin', symbol: 'BTC', value: 11_980.30, amount: 0.268, price: 44_703, change24h: 2.14, color: '#F7931A', allocation: 42 },
  { name: 'Ethereum', symbol: 'ETH', value: 7_966.20, amount: 3.44, price: 2_316, change24h: -0.87, color: '#627EEA', allocation: 28 },
  { name: 'Solana', symbol: 'SOL', value: 4_267.60, amount: 28.7, price: 148.7, change24h: 4.31, color: '#9945FF', allocation: 15 },
  { name: 'BNB', symbol: 'BNB', value: 2_845.07, amount: 6.9, price: 412.3, change24h: 1.05, color: '#F0B90B', allocation: 10 },
  { name: 'USDC', symbol: 'USDC', value: 1_391.55, amount: 1_391.55, price: 1.00, change24h: 0.00, color: '#2775CA', allocation: 5 },
];

export const pnlData = [
  { month: 'Jan', profit: 4.2, loss: -1.1 },
  { month: 'Feb', profit: 6.8, loss: -0.9 },
  { month: 'Mar', profit: 5.4, loss: -1.8 },
  { month: 'Apr', profit: 8.9, loss: -0.6 },
  { month: 'May', profit: 7.2, loss: -1.3 },
  { month: 'Jun', profit: 11.4, loss: -0.8 },
  { month: 'Jul', profit: 9.6, loss: -1.5 },
  { month: 'Aug', profit: 13.2, loss: -0.7 },
  { month: 'Sep', profit: 10.8, loss: -1.2 },
  { month: 'Oct', profit: 15.4, loss: -0.5 },
  { month: 'Nov', profit: 12.9, loss: -1.1 },
  { month: 'Dec', profit: 18.7, loss: -0.4 },
];

export const equityCurve = [
  { date: 'Jan 1', value: 0 },
  { date: 'Jan 15', value: 0 },
  { date: 'Feb 1', value: 0 },
  { date: 'Feb 15', value: 0 },
  { date: 'Mar 1', value: 0 },
  { date: 'Mar 15', value: 0 },
  { date: 'Apr 1', value: 0 },
  { date: 'Apr 15', value: 0 },
  { date: 'May 1', value: 0 },
  { date: 'May 15', value: 0 },
  { date: 'Jun 1', value: 0 },
  { date: 'Jun 15', value: 0 },
];

export const signals: Signal[] = [
  { id: 's1', time: '14:22', pair: 'BTC/USDT', signal: 'BUY', price: 44100, target: 45800, stopLoss: 43200, confidence: 92, pnl: '+$1,240', pnlNum: 1240, status: 'open', strategy: 'Momentum AI' },
  { id: 's2', time: '13:45', pair: 'BNB/USDT', signal: 'BUY', price: 412, target: 428, stopLoss: 404, confidence: 87, pnl: '+$156', pnlNum: 156, status: 'open', strategy: 'Trend Follow' },
  { id: 's3', time: '11:58', pair: 'SOL/USDT', signal: 'SELL', price: 148.50, target: 142, stopLoss: 152, confidence: 84, pnl: '+$234', pnlNum: 234, status: 'closed', strategy: 'Mean Revert' },
  { id: 's4', time: '10:32', pair: 'ETH/USDT', signal: 'BUY', price: 2315, target: 2480, stopLoss: 2260, confidence: 89, pnl: '+$421', pnlNum: 421, status: 'closed', strategy: 'Breakout AI' },
  { id: 's5', time: '09:14', pair: 'BTC/USDT', signal: 'BUY', price: 43250, target: 44900, stopLoss: 42600, confidence: 91, pnl: '+$842', pnlNum: 842, status: 'closed', strategy: 'Momentum AI' },
  { id: 's6', time: '08:05', pair: 'ETH/USDT', signal: 'SELL', price: 2380, target: 2280, stopLoss: 2420, confidence: 79, pnl: '-$88', pnlNum: -88, status: 'closed', strategy: 'Sentiment AI' },
  { id: 's7', time: '07:33', pair: 'SOL/USDT', signal: 'BUY', price: 144.20, target: 152, stopLoss: 140, confidence: 85, pnl: '+$312', pnlNum: 312, status: 'closed', strategy: 'Breakout AI' },
  { id: 's8', time: '06:47', pair: 'BNB/USDT', signal: 'SELL', price: 418, target: 408, stopLoss: 423, confidence: 76, pnl: '+$98', pnlNum: 98, status: 'closed', strategy: 'Mean Revert' },
];

/** @deprecated Trades are loaded from Firestore `users/{uid}/history` in the app. */
export const tradeHistory: TradeHistory[] = [];

export const depositAddresses = {
  BTC: '1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf3',
  USDT: 'TN3W4H6rK2ce4vX9YnFQHwKx8Kj3yZ4mP',
  USDC: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
};
