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

export type NftCollection = {
  name: string;
  contractAddress?: string;
  count: number;
  marketplaceUrl?: string;
};

export type NftItem = {
  contractAddress: string;
  tokenId: string;
  name: string;
  imageUrl?: string;
  collectionName: string;
  marketplaceUrl: string;
};

export type NftAnalytics = {
  total: number;
  collections: NftCollection[];
  items?: NftItem[];
};

export type NftAnalyticsResult = { data: NftAnalytics } | { error: string };

export type DeployedContract = {
  address: string;
  deployedAt: Date;
  transactionHash?: string;
};

export type ContractDeploymentAnalytics = {
  total: number;
  contracts: DeployedContract[];
};

export type ContractDeploymentAnalyticsResult =
  | { data: ContractDeploymentAnalytics }
  | { error: string };

export type CombinedBuilderTotals = {
  transactions: number;
  nfts: number;
  contracts: number;
};

export type WalletMetricsBreakdown = {
  id: string;
  name: string;
  transactions: number;
  nfts: number;
  contracts: number;
  errors?: string[];
};

export type CombinedBuilderMetrics = {
  totals: CombinedBuilderTotals;
  perWallet: WalletMetricsBreakdown[];
};

export type CombinedBuilderMetricsResult =
  | { data: CombinedBuilderMetrics }
  | { error: string };

export type GithubMetrics = {
  totalCommits: number;
  publicRepoCount: number;
  web3RepoCount: number;
};

export type GithubMetricsResult = { data: GithubMetrics } | { error: string };
