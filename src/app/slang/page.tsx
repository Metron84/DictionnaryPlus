import Link from "next/link";
import overlayData from "@/data/overlay.json";
import type { OverlayStore } from "@/types/overlay";
import { ALL_GENERATIONS } from "@/types/overlay";

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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="font-display text-xl font-semibold text-zinc-900 dark:text-zinc-100"
          >
            Billie&apos;s Dictionary
          </Link>
          <nav className="flex gap-4">
            <Link
              href="/"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Search
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="font-display text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
          Slang & vernacular
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Browse by generation. Words with usage notes and North American /
          Black English context.
        </p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
          {totalSlang} slang entries
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {byGeneration.map(({ generation, slug, count }) => (
            <li key={generation}>
              <Link
                href={`/slang/${slug}`}
                className="block rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300 hover:shadow dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
              >
                <span className="font-display text-lg font-medium text-zinc-900 dark:text-zinc-100">
                  {generation}
                </span>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {generationDescriptions[generation]}
                </p>
                <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {count} {count === 1 ? "word" : "words"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
