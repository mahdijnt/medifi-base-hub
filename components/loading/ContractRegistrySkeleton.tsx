import { cn } from "@/lib/utils";

const shimmerBarClass =
  "nft-skeleton-shimmer rounded-md bg-[var(--accent-blue)]/10 dark:bg-[var(--accent-cyan)]/12";

type ContractRegistrySkeletonProps = {
  className?: string;
  count?: number;
};

function ContractCardSkeleton() {
  return (
    <article
      className={cn(
        "rounded-xl border border-[var(--accent-blue)]/14 bg-[var(--accent-blue)]/[0.05] p-5 backdrop-blur-sm",
        shimmerBarClass,
      )}
      aria-hidden="true"
    >
      <div className="space-y-3">
        <div className={cn(shimmerBarClass, "h-5 w-2/3")} />
        <div className={cn(shimmerBarClass, "h-4 w-1/3")} />
        <div className={cn(shimmerBarClass, "h-12 w-full")} />
        <div className="flex justify-between gap-3 pt-1">
          <div className={cn(shimmerBarClass, "h-3 w-24")} />
          <div className={cn(shimmerBarClass, "h-6 w-16")} />
        </div>
      </div>
    </article>
  );
}

export function ContractRegistrySkeleton({
  className,
  count = 3,
}: ContractRegistrySkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
        className,
      )}
      aria-hidden="true"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <ContractCardSkeleton key={index} />
      ))}
    </div>
  );
}
