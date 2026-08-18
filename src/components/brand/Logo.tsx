interface LogoProps {
  size?: number;
  withWordmark?: boolean;
}

/** NullPointerStudio — znak: celownik z pustym środkiem (null pointer). */
export function Logo({ size = 28, withWordmark = true }: LogoProps) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="text-signal"
      >
        <rect x="1" y="1" width="30" height="30" rx="3" className="stroke-current" strokeWidth="1.5" opacity="0.5" />
        <circle cx="16" cy="16" r="7.5" className="stroke-current" strokeWidth="1.5" />
        <path d="M9 9 L23 23" className="stroke-current" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="1.6" className="fill-current" />
      </svg>
      {withWordmark ? (
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Null<span className="text-foreground">Pointer</span>Studio
        </span>
      ) : null}
    </span>
  );
}
