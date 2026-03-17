import { notFound } from "next/navigation";
import Link from "next/link";
import { getEntry, getOverlay } from "@/lib/dictionary";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function WordPage({ params }: PageProps) {
  const { slug } = await params;
  const word = decodeURIComponent(slug);
  const entry = await getEntry(word);
  if (!entry) notFound();
  const overlay = getOverlay(entry.headword);

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
          <Link
            href="/"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            ← Search
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <article>
          <h1 className="font-display text-4xl font-semibold text-zinc-900 dark:text-zinc-100 sm:text-5xl">
            {entry.headword}
          </h1>
          {entry.pronunciation && (
            <p className="mt-1 text-zinc-500 dark:text-zinc-400">
              {entry.pronunciation}
            </p>
          )}
          {entry.partOfSpeech.length > 0 && (
            <p className="mt-2 text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {entry.partOfSpeech.join(", ")}
            </p>
          )}
          {overlay && (overlay.slang || (overlay.tags && overlay.tags.length > 0)) && (
            <div className="mt-2 flex flex-wrap gap-2">
              {overlay.slang && (
                <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                  Slang
                </span>
              )}
              {overlay.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-600 dark:text-zinc-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <section className="mt-6">
            <h2 className="font-display text-lg font-medium text-zinc-800 dark:text-zinc-200">
              Definition
            </h2>
            <ol className="mt-2 list-inside list-decimal space-y-2 text-zinc-700 dark:text-zinc-300">
              {entry.definitions.map((def, i) => (
                <li key={i}>
                  {def.definition}
                  {def.example && (
                    <span className="block pl-4 text-zinc-500 dark:text-zinc-400">
                      e.g. {def.example}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </section>
          {entry.etymology && (
            <section className="mt-6">
              <h2 className="font-display text-lg font-medium text-zinc-800 dark:text-zinc-200">
                Etymology
              </h2>
              <p className="mt-2 text-zinc-700 dark:text-zinc-300">
                {entry.etymology}
              </p>
            </section>
          )}
          {overlay?.usageNote && (
            <section className="mt-6 rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
              <h2 className="font-display text-lg font-medium text-zinc-800 dark:text-zinc-200">
                Usage
              </h2>
              <p className="mt-2 text-zinc-700 dark:text-zinc-300">
                {overlay.usageNote}
              </p>
            </section>
          )}
          {overlay?.culturalNote && (
            <section className="mt-6 rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
              <h2 className="font-display text-lg font-medium text-zinc-800 dark:text-zinc-200">
                Cultural note
              </h2>
              <p className="mt-2 text-zinc-700 dark:text-zinc-300">
                {overlay.culturalNote}
              </p>
            </section>
          )}
          {(entry.synonyms.length > 0 || entry.antonyms.length > 0) && (
            <section className="mt-6">
              <h2 className="font-display text-lg font-medium text-zinc-800 dark:text-zinc-200">
                Synonyms & antonyms
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {entry.synonyms.slice(0, 15).map((s) => (
                  <Link
                    key={s}
                    href={`/word/${encodeURIComponent(s.toLowerCase())}`}
                    className="rounded bg-emerald-100 px-2 py-1 text-sm text-emerald-800 hover:underline dark:bg-emerald-900/40 dark:text-emerald-200"
                  >
                    {s}
                  </Link>
                ))}
                {entry.antonyms.slice(0, 10).map((a) => (
                  <Link
                    key={a}
                    href={`/word/${encodeURIComponent(a.toLowerCase())}`}
                    className="rounded bg-rose-100 px-2 py-1 text-sm text-rose-800 hover:underline dark:bg-rose-900/40 dark:text-rose-200"
                  >
                    {a}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
    </div>
  );
}
