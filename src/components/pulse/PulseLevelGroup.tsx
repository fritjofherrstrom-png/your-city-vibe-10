import type { PulseItem, PulseLevel } from "@/data/pulse";
import type { TimeStatus } from "@/lib/pulse-time";
import { PulseCard } from "./PulseCard";

type Props = {
  level: PulseLevel;
  items: (PulseItem & { status: TimeStatus })[];
};

const LEVEL_META: Record<PulseLevel, { label: string; sub: string; mark: string }> = {
  city: {
    label: "Stadens rytm",
    sub: "Det en lokal bär med sig utan att tänka på det",
    mark: "I",
  },
  neighborhood: {
    label: "Kvarterspuls",
    sub: "Vad som faktiskt händer där just i kväll",
    mark: "II",
  },
  venue: {
    label: "Ställesnivå",
    sub: "Premiärer, set, smaker som bara finns nu",
    mark: "III",
  },
};

export function PulseLevelGroup({ level, items }: Props) {
  if (items.length === 0) return null;
  const meta = LEVEL_META[level];

  return (
    <div>
      <div className="flex items-baseline gap-6 mb-8">
        <span className="font-display italic text-5xl md:text-6xl text-terracotta/90 leading-none">
          {meta.mark}
        </span>
        <div>
          <h3 className="font-display text-2xl md:text-3xl">{meta.label}</h3>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/50 mt-1">
            {meta.sub}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {items.map((item, i) => (
          <PulseCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}
