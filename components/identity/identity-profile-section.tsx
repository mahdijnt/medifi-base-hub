import Image from "next/image";
import {
  identityAvatarFrame,
  identityAvatarHalo,
  identityAvatarImage,
  identityAvatarReflection,
} from "@/components/identity/identity-theme";
import { identity } from "@/data/identity";
import { withBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";
import { getContrastTextClass } from "@/utils/color/autoTextColor";

export function IdentityProfileSection() {
  return (
    <div className="relative border-b border-sky-400/15 pb-10">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(37,99,235,0.14),transparent_55%)]"
        aria-hidden="true"
      />

      <div className="relative flex items-center gap-2">
        <span
          className="size-2 rounded-full bg-sky-400 shadow-[0_0_12px_4px_rgba(59,130,246,0.5)]"
          aria-hidden="true"
        />
        <p
          className={cn(
            "text-[11px] font-medium uppercase tracking-wider",
            getContrastTextClass("identity-glow", "label"),
          )}
        >
          Identity
        </p>
      </div>

      <div className="relative mt-8 flex flex-col gap-8 sm:mt-10 sm:flex-row sm:items-center sm:gap-10">
        <div className="relative shrink-0 self-start">
          <div className={identityAvatarHalo} aria-hidden="true" />
          <div className={identityAvatarFrame}>
            <Image
              src={withBasePath(identity.avatar)}
              alt={`${identity.name} profile`}
              width={224}
              height={224}
              priority
              className={identityAvatarImage}
            />
            <span className={identityAvatarReflection} aria-hidden="true" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h1
            className={cn(
              "text-2xl font-semibold tracking-tight sm:text-3xl",
              getContrastTextClass("identity-card", "heading"),
            )}
          >
            {identity.name}
          </h1>
          <p
            className={cn(
              "mt-4 max-w-md text-sm leading-relaxed sm:mt-5 sm:text-base",
              getContrastTextClass("identity-card", "muted"),
            )}
          >
            {identity.bio}
          </p>
        </div>
      </div>
    </div>
  );
}
