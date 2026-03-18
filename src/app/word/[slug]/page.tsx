import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getEntry,
  getOverlay,
  getOverlayBySlug,
  getRelatedSlang,
  getGenerationsForHeadword,
} from "@/lib/dictionary";
import { GENERATION_TO_SLUG } from "@/types/overlay";
import type { Generation } from "@/types/overlay";
import { DictionaryEntry } from "@/components/DictionaryEntry";
import { Masthead } from "@/components/Masthead";
import { SearchBox } from "@/components/SearchBox";
import { DidYouKnow } from "@/components/DidYouKnow";
import { RelatedWords } from "@/components/RelatedWords";
import { FrequencyBar } from "@/components/FrequencyBar";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function WordPage({ params }: PageProps) {
  const { slug } = await params;
  const word = decodeURIComponent(slug).replace(/-/g, " ");
  const entry = await getEntry(word);
  const overlayOnly = !entry ? getOverlayBySlug(slug) : null;
  if (!entry && !overlayOnly) notFound();
  const overlay = entry ? getOverlay(entry.headword) : overlayOnly;

  const displayHeadword = entry?.headword ?? overlayOnly?.headword ?? word;

  const relatedWords: { word: string; pos?: string; slug?: string }[] = entry
    ? [
        ...entry.synonyms.slice(0, 8).map((w) => ({ word: w })),
        ...entry.antonyms.slice(0, 5).map((w) => ({ word: w })),
      ]
    : overlay?.relatedWordIds?.map((w) => ({ word: w })) ?? [];

  const relatedSlang =
    overlay?.generation &&
    getRelatedSlang(overlay.generation, displayHeadword, 8).map((r) => ({
      word: r.headword,
      slug: r.slug,
    }));

  const otherGenerations = getGenerationsForHeadword(displayHeadword).filter(
    (g) => g !== overlay?.generation
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-[780px] px-4 py-6">
        <Masthead volume="North American Edition">
          <Link
            href="/"
            className="font-body text-[var(--blue-accent)] underline decoration-dotted hover:decoration-solid focus:outline-none focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-offset-2"
          >
            ← Search
          </Link>
          <div className="w-full min-w-0 max-w-md">
            <SearchBox />
          </div>
        </Masthead>

        {overlay?.generation && (
          <nav
            className="mt-4 font-mono text-[0.7rem] uppercase tracking-wider text-[var(--ink-faint)]"
            aria-label="Breadcrumb"
          >
            <Link
              href="/slang"
              className="text-[var(--blue-accent)] underline decoration-dotted hover:decoration-solid focus:outline-none focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-offset-2"
            >
              Slang
            </Link>
            <span className="mx-1.5" aria-hidden="true">
              →
            </span>
            <Link
              href={`/slang/${GENERATION_TO_SLUG[overlay.generation as Generation]}`}
              className="text-[var(--blue-accent)] underline decoration-dotted hover:decoration-solid focus:outline-none focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-offset-2"
            >
              {overlay.generation}
            </Link>
            <span className="mx-1.5" aria-hidden="true">
              →
            </span>
            <span className="text-[var(--ink)]">{displayHeadword}</span>
          </nav>
        )}

        {otherGenerations.length > 0 && (
          <p className="mt-2 font-body text-[0.85rem] text-[var(--ink-muted)]">
            Also in:{" "}
            {otherGenerations.map((gen, i) => (
              <span key={gen}>
                {i > 0 && ", "}
                <Link
                  href={`/slang/${GENERATION_TO_SLUG[gen as Generation]}`}
                  className="text-[var(--blue-accent)] underline decoration-dotted hover:decoration-solid focus:outline-none focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-offset-2"
                >
                  {gen}
                </Link>
              </span>
            ))}
          </p>
        )}

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[1fr_220px]">
          <div className="min-w-0">
            <DictionaryEntry
              headword={displayHeadword}
              pronunciation={entry?.pronunciation}
              partOfSpeech={entry?.partOfSpeech ?? []}
              senses={entry?.definitions ?? []}
              etymology={entry?.etymology}
              synonyms={entry?.synonyms}
              antonyms={entry?.antonyms}
              usageNote={overlay?.usageNote}
              vernacularNotes={
                overlay
                  ? {
                      usageNote: overlay.usageNote,
                      culturalNote: overlay.culturalNote,
                      tags: overlay.tags,
                      generation: overlay.generation,
                      etymologyJourney: overlay.etymologyJourney,
                      example: overlay.example,
                    }
                  : undefined
              }
            />
          </div>

          <aside className="hidden w-[220px] shrink-0 flex-col gap-6 md:flex no-print">
            <DidYouKnow title="Did you know?">
              {overlay?.culturalNote ??
                "This entry draws on historical and contemporary usage across North American and Black English contexts."}
            </DidYouKnow>
            {relatedSlang && relatedSlang.length > 0 && (
              <RelatedWords words={relatedSlang} label="Related slang" />
            )}
            <RelatedWords words={relatedWords} />
            <FrequencyBar data={null} />
            <p className="font-body text-[0.8rem] text-[var(--ink-faint)]">
              <a
                href={`mailto:feedback@example.com?subject=Report%20error%3A%20${encodeURIComponent(displayHeadword)}`}
                className="text-[var(--blue-accent)] underline decoration-dotted hover:decoration-solid focus:outline-none focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-offset-2"
              >
                Report a mistake
              </a>
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
