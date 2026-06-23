"use client";

import {
  dashPrimaryBorder,
  dashPrimaryGlow,
  dashSecondaryBorder,
  glassGradientBorder,
  glassInnerSurface,
  glassRadialGlow,
} from "@/components/dashboard/glass-styles";
import { FadeIn } from "@/components/ui/fade-in";
import { useBuilderSnapshot } from "@/hooks/useBuilderSnapshot";
import { cn } from "@/lib/utils";
import {
  getAccentLabelClass,
  getContrastTextClass,
  type BackgroundSurfaceType,
} from "@/utils/color/autoTextColor";

const STAGGER_MS = 150;

type SnapshotMetricProps = {
  label: string;
  value: number | null;
  loading: boolean;
  error: string | null;
  hint: string;
  surface: BackgroundSurfaceType;
  accent: "primary" | "secondary" | "interactive";
  borderClass: string;
};

function SnapshotMetric({
  label,
  value,
  loading,
  error,
  hint,
  surface,
  accent,
  borderClass,
}: SnapshotMetricProps) {
  const displayValue = loading
    ? "…"
    : error
      ? "—"
      : (value ?? 0).toLocaleString();

  return (
    <div className={cn("group relative rounded-xl p-px", borderClass)}>
      <div
        className={cn(
          "relative flex h-full flex-col rounded-[11px] p-5 sm:p-6",
          glassInnerSurface,
        )}
      >
        <div
          className={cn(glassRadialGlow, "opacity-40")}
          aria-hidden="true"
        />

        <div className="relative flex flex-1 flex-col">
          <p
            className={cn(
              "text-xs font-medium uppercase tracking-wide",
              getAccentLabelClass(accent),
            )}
          >
            {label}
          </p>

          {loading ? (
            <div
              className="mt-3 h-9 w-24 animate-pulse rounded-md bg-foreground/10"
              aria-hidden="true"
            />
          ) : (
            <p
              className={cn(
                "mt-2 font-mono text-3xl font-semibold tracking-tight sm:text-4xl",
                error
                  ? getContrastTextClass(surface, "muted")
                  : getContrastTextClass(surface, "value"),
              )}
              aria-busy={loading}
            >
              {displayValue}
            </p>
          )}

          <p
            className={cn(
              "mt-2 text-[11px] leading-snug",
              getContrastTextClass(surface, "muted"),
            )}
          >
            {error ?? hint}
          </p>
        </div>
      </div>
    </div>
  );
}

export function BuilderSnapshot() {
  const { metrics } = useBuilderSnapshot();

  return (
    <section
      aria-labelledby="builder-snapshot-heading"
      className="pb-16 sm:pb-20"
    >
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <FadeIn duration={150}>
          <div className="flex items-center gap-3">
            <span
              className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-surface/60 font-mono text-[10px] font-medium text-muted"
              aria-hidden="true"
            >
              SN
            </span>
            <p className="text-xs font-medium uppercase tracking-widest text-muted">
              Snapshot
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={STAGGER_MS} duration={150}>
          <h2
            id="builder-snapshot-heading"
            className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            Builder Snapshot
          </h2>
        </FadeIn>

        <FadeIn delay={STAGGER_MS * 2} duration={150}>
          <div className={cn(glassGradientBorder)}>
            <div className={cn("relative p-5 sm:p-8", glassInnerSurface)}>
              <div
                className={cn(dashPrimaryGlow, "opacity-30")}
                aria-hidden="true"
              />

              <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <SnapshotMetric
                  label="Total Deployments"
                  value={metrics.deployments.data}
                  loading={metrics.deployments.loading}
                  error={metrics.deployments.error}
                  hint="Contracts deployed on Base"
                  surface="glass-blue"
                  accent="primary"
                  borderClass={dashPrimaryBorder}
                />

                <SnapshotMetric
                  label="Total GitHub Commits"
                  value={metrics.commits.data}
                  loading={metrics.commits.loading}
                  error={metrics.commits.error}
                  hint="Commits across public repos"
                  surface="glow-cyan"
                  accent="secondary"
                  borderClass={dashSecondaryBorder}
                />

                <SnapshotMetric
                  label="Total Projects Built"
                  value={metrics.projects.data}
                  loading={metrics.projects.loading}
                  error={metrics.projects.error}
                  hint="Public non-fork repositories"
                  surface="glow-teal"
                  accent="secondary"
                  borderClass={dashSecondaryBorder}
                />

                <SnapshotMetric
                  label="Onchain Identity Score"
                  value={metrics.identityScore.data}
                  loading={metrics.identityScore.loading}
                  error={metrics.identityScore.error}
                  hint="Weighted Farcaster + Base tx activity"
                  surface="glow-purple"
                  accent="interactive"
                  borderClass="bg-gradient-to-br from-[var(--accent-blue)]/16 via-[var(--accent-purple)]/8 to-transparent"
                />
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
