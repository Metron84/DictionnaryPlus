export function Footer() {
  return (
    <footer className="mt-16 footer-border">
      <div className="mx-auto flex max-w-[780px] flex-wrap items-center justify-between gap-4 px-4 py-4">
      <p className="font-body text-[0.9rem] italic text-[var(--ink-muted)]">
        Definitions from the Free Dictionary API; etymology from Etymonline. Curated notes for North American and Black English context.
      </p>
      <span className="font-mono text-[0.7rem] uppercase tracking-wider text-[var(--ink-faint)] border border-[var(--rule)] px-2 py-1">
        Billie&apos;s Dictionary
      </span>
      </div>
    </footer>
  );
}
