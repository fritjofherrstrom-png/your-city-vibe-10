import type { PulseDay } from "@/data/pulse";

type Props = {
  days: PulseDay[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function PulseDayTabs({ days, activeIndex, onSelect }: Props) {
  if (days.length <= 1) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-12 border-y border-paper/15 py-4">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/50 mr-2">
        Dag
      </span>
      {days.map((d, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={d.date}
            onClick={() => onSelect(i)}
            className={`font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-2 border transition-colors ${
              active
                ? "border-terracotta bg-terracotta text-paper"
                : "border-paper/25 text-paper/70 hover:border-paper hover:text-paper"
            }`}
          >
            Dag {i + 1} · {d.weekdayLabel.slice(0, 3)} {d.dateLabel}
          </button>
        );
      })}
    </div>
  );
}
