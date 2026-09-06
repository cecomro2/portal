export function PageHeader({
  kicker,
  title,
  subtitle,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 py-16 lg:py-20">
      <div
        className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-primary-400/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {kicker && (
          <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent-300">
            <span className="h-px w-8 bg-accent-400" />
            {kicker}
          </p>
        )}
        <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-base text-primary-100/90">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
