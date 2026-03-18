"use client";

import Link from "next/link";

const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

interface AlphabetStripProps {
  /** Current active letter (e.g. first letter of headword on word page) */
  activeLetter?: string | null;
}

export function AlphabetStrip({ activeLetter }: AlphabetStripProps) {
  const active = activeLetter?.toLowerCase() ?? null;

  return (
    <nav
      className="flex flex-wrap justify-center gap-0.5 border-b border-[var(--rule-light)] py-2"
      aria-label="Browse by letter"
    >
      {LETTERS.map((letter) => {
        const isActive = active === letter;
        return (
          <Link
            key={letter}
            href={`/?letter=${letter}`}
            className="min-w-[1.25rem] text-center font-body text-[0.9rem] py-0.5 px-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-offset-1"
            style={{
              color: isActive ? "var(--red-accent)" : "var(--ink)",
              borderBottom: isActive ? "2px solid var(--red-accent)" : "2px solid transparent",
            }}
            aria-current={isActive ? "true" : undefined}
          >
            {letter}
          </Link>
        );
      })}
    </nav>
  );
}
