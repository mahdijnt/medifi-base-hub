import { FadeIn } from "@/components/ui/fade-in";
import type { TransactionAnalytics } from "@/lib/types/analytics";
import { MetricCard } from "./metric-card";

const STAGGER_MS = 120;

type MetricsGridProps = {
  analytics: TransactionAnalytics | null;
  loading: boolean;
  error: string | null;
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

export function MetricsGrid({ analytics, loading, error }: MetricsGridProps) {
  const metrics = [
    {
      label: "Total Transactions",
      value: formatTotal(analytics?.total ?? null, loading),
    },
    {
      label: "First Transaction Date",
      value: loading
        ? "Loading..."
        : formatTransactionDate(analytics?.firstTx ?? null),
    },
    {
      label: "Last Transaction Date",
      value: loading
        ? "Loading..."
        : formatTransactionDate(analytics?.lastTx ?? null),
    },
  ];

  return (
    <div className="space-y-4">
      <FadeIn delay={STAGGER_MS * 4} duration={500}>
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted">
          Metrics
        </h2>
      </FadeIn>

      {error ? (
        <FadeIn delay={STAGGER_MS * 4} duration={500}>
          <p
            role="alert"
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        </FadeIn>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric, index) => (
          <FadeIn
            key={metric.label}
            delay={STAGGER_MS * 5 + index * STAGGER_MS}
            duration={500}
          >
            <MetricCard
              label={metric.label}
              value={metric.value}
              loading={loading}
            />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
