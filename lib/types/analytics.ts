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

export type TransactionAnalytics = {
  total: number;
  firstTx: Date | null;
  lastTx: Date | null;
};

export type TransactionAnalyticsResult =
  | { data: TransactionAnalytics }
  | { error: string };

export type NftAnalytics = {
  total: number;
  collections: string[];
};

export type NftAnalyticsResult = { data: NftAnalytics } | { error: string };
