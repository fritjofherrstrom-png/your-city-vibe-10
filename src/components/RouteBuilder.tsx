import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CITIES, VIBES, type City, type Vibe } from "@/data/cities";

export function RouteBuilder() {
  const [cityId, setCityId] = useState<City["id"]>("rome");
  const [vibe, setVibe] = useState<Vibe>("slow");

  const city = CITIES.find((c) => c.id === cityId)!;
  const route = city.routes[vibe];

  return (
    <>
      {/* Cities picker */}
      <section id="cities" className="bg-sand py-24 md:py-32 grain">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between mb-12 gap-8 flex-wrap">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
                § Kapitel 02 · Välj din stad
              </p>
              <h2 className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight max-w-xl">
                Tre städer.<br />Tre helt olika dagar.
              </h2>
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground max-w-xs">
              Klicka på en stad — välj en vibe — se rutten byggas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {CITIES.map((c, i) => (
              <motion.button
                key={c.id}
                onClick={() => setCityId(c.id)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className={`group text-left bg-background overflow-hidden border-2 transition-colors ${
                  cityId === c.id ? "border-accent" : "border-transparent hover:border-foreground/30"
                }`}
              >
                <div className="aspect-[4/5] overflow-hidden bg-muted relative">
                  <img
                    src={c.image}
                    alt={`${c.name}, ${c.country}`}
                    loading="lazy"
                    width={1024}
                    height={1280}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.25em] bg-background px-2 py-1">
                    Nº0{i + 1}
                  </div>
                </div>
                <div className="p-6 flex items-baseline justify-between">
                  <div>
                    <h3 className="font-display text-3xl">{c.name}</h3>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
                      {c.country}
                    </p>
                  </div>
                  <span
                    className={`font-mono text-[11px] uppercase tracking-[0.18em] ${
                      cityId === c.id ? "text-accent" : "text-muted-foreground"
                    }`}
                  >
                    {cityId === c.id ? "● vald" : "välj →"}
                  </span>
                </div>
                <p className="px-6 pb-6 text-sm text-muted-foreground italic font-display leading-snug">
                  "{c.tagline}"
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Vibe picker + Route */}
      <section id="route" className="bg-background py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-12 gap-12 mb-12">
            <div className="md:col-span-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
                § Kapitel 03 · Sätt vibet
              </p>
              <h2 className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight">
                Vad är det för<br />
                <em className="italic">slags</em> dag?
              </h2>
              <p className="mt-6 text-muted-foreground max-w-md">
                Samma stad, fyra helt olika dagar. Det är hela poängen.
              </p>
            </div>

            <div className="md:col-span-7 grid sm:grid-cols-2 gap-3">
              {VIBES.map((v) => {
                const active = vibe === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setVibe(v.id)}
                    className={`text-left p-5 border transition-all ${
                      active
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-foreground/20 hover:border-foreground bg-background"
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-display text-xl">{v.label}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-60">
                        {active ? "●" : "○"}
                      </span>
                    </div>
                    <p className={`mt-2 text-sm ${active ? "opacity-90" : "text-muted-foreground"}`}>
                      {v.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="editorial-rule my-16" />

          {/* Route output */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${cityId}-${vibe}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid md:grid-cols-12 gap-10 mb-12 items-end">
                <div className="md:col-span-8">
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent mb-4">
                    Rutten · {city.name} · {VIBES.find((v) => v.id === vibe)?.label}
                  </p>
                  <h3 className="font-display text-3xl md:text-5xl leading-[1.05] tracking-tight text-balance">
                    {route.title}
                  </h3>
                  <p className="mt-4 text-lg italic font-display text-muted-foreground">
                    {route.subtitle}
                  </p>
                </div>
                <div className="md:col-span-4 md:text-right">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {route.stops.length} stopp · ca {route.stops.length * 1.2 | 0}h
                  </p>
                </div>
              </div>

              <ol className="space-y-0 border-t border-foreground/20">
                {route.stops.map((stop, i) => (
                  <motion.li
                    key={`${stop.title}-${i}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="grid grid-cols-12 gap-4 md:gap-8 py-8 border-b border-foreground/15 group hover:bg-sand/50 transition-colors px-2 -mx-2"
                  >
                    <div className="col-span-3 md:col-span-2">
                      <div className="font-mono text-xs text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="font-display text-2xl md:text-3xl mt-1">{stop.time}</div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-2">
                        {stop.duration}
                      </div>
                    </div>

                    <div className="col-span-9 md:col-span-7">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <h4 className="font-display text-2xl md:text-3xl group-hover:text-accent transition-colors">
                          {stop.title}
                        </h4>
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          {stop.type}
                        </span>
                      </div>
                      <p className="mt-3 text-base leading-relaxed text-pretty max-w-prose">
                        {stop.blurb}
                      </p>
                      {stop.tip && (
                        <p className="mt-3 text-sm italic font-display text-accent">
                          ↳ {stop.tip}
                        </p>
                      )}
                    </div>

                    <div className="hidden md:block md:col-span-3 text-right">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        ◉ {stop.neighborhood}
                      </span>
                    </div>
                  </motion.li>
                ))}
              </ol>

              <div className="mt-12 flex flex-wrap items-center justify-between gap-4 p-6 border border-foreground/30 bg-sand/40">
                <p className="font-display italic text-lg max-w-md">
                  Det här är en smakbit. I appen får du karta, tidsoptimering och en knapp för
                  "byt ett stopp".
                </p>
                <a
                  href="#manifesto"
                  className="font-mono text-xs uppercase tracking-[0.2em] underline underline-offset-8 decoration-foreground/40 hover:text-accent hover:decoration-accent transition-colors whitespace-nowrap"
                >
                  Läs manifestet →
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
