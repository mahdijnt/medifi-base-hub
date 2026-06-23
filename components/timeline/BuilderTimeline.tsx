import { SectionBadge } from "@/components/dashboard/section-badge";
import { timelineMilestones } from "@/data/timeline";
import { cn } from "@/lib/utils";
import { timelineGradientLine } from "./timeline-styles";
import { glassGradientBorder } from "@/components/dashboard/glass-styles";
import { TimelineItem, TimelineNode } from "./TimelineItem";

export function BuilderTimeline() {
  return (
    <section
      aria-labelledby="builder-timeline-heading"
      className="pb-16 sm:pb-20"
    >
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <SectionBadge badge="TL" label="Timeline" />

        <h2
          id="builder-timeline-heading"
          className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        >
          Builder Timeline
        </h2>

        <div className={cn(glassGradientBorder)}>
          <div
            className={cn(
              "relative p-5 sm:p-8",
              "overflow-hidden rounded-[15px]",
              "border border-white/10 bg-white/[0.04] backdrop-blur-[12px]",
              "dark:border-white/12 dark:bg-white/[0.06]",
            )}
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-[15px] bg-[radial-gradient(ellipse_at_top_left,rgba(20,184,166,0.08),transparent_55%)]"
              aria-hidden="true"
            />

            <div className="relative">
              <div
                className={cn(timelineGradientLine)}
                aria-hidden="true"
              />

              <ol className="relative space-y-7 sm:space-y-9">
                {timelineMilestones.map((milestone) => (
                  <li
                    key={milestone.id}
                    className="grid grid-cols-[1.5rem_1fr] gap-4 sm:grid-cols-[2rem_1fr] sm:gap-6"
                  >
                    <div className="flex justify-center pt-6 sm:pt-7">
                      <TimelineNode milestone={milestone} />
                    </div>
                    <TimelineItem milestone={milestone} />
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
