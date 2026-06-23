import { FadeIn } from "@/components/ui/fade-in";
import { MetricSkeleton } from "@/components/loading";
import type { CombinedBuilderTotals } from "@/lib/types/analytics";
import { MetricCard } from "./metric-card";

const STAGGER_MS = 120;

type CombinedSummaryProps = {
  totals: CombinedBuilderTotals | null;
  loading: boolean;
};

function formatTotal(total: number | null): string {
  if (total === null) {
    return "--";
  }

  return total.toLocaleString("en-US");
}

const METRIC_LABELS = [
  "Total Transactions",
  "Total NFTs",
  "Total Contracts",
] as const;

export function CombinedSummary({ totals, loading }: CombinedSummaryProps) {
  if (loading) {
    return (
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        aria-busy="true"
        aria-label="Loading combined metrics"
      >
        {METRIC_LABELS.map((label) => (
          <MetricSkeleton key={label} />
        ))}
      </div>
    );
  }

  const metrics = [
    {
      label: METRIC_LABELS[0],
      value: formatTotal(totals?.transactions ?? null),
    },
    {
      label: METRIC_LABELS[1],
      value: formatTotal(totals?.nfts ?? null),
    },
    {
      label: METRIC_LABELS[2],
      value: formatTotal(totals?.contracts ?? null),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric, index) => (
        <FadeIn
          key={metric.label}
          delay={STAGGER_MS * 2 + index * STAGGER_MS}
          duration={500}
        >
          <MetricCard label={metric.label} value={metric.value} />
        </FadeIn>
      ))}
    </div>
  );
}
