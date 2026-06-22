import { FadeIn } from "@/components/ui/fade-in";
import type { CombinedBuilderTotals } from "@/lib/types/analytics";
import { MetricCard } from "./metric-card";

const STAGGER_MS = 120;

type CombinedSummaryProps = {
  totals: CombinedBuilderTotals | null;
  loading: boolean;
};

function formatTotal(total: number | null, loading: boolean): string {
  if (loading) {
    return "Loading...";
  }

  if (total === null) {
    return "--";
  }

  return total.toLocaleString("en-US");
}

export function CombinedSummary({ totals, loading }: CombinedSummaryProps) {
  const metrics = [
    {
      label: "Total Transactions",
      value: formatTotal(totals?.transactions ?? null, loading),
    },
    {
      label: "Total NFTs",
      value: formatTotal(totals?.nfts ?? null, loading),
    },
    {
      label: "Total Contracts",
      value: formatTotal(totals?.contracts ?? null, loading),
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
          <MetricCard
            label={metric.label}
            value={metric.value}
            loading={loading}
          />
        </FadeIn>
      ))}
    </div>
  );
}
