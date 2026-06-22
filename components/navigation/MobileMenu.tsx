"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function MobileMenu({ isOpen, onClose, children }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/40 backdrop-blur-sm transition-opacity duration-200 md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!isOpen}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-[min(100%,18rem)] flex-col border-l border-black/[0.08] bg-background/75 p-6 pt-20 shadow-[0_0_40px_-8px_var(--glow)] backdrop-blur-[16px] transition-all duration-200 md:hidden",
          isOpen ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-full opacity-0",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--glow),transparent_55%)]"
          aria-hidden
        />
        <nav className="relative flex flex-col gap-1">{children}</nav>
      </div>
    </>
  );
}
