interface PageHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function PageHeading({ eyebrow, title, description }: PageHeadingProps) {
  return (
    <div className="border-b border-border pb-8">
      <p className="label-mono">{eyebrow}</p>
      <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">{title}</h1>
      {description ? (
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
