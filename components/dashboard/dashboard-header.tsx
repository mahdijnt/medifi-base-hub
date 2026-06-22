import { FadeIn } from "@/components/ui/fade-in";

const STAGGER_MS = 120;

type DashboardHeaderProps = {
  title: string;
  description: string;
};

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <header className="space-y-6">
      <FadeIn duration={450}>
        <div className="flex items-center gap-3">
          <span
            className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-surface/60 font-mono text-[10px] font-medium text-muted"
            aria-hidden="true"
          >
            WA
          </span>
          <p className="text-xs font-medium uppercase tracking-widest text-muted">
            Analytics
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={STAGGER_MS} duration={500}>
        <h1
          id="dashboard-heading"
          className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        >
          {title}
        </h1>
      </FadeIn>

      <FadeIn delay={STAGGER_MS * 2} duration={500}>
        <p className="max-w-2xl text-sm leading-relaxed text-foreground/75 sm:text-base">
          {description}
        </p>
      </FadeIn>
    </header>
  );
}
