import { cn } from "@/lib/utils";

/** Gradient border wrapper used across dashboard glass panels */
export const glassGradientBorder = cn(
  "relative rounded-2xl p-px",
  "bg-gradient-to-br from-black/10 via-black/5 to-black/[0.03]",
  "dark:from-white/20 dark:via-white/10 dark:to-white/5",
);

/** Inner frosted glass surface */
export const glassInnerSurface = cn(
  "relative overflow-hidden rounded-[15px]",
  "border border-black/[0.08] bg-black/[0.04] backdrop-blur-[12px]",
  "dark:border-white/15 dark:bg-white/[0.08]",
  "shadow-sm",
);

/** Hover glow for interactive cards */
export const glassHoverGlow = cn(
  "transition-all duration-300 ease-out",
  "hover:shadow-[0_0_24px_-4px_var(--glow)]",
);

/** Radial glow overlay (use inside glassInnerSurface) */
export const glassRadialGlow = cn(
  "pointer-events-none absolute inset-0 rounded-[15px]",
  "bg-[radial-gradient(ellipse_at_top_right,var(--glow),transparent_60%)]",
);
