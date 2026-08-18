import { createFileRoute } from "@tanstack/react-router";
import { CULTURE_TOPICS, QUICK_FACTS } from "@/data/spain";
import { PageHeading } from "@/components/layout/PageHeading";

export const Route = createFileRoute("/hiszpania")({
  head: () => ({
    meta: [
      { title: "Hiszpania — kultura, tradycje i praktyka" },
      {
        name: "description",
        content: "Rytm dnia, tapas, ferie i savoir-vivre w Andaluzji plus praktyczne informacje na wyjazd.",
      },
      { property: "og:title", content: "Hiszpania — kultura, tradycje i praktyka" },
      { property: "og:description", content: "Co warto wiedzieć o Andaluzji przed wyjazdem: zwyczaje, jedzenie, święta." },
    ],
  }),
  component: SpainPage,
});

function SpainPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <PageHeading
        eyebrow="Kontekst · Andaluzja"
        title="Hiszpania w skrócie"
        description="Kultura, tradycje i codzienne zasady, które decydują o tym, czy wyjazd płynie gładko."
      />

      <section className="mt-10 grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-3">
        {QUICK_FACTS.map((f) => (
          <div key={f.label} className="bg-surface p-5">
            <p className="label-mono">{f.label}</p>
            <p className="mt-2 font-display text-lg tracking-tight">{f.value}</p>
          </div>
        ))}
      </section>

      <div className="mt-12 space-y-10">
        {CULTURE_TOPICS.map((t, i) => (
          <section key={t.id} className="grid gap-5 border-t border-border pt-8 lg:grid-cols-[1fr_1.6fr]">
            <div>
              <p className="font-mono text-[11px] text-signal">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="mt-2 font-display text-2xl tracking-tight">{t.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
            </div>
            <ul className="space-y-3">
              {t.points.map((p) => (
                <li key={p} className="flex gap-3 text-sm leading-relaxed">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-signal" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
