/**
 * Stadsagnostisk kärna.
 *
 * Princip: Rom är *en* stad, inte *staden*. Allt motorn behöver veta om en stad
 * — zoner, hur man tar sig mellan dem, hur fri-text-kvarter mappas till zoner —
 * uttrycks via `City`. När vi lägger till Lissabon eller Tokyo skriver vi en ny
 * `City`, vi rör inte motorn.
 *
 * Denna fil får INTE importera stadsspecifik data. Endast typer + rena helpers.
 */

import type { Vibe, City as LegacyCity } from "@/data/cities";

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
