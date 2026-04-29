/**
 * Rom som City. Wrappar befintlig rome-geography + cities-katalog så att
 * motorn kan tala stadsagnostiskt utan att vi flyttar all data på en gång.
 *
 * Nästa steg (separat PR): flytta katalogen från src/data/cities.ts hit och
 * berika Stop-modellen med lat/lng, energyLevel, vibeAffinity.
 */
import {
  ROME_ZONES,
  neighborhoodToZone,
  walkMinutesBetween as romeWalk,
  type RomeZone,
} from "@/data/rome-geography";
import { CITIES } from "@/data/cities";
import type { City, WalkMatrix, ZoneId } from "../types";

const legacy = CITIES.find((c) => c.id === "rome")!;

/**
 * Bygg WalkMatrix genom att fråga rome-geography för varje zonpar.
 * Vi kapslar in den gamla matrisen så att City-konsumenter aldrig behöver
 * känna till RomeZone-typen.
 */
function buildWalkMatrix(): WalkMatrix {
  const matrix: WalkMatrix = {};
  for (const a of ROME_ZONES) {
    matrix[a.id] = {};
    for (const b of ROME_ZONES) {
      if (a.id === b.id) continue;
      matrix[a.id][b.id] = romeWalk(a.id as RomeZone, b.id as RomeZone);
    }
  }
  return matrix;
}

export const ROME: City = {
  id: "rome",
  name: "Rom",
  timezone: "Europe/Rome",
  locale: "sv",
  zones: ROME_ZONES.map((z) => ({ id: z.id, label: z.label, blurb: z.blurb })),
  walkMatrix: buildWalkMatrix(),
  resolveNeighborhood: (n: string): ZoneId | null => neighborhoodToZone(n),
  defaultZone: "centro",
  defaultWalkMinutes: 30,
  legacy,
};
