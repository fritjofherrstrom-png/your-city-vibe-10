import { useState, useEffect } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { CalendarIcon, Settings2 } from "lucide-react";
import type { DateRange } from "react-day-picker";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { ROME_ZONES, type RomeZone } from "@/data/rome-geography";
import { walkLabel, type TripSearch } from "@/lib/trip";
import { VIBES, type Vibe } from "@/data/cities";

/**
 * TripPlanner — sheet ovanför rutten där användaren anger
 * datum, hotellzon och promenadtolerans. Allt sparas i URL.
 */
export function TripPlanner() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/" }) as TripSearch;
  const [open, setOpen] = useState(false);

  // Lokal draft state — committas till URL vid "Spara"
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(search.start + "T00:00:00"),
    to: new Date(search.end + "T00:00:00"),
  });
  const [zone, setZone] = useState<RomeZone>(search.zone as RomeZone);
  const [walk, setWalk] = useState<number>(search.walk);
  const [vibe, setVibe] = useState<Vibe>(search.vibe as Vibe);

  // Reset när sheet öppnas — vi vill alltid spegla aktuellt URL-state
  useEffect(() => {
    if (open) {
      setRange({
        from: new Date(search.start + "T00:00:00"),
        to: new Date(search.end + "T00:00:00"),
      });
      setZone(search.zone as RomeZone);
      setWalk(search.walk);
      setVibe(search.vibe as Vibe);
    }
  }, [open, search.start, search.end, search.zone, search.walk, search.vibe]);

  const save = () => {
    const start = range?.from ? format(range.from, "yyyy-MM-dd") : search.start;
    const end = range?.to
      ? format(range.to, "yyyy-MM-dd")
      : range?.from
        ? format(range.from, "yyyy-MM-dd")
        : search.end;

    navigate({
      to: "/",
      search: (prev: TripSearch) => ({
        ...prev,
        start,
        end,
        zone,
        walk,
        vibe,
        day: 0, // återställ till första dagen vid ny resa
      }),
      hash: "route",
    });
    setOpen(false);
  };

  const startLabel = range?.from ? format(range.from, "d MMM", { locale: sv }) : "—";
  const endLabel = range?.to ? format(range.to, "d MMM", { locale: sv }) : startLabel;
  const dayCount =
    range?.from && range?.to
      ? Math.round((range.to.getTime() - range.from.getTime()) / 86400000) + 1
      : 1;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="font-mono text-[11px] uppercase tracking-[0.2em] border-foreground/30 hover:border-foreground hover:bg-sand"
        >
          <Settings2 className="mr-2 h-3.5 w-3.5" />
          Planera din resa
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-md overflow-y-auto bg-paper text-ink border-l border-foreground/20"
      >
        <SheetHeader className="text-left">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            § Planera
          </p>
          <SheetTitle className="font-display text-3xl tracking-tight">
            Din resa till Rom
          </SheetTitle>
          <SheetDescription className="font-display italic text-base">
            Datum, var du bor, hur långt du orkar gå. Allt annat anpassar sig.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-8">
          {/* ── Datum ─────────────────────────────────── */}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground block mb-3">
              När är du i Rom
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-display text-base h-auto py-3 border-foreground/30",
                    !range?.from && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-3 h-4 w-4" />
                  {range?.from ? (
                    <>
                      {startLabel} → {endLabel}
                      <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {dayCount} {dayCount === 1 ? "dag" : "dagar"}
                      </span>
                    </>
                  ) : (
                    <span>Välj datum</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 pointer-events-auto"
                align="start"
              >
                <Calendar
                  mode="range"
                  selected={range}
                  onSelect={setRange}
                  numberOfMonths={1}
                  defaultMonth={range?.from ?? new Date("2026-04-18")}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Demo-data finns för 18–22 april 2026
            </p>
          </div>

          {/* ── Hotellzon ─────────────────────────────── */}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground block mb-3">
              Var bor du
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ROME_ZONES.map((z) => {
                const active = zone === z.id;
                return (
                  <button
                    key={z.id}
                    onClick={() => setZone(z.id)}
                    className={cn(
                      "text-left p-3 border transition-all",
                      active
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-foreground/20 hover:border-foreground bg-background",
                    )}
                  >
                    <div className="font-display text-base leading-tight">{z.label}</div>
                    <div
                      className={cn(
                        "mt-1 text-[11px] leading-snug",
                        active ? "opacity-90" : "text-muted-foreground",
                      )}
                    >
                      {z.blurb}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Promenadtolerans ──────────────────────── */}
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Hur långt orkar du gå mellan stopp
              </label>
              <span className="font-display text-lg">
                {walk} <span className="text-muted-foreground text-sm">min</span>
              </span>
            </div>
            <Slider
              value={[walk]}
              onValueChange={(v) => setWalk(v[0])}
              min={5}
              max={45}
              step={1}
              className="my-4"
            />
            <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span>5 min · kort</span>
              <span>{walkLabel(walk)}</span>
              <span>45 min · lång</span>
            </div>
          </div>

          {/* ── Vibe ──────────────────────────────────── */}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground block mb-3">
              Vad är det för slags dag
            </label>
            <div className="grid grid-cols-2 gap-2">
              {VIBES.map((v) => {
                const active = vibe === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setVibe(v.id)}
                    className={cn(
                      "text-left p-3 border transition-all",
                      active
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-foreground/20 hover:border-foreground bg-background",
                    )}
                  >
                    <div className="font-display text-base leading-tight">{v.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-foreground/15">
            <Button
              onClick={save}
              className="w-full font-mono text-xs uppercase tracking-[0.25em] h-12 bg-ink text-paper hover:bg-terracotta"
            >
              Spara &amp; bygg dagen
            </Button>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-center">
              Allt sparas i adressraden — dela länken
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
