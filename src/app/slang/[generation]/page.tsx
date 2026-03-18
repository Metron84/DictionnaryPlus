import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
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
  searchParams: Promise<{ tag?: string }>;
}

function getGenerationDescription(generation: string): string {
  return generation === "Gen Alpha"
    ? "Slang from the youngest generation: internet and streaming culture."
    : generation === "Gen Z"
      ? "Slang from Gen Z: social media, Black English, and internet culture."
      : generation === "Millennial"
        ? "Millennial slang: social media, FOMO, and early internet."
        : generation === "Gen X"
          ? "Gen X slang: alternative, punk, and 90s attitude."
          : "Boomer-era slang: cool, groove, and counterculture.";
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://billies-dictionary.vercel.app";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { generation: slug } = await params;
  const generation = GENERATION_SLUGS[slug];
  if (!generation) return {};
  const description = getGenerationDescription(generation);
  const title = `${generation} slang | Billie's Dictionary`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/slang/${slug}`,
      siteName: "Billie's Dictionary",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function SlangGenerationPage({ params, searchParams }: PageProps) {
  const { generation: slug } = await params;
  const { tag: tagFilter } = await searchParams;
  const generation = GENERATION_SLUGS[slug];
  if (!generation) notFound();

  let entries = Object.entries(overlay)
    .filter(
      ([, v]) =>
        v.slang &&
        v.generation === generation
    )
    .map(([key, v]) => ({ key, ...v }))
    .sort((a, b) => a.headword.localeCompare(b.headword));

  const allTags = Array.from(
    new Set(entries.flatMap((e) => e.tags ?? []))
  ).sort();

  if (tagFilter?.trim()) {
    entries = entries.filter((e) => e.tags?.includes(tagFilter.trim()));
  }

  const title = generation;
  const description = getGenerationDescription(generation);

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
          {allTags.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[0.68rem] uppercase tracking-wider text-[var(--ink-faint)]">
                Filter:
              </span>
              <Link
                href={`/slang/${slug}`}
                className={`rounded border px-2 py-1 font-body text-[0.8rem] focus:outline-none focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-offset-2 ${
                  !tagFilter
                    ? "border-[var(--blue-accent)] bg-[var(--rule-light)] text-[var(--ink)]"
                    : "border-[var(--rule)] text-[var(--blue-accent)] underline decoration-dotted hover:decoration-solid"
                }`}
              >
                All
              </Link>
              {allTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/slang/${slug}${tag ? `?tag=${encodeURIComponent(tag)}` : ""}`}
                  className={`rounded border px-2 py-1 font-body text-[0.8rem] focus:outline-none focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-offset-2 ${
                    tagFilter === tag
                      ? "border-[var(--blue-accent)] bg-[var(--rule-light)] text-[var(--ink)]"
                      : "border-[var(--rule)] text-[var(--blue-accent)] underline decoration-dotted hover:decoration-solid"
                  }`}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
          <ul className="mt-6 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {entries.map(({ headword, tags }) => (
              <li key={headword}>
                <Link
                  href={`/word/${headwordToSlug(headword)}`}
                  className="flex flex-wrap items-center gap-2 border border-[var(--rule)] px-4 py-3 font-body text-[var(--ink)] hover:bg-[var(--rule-light)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-offset-2"
                >
                  <span>{headword}</span>
                  {tags?.[0] && (
                    <span className="font-mono text-[0.65rem] uppercase tracking-wider text-[var(--ink-faint)]">
                      {tags[0]}
                    </span>
                  )}
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
