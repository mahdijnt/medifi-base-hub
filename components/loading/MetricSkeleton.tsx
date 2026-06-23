import { cn } from "@/lib/utils";

const cardOuterClass = cn(
  "relative rounded-xl p-px",
  "bg-gradient-to-br from-black/10 via-black/5 to-black/[0.03]",
  "dark:from-white/20 dark:via-white/10 dark:to-white/5",
);

const cardInnerClass = cn(
  "relative flex h-full flex-col rounded-[11px] p-5",
  "border border-black/[0.08] bg-black/[0.04] backdrop-blur-[12px]",
  "dark:border-white/15 dark:bg-white/[0.08]",
  "shadow-sm",
);

const shimmerBarClass =
  "skeleton-shimmer rounded-md bg-foreground/[0.06] dark:bg-foreground/[0.08]";

type MetricSkeletonProps = {
  className?: string;
};

export function MetricSkeleton({ className }: MetricSkeletonProps) {
  return (
    <article
      className={cn(cardOuterClass, className)}
      aria-hidden="true"
    >
      <div className={cardInnerClass}>
        <div
          className="pointer-events-none absolute inset-0 rounded-[11px] bg-[radial-gradient(ellipse_at_top_right,var(--glow),transparent_60%)] opacity-40"
          aria-hidden="true"
        />

        <div className="relative flex flex-1 flex-col">
          <div className={cn(shimmerBarClass, "h-4 w-28")} />
          <div className={cn(shimmerBarClass, "mt-2 h-9 w-24")} />
        </div>
      </div>
    </article>
  );
}

export function WalletBreakdownSkeleton({ className }: MetricSkeletonProps) {
  return (
    <article
      className={cn(cardOuterClass, className)}
      aria-hidden="true"
    >
      <div className={cardInnerClass}>
        <div
          className="pointer-events-none absolute inset-0 rounded-[11px] bg-[radial-gradient(ellipse_at_top_right,var(--glow),transparent_60%)] opacity-40"
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
