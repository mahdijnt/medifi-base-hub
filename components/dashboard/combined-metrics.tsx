"use client";

import { useEffect, useState } from "react";
import { CombinedAnalyticsSummary } from "@/components/dashboard/combined-analytics-summary";
import { StatusMessage } from "@/components/loading";
import { FadeIn } from "@/components/ui/fade-in";
import type { CombinedBuilderMetrics } from "@/lib/types/analytics";
import { getAccentLabelClass } from "@/utils/color/autoTextColor";

const STAGGER_MS = 80;

const ANALYTICS_STATUS_MESSAGES = [
  "Analyzing transactions...",
  "Analyzing NFTs...",
  "Analyzing contracts...",
] as const;

const STATUS_REVEAL_MS = 180;

type CombinedMetricsProps = {
  metrics: CombinedBuilderMetrics | null;
  loading: boolean;
  error: string | null;
  walletCount: number;
};

export function CombinedMetrics({
  metrics,
  loading,
  error,
  walletCount,
}: CombinedMetricsProps) {
  const [revealedStatusCount, setRevealedStatusCount] = useState(0);

  useEffect(() => {
    if (!loading) {
      setRevealedStatusCount(0);
      return;
    }

    setRevealedStatusCount(1);

    const timers = ANALYTICS_STATUS_MESSAGES.slice(1).map((_, index) =>
      window.setTimeout(
        () => setRevealedStatusCount(index + 2),
        (index + 1) * STATUS_REVEAL_MS,
      ),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [loading]);

  return (
    <section aria-labelledby="combined-metrics-heading" className="space-y-6">
      <FadeIn>
        <div className="flex items-center gap-3">
          <span
            className="inline-flex size-8 items-center justify-center rounded-lg border border-[var(--accent-blue)]/22 bg-[var(--accent-blue)]/8 font-mono text-[10px] font-medium text-blue-800 shadow-sm shadow-[var(--glow-blue-soft)] dark:text-blue-200"
            aria-hidden="true"
          >
            CM
          </span>
          <p
            className={`text-xs font-medium uppercase tracking-widest ${getAccentLabelClass("primary")}`}
          >
            Combined Metrics
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={STAGGER_MS}>
        <h2
          id="combined-metrics-heading"
          className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        >
          Builder Command Center
        </h2>
      </FadeIn>

      {loading ? (
        <div
          className="space-y-1.5 py-1"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          {ANALYTICS_STATUS_MESSAGES.map((message, index) => (
            <StatusMessage
              key={message}
              message={message}
              active={index < revealedStatusCount}
            />
          ))}
        </div>
      ) : null}

      <CombinedAnalyticsSummary
        combined={metrics}
        loading={loading}
        error={error}
        walletCount={walletCount}
      />
    </section>
  );
}
