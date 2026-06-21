import { siteConfig } from "@/data";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-center sm:flex-row sm:px-6 sm:text-left">
        <p className="text-xs text-muted">
          &copy; {year} {siteConfig.name}
        </p>
        <p className="text-xs text-muted/80">Built on Base</p>
      </div>
    </footer>
  );
}
