import { useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import { ROME_PULSE_DAYS } from "@/data/pulse";
import { getWeather } from "@/lib/weather";
import { WeatherStrip } from "@/components/pulse/WeatherStrip";
import type { TripSearch } from "@/lib/trip";

export function SiteHeader() {
  const search = useSearch({ from: "/" }) as TripSearch;

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
  const activeDay = ROME_PULSE_DAYS[dayIndex] ?? ROME_PULSE_DAYS[0];
  const weather = getWeather(activeDay.date);

  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-4">
        <a href="/" className="flex items-baseline gap-2 group shrink-0">
          <span className="font-display text-2xl tracking-tight">Parranda</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hidden sm:inline">
            City. Vibe. Day.
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#concept" className="hover:text-accent transition-colors">Konceptet</a>
          <a href="#pulse" className="hover:text-accent transition-colors">Just nu i Rom</a>
          <a href="#route" className="hover:text-accent transition-colors">Din dag</a>
          <a href="#manifesto" className="hover:text-accent transition-colors">Manifest</a>
        </nav>
        <div className="hidden lg:block">
          <WeatherStrip weather={weather} tone="paper" compact />
        </div>
      </div>
    </header>
  );
}
