import type { DayWeather } from "@/lib/weather";
import { CONDITION_GLYPH, CONDITION_LABEL, getClothingAdvice } from "@/lib/weather";

type Props = {
  weather: DayWeather;
  /** Visuell variant — paper för ljus bakgrund, ink för mörk. */
  tone?: "paper" | "ink";
  /** Kompakt variant för header */
  compact?: boolean;
};

/**
 * WeatherStrip — visar dagens väder + klädråd.
 * Används både i Pulse-headern (full) och SiteHeader (compact).
 */
export function WeatherStrip({ weather, tone = "paper", compact = false }: Props) {
  const advice = getClothingAdvice(weather);
  const isInk = tone === "ink";

  const labelColor = isInk ? "text-paper/55" : "text-muted-foreground";
  const valueColor = isInk ? "text-paper" : "text-foreground";
  const detailColor = isInk ? "text-paper/70" : "text-muted-foreground";
  const borderColor = isInk ? "border-paper/15" : "border-foreground/15";

  if (compact) {
    return (
      <div className={`flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] ${labelColor}`}>
        <span className={`text-base ${valueColor}`} aria-hidden>
          {CONDITION_GLYPH[weather.condition]}
        </span>
        <span className={valueColor}>{weather.highC}°</span>
        <span className="hidden sm:inline">{advice.headline}</span>
      </div>
    );
  }

  return (
    <div className={`border ${borderColor} px-5 py-4 grid sm:grid-cols-[auto_1fr] gap-x-6 gap-y-3 items-start`}>
      <div className="flex items-center gap-4">
        <span className={`text-4xl leading-none ${valueColor}`} aria-hidden>
          {CONDITION_GLYPH[weather.condition]}
        </span>
        <div>
          <p className={`font-display text-3xl leading-none ${valueColor}`}>
            {weather.highC}°<span className={`text-base ${detailColor} ml-1`}>/ {weather.eveningC}° kväll</span>
          </p>
          <p className={`font-mono text-[10px] uppercase tracking-[0.25em] mt-1 ${labelColor}`}>
            {CONDITION_LABEL[weather.condition]} · {weather.rainChance}% regn
          </p>
        </div>
      </div>
      <div className={`sm:border-l ${borderColor} sm:pl-6`}>
        <p className={`font-mono text-[10px] uppercase tracking-[0.25em] mb-1 ${labelColor}`}>
          Klädråd
        </p>
        <p className={`font-display text-lg leading-snug ${valueColor}`}>
          {advice.headline}
        </p>
        <p className={`text-sm leading-snug mt-1 ${detailColor}`}>
          {advice.detail}
        </p>
      </div>
    </div>
  );
}
