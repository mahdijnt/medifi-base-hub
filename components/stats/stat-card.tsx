import type { BuilderStat } from "@/data/stats";
import { cn } from "@/lib/utils";

type StatCardProps = {
  stat: BuilderStat;
};

export function StatCard({ stat }: StatCardProps) {
  return (
    <article
      className={cn(
        "group relative rounded-xl p-px",
        "bg-gradient-to-br from-black/10 via-black/5 to-black/[0.03]",
        "dark:from-white/20 dark:via-white/10 dark:to-white/5",
        "transition-transform duration-300 ease-out hover:scale-[1.03]",
      )}
    >
      <div
        className={cn(
          "relative flex h-full flex-col rounded-[11px] p-5",
          "border border-black/[0.08] bg-black/[0.04] backdrop-blur-[12px]",
          "dark:border-white/15 dark:bg-white/[0.08]",
          "shadow-sm transition-shadow duration-300",
          "group-hover:shadow-[0_0_24px_-4px_var(--glow)]",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[11px] bg-[radial-gradient(ellipse_at_top_right,var(--glow),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        />

        <div className="relative flex flex-1 flex-col">
          <p className="text-sm font-medium text-muted">{stat.title}</p>

          <p className="mt-2 font-mono text-3xl font-semibold tracking-tight text-foreground">
            {stat.value.toLocaleString()}
          </p>

          <div className="mt-4 space-y-2">
            <div
              className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/10"
              role="presentation"
              aria-hidden="true"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-foreground/40 to-foreground/70 transition-none"
                style={{ width: `${stat.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
