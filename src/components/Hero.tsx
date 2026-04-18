import { motion } from "framer-motion";
import heroImage from "@/assets/hero-rome.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-12 md:pt-24 md:pb-20 grid md:grid-cols-12 gap-10 items-end">
        <div className="md:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6"
          >
            Issue Nº01 · En dag i taget
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-[2.6rem] sm:text-6xl md:text-7xl leading-[0.95] tracking-tight text-balance"
          >
            Inte vad du <em className="text-accent not-italic font-display italic">borde</em> se.
            <br />
            Hur du borde <em className="font-display italic">uppleva</em> det.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed text-pretty"
          >
            Parranda bygger den perfekta dagen i en stad — utifrån plats, tempo och stämning.
            En personlig, lokalt kuraterad rutt. Inte en lista. En riktning.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#pulse"
              className="bg-foreground text-background px-7 py-4 text-sm font-mono uppercase tracking-[0.18em] hover:bg-accent transition-colors"
            >
              Se vad som händer just nu →
            </a>
            <a
              href="#route"
              className="text-sm font-mono uppercase tracking-[0.18em] underline decoration-foreground/30 underline-offset-8 hover:decoration-accent hover:text-accent transition-colors"
            >
              Bygg din dag
            </a>
          </motion.div>

          <div className="mt-16 flex items-center gap-4 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
            <span>Demo · Rom · torsdag 18 april 2026</span>
            <span className="opacity-30">/</span>
            <span className="opacity-50">Stockholm & Prag snart</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="md:col-span-5 relative grain"
        >
          <div className="aspect-[4/5] overflow-hidden bg-muted">
            <img
              src={heroImage}
              alt="Sun-drenched Roman piazza at golden hour with a vespa"
              className="w-full h-full object-cover"
              width={1600}
              height={1216}
            />
          </div>
          <div className="absolute -bottom-3 -left-3 md:-left-6 bg-background border border-foreground/80 px-4 py-3 max-w-[14rem] shadow-[var(--shadow-card)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Plate Nº37
            </p>
            <p className="font-display italic text-sm mt-1 leading-snug">
              Piazza i Trastevere, 18:42 — golden hour, ingen brådska.
            </p>
          </div>
        </motion.div>
      </div>
      <div className="editorial-rule mx-auto max-w-7xl" />
    </section>
  );
}
