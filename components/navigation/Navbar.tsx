"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data";
import { navLinks } from "@/lib/constants";
import { isActiveNavRoute } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";
import { NavItem } from "./NavItem";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="transition-transform duration-200"
    >
      {open ? (
        <path
          d="M5 5L15 15M15 5L5 15"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ) : (
        <>
          <path
            d="M3.5 6H16.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M3.5 10H16.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M3.5 14H16.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-black/[0.08] bg-background/60 backdrop-blur-[12px]",
          "shadow-[0_1px_0_0_var(--glow)]",
        )}
      >
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--glow)] to-transparent"
          aria-hidden
        />

        <div className="relative mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className={cn(
              "text-sm font-semibold tracking-tight text-foreground transition-all duration-200",
              "hover:scale-[1.03] hover:opacity-90",
            )}
          >
            {siteConfig.name}
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <NavItem
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={isActiveNavRoute(pathname, link.href)}
              />
            ))}
          </nav>

          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center rounded-lg border border-black/[0.08] bg-black/[0.04] p-2 text-foreground backdrop-blur-[12px] transition-all duration-200 md:hidden",
              "hover:scale-[1.03] hover:shadow-[0_0_20px_-6px_var(--glow)]",
            )}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={closeMobileMenu}>
        <div id="mobile-navigation">
          {navLinks.map((link) => (
            <NavItem
              key={link.href}
              href={link.href}
              label={link.label}
              isActive={isActiveNavRoute(pathname, link.href)}
              onNavigate={closeMobileMenu}
              className="w-full px-4 py-3"
            />
          ))}
        </div>
      </MobileMenu>
    </>
  );
}
