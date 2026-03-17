import { notFound } from "next/navigation";
import Link from "next/link";
import { getEntry, getOverlay, getOverlayBySlug } from "@/lib/dictionary";
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

  const relatedWords: { word: string; pos?: string }[] = entry
    ? [
        ...entry.synonyms.slice(0, 8).map((w) => ({ word: w })),
        ...entry.antonyms.slice(0, 5).map((w) => ({ word: w })),
      ]
    : overlay?.relatedWordIds?.map((w) => ({ word: w })) ?? [];

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
                    }
                  : undefined
              }
            />
          </div>

          <aside className="hidden w-[220px] shrink-0 flex-col gap-6 md:flex">
            <DidYouKnow title="Did you know?">
              {overlay?.culturalNote ??
                "This entry draws on historical and contemporary usage across North American and Black English contexts."}
            </DidYouKnow>
            <RelatedWords words={relatedWords} />
            <FrequencyBar data={null} />
          </aside>
        </div>
      </div>
    </div>
  );
}
