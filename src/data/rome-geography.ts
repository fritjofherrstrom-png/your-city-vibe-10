/**
 * Lättviktig geografi för Rom — zoner och promenadtider mellan dem.
 * Inga koordinater, inga kartor. Bara redaktionellt sann tid mellan kvarter.
 *
 * Vi mappar varje stopps "neighborhood" till en RomeZone, sen slår upp
 * tid mellan zoner i en symmetrisk matris (minuter, gångfart).
 */

export type RomeZone =
  | "trastevere"
  | "centro"
  | "monti"
  | "testaccio"
  | "aventino"
  | "pigneto"
  | "esquilino"
  | "centocelle"
  | "ostiense"
  | "prati";

export const ROME_ZONES: { id: RomeZone; label: string; blurb: string }[] = [
  { id: "trastevere", label: "Trastevere", blurb: "Söder om floden, kullerstenar, kvällslevande." },
  { id: "centro", label: "Centro Storico", blurb: "Pantheon, Piazza Navona, Campo de' Fiori." },
  { id: "monti", label: "Monti", blurb: "Bohemkvarter mellan Colosseum och Termini." },
  { id: "testaccio", label: "Testaccio", blurb: "Mat-mecka, gamla slakteridistriktet." },
  { id: "aventino", label: "Aventino", blurb: "Lugn kulle, apelsinträdgård, utsikt." },
  { id: "pigneto", label: "Pigneto", blurb: "Öster om centrum, kvällsbarer och vinyl." },
  { id: "esquilino", label: "Esquilino", blurb: "Multikulturellt, runt Termini." },
  { id: "centocelle", label: "Centocelle", blurb: "Långt öster, romerskt vardagsliv." },
  { id: "ostiense", label: "Ostiense", blurb: "Söder, ex-industri, gatukonst." },
  { id: "prati", label: "Prati", blurb: "Norr om Vatikanen, lugnt, borgerligt." },
];

/**
 * Promenadtid i minuter mellan zoner. Symmetrisk — vi använder bara halva.
 * Värden är ungefärliga gångtider i normal takt på en torr eftermiddag.
 */
const WALK_MATRIX: Record<RomeZone, Partial<Record<RomeZone, number>>> = {
  trastevere: { centro: 15, monti: 30, testaccio: 18, aventino: 20, ostiense: 25, prati: 25, esquilino: 35, pigneto: 50, centocelle: 70 },
  centro: { trastevere: 15, monti: 18, testaccio: 30, aventino: 25, ostiense: 35, prati: 20, esquilino: 22, pigneto: 40, centocelle: 60 },
  monti: { centro: 18, trastevere: 30, testaccio: 35, aventino: 22, ostiense: 40, prati: 35, esquilino: 10, pigneto: 30, centocelle: 50 },
  testaccio: { trastevere: 18, centro: 30, monti: 35, aventino: 12, ostiense: 15, prati: 40, esquilino: 35, pigneto: 45, centocelle: 65 },
  aventino: { trastevere: 20, centro: 25, monti: 22, testaccio: 12, ostiense: 18, prati: 35, esquilino: 25, pigneto: 35, centocelle: 55 },
  pigneto: { trastevere: 50, centro: 40, monti: 30, testaccio: 45, aventino: 35, ostiense: 40, prati: 55, esquilino: 25, centocelle: 25 },
  esquilino: { trastevere: 35, centro: 22, monti: 10, testaccio: 35, aventino: 25, ostiense: 35, prati: 35, pigneto: 25, centocelle: 45 },
  centocelle: { trastevere: 70, centro: 60, monti: 50, testaccio: 65, aventino: 55, ostiense: 60, prati: 75, esquilino: 45, pigneto: 25 },
  ostiense: { trastevere: 25, centro: 35, monti: 40, testaccio: 15, aventino: 18, prati: 45, esquilino: 35, pigneto: 40, centocelle: 60 },
  prati: { trastevere: 25, centro: 20, monti: 35, testaccio: 40, aventino: 35, ostiense: 45, esquilino: 35, pigneto: 55, centocelle: 75 },
};

/**
 * Försök mappa en fri-text "neighborhood" från Stop till en zon.
 * Vi gör enkel substring-match — räcker långt med vår egen kuraterade data.
 */
export function neighborhoodToZone(neighborhood: string): RomeZone | null {
  const n = neighborhood.toLowerCase();
  for (const z of ROME_ZONES) {
    if (n.includes(z.id)) return z.id;
    if (n.includes(z.label.toLowerCase())) return z.id;
  }
  // Specialfall — "Centro Storico", "Campo de' Fiori" → centro
  if (n.includes("campo") || n.includes("storico") || n.includes("navona") || n.includes("pantheon")) return "centro";
  return null;
}

/**
 * Promenadtid mellan två zoner i minuter. 0 om samma zon. null om okänt.
 */
export function walkMinutesBetween(a: RomeZone, b: RomeZone): number {
  if (a === b) return 0;
  return WALK_MATRIX[a]?.[b] ?? WALK_MATRIX[b]?.[a] ?? 30;
}
