"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type NavItemProps = {
  href: string;
  label: string;
  isActive: boolean;
  onNavigate?: () => void;
  className?: string;
};

export function NavItem({
  href,
  label,
  isActive,
  onNavigate,
  className,
}: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
        "hover:scale-[1.03] hover:opacity-100",
        isActive
          ? "text-foreground opacity-100 shadow-[0_0_20px_-6px_var(--glow)]"
          : "text-muted opacity-80 hover:text-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute inset-0 rounded-lg bg-[radial-gradient(ellipse_at_center,var(--glow),transparent_70%)] opacity-0 transition-opacity duration-200",
          "group-hover:opacity-60",
          isActive && "opacity-40",
        )}
        aria-hidden
      />
      <span className="relative">{label}</span>
      <span
        className={cn(
          "absolute inset-x-2 -bottom-0.5 h-px rounded-full bg-gradient-to-r from-transparent via-foreground/60 to-transparent transition-all duration-200",
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50",
        )}
        aria-hidden
      />
    </Link>
  );
}
