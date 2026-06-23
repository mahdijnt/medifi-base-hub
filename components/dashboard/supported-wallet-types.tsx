import { FadeIn } from "@/components/ui/fade-in";
import { cn } from "@/lib/utils";
import { SectionBadge } from "./section-badge";
import {
  glassGradientBorder,
  glassHoverGlow,
  glassInnerSurface,
  glassRadialGlow,
} from "./glass-styles";

const STAGGER_MS = 80;

const WALLET_TYPES = [
  {
    id: "base",
    badge: "BW",
    title: "Base Wallet",
    description:
      "Your primary onchain identity on Base L2 — holds assets, signs transactions, and interacts with dApps across the ecosystem.",
  },
  {
    id: "farcaster",
    badge: "FC",
    title: "Farcaster Wallet",
    description:
      "Linked to your Farcaster account for social onchain actions — tips, frames, and protocol-level interactions on Base.",
  },
  {
    id: "baseapp",
    badge: "BA",
    title: "Base App Wallet",
    description:
      "The smart wallet inside Base App — optimized for everyday payments, swaps, and mini-app experiences on Base.",
  },
] as const;

function WalletTypeCard({
  badge,
  title,
  description,
}: {
  badge: string;
  title: string;
  description: string;
}) {
  return (
    <article
      className={cn(
        glassGradientBorder,
        glassHoverGlow,
        "group h-full transition-transform duration-300 ease-out hover:scale-[1.02]",
      )}
    >
      <div className={cn(glassInnerSurface, "flex h-full flex-col p-5")}>
        <div
          className={cn(
            glassRadialGlow,
            "opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          )}
          aria-hidden="true"
        />

        <div className="relative flex flex-1 flex-col gap-3">
          <span
            className="inline-flex size-7 w-fit items-center justify-center rounded-md border border-border bg-surface/60 font-mono text-[10px] font-medium text-muted"
            aria-hidden="true"
          >
            {badge}
          </span>
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-muted">{description}</p>
        </div>
      </div>
    </article>
  );
}

export function SupportedWalletTypes() {
  return (
    <section aria-labelledby="wallet-types-heading" className="space-y-6">
      <FadeIn delay={STAGGER_MS}>
        <SectionBadge badge="WT" label="Wallet Types" />
      </FadeIn>

      <FadeIn delay={STAGGER_MS * 2}>
        <h2
          id="wallet-types-heading"
          className="text-lg font-semibold tracking-tight text-foreground sm:text-xl"
        >
          Supported Wallet Types
        </h2>
      </FadeIn>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {WALLET_TYPES.map((wallet, index) => (
          <FadeIn
            key={wallet.id}
            delay={STAGGER_MS * 2 + index * STAGGER_MS}
          >
            <WalletTypeCard
              badge={wallet.badge}
              title={wallet.title}
              description={wallet.description}
            />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
