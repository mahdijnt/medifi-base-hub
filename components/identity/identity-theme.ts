import { cn } from "@/lib/utils";

/** Identity palette — deep navy, steel, charcoal, teal, electric blue */
export const IDENTITY_PALETTE = {
  navy: "#0f172a",
  steel: "#64748b",
  charcoal: "#0a0a0f",
  teal: "#14b8a6",
  electricBlue: "#3b82f6",
} as const;

export const identityCardOuter = cn(
  "relative overflow-hidden rounded-3xl p-px",
  "bg-gradient-to-br from-slate-600/40 via-sky-500/30 to-teal-500/35",
  "shadow-[0_0_56px_-12px_rgba(59,130,246,0.28)]",
  "identity-micro-animate",
);

export const identityCardInner = cn(
  "relative overflow-hidden rounded-[23px]",
  "border border-sky-400/25 bg-[#0a0f1a]/75 backdrop-blur-[36px]",
  "dark:border-sky-400/20 dark:bg-[#080c14]/80",
  "shadow-[inset_0_1px_0_0_rgba(148,163,184,0.15),inset_0_-1px_0_0_rgba(0,0,0,0.35)]",
);

export const identityCardGradient = cn(
  "pointer-events-none absolute inset-0 rounded-[23px]",
  "bg-gradient-to-br from-slate-500/10 via-sky-500/8 to-teal-500/10",
);

export const identityCardMetallic = cn(
  "pointer-events-none absolute inset-0 rounded-[23px] opacity-[0.12]",
  "bg-[linear-gradient(135deg,rgba(148,163,184,0.35)_0%,transparent_35%,rgba(59,130,246,0.08)_55%,transparent_75%,rgba(20,184,166,0.1)_100%)]",
);

export const identityCardShimmer = cn(
  "pointer-events-none absolute inset-0 rounded-[23px] opacity-[0.06]",
  "bg-[linear-gradient(125deg,transparent_30%,rgba(255,255,255,0.35)_48%,transparent_62%)]",
);

export const identityCardNoise = cn(
  "pointer-events-none absolute inset-0 rounded-[23px] opacity-[0.05] mix-blend-overlay",
  "[background-image:url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")]",
);

export const identityAvatarHalo = cn(
  "pointer-events-none absolute -inset-12 rounded-full",
  "bg-[radial-gradient(circle,rgba(30,64,175,0.45)_0%,rgba(20,184,166,0.28)_40%,transparent_72%)]",
  "blur-3xl",
);

export const identityAvatarFrame = cn(
  "relative rounded-full p-[5px]",
  "bg-gradient-to-br from-sky-500/80 via-slate-500/50 to-teal-500/75",
  "shadow-[0_0_40px_8px_rgba(37,99,235,0.35),0_0_80px_16px_rgba(20,184,166,0.15)]",
  "backdrop-blur-xl",
  "ring-1 ring-sky-300/25",
);

export const identityAvatarReflection = cn(
  "pointer-events-none absolute inset-[5px] rounded-full",
  "bg-[linear-gradient(135deg,rgba(255,255,255,0.2)_0%,transparent_42%,transparent_100%)]",
);

export const identityAvatarImage = cn(
  "size-52 rounded-full object-cover sm:size-56",
  "border-[4px] border-slate-400/30 bg-[#0f172a]/90",
  "shadow-[inset_0_2px_14px_rgba(0,0,0,0.25)]",
);

export const identitySocialCapsule = cn(
  "group/icon relative flex size-12 items-center justify-center rounded-xl p-px",
  "bg-gradient-to-br from-slate-500/55 via-sky-500/45 to-teal-500/50",
  "shadow-[0_0_20px_-4px_rgba(59,130,246,0.3)]",
  "transition-all duration-200 ease-out",
  "hover:scale-105 hover:shadow-[0_0_28px_-2px_rgba(59,130,246,0.5)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
);

export const identitySocialCapsuleInner = cn(
  "relative flex size-full items-center justify-center overflow-hidden rounded-[11px]",
  "border border-slate-400/20 bg-[#0a0f1a]/70 backdrop-blur-[18px]",
  "dark:border-slate-500/15 dark:bg-[#080c14]/75",
  "shadow-[inset_0_1px_0_0_rgba(148,163,184,0.14)]",
);

export const identitySocialHighlight = cn(
  "pointer-events-none absolute inset-0 rounded-[11px]",
  "bg-[linear-gradient(135deg,rgba(255,255,255,0.16)_0%,transparent_45%,transparent_100%)]",
);

export const identityProfilesPanel = cn(
  "mt-6 rounded-2xl border border-sky-400/15 p-5 sm:p-6",
  "bg-gradient-to-br from-slate-500/[0.08] via-sky-500/[0.05] to-teal-500/[0.07]",
  "backdrop-blur-[14px]",
  "shadow-[inset_0_1px_0_0_rgba(148,163,184,0.08)]",
);
