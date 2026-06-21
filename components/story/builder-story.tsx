import { FadeIn } from "@/components/ui/fade-in";
import { builderStory } from "@/data/story";
import { cn } from "@/lib/utils";

const STAGGER_MS = 80;

export function BuilderStory() {
  return (
    <section aria-labelledby="builder-story-heading" className="pb-16 pt-4 sm:pb-20">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <FadeIn duration={450}>
          <div className="flex items-center gap-3">
            <span
              className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-surface/60 font-mono text-[10px] font-medium text-muted"
              aria-hidden="true"
            >
              BS
            </span>
            <p className="text-xs font-medium uppercase tracking-widest text-muted">
              Narrative
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={STAGGER_MS} duration={500}>
          <div
            className={cn(
              "overflow-hidden rounded-2xl border border-border",
              "bg-surface/30 shadow-sm backdrop-blur-sm",
              "ring-1 ring-foreground/[0.03]",
            )}
          >
            <div className="relative px-5 py-7 sm:px-8 sm:py-8">
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--glow),transparent_55%)]"
                aria-hidden="true"
              />

              <FadeIn delay={STAGGER_MS * 2} duration={500}>
                <h2
                  id="builder-story-heading"
                  className="relative text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
                >
                  {builderStory.title}
                </h2>
              </FadeIn>

              <div className="relative mt-6 space-y-6">
                {builderStory.sections.map((section, index) => (
                  <FadeIn
                    key={section.id}
                    delay={STAGGER_MS * 3 + index * STAGGER_MS}
                    duration={550}
                  >
                    <div
                      className={cn(
                        "rounded-xl border border-border bg-background/50 p-4 sm:p-5",
                        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]",
                      )}
                    >
                      <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
                        {section.label}
                      </p>
                      <div className="mt-2 space-y-4">
                        {section.content.map((paragraph, paragraphIndex) => (
                          <p
                            key={paragraphIndex}
                            className="text-sm leading-relaxed text-foreground/90 sm:text-base"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
