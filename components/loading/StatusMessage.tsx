"use client";

import { cn } from "@/lib/utils";

type StatusMessageProps = {
  message: string;
  active?: boolean;
  delay?: number;
  className?: string;
};

export function StatusMessage({
  message,
  active = true,
  delay = 0,
  className,
}: StatusMessageProps) {
  return (
    <p
      className={cn(
        "text-sm font-medium text-muted transition-opacity duration-500 ease-out",
        active ? "opacity-100" : "opacity-0",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
      aria-live="polite"
    >
      {message}
    </p>
  );
}
