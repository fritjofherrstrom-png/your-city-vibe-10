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
          <a href="#cities" className="hover:text-accent transition-colors">Städer</a>
          <a href="#route" className="hover:text-accent transition-colors">Demo-rutt</a>
          <a href="#manifesto" className="hover:text-accent transition-colors">Manifest</a>
        </nav>
        <a
          href="#cities"
          className="text-xs font-mono uppercase tracking-[0.18em] border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors"
        >
          Bygg en dag
        </a>
      </div>
    </header>
  );
}
