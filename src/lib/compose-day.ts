/**
 * Kompositionsmotorn — där Pulse blir input till Route, inte bara fotnot.
 *
 * Givet en kuraterad rutt + dagens puls, hittar vi pulse-venues som skulle
 * kunna *ersätta* ett kuraterat stopp idag (rätt tid, rätt vibe, rätt zon).
 * Vi byter inget automatiskt — vi *föreslår*. Användaren väljer.
 *
 * Stadsagnostisk: tar en `City` som beskriver zoner och promenadtider.
 * Rom är bara första staden. Lissabon, Tokyo: skicka annan City — motorn
 * fungerar oförändrat.
 */
import type { PulseDay, PulseItem } from "@/data/pulse";
import type { Stop, Vibe } from "@/data/cities";
import type { City, ZoneId } from "@/cities/types";
import { walkMinutesBetween } from "@/cities/types";

export type PulseAlternative = {
  pulse: PulseItem;
  /** Hur väl alternativet matchar — för sortering om flera kandidater. */
  score: number;
  /** Människoläsbar förklaring: "öppnar 18:30 · 8 min från Trastevere · matchar romantic" */
  why: string;
};

export type ComposedStop = {
  stop: Stop;
  /** Det bästa pulse-alternativet, om något. Max ett per stopp för att hålla UI lugnt. */
  alternative: PulseAlternative | null;
};

export type ComposedDay = {
  stops: ComposedStop[];
  /** Pulse-venues som matchar dagens vibe men inte ersätter något kuraterat stopp. */
  bonusPulse: PulseItem[];
};

/** Parsa "HH:mm" → minuter sedan midnatt. Returnerar null om ogiltigt. */
function parseTime(t: string | undefined): number | null {
  if (!t) return null;
  const m = /^(\d{1,2}):(\d{2})/.exec(t);
  if (!m) return null;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

/**
 * Hur väl matchar en pulse-venue ett kuraterat stopp idag?
 * Returnerar score 0–100, eller null om den inte matchar alls.
 */
function scoreMatch(
  city: City,
  stop: Stop,
  stopTime: number | null,
  pulse: PulseItem,
  vibe: Vibe,
): { score: number; why: string } | null {
  // Bara venues kan ersätta stopp — stadsrytm/kvarterspuls är kommentarer, inte kandidater.
  if (pulse.level !== "venue") return null;

  // Måste ha starttid — utan tid kan vi inte placera det.
  const pulseStart = parseTime(pulse.startsAt);
  if (pulseStart === null) return null;

  // Vibe måste matcha (eller pulse-item har ingen vibe-bias = passar alla).
  const vibeMatch =
    !pulse.matchesVibes ||
    pulse.matchesVibes.length === 0 ||
    pulse.matchesVibes.includes(vibe);
  if (!vibeMatch) return null;

  // Tid: pulse-start måste ligga inom ±90 min från stoppets tid.
  if (stopTime === null) return null;
  const timeDiff = Math.abs(pulseStart - stopTime);
  if (timeDiff > 90) return null;

  // Zon: pulse-zon måste vara samma som stoppets zon, eller max 20 min promenad bort.
  const sZone: ZoneId | null = city.resolveNeighborhood(stop.neighborhood);
  const pZone: ZoneId | null = city.resolveNeighborhood(pulse.where);
  if (!sZone || !pZone) return null;
  const zoneWalk = walkMinutesBetween(city, sZone, pZone);
  if (zoneWalk > 20) return null;

  // Score: närmare i tid + närmare i zon + explicit vibe-träff = högre.
  const timeScore = 50 - timeDiff / 2; // 50 vid exakt match, 5 vid 90 min diff
  const zoneScore = 30 - zoneWalk * 1.5; // 30 vid samma zon, 0 vid 20 min
  const vibeScore =
    pulse.matchesVibes && pulse.matchesVibes.includes(vibe) ? 20 : 10;
  const score = Math.max(0, Math.round(timeScore + zoneScore + vibeScore));

  // Bygg why-strängen — det användaren faktiskt läser.
  const parts: string[] = [];
  if (pulse.startsAt) parts.push(`öppnar ${pulse.startsAt}`);
  if (sZone === pZone) parts.push(`samma kvarter`);
  else if (zoneWalk > 0) parts.push(`${zoneWalk} min bort`);
  if (pulse.matchesVibes?.includes(vibe)) parts.push(`matchar ${vibe}`);
  const why = parts.join(" · ");

  return { score, why };
}

/**
 * Komponera dagen: för varje kuraterat stopp, leta efter bästa pulse-alternativ.
 * Pulse-items som matchar vibe men inte ersätter något läggs som bonus.
 *
 * `city` är obligatorisk — motorn vet inget om Rom specifikt. Den vet bara
 * "givet denna stads zoner och promenadtider, vad passar".
 */
export function composeDay({
  city,
  stops,
  pulseDay,
  vibe,
}: {
  city: City;
  stops: Stop[];
  pulseDay: PulseDay;
  vibe: Vibe;
  /** Behållen för bakåtkompatibilitet i anrop. Används inte längre direkt. */
  zone?: ZoneId;
}): ComposedDay {
  // Vi vill inte föreslå samma pulse-item som alternativ till flera stopp.
  const claimed = new Set<string>();

  const composedStops: ComposedStop[] = stops.map((stop) => {
    const stopTime = parseTime(stop.time);

    let best: PulseAlternative | null = null;

    for (const pulse of pulseDay.items) {
      if (claimed.has(pulse.id)) continue;

      const match = scoreMatch(city, stop, stopTime, pulse, vibe);
      if (!match) continue;

      if (!best || match.score > best.score) {
        best = { pulse, score: match.score, why: match.why };
      }
    }

    if (best) claimed.add(best.pulse.id);
    return { stop, alternative: best };
  });

  // Bonus: vibe-matchande venues som inte blev alternativ åt något stopp.
  const bonusPulse = pulseDay.items.filter((item) => {
    if (item.level !== "venue") return false;
    if (claimed.has(item.id)) return false;
    if (!parseTime(item.startsAt)) return false;
    const vibeMatch =
      !item.matchesVibes ||
      item.matchesVibes.length === 0 ||
      item.matchesVibes.includes(vibe);
    return vibeMatch;
  });

  return { stops: composedStops, bonusPulse };
}
