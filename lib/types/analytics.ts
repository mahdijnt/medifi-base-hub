/** Placeholder shape for aggregated wallet data from Alchemy. */
export interface WalletData {
  address: string;
  balance?: string;
  tokenCount?: number;
}

/** Placeholder shape for an onchain transaction from BaseScan. */
export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp?: number;
  blockNumber?: number;
}
