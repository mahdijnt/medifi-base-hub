import { cn } from "@/lib/utils";

/** Gradient border wrapper used across dashboard glass panels */
export const glassGradientBorder = cn(
  "relative rounded-2xl p-px",
  "bg-gradient-to-br from-[var(--accent-blue)]/12 via-[var(--accent-purple)]/6 to-transparent",
  "dark:from-[var(--accent-blue)]/18 dark:via-[var(--accent-purple)]/10 dark:to-transparent",
);

/** Inner frosted glass surface */
export const glassInnerSurface = cn(
  "relative overflow-hidden rounded-[15px]",
  "border border-black/[0.08] bg-black/[0.04] backdrop-blur-[12px]",
  "dark:border-white/15 dark:bg-white/[0.08]",
  "shadow-sm",
);

/** Hover glow for interactive cards — softened spread */
export const glassHoverGlow = cn(
  "transition-all duration-300 ease-out",
  "hover:shadow-[0_0_20px_-6px_var(--glow-purple-soft)]",
  "sm:hover:shadow-[0_0_24px_-6px_var(--glow-purple-soft)]",
);

/** Radial glow overlay (use inside glassInnerSurface) */
export const glassRadialGlow = cn(
  "pointer-events-none absolute inset-0 rounded-[15px]",
  "bg-[radial-gradient(ellipse_at_top_right,var(--glow-purple-soft),transparent_60%)]",
);

/** Primary metric surface — blue → cyan gradient */
export const dashPrimaryBorder = cn(
  "bg-gradient-to-br from-[var(--accent-blue)]/14 via-[var(--accent-cyan)]/7 to-transparent",
);

export const dashPrimarySurface = cn(
  "border border-[var(--accent-blue)]/20 bg-[var(--accent-blue)]/[0.05] backdrop-blur-[12px]",
  "shadow-[0_0_20px_-10px_var(--glow-blue-soft)]",
  "sm:shadow-[0_0_28px_-10px_var(--glow-blue-soft)]",
);

export const dashPrimaryGlow = cn(
  "pointer-events-none absolute inset-0 rounded-[11px]",
  "bg-[radial-gradient(ellipse_at_top_right,var(--glow-blue-soft),transparent_60%)]",
);

/** Secondary surface — teal/cyan accent */
export const dashSecondaryBorder = cn(
  "bg-gradient-to-br from-[var(--accent-teal)]/12 via-[var(--accent-cyan)]/6 to-transparent",
);

export const dashSecondarySurface = cn(
  "border border-[var(--accent-teal)]/18 bg-[var(--accent-teal)]/[0.04] backdrop-blur-[12px]",
  "shadow-[0_0_18px_-10px_var(--glow-teal-soft)]",
);

/** Interactive hover surface — blue → purple */
export const dashInteractiveBorder = cn(
  "bg-gradient-to-br from-[var(--accent-blue)]/16 via-[var(--accent-purple)]/8 to-transparent",
  "transition-transform duration-300 ease-out hover:scale-[1.02]",
);

export const dashInteractiveHoverGlow = cn(
  "transition-shadow duration-300",
  "group-hover:shadow-[0_0_20px_-8px_var(--glow-purple-soft)]",
  "sm:group-hover:shadow-[0_0_24px_-8px_var(--glow-purple-soft)]",
);

/** Contrast scrim for gradient overlays on metric cards */
export const dashContrastScrim = cn(
  "pointer-events-none absolute inset-0",
  "bg-gradient-to-b from-white/30 via-transparent to-transparent",
  "dark:from-black/25 dark:via-transparent",
);
