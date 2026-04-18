export function Manifesto() {
  const points = [
    "En dag är inte en lista.",
    "Lokalbefolkning vet bäst.",
    "Tempo är personligt.",
    "Stämning slår sevärdhet.",
    "Mindre, men rätt.",
    "Karta + känsla, alltid båda.",
  ];

  return (
    <section id="manifesto" className="bg-foreground text-background py-24 md:py-32 grain">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-background/50 mb-4">
              § Manifest
            </p>
            <h2 className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight">
              Sex regler<br />vi följer.
            </h2>
            <p className="mt-8 text-background/70 max-w-sm">
              Vi tror att resor blir bättre när någon — som faktiskt bor där — har tänkt åt dig först.
            </p>
          </div>

          <ol className="md:col-span-8 grid sm:grid-cols-2 gap-x-10 gap-y-2">
            {points.map((p, i) => (
              <li
                key={i}
                className="flex items-baseline gap-5 py-6 border-b border-background/15"
              >
                <span className="font-mono text-xs text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-2xl md:text-3xl leading-tight">{p}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-20 flex flex-wrap items-center justify-between gap-6 pt-10 border-t border-background/20">
          <p className="font-display italic text-2xl md:text-3xl max-w-2xl">
            "En bättre dag i en stad — snabbare, snyggare, mer personligt."
          </p>
          <a
            href="#cities"
            className="font-mono text-xs uppercase tracking-[0.2em] border border-background px-6 py-3 hover:bg-background hover:text-foreground transition-colors"
          >
            Bygg din dag →
          </a>
        </div>
      </div>
    </section>
  );
}
