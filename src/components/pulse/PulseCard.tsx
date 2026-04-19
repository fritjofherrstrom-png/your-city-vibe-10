import { motion } from "framer-motion";
import type { PulseItem } from "@/data/pulse";
import { STATUS_LABEL, type TimeStatus } from "@/lib/pulse-time";

type Props = {
  item: PulseItem & { status: TimeStatus };
  index: number;
};

const STATUS_STYLES: Record<TimeStatus, { badge: string; ring: string }> = {
  live: {
    badge: "bg-terracotta text-paper border-terracotta",
    ring: "border-terracotta/70 bg-terracotta/[0.06]",
  },
  soon: {
    badge: "bg-sun text-ink border-sun",
    ring: "border-sun/40",
  },
  upcoming: {
    badge: "border-paper/40 text-paper/80",
    ring: "border-paper/15 bg-paper/[0.03]",
  },
  "all-day": {
    badge: "border-paper/30 text-paper/60",
    ring: "border-paper/15 bg-paper/[0.03]",
  },
  past: {
    badge: "border-paper/15 text-paper/30",
    ring: "border-paper/10 bg-transparent opacity-50",
  },
};

export function PulseCard({ item, index }: Props) {
  const styles = STATUS_STYLES[item.status];
  const isLive = item.status === "live";

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={`group border p-6 md:p-7 hover:border-terracotta/60 hover:bg-paper/[0.05] transition-colors ${styles.ring}`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-terracotta">
            {item.kind}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] border px-2 py-0.5 ${styles.badge}`}
          >
            {isLive && (
              <span
                className="inline-block w-1 h-1 rounded-full bg-current"
                style={{ animation: "pulseDot 2.4s ease-in-out infinite" }}
              />
            )}
            {STATUS_LABEL[item.status]}
          </span>
        </div>
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
  );
}
