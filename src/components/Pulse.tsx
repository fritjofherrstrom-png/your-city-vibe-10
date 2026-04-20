import { useMemo } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ROME_PULSE_DAYS, type PulseLevel } from "@/data/pulse";
import { annotateItem, getReferenceMinutes, sortByTimeStatus } from "@/lib/pulse-time";
import { getWeather } from "@/lib/weather";
import type { TripSearch } from "@/lib/trip";
import { PulseMasthead } from "./pulse/PulseMasthead";
import { PulseDayTabs } from "./pulse/PulseDayTabs";
import { PulseTimeline } from "./pulse/PulseTimeline";
import { PulseLevelGroup } from "./pulse/PulseLevelGroup";
import { PulseSneakPeek } from "./pulse/PulseSneakPeek";

const LEVEL_ORDER: PulseLevel[] = ["city", "neighborhood", "venue"];

export function Pulse() {
  const navigate = useNavigate();
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
  const upcomingDays = ROME_PULSE_DAYS.slice(dayIndex + 1, tripDayCount);
  const visibleDays = ROME_PULSE_DAYS.slice(0, tripDayCount);

  const today = new Date().toISOString().slice(0, 10);
  const isToday = activeDay.date === today;
  const refMinutes = useMemo(
    () => getReferenceMinutes(activeDay.date),
    [activeDay.date],
  );

  const weather = useMemo(() => getWeather(activeDay.date), [activeDay.date]);

  const annotated = useMemo(
    () => activeDay.items.map((i) => annotateItem(i, refMinutes)),
    [activeDay.items, refMinutes],
  );

  const grouped = useMemo(() => {
    return LEVEL_ORDER.map((lvl) => ({
      level: lvl,
      items: sortByTimeStatus(annotated.filter((i) => i.level === lvl)),
    }));
  }, [annotated]);

  const setDay = (i: number) => {
    navigate({
      to: "/",
      search: (prev) => ({ ...prev, day: i }),
      hash: "pulse",
    });
  };

  const liveCount = annotated.filter((i) => i.status === "live").length;
  const soonCount = annotated.filter((i) => i.status === "soon").length;

  return (
    <section id="pulse" className="bg-ink text-paper py-24 md:py-32 grain relative overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-40 -right-40 w-[480px] h-[480px] rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--terracotta)" }}
      />

      <div className="mx-auto max-w-7xl px-6 relative">
        <PulseMasthead
          day={activeDay}
          weather={weather}
          refMinutes={refMinutes}
          isToday={isToday}
        />

        <PulseDayTabs days={visibleDays} activeIndex={dayIndex} onSelect={setDay} />

        <PulseTimeline items={annotated} refMinutes={refMinutes} />

        {(liveCount > 0 || soonCount > 0) && (
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/60 mb-8">
            {liveCount > 0 && (
              <span className="text-terracotta">● {liveCount} live nu</span>
            )}
            {liveCount > 0 && soonCount > 0 && <span className="text-paper/30"> · </span>}
            {soonCount > 0 && <span className="text-sun">○ {soonCount} börjar inom timmen</span>}
          </p>
        )}

        <div className="space-y-20">
          {grouped.map((group) => (
            <PulseLevelGroup key={group.level} level={group.level} items={group.items} />
          ))}
        </div>

        <PulseSneakPeek
          upcomingDays={upcomingDays}
          baseDayIndex={dayIndex}
          onSelect={setDay}
        />

        <div className="mt-20 pt-8 border-t border-paper/15 grid md:grid-cols-12 gap-6 items-end">
          <p className="md:col-span-8 font-display italic text-lg md:text-xl text-paper/75 text-pretty max-w-2xl">
            En lokal hade vetat det här utan att tänka på det. Det är vad Parranda gör — en stad
            som viskar i örat, inte en lista att bocka av.
          </p>
          <p className="md:col-span-4 md:text-right font-mono text-[10px] uppercase tracking-[0.25em] text-paper/50">
            Nästa uppdatering · i morgon 06:00
          </p>
        </div>
      </div>
    </section>
  );
}
