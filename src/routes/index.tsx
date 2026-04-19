import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { Concept } from "@/components/Concept";
import { Pulse } from "@/components/Pulse";
import { RouteBuilder } from "@/components/RouteBuilder";
import { Manifesto } from "@/components/Manifesto";
import { SiteFooter } from "@/components/SiteFooter";
import { tripSearchSchema } from "@/lib/trip";

export const Route = createFileRoute("/")({
  validateSearch: zodValidator(tripSearchSchema),
  head: () => ({
    meta: [
      { title: "Parranda — En personlig dag i staden" },
      {
        name: "description",
        content:
          "Parranda bygger den perfekta dagen i Rom utifrån dina datum, var du bor, hur långt du orkar gå och vad det är för slags dag.",
      },
      { property: "og:title", content: "Parranda — En personlig dag i staden" },
      {
        property: "og:description",
        content:
          "City guide möter route planner möter vibe-baserad reskompis. En bättre dag, snabbare och snyggare.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <Hero />
        <Concept />
        <Pulse />
        <RouteBuilder />
        <Manifesto />
      </main>
      <SiteFooter />
    </div>
  );
}
