import { cn } from "@/lib/utils";
import { dashPrimaryBorder, dashPrimaryGlow, dashPrimarySurface } from "@/components/dashboard/glass-styles";

const shimmerBarClass =
  "skeleton-shimmer rounded-md bg-foreground/[0.07] dark:bg-foreground/[0.09]";

type MetricSkeletonProps = {
  className?: string;
};

export function MetricSkeleton({ className }: MetricSkeletonProps) {
  return (
    <article
      className={cn(dashPrimaryBorder, "relative rounded-xl p-px", className)}
      aria-hidden="true"
    >
      <div className={cn(dashPrimarySurface, "relative flex h-full flex-col rounded-[11px] p-5")}>
        <div
          className={cn(dashPrimaryGlow, "opacity-30")}
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
      className={cn(dashPrimaryBorder, "relative rounded-xl p-px", className)}
      aria-hidden="true"
    >
      <div className={cn(dashPrimarySurface, "relative flex h-full flex-col rounded-[11px] p-5")}>
        <div
          className={cn(dashPrimaryGlow, "opacity-30")}
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
