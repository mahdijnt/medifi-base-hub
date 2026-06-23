import { FadeIn } from "@/components/ui/fade-in";
import { currentGoals, type Goal } from "@/data/goals";
import { GoalCard } from "./goal-card";

const STAGGER_MS = 150;

type CurrentGoalsProps = {
  goals?: Goal[];
  loading?: boolean;
};

export function CurrentGoals({
  goals = currentGoals,
  loading = false,
}: CurrentGoalsProps) {
  return (
    <section aria-labelledby="current-goals-heading" className="pb-16 sm:pb-20">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <FadeIn duration={450}>
          <div className="flex items-center gap-3">
            <span
              className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-surface/60 font-mono text-[10px] font-medium text-muted"
              aria-hidden="true"
            >
              CG
            </span>
            <p className="text-xs font-medium uppercase tracking-widest text-muted">
              Objectives
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={STAGGER_MS} duration={500}>
          <h2
            id="current-goals-heading"
            className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            Current Goals
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal, index) => (
            <FadeIn
              key={goal.id}
              delay={STAGGER_MS * 2 + index * STAGGER_MS}
              duration={500}
            >
              <GoalCard goal={goal} loading={loading} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
