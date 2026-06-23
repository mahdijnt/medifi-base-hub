export type BackgroundSurfaceType =
  | "light"
  | "dark"
  | "glass"
  | "glow-blue"
  | "glow-teal"
  | "glow-cyan"
  | "glow-purple"
  | "glass-blue"
  | "interactive"
  | "muted";

export type TextRole = "label" | "value" | "heading" | "muted" | "badge";

type TextClassSet = Record<TextRole, string>;

/** Relative luminance (0–1) from a hex color string */
export function getLuminance(hex: string): number {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;

  const [rs, gs, bs] = [r, g, b].map((channel) =>
    channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4),
  );

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/** Returns true when luminance exceeds the WCAG midpoint threshold */
export function isLightBackground(luminance: number): boolean {
  return luminance > 0.5;
}

/** Pre-computed Tailwind text classes per surface type — no runtime color math on render */
export const CONTRAST_TEXT_MAP: Record<BackgroundSurfaceType, TextClassSet> = {
  light: {
    label: "text-slate-600",
    value: "text-slate-900",
    heading: "text-slate-900",
    muted: "text-slate-500",
    badge: "text-slate-700",
  },
  dark: {
    label: "text-slate-300",
    value: "text-white/95",
    heading: "text-white/95",
    muted: "text-slate-400",
    badge: "text-slate-200",
  },
  glass: {
    label: "text-muted",
    value: "text-foreground",
    heading: "text-foreground",
    muted: "text-muted",
    badge: "text-muted",
  },
  "glow-blue": {
    label: "text-slate-700 dark:text-slate-300",
    value: "text-slate-900 dark:text-white/95",
    heading: "text-slate-900 dark:text-white/95",
    muted: "text-slate-600 dark:text-slate-400",
    badge: "text-blue-800 dark:text-blue-200",
  },
  "glow-teal": {
    label: "text-teal-800 dark:text-teal-200/90",
    value: "text-slate-900 dark:text-white/95",
    heading: "text-slate-900 dark:text-white/95",
    muted: "text-teal-700/90 dark:text-teal-300/75",
    badge: "text-teal-800 dark:text-teal-200",
  },
  "glow-cyan": {
    label: "text-cyan-800 dark:text-cyan-200/90",
    value: "text-slate-900 dark:text-white/95",
    heading: "text-slate-900 dark:text-white/95",
    muted: "text-cyan-700/90 dark:text-cyan-300/75",
    badge: "text-cyan-800 dark:text-cyan-200",
  },
  "glow-purple": {
    label: "text-violet-800 dark:text-violet-200/90",
    value: "text-slate-900 dark:text-white/95",
    heading: "text-slate-900 dark:text-white/95",
    muted: "text-violet-700/90 dark:text-violet-300/75",
    badge: "text-violet-800 dark:text-violet-200",
  },
  "glass-blue": {
    label: "text-slate-700 dark:text-slate-300",
    value: "text-slate-900 dark:text-white/95",
    heading: "text-slate-900 dark:text-white/95",
    muted: "text-slate-600 dark:text-slate-400",
    badge: "text-blue-800 dark:text-blue-200",
  },
  interactive: {
    label: "text-slate-800 dark:text-slate-200",
    value: "text-foreground",
    heading: "text-foreground",
    muted: "text-slate-600 dark:text-slate-400",
    badge: "text-violet-800 dark:text-violet-200",
  },
  muted: {
    label: "text-muted",
    value: "text-foreground/90",
    heading: "text-foreground",
    muted: "text-muted",
    badge: "text-muted",
  },
};

/** Pick a readable Tailwind text class for a known surface type */
export function getContrastTextClass(
  backgroundType: BackgroundSurfaceType,
  role: TextRole = "value",
): string {
  return CONTRAST_TEXT_MAP[backgroundType][role];
}

/** Section accent labels: primary → blue, secondary → teal/cyan, interactive → purple */
export function getAccentLabelClass(
  accent: "primary" | "secondary" | "interactive",
): string {
  const map = {
    primary: "text-blue-800 dark:text-blue-200",
    secondary: "text-teal-800 dark:text-teal-200/90",
    interactive: "text-violet-800 dark:text-violet-200/90",
  } as const;

  return map[accent];
}
