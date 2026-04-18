import { ROME_PULSE, type PulseItem } from "@/data/pulse";
import type { Stop, Vibe } from "@/data/cities";

/**
 * Matchar Pulse-signaler mot ett enskilt stopp.
 * Vi gör enkel, läsbar matchning på kvarter och vibe — inte fuzzy NLP.
 * Det räcker långt för v1 och håller redaktionell kontroll i datan.
 */
export function getPulseSignalsForStop(stop: Stop, vibe: Vibe): PulseItem[] {
  const stopHood = stop.neighborhood.toLowerCase();

  return ROME_PULSE.items.filter((item) => {
    const itemWhere = item.where.toLowerCase();

    // Kvartersmatch: Pulse-itemets "where" innehåller stoppets kvarter
    // eller tvärtom (t.ex. "Pigneto" matchar "Largo Spartaco, Pigneto").
    const hoodMatch =
      itemWhere.includes(stopHood) ||
      stopHood.split(/[\s,]+/).some((token) => token.length > 3 && itemWhere.includes(token));

    if (!hoodMatch) return false;

    // Om det är en "Undvik"-signal: visa alltid när kvarteret matchar.
    if (item.kind.toLowerCase().includes("undvik")) return true;

    // Annars: matcha även på vibe om vibe finns angiven på itemet.
    if (!item.matchesVibes || item.matchesVibes.length === 0) return true;
    return item.matchesVibes.includes(vibe);
  });
}

/**
 * Hämtar de Pulse-signaler som är "stadens rytm" — dvs påverkar hela dagen,
 * inte ett specifikt stopp. Används för banner ovanför rutten.
 */
export function getCityWideSignals(vibe: Vibe): PulseItem[] {
  return ROME_PULSE.items.filter((item) => {
    if (item.level !== "city") return false;
    // Visa varningar alltid, annars filtrera på vibe.
    if (item.kind.toLowerCase().includes("varning")) return true;
    if (!item.matchesVibes || item.matchesVibes.length === 0) return true;
    return item.matchesVibes.includes(vibe);
  });
}

/**
 * Vibe-baserade "Rom-tips" — kvarter att välja eller undvika i kväll
 * baserat på Undvik-signaler i Pulse.
 */
export function getNeighborhoodAdvice(): PulseItem[] {
  return ROME_PULSE.items.filter(
    (item) =>
      item.level === "neighborhood" &&
      (item.kind.toLowerCase().includes("undvik") || item.kind.toLowerCase().includes("varning"))
  );
}
