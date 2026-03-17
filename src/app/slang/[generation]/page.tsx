import { notFound } from "next/navigation";
import Link from "next/link";
import overlayData from "@/data/overlay.json";
import type { OverlayStore } from "@/types/overlay";
import { GENERATION_SLUGS } from "@/types/overlay";

const overlay = overlayData as OverlayStore;

function headwordToSlug(h: string): string {
  return h.toLowerCase().replace(/\s+/g, "-");
}

interface PageProps {
  params: Promise<{ generation: string }>;
}

export default async function SlangGenerationPage({ params }: PageProps) {
  const { generation: slug } = await params;
  const generation = GENERATION_SLUGS[slug];
  if (!generation) notFound();

  const entries = Object.entries(overlay)
    .filter(
      ([, v]) =>
        v.slang &&
        v.generation === generation
    )
    .map(([key, v]) => ({ key, ...v }))
    .sort((a, b) => a.headword.localeCompare(b.headword));

  const title = generation;
  const description =
    generation === "Gen Alpha"
      ? "Slang from the youngest generation: internet and streaming culture."
      : generation === "Gen Z"
        ? "Slang from Gen Z: social media, Black English, and internet culture."
        : generation === "Millennial"
          ? "Millennial slang: social media, FOMO, and early internet."
          : generation === "Gen X"
            ? "Gen X slang: alternative, punk, and 90s attitude."
            : "Boomer-era slang: cool, groove, and counterculture.";

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
              href="/slang"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              All slang
            </Link>
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
        <Link
          href="/slang"
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          ← Slang & vernacular
        </Link>
        <h1 className="mt-4 font-display text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">{description}</p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {entries.map(({ headword }) => (
            <li key={headword}>
              <Link
                href={`/word/${headwordToSlug(headword)}`}
                className="block rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-zinc-200 hover:bg-zinc-50 dark:bg-zinc-800 dark:ring-zinc-700 dark:hover:bg-zinc-700"
              >
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {headword}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {entries.length === 0 && (
          <p className="mt-4 text-zinc-500 dark:text-zinc-400">
            No {title} slang entries yet.
          </p>
        )}
      </main>
    </div>
  );
}
