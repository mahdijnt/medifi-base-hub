import Image from "next/image";
import { SocialLink } from "@/components/social-link";
import { identity, socialLinks } from "@/data/identity";
import { cn } from "@/lib/utils";

export function IdentityHub() {
  return (
    <section className="flex min-h-[calc(100vh-7rem)] flex-col justify-center py-12 sm:py-16">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-surface/60 font-mono text-[10px] font-medium text-muted"
            aria-hidden="true"
          >
            ID
          </span>
          <p className="text-xs font-medium uppercase tracking-widest text-muted">
            Builder Identity Hub
          </p>
        </div>

        <div
          className={cn(
            "overflow-hidden rounded-2xl border border-border",
            "bg-surface/30 shadow-sm backdrop-blur-sm",
            "ring-1 ring-foreground/[0.03]",
          )}
        >
          <div className="relative border-b border-border px-5 py-7 sm:px-8 sm:py-8">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--glow),transparent_55%)]"
              aria-hidden="true"
            />

            <div className="relative flex items-center gap-2">
              <span
                className="size-2 rounded-full bg-emerald-500 shadow-[0_0_10px_3px_rgba(16,185,129,0.45)]"
                aria-hidden="true"
              />
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
                Identity
              </p>
            </div>

            <div className="relative mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
              <div className="relative shrink-0 self-start">
                <div
                  className="absolute -inset-1 rounded-full bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-transparent blur-sm"
                  aria-hidden="true"
                />
                <Image
                  src={identity.avatar}
                  alt={`${identity.name} profile`}
                  width={88}
                  height={88}
                  priority
                  className={cn(
                    "relative size-[5.5rem] rounded-full object-cover",
                    "border-2 border-border/80 bg-surface",
                    "shadow-[0_8px_32px_-8px_var(--glow)]",
                  )}
                />
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {identity.name}
                </h1>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted sm:text-base">
                  {identity.bio}
                </p>
              </div>
            </div>
          </div>

          <div className="px-5 py-6 sm:px-8 sm:py-7">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
                Profiles
              </p>
              <span className="font-mono text-[10px] text-muted/80">
                {socialLinks.length} links
              </span>
            </div>

            <div
              className={cn(
                "mt-4 rounded-xl border border-border bg-background/50 p-4 sm:p-5",
                "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]",
              )}
            >
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link, index) => (
                  <SocialLink
                    key={link.url}
                    label={link.label}
                    url={link.url}
                    image={link.image}
                    tooltipId={`social-tooltip-${index}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
