import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";

const NAV = [
  { to: "/", label: "Trasa" },
  { to: "/rozmowki", label: "Rozmówki" },
  { to: "/hiszpania", label: "Hiszpania" },
  { to: "/miejsca", label: "Miejsca" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-sm px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-signal" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
