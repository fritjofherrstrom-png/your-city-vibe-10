import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { CITIES, VIBES, type Vibe } from "@/data/cities";
import {
  getCityWideSignals,
  getNeighborhoodAdvice,
  getPulseSignalsForStop,
} from "@/lib/pulse-match";
import { ROME_PULSE } from "@/data/pulse";

// Demon fokuserar på Rom — Stockholm och Prag finns kvar i datan för senare.
const ROME = CITIES.find((c) => c.id === "rome")!;

export function RouteBuilder() {
  const [vibe, setVibe] = useState<Vibe>("slow");
  const route = ROME.routes[vibe];

  const cityWide = useMemo(() => getCityWideSignals(vibe), [vibe]);
  const hoodAdvice = useMemo(() => getNeighborhoodAdvice(), []);

  return (
    <section id="route" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-12 gap-12 mb-12">
          <div className="md:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
              § Kapitel 03 · Bygg din dag
            </p>
            <h2 className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight">
              Vad är det för<br />
              <em className="italic">slags</em> dag i Rom?
            </h2>
            <p className="mt-6 text-muted-foreground max-w-md">
              Samma stad, fyra helt olika dagar. Rutten anpassas till vad som faktiskt händer
              just i dag — det du läste i Puls ovan.
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
            key={vibe}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            <div className="grid md:grid-cols-12 gap-10 mb-12 items-end">
              <div className="md:col-span-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent mb-4">
                  Rutten · Rom · {VIBES.find((v) => v.id === vibe)?.label}
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
                  {route.stops.length} stopp · ca {(route.stops.length * 1.2) | 0}h
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
  );
}
