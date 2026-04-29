/**
 * Cityregister. En enda källa för "vilka städer finns och vad är default".
 * När vi lägger till Lissabon: importera, lägg i CITIES_BY_ID, klart.
 */
import { ROME } from "./rome";
import type { City } from "./types";

export const DEFAULT_CITY_ID = "rome";

const CITIES_BY_ID: Record<string, City> = {
  rome: ROME,
};

export function getCity(id: string = DEFAULT_CITY_ID): City {
  return CITIES_BY_ID[id] ?? ROME;
}

export function listCities(): City[] {
  return Object.values(CITIES_BY_ID);
}
