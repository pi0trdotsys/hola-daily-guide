# Andalucía Guide — dokumentacja implementacyjna

Sygnatura: **NullPointerStudio**. Styl: *Minimal Fancy Tech* (ink-dark, hairline grid, jeden akcent sygnałowy, mono micro-typografia).

## 1. Zakres produktu

Prywatny przewodnik na wyjazd **20–29 sierpnia** do Andaluzji.

| Odcinek | Daty | Baza |
|---|---|---|
| 1 | 20–22.08 | Málaga |
| 2 | 22–26.08 | Tolox |
| 3 | 26–29.08 | Estepona |

> Uwaga: brief zawierał rozbieżność (sierpień vs wrzesień przy miastach). Makieta zakłada sierpień. Zmiana = wyłącznie edycja `TRIP_DAYS[].date/label` oraz `BASES[].range`.

Sekcje: trasa dzień po dniu, karta dnia (plan, wydarzenia, pogoda, tip), rozmówki, informacje o Hiszpanii (kultura/tradycje/praktyka), miejsca (noclegi, jedzenie, widoki, plaże).

## 2. Stack

- TanStack Start v1 + TanStack Router (file-based routing), React 19, Vite 7
- TypeScript strict
- Tailwind CSS v4 (tokeny w `src/styles.css`, brak `tailwind.config.js`)
- shadcn/ui dostępne w `src/components/ui` (makieta ich nie wymaga)

## 3. Struktura plików

```
src/
  styles.css                     # design system: tokeny oklch + utilities
  routes/
    __root.tsx                   # shell: fonty, header, footer, meta
    index.tsx                    # / — przegląd tras + lista 10 dni
    dzien.$date.tsx              # /dzien/$date — karta pojedynczego dnia
    rozmowki.tsx                 # /rozmowki
    hiszpania.tsx                # /hiszpania
    miejsca.tsx                  # /miejsca
  data/
    trip.ts                      # BASES, TRIP_DAYS, PLACES + typy
    phrases.ts                   # PHRASE_GROUPS, PRONUNCIATION_RULES
    spain.ts                     # QUICK_FACTS, CULTURE_TOPICS
  components/
    brand/Logo.tsx               # znak + wordmark NullPointerStudio
    layout/SiteHeader.tsx        # sticky nav
    layout/SiteFooter.tsx
    layout/PageHeading.tsx       # eyebrow + h1 + lead
    trip/WeatherStrip.tsx        # pasek pogodowy
```

Routing: nazwa pliku z kropkami = segmenty URL. `dzien.$date.tsx` → `createFileRoute("/dzien/$date")`. `src/routeTree.gen.ts` jest generowany — nie edytować.

## 4. Model danych (`src/data/trip.ts`)

```ts
type Base = "malaga" | "tolox" | "estepona";

interface Weather { tempMax: number; tempMin: number; condition: string; seaTemp?: number; uv: number }
interface PlanItem { time: string; title: string; note: string }
interface Happening { title: string; where: string; note: string }

interface TripDay {
  date: string;        // ISO, klucz routingu
  label: string;       // "20 sierpnia"
  weekday: string;
  base: Base;
  headline: string;
  summary: string;
  plan: PlanItem[];
  happening: Happening[];
  weather: Weather;    // makieta: dane statyczne
  tip: string;
}

interface Place { name: string; base: Base; category: "Nocleg"|"Jedzenie"|"Widok"|"Plaża"|"Kultura"; note: string; price: string }
```

`TRIP_DAYS` ma 10 wpisów (D01–D10). `BASES` to `Record<Base, BaseInfo>` z `name`, `range`, `tagline`, `coords`.

## 5. Design system

Tokeny w `src/styles.css` (`:root`, format **oklch**). Nigdy nie używać klas typu `text-white`, `bg-[#...]` w komponentach.

| Token | Rola |
|---|---|
| `--background` `oklch(0.16 0.012 250)` | tło ink |
| `--surface` / `--surface-2` | panele |
| `--signal` `oklch(0.84 0.17 180)` | jedyny akcent (cyan) |
| `--sun` / `--terra` | temperatura / kategorie |
| `--border` | hairline 1px |
| `--radius` `0.25rem` | ostre narożniki |

Utilities: `panel` (półprzezroczysty panel + blur + shadow), `label-mono` (mono 11px, tracking .18em, uppercase), `signal-ring` (glow akcentu). Body ma siatkę 96×96 px z `--grid-line`.

Typografia: `Space Grotesk` (display/sans) + `JetBrains Mono` (mono), ładowane `<link>` w `__root.tsx` head — **nie** przez `@import` w CSS (Tailwind v4/Lightning CSS).

Reguły kompozycji: nagłówek strony = eyebrow mono + h1 display + lead; listy jako `divide-y` na hairline; brak cieni poza `--shadow-panel`; hover = zmiana koloru/translate, bez skalowania.

## 6. Logo

`src/components/brand/Logo.tsx` — SVG 32×32: kwadratowa ramka (opacity .5), okrąg, przekątna 9,9→23,23 i kropka w centrum (metafora null pointera). Kolor dziedziczy `text-signal`. Props: `size?: number = 28`, `withWordmark?: boolean = true`. Wordmark: „Null**Pointer**Studio”, mono 11px, tracking .22em.

## 7. Strony — kontrakt

- **`/`** — hero heading; 3 karty baz (`BASES`); lista dni jako wiersze `Link → /dzien/$date` z `D01`, datą, headline, bazą i temperaturą; sekcja skrótów.
- **`/dzien/$date`** — loader szuka dnia po `params.date`, brak → `notFound()`. `head({ loaderData })` obsługuje `loaderData === undefined` (noindex). Zawiera: pasek D01–D10, `PageHeading`, `WeatherStrip`, oś czasu planu (kropki na lewej krawędzi), panel „Co się dzieje”, box „Wskazówka”, nawigację prev/next.
- **`/rozmowki`** — tabela zasad wymowy + 5 grup; wiersz = PL / ES / `[wymowa]` w kolorze sygnału.
- **`/hiszpania`** — 6 kafli faktów (grid `gap-px` na tle `bg-border`) + 5 tematów w układzie dwukolumnowym z numeracją.
- **`/miejsca`** — grupowanie po bazie, karty `panel` z kategorią, ceną, nazwą i notatką.

Każda trasa ma własne `head()` z unikalnym `title`, `description`, `og:title`, `og:description`.

## 8. Rozszerzenia po makiecie

1. **Pogoda live** — zamienić statyczne `weather` na `createServerFn({ method: "GET" })` w `src/lib/weather.functions.ts` odpytujące Open-Meteo po `coords` z `BASES`; loader trasy przez `context.queryClient.ensureQueryData`, komponent przez `useSuspenseQuery`. Statyczne dane zostają jako fallback.
2. **Wydarzenia** — `happening` docelowo z CMS/JSON; interfejs bez zmian.
3. **Offline** — dane są statyczne, więc wystarczy service worker cache-first.
4. **Ulubione / notatki** — wymaga Lovable Cloud (tabela `notes` z RLS po `auth.uid()`), czytana wyłącznie po stronie klienta.
5. **Audio wymowy** — pole `audio?: string` w `Phrase`, TTS generowane offline do `public/audio`.

## 9. Zasady utrzymania

- Cała treść w `src/data/*` — komponenty nie zawierają tekstów merytorycznych.
- Nowa trasa = nowy plik w `src/routes` + wpis w `NAV` w `SiteHeader.tsx`.
- Nowy kolor = token w `:root` + rejestracja w `@theme inline` jako `--color-<nazwa>`.
- Bez light/dark toggle — interfejs jest jednomotywowy (ink).
