const PILLARS = [
  {
    no: "01",
    title: "Plats",
    body: "Var står du? Vad finns runt hörnet som är värt att känna till? Parranda börjar där du är — inte där guideboken börjar.",
  },
  {
    no: "02",
    title: "Smak",
    body: "Naturvin eller espressobar? Modernism eller barock? Vi vet skillnaden, och vi planerar därefter.",
  },
  {
    no: "03",
    title: "Tempo",
    body: "Tre timmar eller en hel söndag. En lugn lunch eller fyra stopp innan midnatt. Du sätter takten.",
  },
  {
    no: "04",
    title: "Stämning",
    body: "Romantisk, nyfiken, utelivshungrig, långsam. Säg vibet — vi bygger dagen runt det.",
  },
];

export function Concept() {
  return (
    <section id="concept" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
              § Kapitel 01
            </p>
            <h2 className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight">
              En reskompis,<br />
              inte en lista.
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p className="text-lg leading-relaxed text-pretty">
              Bloggar är gamla. Google Maps-listor är generella. TikTok-sparningar är spridda
              överallt. Parranda samlar fyra saker — <em className="font-display">plats, smak, tempo, stämning</em> —
              och bygger en faktisk rutt. Inte hundra alternativ. Bara den som passar idag.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
              Lokalkuraterat. Tidsoptimerat. Ärligt. En bättre dag i en stad,
              snabbare och snyggare än det du hade gjort själv.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-t border-foreground/20">
          {PILLARS.map((p) => (
            <div
              key={p.no}
              className="p-8 border-b border-foreground/20 lg:border-r lg:last:border-r-0 sm:[&:nth-child(2)]:lg:border-r [&:nth-child(odd)]:sm:border-r sm:[&:nth-child(odd)]:lg:border-r"
            >
              <div className="font-mono text-xs text-accent mb-6">{p.no}</div>
              <h3 className="font-display text-2xl mb-3">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
