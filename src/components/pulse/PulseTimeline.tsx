import { formatRefTime, type TimeStatus } from "@/lib/pulse-time";

type AnnotatedItem = {
  id: string;
  title: string;
  status: TimeStatus;
  startMinutes: number | null;
};

type Props = {
  items: AnnotatedItem[];
  refMinutes: number;
};

/**
 * En tunn tidslinje 06–02 som visar var i dygnet vi är + var events ligger.
 * Hjälper användaren att kalibrera "vad är just nu" mot resten av dagen.
 */
export function PulseTimeline({ items, refMinutes }: Props) {
  // Tidslinjens räckvidd: 06:00 → 02:00 nästa dag (20h)
  const START_MIN = 6 * 60;
  const END_MIN = 26 * 60; // 02:00 nästa dag
  const RANGE = END_MIN - START_MIN;

  const normalize = (m: number) => {
    // Om event ligger på "tidig morgon" (00–06) mappas det till efter midnatt
    const adjusted = m < START_MIN ? m + 24 * 60 : m;
    return Math.max(0, Math.min(1, (adjusted - START_MIN) / RANGE));
  };

  const refPosition = normalize(refMinutes);
  const timed = items.filter((i) => i.startMinutes !== null);

  const HOUR_MARKS = [6, 9, 12, 15, 18, 21, 0];

  return (
    <div className="mb-12 border-y border-paper/15 py-6">
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/50">
          Dagens tidslinje
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-terracotta">
          ◉ Nu · {formatRefTime(refMinutes)}
        </p>
      </div>

      <div className="relative h-12">
        {/* Bas-linje */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-paper/20" />

        {/* Timetiketter */}
        {HOUR_MARKS.map((h) => {
          const m = h === 0 ? 24 * 60 : h * 60;
          const pos = normalize(m);
          return (
            <div
              key={h}
              className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: `${pos * 100}%`, transform: "translate(-50%, -50%)" }}
            >
              <div className="w-px h-2 bg-paper/30 mb-1" />
              <span className="font-mono text-[9px] text-paper/40">
                {String(h).padStart(2, "0")}
              </span>
            </div>
          );
        })}

        {/* Event-prickar */}
        {timed.map((item) => {
          const pos = normalize(item.startMinutes!);
          const isLive = item.status === "live";
          const isPast = item.status === "past";
          return (
            <div
              key={item.id}
              className="absolute top-1/2 -translate-y-1/2 group"
              style={{ left: `${pos * 100}%`, transform: "translate(-50%, -50%)" }}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  isLive
                    ? "bg-terracotta scale-150"
                    : isPast
                      ? "bg-paper/20"
                      : "bg-sun"
                }`}
                style={isLive ? { animation: "pulseDot 2.4s ease-in-out infinite" } : undefined}
              />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.15em] text-paper/80 bg-ink border border-paper/20 px-2 py-1 z-10">
                {item.title}
              </div>
            </div>
          );
        })}

        {/* Nu-markör */}
        <div
          className="absolute top-0 bottom-0 w-px bg-terracotta"
          style={{ left: `${refPosition * 100}%` }}
        >
          <div
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-terracotta"
            style={{ animation: "pulseDot 2.4s ease-in-out infinite" }}
          />
        </div>
      </div>
    </div>
  );
}
