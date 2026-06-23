import { FadeIn } from "@/components/ui/fade-in";
import type { CombinedBuilderTotals } from "@/lib/types/analytics";
import { cn } from "@/lib/utils";
import { getContrastTextClass } from "@/utils/color/autoTextColor";
import {
  dashContrastScrim,
  dashPrimaryBorder,
  dashPrimarySurface,
} from "./glass-styles";

const STAGGER_MS = 80;

type CombinedTotalsCardProps = {
  totals: CombinedBuilderTotals;
};

function formatTotal(total: number): string {
  return total.toLocaleString("en-US");
}

const METRICS = [
  { key: "transactions" as const, label: "Combined Transactions" },
  { key: "nfts" as const, label: "Combined NFTs" },
  { key: "contracts" as const, label: "Combined Contracts" },
];

export function CombinedTotalsCard({ totals }: CombinedTotalsCardProps) {
  return (
    <FadeIn>
      <article className={cn("group relative rounded-2xl p-px", dashPrimaryBorder)}>
        <div
          className={cn(
            "relative overflow-hidden rounded-[15px]",
            dashPrimarySurface,
            "backdrop-blur-[16px]",
            "transition-shadow duration-300",
            "group-hover:shadow-[0_0_28px_-10px_var(--glow-blue-soft)]",
            "sm:group-hover:shadow-[0_0_36px_-10px_var(--glow-blue-soft)]",
          )}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--glow-blue-soft),transparent_55%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[var(--accent-cyan)]/8 blur-3xl sm:bg-[var(--accent-cyan)]/10"
            aria-hidden="true"
          />
          <div className={cn(dashContrastScrim, "rounded-[15px]")} aria-hidden="true" />

          <div className="relative p-6 sm:p-8">
            <p
              className={cn(
                "text-xs font-medium uppercase tracking-widest",
                getContrastTextClass("glow-blue", "badge"),
              )}
            >
              Portfolio Totals
            </p>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {METRICS.map((metric, index) => (
                <FadeIn key={metric.key} delay={STAGGER_MS + index * STAGGER_MS}>
                  <div className="space-y-1">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        getContrastTextClass("glow-blue", "label"),
                      )}
                    >
                      {metric.label}
                    </p>
                    <p
                      className={cn(
                        "font-mono text-3xl font-semibold tracking-tight sm:text-4xl",
                        getContrastTextClass("glow-blue", "value"),
                      )}
                    >
                      {formatTotal(totals[metric.key])}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </article>
    </FadeIn>
  );
}
