/**
 * Mock-väder per resedag.
 * Skrivet som om Open-Meteo redan vore inkopplat — samma form på datat,
 * så ett byte sen blir ett funktionsbyte, inte en refaktor.
 */

export type WeatherCondition =
  | "sunny"
  | "partly-cloudy"
  | "cloudy"
  | "light-rain"
  | "rain"
  | "thunder";

export type DayWeather = {
  date: string;
  /** Temperatur kl 14, °C */
  highC: number;
  /** Temperatur kl 21, °C */
  eveningC: number;
  condition: WeatherCondition;
  /** Sannolikhet för regn under dagen, 0–100 */
  rainChance: number;
  /** Kort beskrivning på svenska */
  blurb: string;
};

const ROME_WEATHER: Record<string, DayWeather> = {
  "2026-04-18": {
    date: "2026-04-18",
    highC: 21,
    eveningC: 15,
    condition: "partly-cloudy",
    rainChance: 10,
    blurb: "Mild aprildag. Lätt molnighet, klart mot kvällen.",
  },
  "2026-04-19": {
    date: "2026-04-19",
    highC: 23,
    eveningC: 17,
    condition: "sunny",
    rainChance: 0,
    blurb: "Den första riktigt varma dagen. Fullt sken hela dagen.",
  },
  "2026-04-20": {
    date: "2026-04-20",
    highC: 19,
    eveningC: 13,
    condition: "light-rain",
    rainChance: 60,
    blurb: "Skurar mellan 14 och 18. Klarnar lagom till aperitivo.",
  },
  "2026-04-21": {
    date: "2026-04-21",
    highC: 22,
    eveningC: 16,
    condition: "sunny",
    rainChance: 5,
    blurb: "Födelsedagsväder. Sol över Foro Romano hela dagen.",
  },
  "2026-04-22": {
    date: "2026-04-22",
    highC: 20,
    eveningC: 14,
    condition: "partly-cloudy",
    rainChance: 20,
    blurb: "Dagen efter — lite molnigt, lugnt, behagligt promenadväder.",
  },
};

const FALLBACK: DayWeather = {
  date: "—",
  highC: 20,
  eveningC: 14,
  condition: "partly-cloudy",
  rainChance: 15,
  blurb: "Vårtypiskt — sol och moln om vartannat.",
};

export function getWeather(dateISO: string): DayWeather {
  return ROME_WEATHER[dateISO] ?? FALLBACK;
}

/** Klädråd baserat på dagens (high) + kvällens (evening) temperatur + regn. */
export function getClothingAdvice(w: DayWeather): {
  headline: string;
  detail: string;
} {
  const rainy = w.condition === "rain" || w.condition === "thunder" || w.rainChance >= 50;
  const showers = w.condition === "light-rain" || (w.rainChance >= 25 && w.rainChance < 50);

  let headline = "";
  if (w.highC >= 24) headline = "Linne på dagen";
  else if (w.highC >= 20) headline = "T-shirt + lätt skjorta";
  else if (w.highC >= 15) headline = "Långärmat + tunn jacka";
  else if (w.highC >= 10) headline = "Stickat + jacka";
  else headline = "Kappa";

  const layerForEvening =
    w.eveningC < w.highC - 5
      ? `Ta med ett extra lager — kvällen landar på ${w.eveningC}°.`
      : `Kvällen håller sig kring ${w.eveningC}°.`;

  const rainBit = rainy
    ? " Paraply är ett måste."
    : showers
      ? " Vikbart paraply i väskan."
      : "";

  return {
    headline,
    detail: layerForEvening + rainBit,
  };
}

/** True om vi bör föreslå inomhusprio i rutten. */
export function isRainMode(w: DayWeather): boolean {
  return (
    w.condition === "rain" ||
    w.condition === "thunder" ||
    w.condition === "light-rain" ||
    w.rainChance >= 50
  );
}

export const CONDITION_LABEL: Record<WeatherCondition, string> = {
  sunny: "Sol",
  "partly-cloudy": "Sol & moln",
  cloudy: "Mulet",
  "light-rain": "Skurar",
  rain: "Regn",
  thunder: "Åska",
};

export const CONDITION_GLYPH: Record<WeatherCondition, string> = {
  sunny: "☀",
  "partly-cloudy": "⛅",
  cloudy: "☁",
  "light-rain": "🌦",
  rain: "🌧",
  thunder: "⛈",
};
