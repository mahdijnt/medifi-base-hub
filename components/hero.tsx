import { siteConfig } from "@/data";

export function Hero() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {siteConfig.name}
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted">{siteConfig.description}</p>
    </section>
  );
}
