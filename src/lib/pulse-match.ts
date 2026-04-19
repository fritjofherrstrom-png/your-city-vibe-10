import { type PulseDay, type PulseItem } from "@/data/pulse";
import type { Stop, Vibe } from "@/data/cities";

/**
 * Matchar Pulse-signaler mot ett enskilt stopp inom en given dag.
 * Vi gör enkel, läsbar matchning på kvarter och vibe — inte fuzzy NLP.
 * Det räcker långt för v1 och håller redaktionell kontroll i datan.
 */
export function getPulseSignalsForStop(stop: Stop, vibe: Vibe, day: PulseDay): PulseItem[] {
  const stopHood = stop.neighborhood.toLowerCase();

  return day.items.filter((item) => {
    const itemWhere = item.where.toLowerCase();

    const hoodMatch =
      itemWhere.includes(stopHood) ||
      stopHood.split(/[\s,]+/).some((token) => token.length > 3 && itemWhere.includes(token));

    if (!hoodMatch) return false;

    if (item.kind.toLowerCase().includes("undvik")) return true;
    if (!item.matchesVibes || item.matchesVibes.length === 0) return true;
    return item.matchesVibes.includes(vibe);
  });
}

/**
 * Hämtar de Pulse-signaler som är "stadens rytm" — påverkar hela dagen.
 */
export function getCityWideSignals(vibe: Vibe, day: PulseDay): PulseItem[] {
  return day.items.filter((item) => {
    if (item.level !== "city") return false;
    if (item.kind.toLowerCase().includes("varning")) return true;
    if (!item.matchesVibes || item.matchesVibes.length === 0) return true;
    return item.matchesVibes.includes(vibe);
  });
}

/**
 * Vibe-baserade kvartersråd från Pulse — undvik/varning på kvartersnivå.
 */
export function getNeighborhoodAdvice(day: PulseDay): PulseItem[] {
  return day.items.filter(
    (item) =>
      item.level === "neighborhood" &&
      (item.kind.toLowerCase().includes("undvik") || item.kind.toLowerCase().includes("varning")),
  );
}
