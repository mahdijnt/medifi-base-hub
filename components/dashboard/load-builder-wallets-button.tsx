"use client";

import { cn } from "@/lib/utils";
import { getContrastTextClass } from "@/utils/color/autoTextColor";
import {
  glassGradientBorder,
  glassHoverGlow,
  glassInnerSurface,
  glassRadialGlow,
} from "./glass-styles";

type LoadBuilderWalletsButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export function LoadBuilderWalletsButton({
  onClick,
  disabled = false,
}: LoadBuilderWalletsButtonProps) {
  return (
    <div className="flex justify-center pt-2 sm:justify-start">
      <div
        className={cn(
          glassGradientBorder,
          "transition-transform duration-200 ease-out active:scale-[0.98]",
          disabled && "opacity-70",
        )}
      >
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={cn(
            "group relative overflow-hidden rounded-[15px] px-6 py-3",
            glassInnerSurface,
            glassHoverGlow,
            "border-0 text-sm font-medium",
            getContrastTextClass("interactive", "value"),
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-purple)]/30",
            disabled && "cursor-not-allowed hover:shadow-none",
          )}
        >
          <div
            className={cn(
              glassRadialGlow,
              "opacity-0 transition-opacity duration-300 group-hover:opacity-100",
              disabled && "group-hover:opacity-0",
            )}
            aria-hidden="true"
          />
          <span className="relative flex items-center gap-2">
            <svg
              className={cn(
                "size-4 transition-transform duration-300 group-hover:scale-110",
                getContrastTextClass("interactive", "muted"),
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Load Builder Wallets
          </span>
        </button>
      </div>
    </div>
  );
}
