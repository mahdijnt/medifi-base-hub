"use client";

import { CombinedSummarySkeleton } from "@/components/loading/CombinedSummarySkeleton";
import { FadeIn } from "@/components/ui/fade-in";
import type { CombinedBuilderMetrics } from "@/lib/types/analytics";
import { cn } from "@/lib/utils";
import { getAccentLabelClass } from "@/utils/color/autoTextColor";
import { CombinedTotalsCard } from "./combined-totals-card";
import { WalletBreakdownCard } from "./wallet-breakdown-card";

const STAGGER_MS = 80;

type CombinedAnalyticsSummaryProps = {
  combined: CombinedBuilderMetrics | null;
  loading: boolean;
  error: string | null;
  walletCount: number;
};

function CombinedErrorCard({ message }: { message: string }) {
  return (
    <FadeIn>
      <div
        role="alert"
        className={cn(
          "rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3",
          "text-sm text-red-700 dark:text-red-400",
        )}
      >
        {message}
      </div>
    </FadeIn>
  );
}

function CombinedEmptyState() {
  return (
    <FadeIn>
      <p
        className={cn(
          "rounded-xl border border-[var(--accent-blue)]/18 bg-[var(--accent-blue)]/[0.05] px-4 py-6 text-center text-sm backdrop-blur-sm",
          "text-slate-700 dark:text-slate-300",
        )}
      >
        No analytics available.
      </p>
    </FadeIn>
  );
}

export function CombinedAnalyticsSummary({
  combined,
  loading,
  error,
  walletCount,
}: CombinedAnalyticsSummaryProps) {
  if (loading) {
    return (
      <CombinedSummarySkeleton breakdownCount={walletCount || 3} />
    );
  }

  if (error) {
    return <CombinedErrorCard message={error} />;
  }

  if (!combined || combined.perWallet.length === 0) {
    return <CombinedEmptyState />;
  }

  return (
    <div className="space-y-8">
      <CombinedTotalsCard totals={combined.totals} />

      <div className="space-y-4">
        <FadeIn delay={STAGGER_MS * 2}>
          <h3
            className={cn(
              "text-sm font-medium uppercase tracking-wider",
              getAccentLabelClass("secondary"),
            )}
          >
            Per-Wallet Breakdown
          </h3>
        </FadeIn>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {combined.perWallet.map((wallet, index) => (
            <FadeIn key={wallet.id} delay={STAGGER_MS * 2 + index * STAGGER_MS}>
              <WalletBreakdownCard wallet={wallet} />
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
