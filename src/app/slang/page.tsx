import Link from "next/link";
import overlayData from "@/data/overlay.json";
import type { OverlayStore } from "@/types/overlay";

const overlay = overlayData as OverlayStore;
const slangHeadwords = Object.entries(overlay)
  .filter(([, v]) => v.slang === true || (v.tags && v.tags.includes("slang")))
  .map(([headword]) => headword)
  .sort((a, b) => a.localeCompare(b));

export default function SlangPage() {
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
          Words with usage notes and North American / Black English context.
        </p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {slangHeadwords.map((headword) => (
            <li key={headword}>
              <Link
                href={`/word/${encodeURIComponent(headword.toLowerCase())}`}
                className="block rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-zinc-200 hover:bg-zinc-50 dark:bg-zinc-800 dark:ring-zinc-700 dark:hover:bg-zinc-700"
              >
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {headword}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {slangHeadwords.length === 0 && (
          <p className="mt-4 text-zinc-500 dark:text-zinc-400">
            No slang entries yet. Add entries with <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">slang: true</code> or <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">tags: [&quot;slang&quot;]</code> in{" "}
            <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">src/data/overlay.json</code>.
          </p>
        )}
      </main>
    </div>
  );
}
