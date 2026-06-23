import { cn } from "@/lib/utils";

const cardOuterClass = cn(
  "relative rounded-xl p-px",
  "bg-gradient-to-br from-blue-500/25 via-blue-400/10 to-blue-600/5",
);

const cardInnerClass = cn(
  "relative flex h-full flex-col rounded-[11px] p-5",
  "border border-blue-500/20 bg-blue-500/[0.06] backdrop-blur-[12px]",
  "shadow-sm shadow-blue-500/10",
);

const shimmerBarClass =
  "nft-skeleton-shimmer rounded-md bg-blue-400/10 dark:bg-blue-400/15";

type ContractMetricSkeletonProps = {
  className?: string;
};

export function ContractMetricSkeleton({
  className,
}: ContractMetricSkeletonProps) {
  return (
    <article className={cn(cardOuterClass, className)} aria-hidden="true">
      <div className={cardInnerClass}>
        <div
          className="pointer-events-none absolute inset-0 rounded-[11px] bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.25),transparent_60%)] opacity-60"
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
            "flex h-12 items-center rounded-lg border border-blue-500/15 bg-blue-500/[0.06] px-3 backdrop-blur-sm",
            shimmerBarClass,
          )}
        />
      ))}
    </div>
  );
}
