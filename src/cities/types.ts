/**
 * Stadsagnostisk kärna.
 *
 * Princip: Rom är *en* stad, inte *staden*. Allt motorn behöver veta om en stad
 * — zoner, hur man tar sig mellan dem, hur fri-text-kvarter mappas till zoner,
 * dagens puls, väder, redaktionell ton — uttrycks via `City`. När vi lägger
 * till Lissabon eller Tokyo skriver vi en ny `City`, vi rör inte motorn.
 *
 * Denna fil får INTE importera stadsspecifik data. Endast typer + rena helpers.
 */

import type { Vibe, City as LegacyCity } from "@/data/cities";
import type { PulseDay } from "@/data/pulse";
import type { DayWeather } from "@/lib/weather";

/** Opaque zon-id — varje stad definierar sina egna. Strängar för enkelhet. */
export type ZoneId = string;

export type Zone = {
  id: ZoneId;
  label: string;
  blurb: string;
};

/**
 * Promenadtid mellan zoner i minuter. Symmetrisk i princip, men vi tillåter
 * asymmetri (en stad kan ha enkelriktade gator, höjdskillnader, broar).
 * Saknas par → fallback i walkMinutesBetween.
 */
export type WalkMatrix = Record<ZoneId, Partial<Record<ZoneId, number>>>;

/**
 * Stadens "läs-fri-text-och-gissa-zon"-funktion. Varje stad har egen heuristik
 * eftersom kvartersnamn, alias och stavningar skiljer sig dramatiskt.
 */
export type NeighborhoodResolver = (neighborhood: string) => ZoneId | null;

/**
 * Redaktionell copy som varierar per stad. Allt som UI-lagret idag har
 * hårdkodat ("Rom", "Issue Nº01 · Rom · april 2026") flyttas hit.
 */
export type CityCopy = {
  /** "Issue Nº01 · Rom · april 2026" */
  issueLabel: string;
  /** "Var bor du i Rom" — Hero, signal 01 */
  homeQuestion: string;
  /** Tagline under headern, t.ex. "Personlig city guide för promenadvänliga och lokalt kuraterade Rom-dagar" */
  tagline: string;
  /** Kort beskrivning under H1 */
  heroSubline: string;
};

/**
 * Klassificering av stop-typer. Ersätter den hårdkodade INDOOR_TYPES-Set:en
 * i RouteBuilder. Varje stad får mappa sina lokala typsträngar (Pivnice,
 * Caffè, Trattoria) till en av dessa kategorier — så fungerar regnläge,
 * tids-buckets och framtida ikoner stadsoberoende.
 */
export type StopCategory =
  | "food"
  | "drink"
  | "culture"
  | "outdoor"
  | "transport"
  | "view"
  | "other";

/** True = funkar som inomhus-val i regnväder. */
export function isIndoorCategory(c: StopCategory): boolean {
  return c !== "outdoor" && c !== "view" && c !== "transport";
}

/**
 * Motor-parametrar. Hårdkodade konstanter i compose-day flyttas hit så att
 * Tokyo (annan skala) eller en testresenär kan justera dem.
 */
export type EngineParams = {
  /** Max promenadtid mellan stoppets zon och pulse-venuets zon (min). */
  maxZoneWalkMinutes: number;
  /** Max tidsdrift mellan stoppets klockslag och pulse-venuets start (min). */
  maxTimeDriftMinutes: number;
};

export const DEFAULT_ENGINE: EngineParams = {
  maxZoneWalkMinutes: 20,
  maxTimeDriftMinutes: 90,
};

export type City = {
  id: string;
  name: string;
  /** IANA-tidszon, för framtida tidsmedveten matchning (events, väder). */
  timezone: string;
  /** Standardspråk för redaktionell ton (sv, en, it...). */
  locale: string;
  zones: Zone[];
  walkMatrix: WalkMatrix;
  resolveNeighborhood: NeighborhoodResolver;
  /** Fallback-zon när resolveNeighborhood inte hittar något — undviker null-spridning. */
  defaultZone: ZoneId;
  /** Fallback-promenadtid mellan okända zonpar (minuter). */
  defaultWalkMinutes: number;
  /** Den ursprungliga route-katalogen (vibe → kuraterad rutt). Tills vi flyttat allt. */
  legacy: LegacyCity;
  /** Dagens puls för denna stad, i kronologisk ordning. */
  pulseDays: PulseDay[];
  /** Väderupplsningen för ett ISO-datum. Idag mock — imorgon Open-Meteo. */
  getWeather: (dateISO: string) => DayWeather;
  /** Klassificera en stop.type till generisk kategori. */
  classifyStopType: (type: string) => StopCategory;
  /** Motor-parametrar (kompositionströsklar). */
  engine: EngineParams;
  /** Redaktionell copy som UI-lagret läser istället för hårdkodade Rom-strängar. */
  copy: CityCopy;
};

/**
 * Promenadtid mellan två zoner. 0 om samma zon. Faller tillbaka till
 * stadens defaultWalkMinutes om paret saknas i matrisen.
 */
export function walkMinutesBetween(city: City, a: ZoneId, b: ZoneId): number {
  if (a === b) return 0;
  const direct = city.walkMatrix[a]?.[b];
  if (typeof direct === "number") return direct;
  const reverse = city.walkMatrix[b]?.[a];
  if (typeof reverse === "number") return reverse;
  return city.defaultWalkMinutes;
}

export type { Vibe };
