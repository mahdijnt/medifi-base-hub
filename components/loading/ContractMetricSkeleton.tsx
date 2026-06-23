import { cn } from "@/lib/utils";
import { dashPrimaryBorder, dashPrimaryGlow, dashPrimarySurface } from "@/components/dashboard/glass-styles";

const shimmerBarClass =
  "nft-skeleton-shimmer rounded-md bg-[var(--accent-blue)]/10 dark:bg-[var(--accent-cyan)]/12";

type ContractMetricSkeletonProps = {
  className?: string;
};

export function ContractMetricSkeleton({
  className,
}: ContractMetricSkeletonProps) {
  return (
    <article className={cn(dashPrimaryBorder, "relative rounded-xl p-px", className)} aria-hidden="true">
      <div className={cn(dashPrimarySurface, "relative flex h-full flex-col rounded-[11px] p-5")}>
        <div
          className={cn(dashPrimaryGlow, "opacity-40")}
          aria-hidden="true"
        />

        <div className="relative flex flex-1 flex-col">
          <div className={cn(shimmerBarClass, "h-4 w-36")} />
          <div className={cn(shimmerBarClass, "mt-2 h-9 w-16")} />
        </div>
      </div>
    </article>
  );
}

export function ContractListSkeleton({
  className,
}: ContractMetricSkeletonProps) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden="true">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "flex h-12 items-center rounded-lg border border-[var(--accent-blue)]/14 bg-[var(--accent-blue)]/[0.05] px-3 backdrop-blur-sm",
            shimmerBarClass,
          )}
        />
      ))}
    </div>
  );
}
