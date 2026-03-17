import Link from "next/link";

interface MastheadProps {
  /** Right-aligned volume/edition line */
  volume?: string;
  /** Show search in masthead (e.g. word page has compact masthead + search) */
  children?: React.ReactNode;
}

export function Masthead({ volume = "North American Edition", children }: MastheadProps) {
  return (
    <header className="masthead-border">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/"
            className="font-display text-[2.6rem] font-semibold text-[var(--ink)] hover:text-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-offset-2"
          >
            Billie&apos;s Dictionary
          </Link>
          <p className="font-body mt-0.5 italic text-[var(--ink-muted)]">
            Words, roots, and how we use them
          </p>
        </div>
        <div className="flex items-center gap-4">
          {children}
          <p className="font-mono text-[0.68rem] uppercase tracking-wider text-[var(--ink-faint)] shrink-0 text-right">
            {volume}
          </p>
        </div>
      </div>
    </header>
  );
}
