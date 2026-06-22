import { FadeIn } from "@/components/ui/fade-in";
import { builderStats } from "@/data/stats";
import { StatCard } from "./stat-card";

const STAGGER_MS = 150;

export function BuilderStats() {
  return (
    <section aria-labelledby="builder-stats-heading" className="pb-16 sm:pb-20">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <FadeIn duration={450}>
          <div className="flex items-center gap-3">
            <span
              className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-surface/60 font-mono text-[10px] font-medium text-muted"
              aria-hidden="true"
            >
              ST
            </span>
            <p className="text-xs font-medium uppercase tracking-widest text-muted">
              Metrics
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={STAGGER_MS} duration={500}>
          <h2
            id="builder-stats-heading"
            className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            Builder Stats
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {builderStats.map((stat, index) => (
            <FadeIn
              key={stat.id}
              delay={STAGGER_MS * 2 + index * STAGGER_MS}
              duration={500}
            >
              <StatCard stat={stat} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
