import Link from "next/link";
import overlayData from "@/data/overlay.json";
import type { OverlayStore } from "@/types/overlay";
import { ALL_GENERATIONS } from "@/types/overlay";
import { Masthead } from "@/components/Masthead";

const overlay = overlayData as OverlayStore;

const GENERATION_SLUG: Record<string, string> = {
  "Gen Alpha": "gen-alpha",
  "Gen Z": "gen-z",
  Millennial: "millennial",
  "Gen X": "gen-x",
  Boomer: "boomer",
};

const generationDescriptions: Record<string, string> = {
  "Gen Alpha": "Internet and streaming slang",
  "Gen Z": "Social media and Black English",
  Millennial: "FOMO, YOLO, and early internet",
  "Gen X": "Punk, alternative, and 90s",
  Boomer: "Cool, groove, and counterculture",
};

export default function SlangPage() {
  const byGeneration = ALL_GENERATIONS.map((gen) => {
    const count = Object.values(overlay).filter(
      (v) => v.slang && v.generation === gen
    ).length;
    return { generation: gen, slug: GENERATION_SLUG[gen], count };
  });

  const totalSlang = Object.values(overlay).filter((v) => v.slang).length;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-[780px] px-4 py-6">
        <Masthead volume="North American Edition">
          <Link
            href="/"
            className="font-body text-[var(--blue-accent)] underline decoration-dotted hover:decoration-solid focus:outline-none focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-offset-2"
          >
            Search
          </Link>
        </Masthead>

        <main className="py-8" role="main">
          <h1 className="font-display text-[1.85rem] font-semibold text-[var(--ink)]">
            Slang & vernacular
          </h1>
          <p className="mt-2 font-body italic text-[var(--ink-muted)]">
            Browse by generation. Words with usage notes and North American /
            Black English context.
          </p>
          <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-wider text-[var(--ink-faint)]">
            {totalSlang} slang entries
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {byGeneration.map(({ generation, slug, count }) => (
              <li key={generation}>
                <Link
                  href={`/slang/${slug}`}
                  className="block border border-[var(--rule)] p-5 font-body text-[var(--ink)] hover:bg-[var(--rule-light)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-offset-2"
                >
                  <span className="font-display text-lg font-semibold text-[var(--ink)]">
                    {generation}
                  </span>
                  <p className="mt-1 font-body text-[0.9rem] text-[var(--ink-muted)]">
                    {generationDescriptions[generation]}
                  </p>
                  <p className="mt-2 font-mono text-[0.78rem] text-[var(--red-accent)]">
                    {count} {count === 1 ? "word" : "words"}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
}
