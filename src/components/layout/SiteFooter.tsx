import { Logo } from "@/components/brand/Logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <Logo size={22} />
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Costa del Sol · 20–29.08 · makieta v1.0
        </p>
      </div>
    </footer>
  );
}
