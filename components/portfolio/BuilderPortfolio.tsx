import { cn } from "@/lib/utils";
import { getContrastTextClass } from "@/utils/color/autoTextColor";
import {
  dashPrimaryBorder,
  dashPrimaryGlow,
  dashPrimarySurface,
  glassGradientBorder,
  glassInnerSurface,
} from "@/components/dashboard/glass-styles";
import { FadeIn } from "@/components/ui/fade-in";

const PROGRESS_DURATION_MS = 160;
const STAGGER_MS = 150;

type BuilderPortfolioProps = {
  deployGoal: number;
  currentDeployCount: number | null;
  overview: string;
  deployLoading?: boolean;
  deployError?: string | null;
};

export function BuilderPortfolio({
  deployGoal,
  currentDeployCount,
  overview,
  deployLoading = false,
  deployError = null,
}: BuilderPortfolioProps) {
  const current = currentDeployCount ?? 0;
  const progress =
    deployGoal > 0 ? Math.min(100, (current / deployGoal) * 100) : 0;

  return (
    <section
      aria-labelledby="builder-portfolio-heading"
      className="pb-16 sm:pb-20"
    >
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <FadeIn duration={150}>
          <div className="flex items-center gap-3">
            <span
              className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-surface/60 font-mono text-[10px] font-medium text-muted"
              aria-hidden="true"
            >
              BP
            </span>
            <p className="text-xs font-medium uppercase tracking-widest text-muted">
              Portfolio
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={STAGGER_MS} duration={150}>
          <h2
            id="builder-portfolio-heading"
            className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            Builder Portfolio
          </h2>
        </FadeIn>

        <FadeIn delay={STAGGER_MS * 2} duration={150}>
          <div className={cn(glassGradientBorder)}>
            <div className={cn("relative p-6 sm:p-8", glassInnerSurface)}>
              <div
                className={cn(dashPrimaryGlow, "opacity-40")}
                aria-hidden="true"
              />

              <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <p
                    className={cn(
                      "text-sm leading-relaxed",
                      getContrastTextClass("glass-blue", "muted"),
                    )}
                  >
                    {overview}
                  </p>
                </div>

                <article
                  className={cn(
                    "group relative rounded-xl p-px",
                    dashPrimaryBorder,
                  )}
                >
                  <div
                    className={cn(
                      "relative flex h-full flex-col rounded-[11px] p-5",
                      dashPrimarySurface,
                    )}
                  >
                    <div
                      className={cn(
                        dashPrimaryGlow,
                        "opacity-70 transition-opacity duration-300 group-hover:opacity-100",
                      )}
                      aria-hidden="true"
                    />

                    <div className="relative flex flex-1 flex-col">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          getContrastTextClass("glow-blue", "label"),
                        )}
                      >
                        Contract Deployments
                      </p>

                      <p
                        className={cn(
                          "mt-2 font-mono text-3xl font-semibold tracking-tight",
                          deployLoading || deployError
                            ? getContrastTextClass("glow-blue", "muted")
                            : getContrastTextClass("glow-blue", "value"),
                        )}
                        aria-busy={deployLoading}
                      >
                        {deployLoading ? "…" : deployError ? "—" : current}
                        <span
                          className={cn(
                            "text-lg font-normal",
                            getContrastTextClass("glow-blue", "muted"),
                          )}
                        >
                          {" "}
                          / {deployGoal}
                        </span>
                      </p>

                      <div className="mt-4 space-y-2">
                        <div
                          className="h-2 w-full overflow-hidden rounded-full bg-foreground/10"
                          role="presentation"
                          aria-hidden="true"
                        >
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[var(--accent-blue)] via-[var(--accent-cyan)] to-[var(--accent-purple)]"
                            style={{
                              width: deployLoading ? "0%" : `${progress}%`,
                              transition: `width ${PROGRESS_DURATION_MS}ms ease-out`,
                            }}
                          />
                        </div>
                        <p
                          className={cn(
                            "text-right font-mono text-[10px]",
                            getContrastTextClass("glow-blue", "muted"),
                          )}
                        >
                          {deployLoading
                            ? "Loading…"
                            : `${Math.round(progress)}% of deploy goal`}
                        </p>
                      </div>

                      {deployError ? (
                        <p
                          className={cn(
                            "mt-2 text-[11px] leading-snug",
                            getContrastTextClass("glow-blue", "muted"),
                          )}
                        >
                          {deployError}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
