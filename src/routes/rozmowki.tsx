import { createFileRoute } from "@tanstack/react-router";
import { PHRASE_GROUPS, PRONUNCIATION_RULES } from "@/data/phrases";
import { PageHeading } from "@/components/layout/PageHeading";

export const Route = createFileRoute("/rozmowki")({
  head: () => ({
    meta: [
      { title: "Rozmówki hiszpańskie — zwroty na wyjazd" },
      {
        name: "description",
        content: "Podstawowe zwroty po hiszpańsku z uproszczoną wymową: bar, restauracja, nocleg, droga, sytuacje awaryjne.",
      },
      { property: "og:title", content: "Rozmówki hiszpańskie — zwroty na wyjazd" },
      { property: "og:description", content: "Zwroty po hiszpańsku z wymową dla Polaka, pogrupowane sytuacyjnie." },
    ],
  }),
  component: PhrasesPage,
});

function PhrasesPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <PageHeading
        eyebrow="Español · minimum operacyjne"
        title="Rozmówki"
        description="Zwroty pogrupowane sytuacyjnie. Trzecia kolumna to zapis wymowy czytany po polsku."
      />

      <section className="mt-10 panel rounded-sm p-5">
        <h2 className="label-mono">Zasady wymowy</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {PRONUNCIATION_RULES.map((r) => (
            <div key={r.rule} className="border-l border-signal/50 pl-3">
              <p className="font-mono text-sm text-signal">{r.rule}</p>
              <p className="mt-1 text-xs text-muted-foreground">{r.example}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-12 space-y-12">
        {PHRASE_GROUPS.map((group) => (
          <section key={group.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3">
              <h2 className="font-display text-2xl tracking-tight">{group.title}</h2>
              <p className="label-mono">{group.hint}</p>
            </div>
            <ul className="divide-y divide-border">
              {group.items.map((p) => (
                <li key={p.es} className="grid gap-1 py-4 sm:grid-cols-3 sm:items-baseline sm:gap-6">
                  <span className="text-sm text-muted-foreground">{p.pl}</span>
                  <span className="font-display text-lg tracking-tight">{p.es}</span>
                  <span className="font-mono text-sm text-signal">[{p.say}]</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
