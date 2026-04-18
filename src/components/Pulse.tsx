import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ROME_PULSE, type PulseLevel } from "@/data/pulse";

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

const LEVEL_ORDER: PulseLevel[] = ["city", "neighborhood", "venue"];

export function Pulse() {
  const [activeLevel, setActiveLevel] = useState<PulseLevel | "all">("all");

  const grouped = useMemo(() => {
    return LEVEL_ORDER.map((lvl) => ({
      level: lvl,
      items: ROME_PULSE.items.filter((i) => i.level === lvl),
    }));
  }, []);

  const visible = activeLevel === "all" ? grouped : grouped.filter((g) => g.level === activeLevel);

  return (
    <section id="pulse" className="bg-ink text-paper py-24 md:py-32 grain relative overflow-hidden">
      {/* Subtle terracotta blob — like a stamp on newsprint */}
      <div
        aria-hidden
        className="absolute -top-40 -right-40 w-[480px] h-[480px] rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--terracotta)" }}
      />

      <div className="mx-auto max-w-7xl px-6 relative">
        {/* Masthead */}
        <div className="grid md:grid-cols-12 gap-8 items-end mb-16 md:mb-20">
          <div className="md:col-span-8">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="inline-block w-2 h-2 rounded-full bg-terracotta"
                style={{
                  animation: "pulseDot 2.4s ease-in-out infinite",
                }}
              />
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-paper/70">
                Live · uppdaterad just nu
              </p>
            </div>

            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper/60 mb-3">
              § Just nu i Rom · {ROME_PULSE.weekdayLabel} {ROME_PULSE.dateLabel}
            </p>

            <h2 className="font-display text-4xl md:text-6xl leading-[1.02] tracking-tight text-balance">
              {ROME_PULSE.headline}
            </h2>

            <p className="mt-6 font-display italic text-lg md:text-xl text-paper/75 max-w-2xl text-pretty">
              {ROME_PULSE.subhead}
            </p>
          </div>

          <div className="md:col-span-4 md:text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/50 mb-2">
              Edition
            </p>
            <p className="font-display text-2xl">
              <time dateTime={ROME_PULSE.date}>
                {ROME_PULSE.weekdayLabel}
                <br />
                {ROME_PULSE.dateLabel}
              </time>
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40 mt-3">
              {ROME_PULSE.items.length} signaler · 3 nivåer
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap items-center gap-2 mb-12 border-y border-paper/15 py-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/50 mr-2">
            Filtrera
          </span>
          <FilterChip active={activeLevel === "all"} onClick={() => setActiveLevel("all")}>
            Allt ({ROME_PULSE.items.length})
          </FilterChip>
          {LEVEL_ORDER.map((lvl) => {
            const count = ROME_PULSE.items.filter((i) => i.level === lvl).length;
            return (
              <FilterChip
                key={lvl}
                active={activeLevel === lvl}
                onClick={() => setActiveLevel(lvl)}
              >
                {LEVEL_META[lvl].label} ({count})
              </FilterChip>
            );
          })}
        </div>

        {/* Levels */}
        <div className="space-y-20">
          {visible.map((group) => (
            <div key={group.level}>
              {/* Level header */}
              <div className="flex items-baseline gap-6 mb-8">
                <span className="font-display italic text-5xl md:text-6xl text-terracotta/90 leading-none">
                  {LEVEL_META[group.level].mark}
                </span>
                <div>
                  <h3 className="font-display text-2xl md:text-3xl">
                    {LEVEL_META[group.level].label}
                  </h3>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/50 mt-1">
                    {LEVEL_META[group.level].sub}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="grid md:grid-cols-2 gap-6">
                {group.items.map((item, i) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="group border border-paper/15 bg-paper/[0.03] p-6 md:p-7 hover:border-terracotta/60 hover:bg-paper/[0.05] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-terracotta">
                        {item.kind}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40 text-right shrink-0">
                        {item.when}
                      </span>
                    </div>

                    <h4 className="font-display text-2xl md:text-[1.7rem] leading-[1.1] text-balance group-hover:text-sun transition-colors">
                      {item.title}
                    </h4>

                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50 mt-3">
                      ◉ {item.where}
                    </p>

                    <p className="mt-5 text-[0.95rem] leading-relaxed text-paper/85 text-pretty">
                      {item.blurb}
                    </p>

                    <div className="mt-6 pt-5 border-t border-paper/10">
                      <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-paper/40 mb-2">
                        Varför det spelar roll
                      </p>
                      <p className="font-display italic text-[1.05rem] leading-snug text-sun text-pretty">
                        {item.whyItMatters}
                      </p>
                    </div>

                    {item.matchesVibes && item.matchesVibes.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {item.matchesVibes.map((v) => (
                          <span
                            key={v}
                            className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper/50 border border-paper/20 px-2 py-1"
                          >
                            passar · {v}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.article>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-20 pt-8 border-t border-paper/15 grid md:grid-cols-12 gap-6 items-end">
          <p className="md:col-span-8 font-display italic text-lg md:text-xl text-paper/75 text-pretty max-w-2xl">
            En lokal hade vetat det här utan att tänka på det. Det är vad Parranda gör — en stad
            som viskar i örat, inte en lista att bocka av.
          </p>
          <p className="md:col-span-4 md:text-right font-mono text-[10px] uppercase tracking-[0.25em] text-paper/50">
            Nästa uppdatering · i morgon 06:00
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.4); }
        }
      `}</style>
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-2 border transition-colors ${
        active
          ? "border-terracotta bg-terracotta text-paper"
          : "border-paper/25 text-paper/70 hover:border-paper hover:text-paper"
      }`}
    >
      {children}
    </button>
  );
}
