import { FadeIn } from "@/components/ui/fade-in";
import { cn } from "@/lib/utils";
import { SectionBadge } from "./section-badge";
import {
  glassGradientBorder,
  glassInnerSurface,
  glassRadialGlow,
} from "./glass-styles";

const STAGGER_MS = 120;

export function DashboardHero() {
  return (
    <header aria-labelledby="dashboard-heading">
      <FadeIn duration={450}>
        <div
          className={cn(
            glassGradientBorder,
            "shadow-[0_0_40px_-12px_var(--glow)]",
          )}
        >
          <div
            className={cn(
              glassInnerSurface,
              "px-6 py-8 sm:px-10 sm:py-10",
            )}
          >
            <div
              className={cn(glassRadialGlow, "opacity-60")}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-0 rounded-[15px] bg-[radial-gradient(ellipse_at_bottom_left,var(--glow),transparent_50%)] opacity-30"
              aria-hidden="true"
            />

            <div className="relative space-y-6">
              <SectionBadge badge="BA" label="Dashboard" />

              <FadeIn delay={STAGGER_MS} duration={500}>
                <h1
                  id="dashboard-heading"
                  className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
                >
                  Base Analytics Dashboard
                </h1>
              </FadeIn>

              <FadeIn delay={STAGGER_MS * 2} duration={500}>
                <p className="max-w-2xl text-sm leading-relaxed text-foreground/75 sm:text-base">
                  Analyze activity across Base ecosystem wallets.
                </p>
              </FadeIn>
            </div>
          </div>
        </div>
      </FadeIn>
    </header>
  );
}
