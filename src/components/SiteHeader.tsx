import { TripPlanner } from "@/components/TripPlanner";

export function SiteHeader() {
  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-baseline gap-2 group">
          <span className="font-display text-2xl tracking-tight">Parranda</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hidden sm:inline">
            City. Vibe. Day.
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#concept" className="hover:text-accent transition-colors">Konceptet</a>
          <a href="#pulse" className="hover:text-accent transition-colors">Just nu i Rom</a>
          <a href="#route" className="hover:text-accent transition-colors">Bygg din dag</a>
          <a href="#manifesto" className="hover:text-accent transition-colors">Manifest</a>
        </nav>
        <TripPlanner />
      </div>
    </header>
  );
}
