import { alchemyRequest } from "@/lib/api/alchemy";
import { hasAlchemyApiKey } from "@/lib/env";
import type {
  TransactionAnalytics,
  TransactionAnalyticsResult,
} from "@/lib/types/analytics";

const TRANSFER_CATEGORIES = [
  "external",
  "internal",
  "erc20",
  "erc721",
  "erc1155",
] as const;

const MAX_COUNT_HEX = "0x3e8";

type AssetTransfer = {
  hash: string;
  metadata?: {
    blockTimestamp?: string;
  };
};

type AssetTransfersResponse = {
  transfers: AssetTransfer[];
  pageKey?: string;
};

type AssetTransfersParams = {
  fromBlock: string;
  toBlock: string;
  category: readonly string[];
  withMetadata: boolean;
  excludeZeroValue: boolean;
  maxCount: string;
  fromAddress?: string;
  toAddress?: string;
  pageKey?: string;
};

async function fetchAllAssetTransfers(
  direction: Pick<AssetTransfersParams, "fromAddress" | "toAddress">,
): Promise<AssetTransfer[]> {
  const transfers: AssetTransfer[] = [];
  let pageKey: string | undefined;

  do {
    const params: AssetTransfersParams = {
      fromBlock: "0x0",
      toBlock: "latest",
      category: TRANSFER_CATEGORIES,
      withMetadata: true,
      excludeZeroValue: false,
      maxCount: MAX_COUNT_HEX,
      ...direction,
      ...(pageKey ? { pageKey } : {}),
    };

    const page = await alchemyRequest<AssetTransfersResponse>(
      "alchemy_getAssetTransfers",
      [params],
    );

    transfers.push(...(page.transfers ?? []));
    pageKey = page.pageKey;
  } while (pageKey);

  return transfers;
}

function mergeUniqueTransactions(
  transfers: AssetTransfer[],
): Map<string, Date> {
  const byHash = new Map<string, Date>();

  for (const transfer of transfers) {
    const hash = transfer.hash?.toLowerCase();
    const timestamp = transfer.metadata?.blockTimestamp;

    if (!hash || !timestamp) {
      continue;
    }

    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      continue;
    }

    const existing = byHash.get(hash);
    if (!existing || date < existing) {
      byHash.set(hash, date);
    }
  }

  return byHash;
}

function computeAnalytics(transactions: Map<string, Date>): TransactionAnalytics {
  if (transactions.size === 0) {
    return { total: 0, firstTx: null, lastTx: null };
  }

  let firstTx: Date | null = null;
  let lastTx: Date | null = null;

  for (const date of transactions.values()) {
    if (!firstTx || date < firstTx) {
      firstTx = date;
    }
    if (!lastTx || date > lastTx) {
      lastTx = date;
    }
  }

  return {
    total: transactions.size,
    firstTx,
    lastTx,
  };
}

/**
 * Fetches full onchain transfer history for a wallet and derives transaction analytics.
 */
export async function getTransactionAnalytics(
  address: string,
): Promise<TransactionAnalyticsResult> {
  const normalizedAddress = address.trim();

  if (!normalizedAddress) {
    return { error: "Wallet address is required." };
  }

  if (!hasAlchemyApiKey()) {
    return {
      error:
        'Missing NEXT_PUBLIC_ALCHEMY_API_KEY. Add it to .env.local to load transaction analytics.',
    };
  }

  try {
    const [outgoing, incoming] = await Promise.all([
      fetchAllAssetTransfers({ fromAddress: normalizedAddress }),
      fetchAllAssetTransfers({ toAddress: normalizedAddress }),
    ]);

    const uniqueTransactions = mergeUniqueTransactions([
      ...outgoing,
      ...incoming,
    ]);

    return { data: computeAnalytics(uniqueTransactions) };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch transaction analytics.";

    return { error: message };
  }
}
