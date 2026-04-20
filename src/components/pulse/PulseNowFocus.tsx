import { motion } from "framer-motion";
import type { PulseItem } from "@/data/pulse";
import { neighborhoodToZone, walkMinutesBetween, type RomeZone } from "@/data/rome-geography";
import { formatRefTime, STATUS_LABEL, type TimeStatus } from "@/lib/pulse-time";

type AnnotatedItem = PulseItem & { status: TimeStatus; startMinutes: number | null };

type Props = {
  items: AnnotatedItem[];
  refMinutes: number;
  homeZone: RomeZone;
  walkLimit: number;
  isToday: boolean;
};

/**
 * "Just nu"-fokusremsa: svar på frågan "vad gör jag härnäst?".
 * Lyfter live + soon-events och knyter dem till användarens zon via promenadtid.
 * Detta är där tidskänslighet + plats-logik möts som ett konkret förslag.
 */
export function PulseNowFocus({ items, refMinutes, homeZone, walkLimit, isToday }: Props) {
  const live = items.filter((i) => i.status === "live");
  const soon = items.filter((i) => i.status === "soon");

  // Inget att visa? Hoppa över helt — fokusremsan ska aldrig kännas tom.
  if (live.length === 0 && soon.length === 0) return null;

  const annotateWithWalk = (item: AnnotatedItem) => {
    const zone = neighborhoodToZone(item.where);
    const walk = zone ? walkMinutesBetween(homeZone, zone) : null;
    return { ...item, walkFromHome: walk, zone };
  };

  const liveWithWalk = live.map(annotateWithWalk);
  const soonWithWalk = soon
    .map(annotateWithWalk)
    .sort((a, b) => (a.startMinutes ?? 0) - (b.startMinutes ?? 0));

  // Plocka det mest relevanta att lyfta som "primary": första live om det finns,
  // annars första soon. Resten visas mer kompakt under.
  const primary = liveWithWalk[0] ?? soonWithWalk[0];
  const rest = [
    ...liveWithWalk.slice(primary === liveWithWalk[0] ? 1 : 0),
    ...soonWithWalk.slice(primary === soonWithWalk[0] && liveWithWalk.length === 0 ? 1 : 0),
  ].slice(0, 3);

  const walkBadge = (walk: number | null) => {
    if (walk === null) return null;
    const overLimit = walk > walkLimit;
    return (
      <span
        className={`font-mono text-[9px] uppercase tracking-[0.2em] border px-1.5 py-0.5 ${
          overLimit
            ? "border-paper/30 text-paper/50"
            : "border-sun/50 text-sun"
        }`}
      >
        {overLimit ? "✕" : "↳"} {walk} min från {homeZone}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12 border border-terracotta/40 bg-terracotta/[0.04] p-6 md:p-8"
    >
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <div className="flex items-center gap-3">
          <span
            className="inline-block w-2 h-2 rounded-full bg-terracotta"
            style={{ animation: "pulseDot 2.4s ease-in-out infinite" }}
          />
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/80">
            {isToday ? "Just nu · " : "Vid referenstid · "}
            <span className="text-terracotta">{formatRefTime(refMinutes)}</span>
          </p>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/50">
          Bor i {homeZone} · max {walkLimit} min promenad
        </p>
      </div>

      {/* Primary — det starkaste förslaget */}
      <div className="border-l-2 border-terracotta pl-5 mb-5">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-terracotta">
            {primary.kind}
          </span>
          <span
            className={`font-mono text-[9px] uppercase tracking-[0.2em] border px-1.5 py-0.5 ${
              primary.status === "live"
                ? "bg-terracotta text-paper border-terracotta"
                : "bg-sun text-ink border-sun"
            }`}
          >
            {STATUS_LABEL[primary.status]}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper/50">
            {primary.when}
          </span>
          {walkBadge(primary.walkFromHome)}
        </div>
        <h3 className="font-display text-2xl md:text-[1.85rem] leading-[1.1] text-balance">
          {primary.title}
        </h3>
        <p className="mt-2 font-display italic text-base md:text-lg text-sun text-pretty">
          {primary.whyItMatters}
        </p>
      </div>

      {/* Rest — kompakt lista */}
      {rest.length > 0 && (
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3 pt-4 border-t border-paper/10">
          {rest.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <span
                className={`font-mono text-[9px] uppercase tracking-[0.2em] border px-1.5 py-0.5 shrink-0 mt-0.5 ${
                  item.status === "live"
                    ? "bg-terracotta text-paper border-terracotta"
                    : "border-sun/60 text-sun"
                }`}
              >
                {STATUS_LABEL[item.status]}
              </span>
              <div className="min-w-0">
                <p className="font-display text-[1.05rem] leading-snug text-pretty">
                  {item.title}
                </p>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper/50 mt-1">
                  {item.when}
                  {item.walkFromHome !== null && (
                    <>
                      {" · "}
                      <span
                        className={
                          item.walkFromHome > walkLimit ? "text-paper/40" : "text-sun/80"
                        }
                      >
                        {item.walkFromHome} min
                      </span>
                    </>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
