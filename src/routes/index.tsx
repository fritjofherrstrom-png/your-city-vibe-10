import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { Concept } from "@/components/Concept";
import { Pulse } from "@/components/Pulse";
import { RouteBuilder } from "@/components/RouteBuilder";
import { Manifesto } from "@/components/Manifesto";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Parranda — En personlig dag i staden" },
      {
        name: "description",
        content:
          "Parranda bygger den perfekta dagen i Rom, Stockholm eller Prag — utifrån plats, smak, tempo och stämning. Lokalt kuraterade rutter, inte listor.",
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
