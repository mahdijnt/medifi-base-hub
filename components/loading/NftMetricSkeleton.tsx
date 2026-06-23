import { cn } from "@/lib/utils";
import { dashPrimaryBorder, dashPrimaryGlow, dashPrimarySurface } from "@/components/dashboard/glass-styles";

const shimmerBarClass =
  "nft-skeleton-shimmer rounded-md bg-[var(--accent-blue)]/10 dark:bg-[var(--accent-cyan)]/12";

type NftMetricSkeletonProps = {
  className?: string;
};

export function NftMetricSkeleton({ className }: NftMetricSkeletonProps) {
  return (
    <article
      className={cn(dashPrimaryBorder, "relative rounded-xl p-px", className)}
      aria-hidden="true"
    >
      <div className={cn(dashPrimarySurface, "relative flex h-full flex-col rounded-[11px] p-5")}>
        <div
          className={cn(dashPrimaryGlow, "opacity-40")}
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

export function NftCollectionSkeleton({ className }: NftMetricSkeletonProps) {
  return (
    <div
      className={cn("grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4", className)}
      aria-hidden="true"
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-9 rounded-lg border border-[var(--accent-teal)]/14 bg-[var(--accent-teal)]/[0.05] backdrop-blur-sm",
            shimmerBarClass,
          )}
        />
      ))}
    </div>
  );
}
