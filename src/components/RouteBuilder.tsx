import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { CITIES, VIBES, type Stop, type Vibe } from "@/data/cities";
import {
  getCityWideSignals,
  getNeighborhoodAdvice,
  getPulseSignalsForStop,
} from "@/lib/pulse-match";
import { getPulseDay, ROME_PULSE_DAYS } from "@/data/pulse";
import { neighborhoodToZone, walkMinutesBetween, type RomeZone } from "@/data/rome-geography";
import { walkLabel, type TripSearch } from "@/lib/trip";
import { TripPlanner } from "@/components/TripPlanner";
import { getWeather, isRainMode, CONDITION_GLYPH, CONDITION_LABEL } from "@/lib/weather";

/** Stop-typer som räknas som "inomhus" — funkar bra i regn. */
const INDOOR_TYPES = new Set([
  "Museum",
  "Konst",
  "Konsthall",
  "Bokhandel",
  "Bar",
  "Cocktails",
  "Vin",
  "Vinbar",
  "Klubb",
  "Pivnice",
  "Hak",
  "Caffè",
  "Kaffe",
  "Fika",
  "Lunch",
  "Middag",
  "Smörgås",
  "Cocktail",
  "Aperitivo",
  "Aperitif",
  "Apertivo",
  "Hemlighet",
  "Arkitektur",
]);

function isIndoor(stop: Stop): boolean {
  return INDOOR_TYPES.has(stop.type);
}

const ROME = CITIES.find((c) => c.id === "rome")!;

export function RouteBuilder() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/" }) as TripSearch;
  const vibe = search.vibe as Vibe;
  const homeZone = search.zone as RomeZone;
  const walkLimit = search.walk;

  const route = ROME.routes[vibe];

  // Vilken pulse-dag visar vi i ruttens kontext?
  const tripDayCount = useMemo(() => {
    const start = new Date(search.start + "T00:00:00");
    const end = new Date(search.end + "T00:00:00");
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return 1;
    return Math.min(
      ROME_PULSE_DAYS.length,
      Math.round((end.getTime() - start.getTime()) / 86400000) + 1,
    );
  }, [search.start, search.end]);

  const dayIndex = Math.min(search.day, tripDayCount - 1);
  const activeDay = ROME_PULSE_DAYS[dayIndex] ?? getPulseDay(undefined);

  const cityWide = useMemo(
    () => getCityWideSignals(vibe, activeDay),
    [vibe, activeDay],
  );
  const hoodAdvice = useMemo(() => getNeighborhoodAdvice(activeDay), [activeDay]);

  const setVibe = (v: Vibe) => {
    navigate({
      to: "/",
      search: (prev: TripSearch) => ({ ...prev, vibe: v }),
      hash: "route",
    });
  };

  return (
    <section id="route" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Trip-summary banner — visar vad URL-state säger om resan */}
        <div className="mb-12 flex flex-wrap items-center justify-between gap-4 border border-foreground/20 bg-sand/50 px-5 py-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Din resa
            </span>
            <span className="font-display">
              {activeDay.weekdayLabel} {activeDay.dateLabel}
              {tripDayCount > 1 && (
                <span className="text-muted-foreground">
                  {" "}· dag {dayIndex + 1} av {tripDayCount}
                </span>
              )}
            </span>
            <span className="font-display">
              Bor i <em className="italic">{homeZone}</em>
            </span>
            <span className="font-display">
              Promenad: {walkLimit} min · {walkLabel(walkLimit)}
            </span>
          </div>
          <TripPlanner />
        </div>

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
              just i dag — och hur långt du orkar gå från {homeZone}.
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
            key={`${vibe}-${dayIndex}-${homeZone}-${walkLimit}`}
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

            {/* ── Pulse-banner ─────────────── */}
            {(cityWide.length > 0 || hoodAdvice.length > 0) && (
              <div className="mb-10 border-l-2 border-terracotta bg-sand/40 px-5 py-5 md:px-7 md:py-6">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full bg-terracotta"
                    style={{ animation: "pulseDot 2.4s ease-in-out infinite" }}
                  />
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    Puls påverkar din dag · {activeDay.weekdayLabel} {activeDay.dateLabel}
                  </p>
                </div>
                <ul className="space-y-3">
                  {cityWide.slice(0, 2).map((s) => (
                    <li key={s.id} className="flex gap-3 text-pretty">
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-terracotta shrink-0 mt-1">
                        {s.kind}
                      </span>
                      <p className="text-[0.95rem] leading-snug">
                        <span className="font-display italic">{s.title}</span>
                        <span className="text-muted-foreground"> — {s.whyItMatters}</span>
                      </p>
                    </li>
                  ))}
                  {hoodAdvice.slice(0, 1).map((s) => (
                    <li key={s.id} className="flex gap-3 text-pretty">
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-terracotta shrink-0 mt-1">
                        {s.kind}
                      </span>
                      <p className="text-[0.95rem] leading-snug">
                        <span className="font-display italic">{s.title}</span>
                        <span className="text-muted-foreground"> — {s.whyItMatters}</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <ol className="space-y-0 border-t border-foreground/20">
              {route.stops.map((stop, i) => {
                const stopSignals = getPulseSignalsForStop(stop, vibe, activeDay);
                const stopZone = neighborhoodToZone(stop.neighborhood);
                const fromHome = stopZone ? walkMinutesBetween(homeZone, stopZone) : null;
                const fromPrev = (() => {
                  if (i === 0) return null;
                  const prev = route.stops[i - 1];
                  const prevZone = neighborhoodToZone(prev.neighborhood);
                  if (!prevZone || !stopZone) return null;
                  return walkMinutesBetween(prevZone, stopZone);
                })();
                const overLimit =
                  (fromPrev !== null && fromPrev > walkLimit) ||
                  (i === 0 && fromHome !== null && fromHome > walkLimit);

                return (
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
                        {stopSignals.length > 0 && (
                          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-terracotta border border-terracotta/50 px-1.5 py-0.5">
                            ◉ puls
                          </span>
                        )}
                        {overLimit && (
                          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-destructive border border-destructive/50 px-1.5 py-0.5">
                            ⚠ över din promenadgräns
                          </span>
                        )}
                      </div>

                      {/* Walk-time annoteringar */}
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {i === 0 && fromHome !== null && (
                          <span>↳ {fromHome} min från {homeZone}</span>
                        )}
                        {fromPrev !== null && (
                          <span>↳ {fromPrev} min från förra stoppet</span>
                        )}
                      </div>

                      <p className="mt-3 text-base leading-relaxed text-pretty max-w-prose">
                        {stop.blurb}
                      </p>
                      {stop.tip && (
                        <p className="mt-3 text-sm italic font-display text-accent">
                          ↳ {stop.tip}
                        </p>
                      )}

                      {/* Pulse-annoteringar för detta stopp */}
                      {stopSignals.map((sig) => (
                        <div
                          key={sig.id}
                          className="mt-4 pl-3 border-l-2 border-terracotta/60"
                        >
                          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-terracotta mb-1">
                            {sig.kind} · {sig.when}
                          </p>
                          <p className="text-sm font-display italic text-pretty">
                            {sig.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1 text-pretty">
                            {sig.whyItMatters}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="hidden md:block md:col-span-3 text-right">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        ◉ {stop.neighborhood}
                      </span>
                    </div>
                  </motion.li>
                );
              })}
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
