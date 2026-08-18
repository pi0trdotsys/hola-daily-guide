import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BASES, TRIP_DAYS } from "@/data/trip";
import { WeatherStrip } from "@/components/trip/WeatherStrip";
import { PageHeading } from "@/components/layout/PageHeading";

export const Route = createFileRoute("/dzien/$date")({
  loader: ({ params }) => {
    const day = TRIP_DAYS.find((d) => d.date === params.date);
    if (!day) throw notFound();
    return { day };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Dzień nie znaleziony" }, { name: "robots", content: "noindex" }],
      };
    }
    const { day } = loaderData;
    const title = `${day.label} — ${day.headline}`;
    return {
      meta: [
        { title },
        { name: "description", content: day.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: day.summary },
      ],
    };
  },
  component: DayPage,
});

function DayPage() {
  const { day } = Route.useLoaderData();
  const index = TRIP_DAYS.findIndex((d) => d.date === day.date);
  const prev = TRIP_DAYS[index - 1];
  const next = TRIP_DAYS[index + 1];

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {TRIP_DAYS.map((d, i) => (
          <Link
            key={d.date}
            to="/dzien/$date"
            params={{ date: d.date }}
            className="shrink-0 rounded-sm border border-border px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "border-signal text-signal signal-ring" }}
          >
            D{String(i + 1).padStart(2, "0")}
          </Link>
        ))}
      </div>

      <PageHeading
        eyebrow={`${day.weekday} · ${BASES[day.base].name}`}
        title={day.headline}
        description={day.summary}
      />

      <div className="mt-8">
        <WeatherStrip weather={day.weather} />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <h2 className="label-mono">Plan dnia</h2>
          <ol className="mt-5 border-l border-border">
            {day.plan.map((item) => (
              <li key={item.time} className="relative pb-8 pl-6 last:pb-0">
                <span className="absolute -left-[3px] top-1.5 size-1.5 rounded-full bg-signal" />
                <p className="font-mono text-[11px] tracking-[0.16em] text-signal">{item.time}</p>
                <p className="mt-1 font-display text-lg tracking-tight">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
              </li>
            ))}
          </ol>
        </section>

        <aside className="space-y-5">
          <div className="panel rounded-sm p-5">
            <h2 className="label-mono">Co się dzieje</h2>
            <ul className="mt-4 space-y-4">
              {day.happening.map((h) => (
                <li key={h.title}>
                  <p className="font-display text-base">{h.title}</p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-terra">{h.where}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{h.note}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-sm border border-signal/40 bg-secondary/40 p-5">
            <h2 className="label-mono">Wskazówka</h2>
            <p className="mt-2 text-sm leading-relaxed">{day.tip}</p>
          </div>
        </aside>
      </div>

      <nav className="mt-14 flex items-center justify-between border-t border-border pt-6 font-mono text-[11px] uppercase tracking-[0.16em]">
        {prev ? (
          <Link to="/dzien/$date" params={{ date: prev.date }} className="text-muted-foreground hover:text-signal">
            ← {prev.label}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to="/dzien/$date" params={{ date: next.date }} className="text-muted-foreground hover:text-signal">
            {next.label} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
