import type { PulseDay } from "@/data/pulse";
import type { DayWeather } from "@/lib/weather";
import { formatRefTime } from "@/lib/pulse-time";
import { WeatherStrip } from "./WeatherStrip";

type Props = {
  day: PulseDay;
  weather: DayWeather;
  refMinutes: number;
  isToday: boolean;
};

export function PulseMasthead({ day, weather, refMinutes, isToday }: Props) {
  return (
    <div className="grid md:grid-cols-12 gap-8 items-start mb-12">
      <div className="md:col-span-8">
        <div className="flex items-center gap-3 mb-6">
          <span
            className="inline-block w-2 h-2 rounded-full bg-terracotta"
            style={{ animation: "pulseDot 2.4s ease-in-out infinite" }}
          />
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-paper/70">
            {isToday ? "Live · just nu" : "Simulerad puls · "}
            {!isToday && (
              <span className="text-paper/50">referenstid {formatRefTime(refMinutes)}</span>
            )}
          </p>
        </div>

        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper/60 mb-3">
          § Just nu i Rom · {day.weekdayLabel} {day.dateLabel}
        </p>

        <h2 className="font-display text-4xl md:text-6xl leading-[1.02] tracking-tight text-balance">
          {day.headline}
        </h2>

        <p className="mt-6 font-display italic text-lg md:text-xl text-paper/75 max-w-2xl text-pretty">
          {day.subhead}
        </p>
      </div>

      <div className="md:col-span-4 space-y-4">
        <div className="md:text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/50 mb-2">
            Edition
          </p>
          <p className="font-display text-2xl">
            <time dateTime={day.date}>
              {day.weekdayLabel}
              <br />
              {day.dateLabel}
            </time>
          </p>
        </div>
        <WeatherStrip weather={weather} tone="ink" />
      </div>
    </div>
  );
}
