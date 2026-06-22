import { FadeIn } from "@/components/ui/fade-in";
import { featuredProjects } from "@/data/projects";
import { ProjectCard } from "./project-card";

const STAGGER_MS = 120;

export function FeaturedProjects() {
  return (
    <section aria-labelledby="featured-projects-heading" className="pb-16 sm:pb-20">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <FadeIn duration={450}>
          <div className="flex items-center gap-3">
            <span
              className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-surface/60 font-mono text-[10px] font-medium text-muted"
              aria-hidden="true"
            >
              FP
            </span>
            <p className="text-xs font-medium uppercase tracking-widest text-muted">
              Portfolio
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={STAGGER_MS} duration={500}>
          <h2
            id="featured-projects-heading"
            className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            Featured Projects
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <FadeIn
              key={project.id}
              delay={STAGGER_MS * 2 + index * STAGGER_MS}
              duration={500}
            >
              <ProjectCard project={project} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
