/**
 * Rom som City. Wrappar befintlig rome-geography, cities-katalog, pulse och
 * väder så att motorn kan tala stadsagnostiskt utan att vi flyttar all data
 * på en gång.
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
import { ROME_PULSE_DAYS } from "@/data/pulse";
import { getWeather as getRomeWeather } from "@/lib/weather";
import {
  DEFAULT_ENGINE,
  type City,
  type StopCategory,
  type WalkMatrix,
  type ZoneId,
} from "../types";

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

/**
 * Mappa Rom-specifika typsträngar (svenska + italienska) till generiska
 * kategorier. När någon lägger till en ny type i datan utan att uppdatera
 * den här mappen → "other", och regnläget/ikoner faller tillbaka tyst.
 */
const ROME_TYPE_MAP: Record<string, StopCategory> = {
  // mat
  Lunch: "food", Middag: "food", Smörgås: "food", Gelato: "food",
  // dryck
  Caffè: "drink", Kaffe: "drink", Fika: "drink", Aperitivo: "drink",
  Aperitif: "drink", Apertivo: "drink", Bar: "drink", Cocktails: "drink",
  Cocktail: "drink", Vin: "drink", Vinbar: "drink", Klubb: "drink",
  Pivnice: "drink", Hak: "drink",
  // kultur / inomhus
  Museum: "culture", Konst: "culture", Konsthall: "culture",
  Bokhandel: "culture", Arkitektur: "culture", Hemlighet: "culture",
  // utomhus
  Promenad: "outdoor", Vandring: "outdoor", Park: "outdoor",
  Trädgård: "outdoor",
  // utsikt
  Utsikt: "view",
  // transport
  Båt: "transport",
};

function classifyRomeType(type: string): StopCategory {
  return ROME_TYPE_MAP[type] ?? "other";
}

export const ROME: City = {
  id: "rome",
  name: "Rom",
  timezone: "Europe/Rome",
  locale: "sv",
  zones: ROME_ZONES.map((z) => ({ id: z.id, label: z.label, blurb: z.blurb })),
  walkMatrix: buildWalkMatrix(),
  resolveNeighborhood: (n: string): ZoneId | null => neighborhoodToZone(n),
  defaultZone: "trastevere",
  defaultWalkMinutes: 30,
  legacy,
  pulseDays: ROME_PULSE_DAYS,
  getWeather: getRomeWeather,
  classifyStopType: classifyRomeType,
  engine: DEFAULT_ENGINE,
  copy: {
    issueLabel: "Issue Nº01 · Rom · april 2026",
    homeQuestion: "Var bor du i Rom",
    tagline:
      "Personlig city guide för promenadvänliga och lokalt kuraterade Rom-dagar",
    heroSubline:
      "Ge mig plats, smak och tempo. Jag bygger en sammanhängande dag — inte en lista.",
  },
};
