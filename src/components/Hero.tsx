import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { CalendarIcon, ChevronDown } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ROME_ZONES, type RomeZone } from "@/data/rome-geography";
import { walkLabel, type TripSearch } from "@/lib/trip";
import { VIBES, type Vibe } from "@/data/cities";
import heroImage from "@/assets/hero-rome.jpg";

/**
 * Hero = motorn. Inputen ÄR landningssidan.
 * Två primära signaler synliga: var bor du + vad är du sugen på.
 * Allt annat (datum, walk, kalenderfinjustering) bakom "Justera resan".
 */
export function Hero() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/" }) as TripSearch;
  const [adjustOpen, setAdjustOpen] = useState(false);

  // Lokalt draft state — committas till URL vid "Bygg min dag"
  const [zone, setZone] = useState<RomeZone>(search.zone as RomeZone);
  const [vibe, setVibe] = useState<Vibe>(search.vibe as Vibe);
  const [walk, setWalk] = useState<number>(search.walk);
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(search.start + "T00:00:00"),
    to: new Date(search.end + "T00:00:00"),
  });

  const compose = () => {
    const start = range?.from ? format(range.from, "yyyy-MM-dd") : search.start;
    const end = range?.to
      ? format(range.to, "yyyy-MM-dd")
      : range?.from
        ? format(range.from, "yyyy-MM-dd")
        : search.end;

    navigate({
      to: "/",
      search: (prev) => ({
        ...prev,
        zone,
        vibe,
        walk,
        start,
        end,
        day: 0,
      }),
      hash: "route",
    });

    // Smooth scroll till resultatet — det här är hela poängen
    setTimeout(() => {
      document.getElementById("route")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const startLabel = range?.from ? format(range.from, "d MMM", { locale: sv }) : "—";
  const endLabel = range?.to ? format(range.to, "d MMM", { locale: sv }) : startLabel;
  const dayCount =
    range?.from && range?.to
      ? Math.round((range.to.getTime() - range.from.getTime()) / 86400000) + 1
      : 1;

  const activeZone = ROME_ZONES.find((z) => z.id === zone);
  const activeVibe = VIBES.find((v) => v.id === vibe);

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Bakgrundsbild — diskret, inte huvudsaken längre */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background"
      />

      <div className="relative mx-auto max-w-5xl px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-8 flex items-center gap-3"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
          Issue Nº01 · Rom · april 2026
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="font-display text-[2.4rem] sm:text-5xl md:text-7xl leading-[0.95] tracking-tight text-balance max-w-4xl"
        >
          Parranda <em className="font-display italic text-accent not-italic">komponerar</em>
          <br />
          din dag i staden.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed text-pretty"
        >
          Ge mig plats, smak och tempo. Jag bygger en sammanhängande dag — inte en lista.
        </motion.p>

        {/* ── Motorn ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 border border-foreground/20 bg-paper/95 backdrop-blur shadow-[var(--shadow-card)]"
        >
          <div className="p-6 md:p-8 space-y-7">
            {/* Signal 1: Plats */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground block mb-3">
                01 · Var bor du i Rom
              </label>
              <div className="flex flex-wrap gap-2">
                {ROME_ZONES.map((z) => {
                  const active = zone === z.id;
                  return (
                    <button
                      key={z.id}
                      onClick={() => setZone(z.id)}
                      className={cn(
                        "px-4 py-2 border font-display text-base transition-all",
                        active
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-foreground/20 hover:border-foreground bg-background",
                      )}
                    >
                      {z.label}
                    </button>
                  );
                })}
              </div>
              {activeZone && (
                <p className="mt-3 font-display italic text-sm text-muted-foreground">
                  ↳ {activeZone.blurb}
                </p>
              )}
            </div>

            {/* Signal 2: Stämning */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground block mb-3">
                02 · Vad är du sugen på
              </label>
              <div className="grid sm:grid-cols-2 gap-2">
                {VIBES.map((v) => {
                  const active = vibe === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setVibe(v.id)}
                      className={cn(
                        "text-left p-4 border transition-all",
                        active
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-foreground/20 hover:border-foreground bg-background",
                      )}
                    >
                      <div className="font-display text-lg leading-tight">{v.label}</div>
                      <div
                        className={cn(
                          "mt-1 text-xs leading-snug",
                          active ? "opacity-90" : "text-muted-foreground",
                        )}
                      >
                        {v.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Justera resan — disclosure för datum + walk */}
            <div className="border-t border-foreground/15 pt-5">
              <button
                onClick={() => setAdjustOpen((o) => !o)}
                className="w-full flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>
                  Justera resan ·{" "}
                  <span className="text-foreground">
                    {startLabel} → {endLabel}
                  </span>
                  <span className="ml-2 text-muted-foreground">
                    · {walk} min · {walkLabel(walk)}
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform",
                    adjustOpen && "rotate-180",
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {adjustOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-5 grid md:grid-cols-2 gap-6">
                      {/* Datum */}
                      <div>
                        <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground block mb-2">
                          När
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-display text-base h-auto py-3 border-foreground/30"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startLabel} → {endLabel}
                              <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                {dayCount} {dayCount === 1 ? "dag" : "dagar"}
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="range"
                              selected={range}
                              onSelect={setRange}
                              numberOfMonths={1}
                              defaultMonth={range?.from ?? new Date("2026-04-18")}
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                          Demo: 18–22 april 2026
                        </p>
                      </div>

                      {/* Walk */}
                      <div>
                        <div className="flex items-baseline justify-between mb-2">
                          <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                            Tempo
                          </label>
                          <span className="font-display text-base">
                            {walk}{" "}
                            <span className="text-muted-foreground text-xs">min · {walkLabel(walk)}</span>
                          </span>
                        </div>
                        <Slider
                          value={[walk]}
                          onValueChange={(v) => setWalk(v[0])}
                          min={5}
                          max={45}
                          step={1}
                          className="my-3"
                        />
                        <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                          <span>kort</span>
                          <span>lång</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* CTA */}
          <div className="border-t border-foreground/20 bg-sand/40 p-5 md:p-6 flex flex-wrap items-center justify-between gap-4">
            <p className="font-display italic text-sm md:text-base text-muted-foreground max-w-md">
              {activeVibe?.label} från {activeZone?.label} · {dayCount}{" "}
              {dayCount === 1 ? "dag" : "dagar"}
            </p>
            <Button
              onClick={compose}
              className="font-mono text-xs uppercase tracking-[0.25em] h-12 px-7 bg-foreground text-background hover:bg-accent"
            >
              Bygg min dag →
            </Button>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
        >
          ◉ plats · smak · tempo · stämning → en sammanhängande dag
        </motion.p>
      </div>
      <div className="editorial-rule mx-auto max-w-7xl" />
    </section>
  );
}
