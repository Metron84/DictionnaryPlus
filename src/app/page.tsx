import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:justify-between">
          <Link
            href="/"
            className="font-display text-2xl font-semibold text-zinc-900 dark:text-zinc-100"
          >
            Billie&apos;s Dictionary
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/slang"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Slang
            </Link>
          </nav>
          <div className="w-full sm:w-auto">
            <SearchBox />
          </div>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-4xl px-4 py-12" role="main">
        <section className="text-center" aria-labelledby="tagline">
          <h1 id="tagline" className="font-display text-3xl font-semibold text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            Words, roots, and how we use them
          </h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Definitions, etymology, synonyms, antonyms, and slang—with North
            American and Black English context.
          </p>
        </section>
        <section className="mt-12" aria-labelledby="try-a-word">
          <h2 id="try-a-word" className="font-display text-lg font-medium text-zinc-800 dark:text-zinc-200">
            Try a word
          </h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {["hello", "word", "lit", "fam", "language"].map((w) => (
              <li key={w}>
                <Link
                  href={`/word/${encodeURIComponent(w)}`}
                  className="rounded-lg bg-white px-3 py-1.5 text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-700"
                >
                  {w}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="mt-8" aria-labelledby="word-of-day">
          <h2 id="word-of-day" className="font-display text-lg font-medium text-zinc-800 dark:text-zinc-200">
            Word of the day
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            <Link
              href="/word/hello"
              className="font-medium text-zinc-900 underline decoration-zinc-300 hover:decoration-zinc-500 dark:text-zinc-100 dark:decoration-zinc-600 dark:hover:decoration-zinc-400"
            >
              hello
            </Link>
            —a greeting when meeting someone or answering the phone.
          </p>
        </section>
      </main>
    </div>
  );
}
