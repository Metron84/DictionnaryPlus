import { notFound } from "next/navigation";
import Link from "next/link";
import overlayData from "@/data/overlay.json";
import type { OverlayStore } from "@/types/overlay";
import { GENERATION_SLUGS } from "@/types/overlay";
import { Masthead } from "@/components/Masthead";

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
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-[780px] px-4 py-6">
        <Masthead volume="North American Edition">
          <nav className="flex items-center gap-4">
            <Link
              href="/slang"
              className="font-body text-[var(--blue-accent)] underline decoration-dotted hover:decoration-solid focus:outline-none focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-offset-2"
            >
              All slang
            </Link>
            <Link
              href="/"
              className="font-body text-[var(--blue-accent)] underline decoration-dotted hover:decoration-solid focus:outline-none focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-offset-2"
            >
              Search
            </Link>
          </nav>
        </Masthead>

        <main className="py-8" role="main">
          <Link
            href="/slang"
            className="font-body text-[0.9rem] text-[var(--ink-muted)] underline decoration-dotted hover:text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-offset-2"
          >
            ← Slang & vernacular
          </Link>
          <h1 className="mt-4 font-display text-[1.85rem] font-semibold text-[var(--ink)]">
            {title}
          </h1>
          <p className="mt-2 font-body italic text-[var(--ink-muted)]">
            {description}
          </p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {entries.map(({ headword }) => (
              <li key={headword}>
                <Link
                  href={`/word/${headwordToSlug(headword)}`}
                  className="block border border-[var(--rule)] px-4 py-3 font-body text-[var(--ink)] hover:bg-[var(--rule-light)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-offset-2"
                >
                  {headword}
                </Link>
              </li>
            ))}
          </ul>
          {entries.length === 0 && (
            <p className="mt-4 font-body text-[var(--ink-faint)]">
              No {title} slang entries yet.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
