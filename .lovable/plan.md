
# Parranda — djupanalys inför stad 2

Jag har läst igenom hela motorn (`compose-day`, `pulse-match`, `rome-geography`, `trip`, `weather`, `pulse`, `Hero`, `RouteBuilder`, `Pulse`, `cities`, registry/types). Stad-agnostiska skalet finns på plats sedan förra varvet — men 80% av appen pratar fortfarande direkt med Rom. Stad 2 går inte att lägga till idag utan att klippa ihop kod på fyra ställen samtidigt. Här är vad som måste fixas, i prioritetsordning.

## Sammanfattning av läget

**Bra:** `src/cities/types.ts`, `registry.ts`, `rome/index.ts` finns. `composeDay` tar redan `city`. Pulse-data är välstrukturerad och berättartonen håller.

**Dåligt:** `RomeZone` läcker som hård typ till **trip.ts (URL-schema), Hero, RouteBuilder, Pulse, PulseNowFocus**. `ROME_PULSE_DAYS` och `ROME_WEATHER` är direktimporterade överallt. `pulse-match` parsar fri text. `composeDay`s zon-walk-tröskel (20 min) är hårdkodad. URL:en heter `zone`, inte `city+zone`. `INDOOR_TYPES` är en global Set i RouteBuilder. Det finns inga tester.

**Konsekvens:** För att lägga till Lissabon idag måste du editera ~9 filer parallellt utan kompilatorhjälp. Det är därför stad 2 känns långt borta — inte för att motorn är fel, utan för att Rom är *limmad* till UI-lagret.

## De 12 bristerna och deras exakta fix

### 1. URL-schemat låser zoner till Rom (BLOCKER för stad 2)

**Problem:** `src/lib/trip.ts` har `ZONE_VALUES = ["trastevere", ...]` som Zod-enum. Lägger du till Lissabon kraschar URL-validering så fort någon väljer Alfama.

**Fix:** Lägg till `city` i URL-state och gör `zone` till `z.string()` (validera mot stadens zoner i komponenten, inte schemat):
```ts
// src/lib/trip.ts
export const tripSearchSchema = z.object({
  city: fallback(z.string(), "rome").default("rome"),
  vibe: fallback(z.enum(VIBE_VALUES), "slow").default("slow"),
  day: fallback(z.number().int().min(0).max(30), 0).default(0),
  zone: fallback(z.string(), "trastevere").default("trastevere"),
  walk: fallback(z.number().int().min(5).max(45), 15).default(15),
  start: fallback(z.string(), "2026-04-18").default("2026-04-18"),
  end: fallback(z.string(), "2026-04-22").default("2026-04-22"),
});
```
Ta bort re-exporten av `RomeZone` från trip.ts. Allt nedströms ska få `ZoneId` (string) från `@/cities/types`.

### 2. Hero importerar `ROME_ZONES` direkt

**Problem:** `Hero.tsx` rad 14 + 138: `import { ROME_ZONES } from "@/data/rome-geography"`. Hela picker-loopen är Rom-bunden. Texterna ("Var bor du i Rom", "Issue Nº01 · Rom · april 2026") är hårdkodade.

**Fix:** Hero läser `getCity(search.city)` och itererar `city.zones`. All copy som nämner "Rom" flyttas till `City.copy`-objekt:
```ts
// src/cities/types.ts (utöka)
export type CityCopy = {
  issueLabel: string;          // "Issue Nº01 · Rom · april 2026"
  homeQuestion: string;        // "Var bor du i Rom"
  tagline: string;             // "Personlig city guide för..."
};
export type City = { /* existing */ copy: CityCopy };
```

### 3. RouteBuilder har en zombie-import av `ROME` + dubbel zon-logik

**Problem:** Rad 30 `const ROME = CITIES.find(...)` används bara för `ROME.routes[vibe]` — och ändå anropas `getCity("rome")` på rad 66. Två källor för samma sak. `neighborhoodToZone` och `walkMinutesBetween` importeras direkt från `rome-geography` på rad 13 (för `fromHome` och `fromPrev`), helt utanför `composeDay`.

**Fix:** Hämta city en gång i toppen, läs route från `city.legacy.routes`, använd `city.resolveNeighborhood` och `walkMinutesBetween(city, ...)`:
```ts
const city = getCity(search.city);
const route = city.legacy.routes[vibe];
// ...
const stopZone = city.resolveNeighborhood(stop.neighborhood);
const fromHome = stopZone ? walkMinutesBetween(city, homeZone, stopZone) : null;
```
Ta bort `import { neighborhoodToZone, walkMinutesBetween, type RomeZone } from "@/data/rome-geography"`.

### 4. Pulse-data är globalt singleton för Rom

**Problem:** `Pulse.tsx` och `RouteBuilder.tsx` importerar `ROME_PULSE_DAYS` direkt. Inget sätt att säga "ge mig Lissabons puls".

**Fix:** Lägg `pulseDays: PulseDay[]` som fält på `City`:
```ts
// src/cities/types.ts
export type City = { /* ... */ pulseDays: PulseDay[]; };

// src/cities/rome/index.ts
import { ROME_PULSE_DAYS } from "@/data/pulse";
export const ROME: City = { /* ... */ pulseDays: ROME_PULSE_DAYS };
```
Sen i Pulse: `const days = city.pulseDays;`. Steg 2 (separat PR): flytta filerna till `src/cities/rome/pulse.ts`.

### 5. Väder är låst till Rom-datum

**Problem:** `weather.ts` är ett dict med fem datum 2026-04-XX. Stad 2 kommer ha andra datum, andra årstider, andra mönster.

**Fix:** Gör väder till en city-tjänst:
```ts
// src/cities/types.ts
export type City = { /* ... */ getWeather: (dateISO: string) => DayWeather; };
```
För Rom: behåll mock-tabellen i `src/cities/rome/weather.ts`. För stad 2: skriv en egen mock eller koppla in Open-Meteo via en server function (lat/lng på `City`).

### 6. `pulse-match.ts` gör fri-text-substring-matchning på kvarter

**Problem:** `getPulseSignalsForStop` jämför `stop.neighborhood.toLowerCase()` mot `item.where.toLowerCase()`. "Trastevere" matchar inte "Piazza San Cosimato". Det funkar för Rom där datan är handredigerad, men spricker när Lissabon-datan kommer från en CMS eller en juniorredaktör.

**Fix:** Normalisera båda sidor via `city.resolveNeighborhood` innan jämförelsen — samma zon-modell som motorn redan använder:
```ts
export function getPulseSignalsForStop(city: City, stop: Stop, vibe: Vibe, day: PulseDay) {
  const stopZone = city.resolveNeighborhood(stop.neighborhood);
  if (!stopZone) return [];
  return day.items.filter((item) => {
    const itemZone = city.resolveNeighborhood(item.where);
    if (itemZone !== stopZone) return false;
    if (item.kind.toLowerCase().includes("undvik")) return true;
    if (!item.matchesVibes?.length) return true;
    return item.matchesVibes.includes(vibe);
  });
}
```

### 7. `composeDay` har magiska konstanter

**Problem:** `if (zoneWalk > 20) return null` och `if (timeDiff > 90) return null` är hårdkodade i `scoreMatch`. Tokyo har annan skala. Sannolikt vill du också justera per resenär (`walk` från URL:en finns redan men används inte i composeDay).

**Fix:** Flytta till `City.engineParams` med defaults, och låt `composeDay` ta `walkLimit` från användaren:
```ts
export type EngineParams = {
  maxZoneWalkMinutes: number;   // default 20
  maxTimeDriftMinutes: number;  // default 90
};
export type City = { /* ... */ engine?: Partial<EngineParams> };

// compose-day.ts
function scoreMatch(city, stop, stopTime, pulse, vibe, params) {
  const maxWalk = Math.min(params.maxZoneWalkMinutes, params.userWalkLimit);
  // ...
}
```

### 8. `INDOOR_TYPES` är en svensk-italiensk hardcoded Set i RouteBuilder

**Problem:** `Pivnice`, `Hak`, `Caffè` blandas med generiska `Museum`, `Bar`. Stad 2 lägger till nya `type`-strängar och regnläget slutar fungera tyst.

**Fix:** Flytta ut + gör generisk via en typklassificering på City-nivå. Bättre: lägg `indoor: boolean` på `Stop` (data-driven), eller gruppera typer i kategorier:
```ts
// src/cities/types.ts
export type StopCategory = "food" | "drink" | "culture" | "outdoor" | "transport" | "view";
export type City = { /* ... */ classifyStopType: (type: string) => StopCategory };
// indoor = category !== "outdoor" && category !== "view"
```

### 9. `PulseNowFocus` får `homeZone: RomeZone` som prop

**Problem:** Pulse.tsx rad 89 castar `search.zone as RomeZone`. Stad 2 → typfel eller silent miss.

**Fix:** Byt till `homeZone: ZoneId` (string) i hela komponentträdet (PulseNowFocus, PulseTimeline om relevant). Låt komponenter som behöver promenadtid ta in `city` som prop, inte dra slutsatser från strängen.

### 10. `tripDayCount` duplicerad i Pulse + RouteBuilder

**Problem:** Identisk `useMemo`-block räknar dagar i två komponenter. Båda begränsar mot `ROME_PULSE_DAYS.length`.

**Fix:** Flytta till `src/lib/trip.ts`:
```ts
export function calcTripDayCount(startISO: string, endISO: string, maxDays: number): number {
  const s = new Date(startISO + "T00:00:00");
  const e = new Date(endISO + "T00:00:00");
  if (isNaN(s.getTime()) || isNaN(e.getTime()) || e < s) return 1;
  return Math.min(maxDays, Math.round((e.getTime() - s.getTime()) / 86400000) + 1);
}
```
Båda ställena anropar med `city.pulseDays.length`.

### 11. Hero kompilerar URL:en utan att veta om vald stad

**Problem:** `compose()` skickar `zone` som kan vara ogiltig för aktiv stad (om `city` byts senare). Inget guard.

**Fix:** I Hero, vid stadbyte (när vi får en city-picker), nollställ `zone` till `city.defaultZone`:
```ts
const onCityChange = (id: string) => {
  const next = getCity(id);
  setZone(next.defaultZone);
  setCity(id);
};
```

### 12. Inga tester på motorn

**Problem:** `composeDay`, `scoreMatch`, `walkMinutesBetween`, `resolveNeighborhood` är hjärtat — men det finns inga vitests. När du portar Lissabon kommer du bryta Rom utan att märka det förrän klicket.

**Fix:** Lägg till `src/lib/__tests__/compose-day.test.ts` med ~6 fall:
- Pulse-venue i samma zon, samma tid → blir alternativ med high score
- Pulse-venue i samma zon, vibe-mismatch → null
- Pulse-venue 25 min bort → null
- Pulse-venue ±90 min drift → returneras, ±91 → null
- Två stopp tävlar om samma pulse-item → bara ett får det
- City utan pulse-venues → bonusPulse är tom, alla stops har `alternative: null`

Plus tester för `walkMinutesBetween` (symmetri, fallback) och `resolveNeighborhood` (kända kvarter, alias, okända).

## Föreslagen ordning (4 PR:er)

```text
PR 1 — Stadsschema-ren        [grund för allt nedan]
  • Lägg city i tripSearchSchema, zone → string
  • Lägg pulseDays + getWeather + copy + classifyStopType + engine på City
  • Flytta calcTripDayCount till lib/trip.ts
  • Inga UI-ändringar

PR 2 — Komponentportar
  • Hero: läs ROME via getCity, copy från city.copy
  • RouteBuilder: ta bort ROME-konstant + rome-geography-importer
  • Pulse + PulseNowFocus: ta city.pulseDays + ZoneId istället för RomeZone

PR 3 — Pulse-match generalisering
  • pulse-match.ts tar city
  • composeDay läser engineParams + userWalkLimit
  • INDOOR_TYPES → city.classifyStopType

PR 4 — Stad 2 (Lissabon eller test-city)
  • Skapa src/cities/lisbon/ med 4 zoner, mini-katalog, 2 pulse-dagar
  • Lägg i registry
  • CitySwitcher i SiteHeader
```

Tester (PR 0 eller parallellt med PR 1) skrivs *innan* PR 2 så vi vet att Rom inte regreserar.

## Kodförslag att börja med direkt

Den minsta första commiten som ger störst effekt — utöka `City`-typen och flytta `tripDayCount`. Det låser upp alla andra steg utan att ändra UI:

**`src/cities/types.ts`** — lägg till fält:
```ts
import type { PulseDay } from "@/data/pulse";
import type { DayWeather } from "@/lib/weather";

export type CityCopy = {
  issueLabel: string;
  homeQuestion: string;
  tagline: string;
};

export type EngineParams = {
  maxZoneWalkMinutes: number;
  maxTimeDriftMinutes: number;
};

export type StopCategory = "food" | "drink" | "culture" | "outdoor" | "transport" | "view" | "other";

export type City = {
  /* befintliga fält */
  copy: CityCopy;
  pulseDays: PulseDay[];
  getWeather: (dateISO: string) => DayWeather;
  classifyStopType: (type: string) => StopCategory;
  engine: EngineParams;
};
```

**`src/lib/trip.ts`** — lägg till hjälpare + city-fält + lossa zone:
```ts
export const tripSearchSchema = z.object({
  city: fallback(z.string(), "rome").default("rome"),
  vibe: fallback(z.enum(VIBE_VALUES), "slow").default("slow"),
  day: fallback(z.number().int().min(0).max(30), 0).default(0),
  zone: fallback(z.string(), "trastevere").default("trastevere"),
  walk: fallback(z.number().int().min(5).max(45), 15).default(15),
  start: fallback(z.string(), "2026-04-18").default("2026-04-18"),
  end: fallback(z.string(), "2026-04-22").default("2026-04-22"),
});

export function calcTripDayCount(startISO: string, endISO: string, maxDays: number): number {
  const s = new Date(startISO + "T00:00:00");
  const e = new Date(endISO + "T00:00:00");
  if (isNaN(s.getTime()) || isNaN(e.getTime()) || e < s) return 1;
  return Math.min(maxDays, Math.round((e.getTime() - s.getTime()) / 86400000) + 1);
}
```

Säg till om jag ska börja med **PR 1** (stadsschema-ren — risk-fri grund, inga UI-ändringar) eller om du vill att jag går rakt på **PR 0: tester** så vi har skyddsnät innan portningen.
