"use client";

import { cn } from "@/lib/utils";
import { getContrastTextClass } from "@/utils/color/autoTextColor";
import {
  glassGradientBorder,
  glassHoverGlow,
  glassInnerSurface,
  glassRadialGlow,
} from "./glass-styles";

type AnalyzeButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export function AnalyzeButton({
  onClick,
  disabled = false,
  loading = false,
}: AnalyzeButtonProps) {
  return (
    <div className="flex justify-center pt-2 sm:justify-start">
      <div
        className={cn(
          glassGradientBorder,
          "transition-transform duration-200 ease-out active:scale-[0.98]",
          (disabled || loading) && "opacity-70",
        )}
      >
        <button
          type="button"
          onClick={onClick}
          disabled={disabled || loading}
          className={cn(
            "group relative overflow-hidden rounded-[15px] px-8 py-3",
            glassInnerSurface,
            glassHoverGlow,
            "border-0 font-medium",
            getContrastTextClass("interactive", "value"),
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-purple)]/30",
            (disabled || loading) && "cursor-not-allowed hover:shadow-none",
          )}
        >
          <div
            className={cn(
              glassRadialGlow,
              "opacity-0 transition-opacity duration-300 group-hover:opacity-100",
              (disabled || loading) && "group-hover:opacity-0",
            )}
            aria-hidden="true"
          />
          <span className="relative flex items-center gap-2">
            {loading ? (
              <svg
                className={cn("size-4 animate-spin", getContrastTextClass("interactive", "muted"))}
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
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
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            )}
            {loading ? "Analyzing..." : "Analyze"}
          </span>
        </button>
      </div>
    </div>
  );
}
