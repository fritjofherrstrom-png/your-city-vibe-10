import type { PulseDay } from "@/data/pulse";

type Props = {
  upcomingDays: PulseDay[];
  baseDayIndex: number;
  onSelect: (index: number) => void;
};

export function PulseSneakPeek({ upcomingDays, baseDayIndex, onSelect }: Props) {
  if (upcomingDays.length === 0) return null;

  return (
    <div className="mt-20 pt-10 border-t border-paper/15">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/50 mb-6">
        Sneak peek · Resten av din vistelse
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        {upcomingDays.map((d, i) => (
          <button
            key={d.date}
            onClick={() => onSelect(baseDayIndex + 1 + i)}
            className="text-left border border-paper/15 p-5 hover:border-terracotta/60 hover:bg-paper/[0.04] transition-colors"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-terracotta mb-2">
              Dag {baseDayIndex + 2 + i} · {d.weekdayLabel} {d.dateLabel}
            </p>
            <h5 className="font-display text-xl leading-tight text-balance">
              {d.headline}
            </h5>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50">
              Visa dagens puls →
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
