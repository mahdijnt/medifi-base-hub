import { glassHoverGlow } from "@/components/dashboard/glass-styles";
import type { TimelineMilestone } from "@/data/timeline";
import { cn } from "@/lib/utils";
import {
  getContrastTextClass,
  type BackgroundSurfaceType,
} from "@/utils/color/autoTextColor";
import {
  timelineContractBorder,
  timelineDashboardBorder,
  timelineFutureBorder,
  timelineHubBorder,
  timelineInnerSurface,
  timelineRadialGlow,
} from "./timeline-styles";

type MilestoneStyle = {
  surface: BackgroundSurfaceType;
  borderClass: string;
  nodeColor: string;
  nodeGlow: string;
  nodeRing: string;
  labelClass: string;
};

const MILESTONE_STYLES: Record<TimelineMilestone["type"], MilestoneStyle> = {
  hub: {
    surface: "glow-teal",
    borderClass: timelineHubBorder,
    nodeColor: "bg-teal-400",
    nodeGlow:
      "shadow-[0_0_14px_3px_rgba(20,184,166,0.55),0_0_28px_6px_rgba(20,184,166,0.2)]",
    nodeRing: "ring-teal-300/40",
    labelClass: "text-teal-700 dark:text-teal-200/90",
  },
  dashboard: {
    surface: "glow-teal",
    borderClass: timelineDashboardBorder,
    nodeColor: "bg-emerald-400",
    nodeGlow:
      "shadow-[0_0_14px_3px_rgba(52,211,153,0.5),0_0_28px_6px_rgba(20,184,166,0.18)]",
    nodeRing: "ring-emerald-300/40",
    labelClass: "text-emerald-700 dark:text-emerald-200/90",
  },
  contract: {
    surface: "glow-purple",
    borderClass: timelineContractBorder,
    nodeColor: "bg-fuchsia-400",
    nodeGlow:
      "shadow-[0_0_14px_3px_rgba(232,121,249,0.5),0_0_28px_6px_rgba(168,85,247,0.2)]",
    nodeRing: "ring-fuchsia-300/40",
    labelClass: "text-fuchsia-700 dark:text-fuchsia-200/90",
  },
  future: {
    surface: "glow-purple",
    borderClass: timelineFutureBorder,
    nodeColor: "bg-purple-400",
    nodeGlow:
      "shadow-[0_0_14px_3px_rgba(192,132,252,0.5),0_0_28px_6px_rgba(236,72,153,0.15)]",
    nodeRing: "ring-purple-300/40",
    labelClass: "text-violet-700 dark:text-violet-200/90",
  },
  custom: {
    surface: "glass",
    borderClass: timelineHubBorder,
    nodeColor: "bg-foreground/60",
    nodeGlow: "shadow-[0_0_10px_2px_var(--glow)]",
    nodeRing: "ring-foreground/20",
    labelClass: "text-muted",
  },
};

type TimelineItemProps = {
  milestone: TimelineMilestone;
};

export function TimelineNode({
  milestone,
}: {
  milestone: TimelineMilestone;
}) {
  const style = MILESTONE_STYLES[milestone.type];
  const isUpcoming = milestone.status === "upcoming";

  return (
    <div className="relative z-10 flex items-center justify-center">
      <span
        className={cn(
          "absolute size-6 rounded-full opacity-50 blur-[1px]",
          style.nodeColor,
          isUpcoming ? "animate-pulse" : "animate-pulse",
        )}
        aria-hidden="true"
      />
      <span
        className={cn(
          "relative size-3.5 rounded-full ring-2 ring-background",
          style.nodeColor,
          style.nodeGlow,
          style.nodeRing,
          isUpcoming && "opacity-75",
        )}
        aria-hidden="true"
      />
    </div>
  );
}

export function TimelineItem({ milestone }: TimelineItemProps) {
  const style = MILESTONE_STYLES[milestone.type];
  const isUpcoming = milestone.status === "upcoming";

  return (
    <article
      className={cn(
        "group relative rounded-2xl p-px",
        style.borderClass,
        glassHoverGlow,
        isUpcoming && "opacity-90",
      )}
      aria-label={milestone.title}
    >
      <div className={cn(timelineInnerSurface, "p-5 sm:p-6")}>
        <div
          className={cn(timelineRadialGlow, "opacity-40")}
          aria-hidden="true"
        />

        <div className="relative space-y-2">
          <p
            className={cn(
              "text-[11px] font-medium uppercase tracking-wider",
              style.labelClass,
            )}
          >
            {milestone.type === "future" || isUpcoming
              ? "Upcoming"
              : "Milestone"}
          </p>

          <h3
            className={cn(
              "text-base font-semibold tracking-tight sm:text-lg",
              getContrastTextClass(style.surface, "heading"),
            )}
          >
            {milestone.title}
          </h3>

          {milestone.description ? (
            <p
              className={cn(
                "text-sm leading-relaxed",
                getContrastTextClass(style.surface, "muted"),
              )}
            >
              {milestone.description}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
