import { siteConfig } from "@/data";

export function Hero() {
  return (
    <section className="flex min-h-[calc(100vh-7rem)] flex-col justify-center py-12 sm:py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-widest text-muted">
          Builder Hub
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {siteConfig.name}
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
          {siteConfig.description}
        </p>
      </div>
    </section>
  );
}
