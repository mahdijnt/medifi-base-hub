import { FadeIn } from "@/components/ui/fade-in";
import type {
  ContractDeploymentAnalytics,
  NftAnalytics,
  TransactionAnalytics,
} from "@/lib/types/analytics";
import { MetricCard } from "./metric-card";

const STAGGER_MS = 120;
const MAX_VISIBLE_COLLECTIONS = 3;

type MetricsGridProps = {
  transactionAnalytics: TransactionAnalytics | null;
  nftAnalytics: NftAnalytics | null;
  contractAnalytics: ContractDeploymentAnalytics | null;
  txLoading: boolean;
  nftLoading: boolean;
  contractLoading: boolean;
  txError: string | null;
  nftError: string | null;
  contractError: string | null;
};

function formatTransactionDate(date: Date | null): string {
  if (!date) {
    return "—";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTotal(total: number | null, loading: boolean): string {
  if (loading) {
    return "Loading...";
  }

  if (total === null) {
    return "--";
  }

  return total.toLocaleString("en-US");
}

function formatCollections(
  collections: string[] | null,
  loading: boolean,
): string {
  if (loading) {
    return "Loading...";
  }

  if (!collections || collections.length === 0) {
    return "—";
  }

  if (collections.length <= MAX_VISIBLE_COLLECTIONS) {
    return collections.join(", ");
  }

  const visible = collections.slice(0, MAX_VISIBLE_COLLECTIONS).join(", ");
  const remaining = collections.length - MAX_VISIBLE_COLLECTIONS;
  return `${visible} +${remaining} more`;
}

export function MetricsGrid({
  transactionAnalytics,
  nftAnalytics,
  contractAnalytics,
  txLoading,
  nftLoading,
  contractLoading,
  txError,
  nftError,
  contractError,
}: MetricsGridProps) {
  const metrics = [
    {
      label: "Total Transactions",
      value: formatTotal(transactionAnalytics?.total ?? null, txLoading),
      loading: txLoading,
    },
    {
      label: "First Transaction Date",
      value: txLoading
        ? "Loading..."
        : formatTransactionDate(transactionAnalytics?.firstTx ?? null),
      loading: txLoading,
    },
    {
      label: "Last Transaction Date",
      value: txLoading
        ? "Loading..."
        : formatTransactionDate(transactionAnalytics?.lastTx ?? null),
      loading: txLoading,
    },
    {
      label: "NFT Count",
      value: formatTotal(nftAnalytics?.total ?? null, nftLoading),
      loading: nftLoading,
      compactValue: false,
    },
    {
      label: "NFT Collections",
      value: formatCollections(nftAnalytics?.collections ?? null, nftLoading),
      loading: nftLoading,
      compactValue: true,
    },
    {
      label: "Contracts Deployed",
      value: formatTotal(contractAnalytics?.total ?? null, contractLoading),
      loading: contractLoading,
    },
  ];

  const errors = [
    txError ? { label: "Transaction analytics", message: txError } : null,
    nftError ? { label: "NFT analytics", message: nftError } : null,
    contractError
      ? { label: "Contract analytics", message: contractError }
      : null,
  ].filter((entry): entry is { label: string; message: string } => entry !== null);

  return (
    <div className="space-y-4">
      <FadeIn delay={STAGGER_MS * 4} duration={500}>
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted">
          Metrics
        </h2>
      </FadeIn>

      {errors.length > 0 ? (
        <div className="space-y-3">
          {errors.map((entry) => (
            <FadeIn key={entry.label} delay={STAGGER_MS * 4} duration={500}>
              <p
                role="alert"
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
              >
                <span className="font-medium">{entry.label}:</span>{" "}
                {entry.message}
              </p>
            </FadeIn>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {metrics.map((metric, index) => (
          <FadeIn
            key={metric.label}
            delay={STAGGER_MS * 5 + index * STAGGER_MS}
            duration={500}
          >
            <MetricCard
              label={metric.label}
              value={metric.value}
              loading={metric.loading}
              compactValue={metric.compactValue}
            />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
