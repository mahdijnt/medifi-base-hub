import { cn } from "@/lib/utils";

/** Vertical connector — teal → purple (no blue) */
export const timelineGradientLine = cn(
  "pointer-events-none absolute bottom-4 left-[11px] top-4 w-px sm:left-[13px]",
  "bg-gradient-to-b from-teal-400 via-fuchsia-500/60 to-purple-600/35",
  "shadow-[0_0_8px_1px_rgba(20,184,166,0.25)]",
);

export const timelineHubBorder = cn(
  "bg-gradient-to-br from-teal-400/20 via-teal-500/10 to-transparent",
);

export const timelineDashboardBorder = cn(
  "bg-gradient-to-br from-teal-400/16 via-emerald-400/10 to-fuchsia-500/8",
);

export const timelineContractBorder = cn(
  "bg-gradient-to-br from-fuchsia-500/18 via-purple-500/12 to-transparent",
);

export const timelineFutureBorder = cn(
  "bg-gradient-to-br from-purple-500/20 via-fuchsia-500/14 to-pink-500/10",
);

export const timelineInnerSurface = cn(
  "relative overflow-hidden rounded-[15px]",
  "border border-white/10 bg-white/[0.05] backdrop-blur-[14px]",
  "dark:border-white/12 dark:bg-white/[0.06]",
  "shadow-[0_4px_24px_-8px_rgba(139,92,246,0.15)]",
);

export const timelineRadialGlow = cn(
  "pointer-events-none absolute inset-0 rounded-[15px]",
  "bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.12),transparent_60%)]",
);
