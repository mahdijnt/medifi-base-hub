import { cn } from "@/lib/utils";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/navigation";

type AppLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export function AppLayout({ children, className }: AppLayoutProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className={cn("mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6", className)}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
