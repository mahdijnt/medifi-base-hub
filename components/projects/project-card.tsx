import type { Project, ProjectStatus } from "@/data/projects";
import { cn } from "@/lib/utils";

const statusStyles: Record<ProjectStatus, string> = {
  Active:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400/90",
  "In Progress":
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400/90",
  Planned:
    "border-border bg-foreground/5 text-muted",
};

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article
      className={cn(
        "group relative rounded-xl p-px",
        "bg-gradient-to-br from-black/10 via-black/5 to-black/[0.03]",
        "dark:from-white/20 dark:via-white/10 dark:to-white/5",
        "transition-transform duration-300 ease-out hover:scale-[1.03]",
      )}
    >
      <div
        className={cn(
          "relative flex h-full flex-col rounded-[11px] p-5",
          "border border-black/[0.08] bg-black/[0.04] backdrop-blur-[12px]",
          "dark:border-white/15 dark:bg-white/[0.08]",
          "shadow-sm transition-shadow duration-300",
          "group-hover:shadow-[0_0_24px_-4px_var(--glow)]",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[11px] bg-[radial-gradient(ellipse_at_top_right,var(--glow),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        />

        <div className="relative flex flex-1 flex-col">
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            {project.name}
          </h3>

          <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/75">
            {project.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5",
                "text-[11px] font-medium tracking-wide",
                "border-border bg-foreground/5 text-muted",
              )}
            >
              {project.type}
            </span>
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5",
                "text-[11px] font-medium tracking-wide",
                statusStyles[project.status],
              )}
            >
              {project.status}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
