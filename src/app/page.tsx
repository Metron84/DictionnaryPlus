import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";
import { Masthead } from "@/components/Masthead";
import { AlphabetStrip } from "@/components/AlphabetStrip";
import commonWordsData from "@/data/commonWords.json";
import dictionaryQuotesData from "@/data/dictionaryQuotes.json";

const commonWords = commonWordsData as string[];

interface DictionaryQuote {
  quote: string;
  attribution: string;
  source?: string;
}
const dictionaryQuotes = dictionaryQuotesData as DictionaryQuote[];

const WORDS_PER_LETTER = 60;

interface HomePageProps {
  searchParams: Promise<{ letter?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { letter } = await searchParams;
  const normalizedLetter = letter?.toLowerCase().slice(0, 1);
  const wordsStartingWithLetter =
    normalizedLetter && /^[a-z]$/.test(normalizedLetter)
      ? commonWords
          .filter((w) => w.toLowerCase().startsWith(normalizedLetter))
          .slice(0, WORDS_PER_LETTER)
      : null;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-[780px] px-4 py-6">
        <Masthead volume="North American Edition">
          <nav className="flex items-center gap-4">
            <Link
              href="/slang"
              className="font-body text-[var(--blue-accent)] underline decoration-dotted hover:decoration-solid focus:outline-none focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-offset-2"
            >
              Slang
            </Link>
            <Link
              href="/slang/random"
              className="font-body text-[var(--blue-accent)] underline decoration-dotted hover:decoration-solid focus:outline-none focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-offset-2"
            >
              Surprise me
            </Link>
          </nav>
        </Masthead>

        <div className="mt-6 w-full">
          <SearchBox />
        </div>

        <AlphabetStrip activeLetter={letter} />

        <main id="main" className="py-12" role="main">
          {wordsStartingWithLetter != null ? (
            <section aria-labelledby="browse-by-letter">
              <h2
                id="browse-by-letter"
                className="font-mono text-[0.68rem] uppercase tracking-wider text-[var(--ink-faint)] border-b border-[var(--rule-light)] pb-1 mb-2"
              >
                Words starting with {(normalizedLetter ?? "").toUpperCase()}
              </h2>
              <ul className="flex flex-wrap gap-2">
                {wordsStartingWithLetter.map((w) => (
                  <li key={w}>
                    <Link
                      href={`/word/${encodeURIComponent(w.toLowerCase())}`}
                      className="border border-[var(--rule)] px-3 py-1.5 font-body text-[var(--ink)] hover:bg-[var(--rule-light)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-offset-2"
                    >
                      {w}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <>
              <section className="text-center" aria-labelledby="tagline">
                <h1
                  id="tagline"
                  className="font-display text-3xl font-semibold text-[var(--ink)] sm:text-4xl"
                >
                  Words, roots, and how we use them
                </h1>
                <p className="mt-3 font-body italic text-[var(--ink-muted)]">
                  Definitions, etymology, synonyms, antonyms, and slang.
                </p>
              </section>

              <section className="mt-12" aria-labelledby="reflection">
                <h2
                  id="reflection"
                  className="font-mono text-[0.68rem] uppercase tracking-wider text-[var(--ink-faint)] border-b border-[var(--rule-light)] pb-1 mb-2"
                >
                  On the dictionary
                </h2>
                {(() => {
                  const q =
                    dictionaryQuotes[
                      Math.floor(Math.random() * dictionaryQuotes.length)
                    ];
                  return (
                    <blockquote className="mt-4 border-l-2 border-[var(--rule)] pl-4 font-body italic text-[var(--ink-muted)]">
                      <p>&ldquo;{q.quote}&rdquo;</p>
                      <footer className="mt-2 not-italic text-[var(--ink)]">
                        — {q.attribution}
                        {q.source && (
                          <span className="text-[var(--ink-faint)]">
                            , {q.source}
                          </span>
                        )}
                      </footer>
                    </blockquote>
                  );
                })()}
              </section>

              <section className="mt-8" aria-labelledby="word-of-day">
                <h2
                  id="word-of-day"
                  className="font-mono text-[0.68rem] uppercase tracking-wider text-[var(--ink-faint)] border-b border-[var(--rule-light)] pb-1 mb-2"
                >
                  Word of the day
                </h2>
                <p className="mt-2 font-body text-[var(--ink)]">
                  <Link
                    href="/word/hello"
                    className="text-[var(--blue-accent)] underline decoration-dotted hover:decoration-solid focus:outline-none focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-offset-1"
                  >
                    hello
                  </Link>
                  {" "}
                  —a greeting when meeting someone or answering the phone.
                </p>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
