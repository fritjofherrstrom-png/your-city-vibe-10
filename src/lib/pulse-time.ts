/**
 * Tidskänslighet för Pulse.
 *
 * Items kan ha startsAt/endsAt (HH:mm). Vi jämför mot en "referenstid":
 * - Om dagen är idag → riktig klocka
 * - Annars → en simulerad "nu"-tid på 19:00, så demon känns levande även
 *   för framtida datum. Det här är ärligt i ett demo-läge: pulsen ska
 *   uppfattas som något som rör sig under dagen.
 */

import type { PulseItem } from "@/data/pulse";

export type TimeStatus = "live" | "upcoming" | "soon" | "past" | "all-day";

const SIM_HOUR = 19;
const SIM_MIN = 0;

/** HH:mm → minuter sedan midnatt. */
function parseHM(hm: string | undefined): number | null {
  if (!hm) return null;
  const [h, m] = hm.split(":").map((n) => parseInt(n, 10));
  if (isNaN(h) || isNaN(m)) return null;
  return h * 60 + m;
}

/** Returnerar referenstiden i minuter sedan midnatt för en given pulse-dag. */
export function getReferenceMinutes(dateISO: string, now: Date = new Date()): number {
  const today = now.toISOString().slice(0, 10);
  if (dateISO === today) {
    return now.getHours() * 60 + now.getMinutes();
  }
  return SIM_HOUR * 60 + SIM_MIN;
}

/**
 * Returnerar status för ett item relativt referenstiden.
 * - all-day: saknar tider (gäller hela dagen)
 * - live: pågår just nu
 * - soon: börjar inom 60 min
 * - upcoming: börjar inom 4h
 * - past: redan slut
 */
export function getItemStatus(
  item: PulseItem,
  refMinutes: number,
): TimeStatus {
  const start = parseHM(item.startsAt);
  const end = parseHM(item.endsAt);

  if (start === null && end === null) return "all-day";

  if (start !== null && end !== null) {
    if (refMinutes >= start && refMinutes <= end) return "live";
    if (refMinutes < start) {
      const delta = start - refMinutes;
      if (delta <= 60) return "soon";
      if (delta <= 240) return "upcoming";
      return "all-day"; // för långt bort — visa som vanlig
    }
    return "past";
  }

  // Bara start → event utan känd sluttid (typiskt set-tider)
  if (start !== null) {
    const delta = start - refMinutes;
    if (delta < 0 && delta > -120) return "live"; // nyligen börjat (≤2h)
    if (delta < -120) return "past";
    if (delta <= 60) return "soon";
    if (delta <= 240) return "upcoming";
    return "all-day";
  }

  return "all-day";
}

/** Sortering: live → soon → upcoming → all-day → past. */
const STATUS_RANK: Record<TimeStatus, number> = {
  live: 0,
  soon: 1,
  upcoming: 2,
  "all-day": 3,
  past: 4,
};

export function sortByTimeStatus<T extends { status: TimeStatus; startMinutes: number | null }>(
  items: T[],
): T[] {
  return [...items].sort((a, b) => {
    const r = STATUS_RANK[a.status] - STATUS_RANK[b.status];
    if (r !== 0) return r;
    if (a.startMinutes === null) return 1;
    if (b.startMinutes === null) return -1;
    return a.startMinutes - b.startMinutes;
  });
}

/** Beriker ett item med statusinfo + numerisk starttid för sortering. */
export function annotateItem(item: PulseItem, refMinutes: number) {
  return {
    ...item,
    status: getItemStatus(item, refMinutes),
    startMinutes: parseHM(item.startsAt),
  };
}

/** Mänsklig etikett för status. */
export const STATUS_LABEL: Record<TimeStatus, string> = {
  live: "Live nu",
  soon: "Snart",
  upcoming: "I kväll",
  "all-day": "Hela dagen",
  past: "Förbi",
};

/** Formaterar referenstiden som HH:mm. */
export function formatRefTime(refMinutes: number): string {
  const h = Math.floor(refMinutes / 60);
  const m = refMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
