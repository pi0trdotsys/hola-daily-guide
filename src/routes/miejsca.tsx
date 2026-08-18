import { createFileRoute } from "@tanstack/react-router";
import { BASES, PLACES } from "@/data/trip";
import { PageHeading } from "@/components/layout/PageHeading";

export const Route = createFileRoute("/miejsca")({
  head: () => ({
    meta: [
      { title: "Miejsca — noclegi, jedzenie i widoki" },
      {
        name: "description",
        content: "Gdzie się zatrzymać i co zjeść w Maladze, Tolox i Esteponie — noclegi, plaże, punkty widokowe.",
      },
      { property: "og:title", content: "Miejsca — noclegi, jedzenie i widoki" },
      { property: "og:description", content: "Wybrane adresy w Maladze, Tolox i Esteponie z orientacyjnymi cenami." },
    ],
  }),
  component: PlacesPage,
});

function PlacesPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <PageHeading
        eyebrow="Baza · trzy przystanki"
        title="Gdzie się zatrzymać"
        description="Noclegi, stoliki i punkty widokowe pogrupowane według bazy noclegowej. Ceny orientacyjne, sezon wysoki."
      />

      <div className="mt-12 space-y-12">
        {Object.values(BASES).map((base) => (
          <section key={base.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3">
              <h2 className="font-display text-2xl tracking-tight">{base.name}</h2>
              <p className="label-mono">{base.range}</p>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {PLACES.filter((p) => p.base === base.id).map((p) => (
                <article key={p.name} className="panel rounded-sm p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-terra">{p.category}</p>
                    <p className="font-mono text-[11px] text-signal">{p.price}</p>
                  </div>
                  <h3 className="mt-2 font-display text-lg tracking-tight">{p.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.note}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
