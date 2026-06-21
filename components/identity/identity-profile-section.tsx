import Image from "next/image";
import { identity } from "@/data/identity";
import { cn } from "@/lib/utils";

export function IdentityProfileSection() {
  return (
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
  );
}
