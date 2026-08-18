import type { Weather } from "@/data/trip";

export function WeatherStrip({ weather }: { weather: Weather }) {
  const cells = [
    { k: "max", v: `${weather.tempMax}°` },
    { k: "min", v: `${weather.tempMin}°` },
    { k: "uv", v: String(weather.uv) },
    ...(weather.seaTemp ? [{ k: "morze", v: `${weather.seaTemp}°` }] : []),
  ];

  return (
    <div className="panel flex flex-wrap items-center gap-x-6 gap-y-3 rounded-sm px-4 py-3">
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-sun">{weather.condition}</span>
      <div className="flex flex-1 flex-wrap gap-x-6 gap-y-2">
        {cells.map((c) => (
          <div key={c.k} className="flex items-baseline gap-2">
            <span className="label-mono">{c.k}</span>
            <span className="font-display text-lg leading-none">{c.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
