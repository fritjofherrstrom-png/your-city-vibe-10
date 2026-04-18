export function SiteFooter() {
  return (
    <footer className="bg-background border-t border-foreground/15 py-12">
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-3 gap-8 items-end">
        <div>
          <div className="font-display text-2xl">Parranda</div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-2">
            City. Vibe. Day. — Issue Nº01
          </p>
        </div>
        <p className="text-sm text-muted-foreground md:text-center text-pretty">
          Lokalt kuraterade rutter för Rom, Stockholm och Prag. Fler städer landar snart.
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:text-right">
          © {new Date().getFullYear()} Parranda · Stockholm · Roma · Praha
        </p>
      </div>
    </footer>
  );
}
