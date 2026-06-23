import { cn } from "@/lib/utils";
import { dashPrimaryBorder, dashPrimarySurface } from "@/components/dashboard/glass-styles";

const shimmerBarClass =
  "nft-skeleton-shimmer rounded-md bg-[var(--accent-blue)]/10 dark:bg-[var(--accent-cyan)]/12";

type CombinedSummarySkeletonProps = {
  breakdownCount?: number;
  className?: string;
};

function BreakdownCardSkeleton() {
  return (
    <article className={cn(dashPrimaryBorder, "relative rounded-xl p-px")} aria-hidden="true">
      <div className={cn(dashPrimarySurface, "relative flex h-full flex-col rounded-[11px] p-5")}>
        <div
          className="pointer-events-none absolute inset-0 rounded-[11px] bg-[radial-gradient(ellipse_at_top_right,var(--glow-blue-soft),transparent_60%)] opacity-40"
          aria-hidden="true"
        />

        <div className="relative flex flex-1 flex-col gap-4">
          <div className={cn(shimmerBarClass, "h-5 w-32")} />

          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index}>
                <div className={cn(shimmerBarClass, "h-3 w-16")} />
                <div className={cn(shimmerBarClass, "mt-1 h-6 w-12")} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export function CombinedSummarySkeleton({
  breakdownCount = 3,
  className,
}: CombinedSummarySkeletonProps) {
  return (
    <div className={cn("space-y-8", className)} aria-busy="true" aria-label="Loading combined analytics">
      <article className={cn(dashPrimaryBorder, "relative rounded-2xl p-px")} aria-hidden="true">
        <div className={cn(dashPrimarySurface, "relative rounded-[15px] p-6 sm:p-8")}>
          <div
            className="pointer-events-none absolute inset-0 rounded-[15px] bg-[radial-gradient(ellipse_at_top_left,var(--glow-blue-soft),transparent_55%)] opacity-50"
            aria-hidden="true"
          />

          <div className="relative space-y-6">
            <div className={cn(shimmerBarClass, "h-4 w-40")} />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className={cn(shimmerBarClass, "h-3 w-28")} />
                  <div className={cn(shimmerBarClass, "h-10 w-24")} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>

      <div className="space-y-4">
        <div className={cn(shimmerBarClass, "h-4 w-44")} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: breakdownCount }).map((_, index) => (
            <BreakdownCardSkeleton key={`breakdown-skeleton-${index}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
