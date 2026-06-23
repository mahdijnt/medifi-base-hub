"use client";

import { FadeIn } from "@/components/ui/fade-in";
import { MetricSkeleton, StatusMessage } from "@/components/loading";
import { getAccentLabelClass } from "@/utils/color/autoTextColor";
import { MetricCard } from "./metric-card";

const STAGGER_MS = 80;

export type TransactionMetrics = {
  total: number;
  firstTx: Date | null;
  lastTx: Date | null;
  loading?: boolean;
  error?: string;
};

export type TransactionsState = {
  main?: TransactionMetrics;
  farcaster?: TransactionMetrics;
  baseapp?: TransactionMetrics;
};

type TransactionWalletKey = keyof TransactionsState;

const WALLET_ORDER: TransactionWalletKey[] = ["main", "farcaster", "baseapp"];

const WALLET_LABELS: Record<TransactionWalletKey, string> = {
  main: "Main Base Wallet",
  farcaster: "Farcaster Wallet",
  baseapp: "Base App Wallet",
};

type TransactionMetricsSectionProps = {
  transactions: TransactionsState;
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

function isEmptyMetrics(metrics: TransactionMetrics): boolean {
  return metrics.total === 0 && metrics.firstTx === null && metrics.lastTx === null;
}

type WalletTransactionCardProps = {
  walletKey: TransactionWalletKey;
  metrics: TransactionMetrics;
};

function WalletTransactionCard({ walletKey, metrics }: WalletTransactionCardProps) {
  const label = WALLET_LABELS[walletKey];

  if (metrics.loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          {label}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <MetricSkeleton key={`${walletKey}-skeleton-${index}`} />
          ))}
        </div>
      </div>
    );
  }

  if (metrics.error) {
    return (
      <div className="space-y-3">
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          {label}
        </h3>
        <p
          role="alert"
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400"
        >
          {metrics.error}
        </p>
      </div>
    );
  }

  if (isEmptyMetrics(metrics)) {
    return (
      <div className="space-y-3">
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          {label}
        </h3>
        <p className="rounded-lg border border-border bg-surface/40 px-4 py-3 text-sm text-muted">
          No transactions found
        </p>
      </div>
    );
  }

  const cards = [
    {
      label: "Total Transactions",
      value: metrics.total.toLocaleString("en-US"),
    },
    {
      label: "First Transaction Date",
      value: formatTransactionDate(metrics.firstTx),
    },
    {
      label: "Last Transaction Date",
      value: formatTransactionDate(metrics.lastTx),
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold tracking-tight text-foreground">
        {label}
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <MetricCard key={card.label} label={card.label} value={card.value} />
        ))}
      </div>
    </div>
  );
}

export function TransactionMetricsSection({
  transactions,
}: TransactionMetricsSectionProps) {
  const activeWallets = WALLET_ORDER.filter((key) => transactions[key] !== undefined);
  const anyLoading = activeWallets.some(
    (key) => transactions[key]?.loading === true,
  );

  if (activeWallets.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="transaction-metrics-heading" className="space-y-6">
      <FadeIn>
        <div className="flex items-center gap-3">
          <span
            className="inline-flex size-8 items-center justify-center rounded-lg border border-[var(--accent-teal)]/22 bg-[var(--accent-teal)]/8 font-mono text-[10px] font-medium text-teal-800 shadow-sm shadow-[var(--glow-teal-soft)] dark:text-teal-200"
            aria-hidden="true"
          >
            TX
          </span>
          <p className={`text-xs font-medium uppercase tracking-widest ${getAccentLabelClass("secondary")}`}>
            Transaction Analytics
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={STAGGER_MS}>
        <h2
          id="transaction-metrics-heading"
          className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        >
          Per-Wallet Transactions
        </h2>
      </FadeIn>

      {anyLoading ? (
        <div role="status" aria-live="polite" aria-busy="true">
          <StatusMessage message="Analyzing transactions..." active />
        </div>
      ) : null}

      <div className="space-y-8">
        {activeWallets.map((walletKey, index) => {
          const metrics = transactions[walletKey];
          if (!metrics) {
            return null;
          }

          return (
            <FadeIn key={walletKey} delay={STAGGER_MS * 2 + index * STAGGER_MS}>
              <WalletTransactionCard walletKey={walletKey} metrics={metrics} />
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
