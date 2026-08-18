import { createFileRoute, Link } from "@tanstack/react-router";
import { BASES, TRIP_DAYS } from "@/data/trip";
import { PageHeading } from "@/components/layout/PageHeading";
import { WeatherStrip } from "@/components/trip/WeatherStrip";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Andalucía 20–29.08 — przewodnik dzień po dniu" },
      {
        name: "description",
        content:
          "Osobisty przewodnik po Andaluzji: Málaga, Tolox i Estepona dzień po dniu, pogoda, rozmówki i miejsca warte postoju.",
      },
      { property: "og:title", content: "Andalucía 20–29.08 — przewodnik dzień po dniu" },
      {
        property: "og:description",
        content: "Plan wyjazdu 20–29 sierpnia: Málaga, Tolox, Estepona. Pogoda, kultura, rozmówki.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <PageHeading
        eyebrow="Andaluzja · 20–29 sierpnia"
        title="Dziesięć dni na południu"
        description="Trzy bazy, jedna trasa. Wybierz dzień, żeby zobaczyć plan godzinowy, prognozę, lokalne wydarzenia i podpowiedzi."
      />

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {Object.values(BASES).map((base) => (
          <article key={base.id} className="panel rounded-sm p-5">
            <p className="label-mono">{base.range}</p>
            <h2 className="mt-2 font-display text-2xl tracking-tight">{base.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{base.tagline}</p>
            <p className="mt-4 font-mono text-[11px] text-signal">{base.coords}</p>
          </article>
        ))}
      </section>

      <section className="mt-14">
        <h2 className="label-mono">Dzień po dniu</h2>
        <div className="mt-5 divide-y divide-border border-y border-border">
          {TRIP_DAYS.map((day, i) => (
            <Link
              key={day.date}
              to="/dzien/$date"
              params={{ date: day.date }}
              className="group grid gap-4 px-1 py-6 transition-colors hover:bg-secondary/40 sm:grid-cols-[auto_1fr_auto] sm:items-center"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-[11px] text-signal">
                  D{String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-xl tracking-tight">{day.label}</span>
                <span className="label-mono">{day.weekday}</span>
              </div>
              <div className="sm:px-6">
                <p className="font-display text-base">{day.headline}</p>
                <p className="mt-1 text-sm text-muted-foreground">{day.summary}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="label-mono">{BASES[day.base].name}</span>
                <span className="font-mono text-sm text-sun">{day.weather.tempMax}°</span>
                <span className="font-mono text-signal transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-4 sm:grid-cols-2">
        <div>
          <h2 className="label-mono">Prognoza startowa</h2>
          <div className="mt-4">
            <WeatherStrip weather={TRIP_DAYS[0]!.weather} />
          </div>
        </div>
        <div className="panel rounded-sm p-5">
          <h2 className="label-mono">Skróty</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/rozmowki" className="rounded-sm border border-border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors hover:border-signal hover:text-signal">
              Rozmówki
            </Link>
            <Link to="/hiszpania" className="rounded-sm border border-border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors hover:border-signal hover:text-signal">
              Kultura i tradycje
            </Link>
            <Link to="/miejsca" className="rounded-sm border border-border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors hover:border-signal hover:text-signal">
              Gdzie się zatrzymać
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
