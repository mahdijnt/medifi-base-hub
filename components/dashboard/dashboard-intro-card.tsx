import { FadeIn } from "@/components/ui/fade-in";
import { cn } from "@/lib/utils";
import { SectionBadge } from "./section-badge";
import {
  glassGradientBorder,
  glassHoverGlow,
  glassInnerSurface,
  glassRadialGlow,
} from "./glass-styles";

const STAGGER_MS = 120;

export function DashboardIntroCard() {
  return (
    <FadeIn delay={STAGGER_MS} duration={500}>
      <article
        className={cn(
          glassGradientBorder,
          glassHoverGlow,
          "group hover:scale-[1.005]",
        )}
      >
        <div className={cn(glassInnerSurface, "p-6 sm:p-7")}>
          <div
            className={cn(
              glassRadialGlow,
              "opacity-0 transition-opacity duration-300 group-hover:opacity-100",
            )}
            aria-hidden="true"
          />

          <div className="relative space-y-4">
            <SectionBadge badge="IN" label="Overview" />

            <p className="text-sm leading-relaxed text-foreground/85 sm:text-base">
              This dashboard aggregates onchain activity across your Base,
              Farcaster, and Base App wallets — transactions, NFT holdings,
              and contract interactions in one view.
            </p>
            <p className="text-sm leading-relaxed text-muted">
              Enter your wallet addresses below and select{" "}
              <span className="font-medium text-foreground/80">Analyze</span> to
              load analytics. Results appear after addresses are submitted.
            </p>
          </div>
        </div>
      </article>
    </FadeIn>
  );
}
