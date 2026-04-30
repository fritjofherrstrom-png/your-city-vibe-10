import { z } from "zod";
import { fallback } from "@tanstack/zod-adapter";
import type { RomeZone } from "@/data/rome-geography";

/**
 * Trip state lever i URL:en — delbart, refresh-säkert.
 * Datum lagras som ISO-strängar (yyyy-mm-dd).
 *
 * Stadsagnostiskt: `city` väljer vilken City-config som används. `zone` är
 * en fri sträng — varje stad äger sin egen valideringslista (resolveNeighborhood
 * + zones). URL-schemat ska aldrig låsa zoner till en specifik stad.
 */

const VIBE_VALUES = ["slow", "buzzy", "romantic", "curious"] as const;

export const tripSearchSchema = z.object({
  /** Vald stad. Validering mot registry sker i komponentlagret. */
  city: fallback(z.string().min(1).max(40), "rome").default("rome"),
  vibe: fallback(z.enum(VIBE_VALUES), "slow").default("slow"),
  /** Aktivt resedag-index (0 = första dagen). */
  day: fallback(z.number().int().min(0).max(30), 0).default(0),
  /** Hotellzon — fri sträng, validering per stad. */
  zone: fallback(z.string().min(1).max(40), "trastevere").default("trastevere"),
  /** Promenadtolerans per förflyttning, i minuter. */
  walk: fallback(z.number().int().min(5).max(45), 15).default(15),
  /** Resans startdatum, ISO yyyy-mm-dd. */
  start: fallback(z.string(), "2026-04-18").default("2026-04-18"),
  /** Resans slutdatum, ISO yyyy-mm-dd. */
  end: fallback(z.string(), "2026-04-22").default("2026-04-22"),
});

export type TripSearch = z.infer<typeof tripSearchSchema>;

export type WalkLabel = "kort" | "medel" | "lång";

export function walkLabel(min: number): WalkLabel {
  if (min <= 12) return "kort";
  if (min <= 22) return "medel";
  return "lång";
}

/**
 * Hjälpare: alla datum mellan start och end (inklusive), som ISO-strängar.
 */
export function tripDates(startISO: string, endISO: string): string[] {
  const start = new Date(startISO + "T00:00:00");
  const end = new Date(endISO + "T00:00:00");
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return [startISO];
  const days: string[] = [];
  const cursor = new Date(start);
  let safety = 0;
  while (cursor <= end && safety < 31) {
    days.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
    safety++;
  }
  return days;
}

/**
 * Räkna antal dagar i resan, kapat till `maxDays` (vanligtvis stadens
 * tillgängliga pulse-dagar). Tidigare duplicerad i Pulse + RouteBuilder.
 */
export function calcTripDayCount(
  startISO: string,
  endISO: string,
  maxDays: number,
): number {
  const start = new Date(startISO + "T00:00:00");
  const end = new Date(endISO + "T00:00:00");
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return 1;
  return Math.min(
    maxDays,
    Math.round((end.getTime() - start.getTime()) / 86400000) + 1,
  );
}

/** Re-export för bekvämlighet. Nya komponenter bör använda ZoneId från @/cities/types. */
export type { RomeZone };
