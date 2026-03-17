"use client";

import { useState } from "react";
import Link from "next/link";

export interface DictionaryEntrySense {
  definition: string;
  example?: string;
}

export interface VernacularNotes {
  usageNote?: string;
  culturalNote?: string;
  tags?: string[];
  generation?: string;
}

export interface DictionaryEntryProps {
  headword: string;
  syllables?: string[];
  pronunciation?: string;
  partOfSpeech: string[];
  senses: DictionaryEntrySense[];
  etymology?: string;
  synonyms?: string[];
  antonyms?: string[];
  usageNote?: string;
  vernacularNotes?: VernacularNotes;
}

const TAB_IDS = ["definition", "etymology", "usage", "vernacular"] as const;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-[var(--ink-faint)] border-b border-[var(--rule-light)] pb-1 mb-2"
      style={{ letterSpacing: "0.1em" }}
    >
      {children}
    </h2>
  );
}

function WordSlug({ word }: { word: string }) {
  const slug = encodeURIComponent(word.toLowerCase().trim());
  return `/word/${slug}`;
}

export function DictionaryEntry({
  headword,
  syllables,
  pronunciation,
  partOfSpeech,
  senses,
  etymology,
  synonyms = [],
  antonyms = [],
  usageNote,
  vernacularNotes,
}: DictionaryEntryProps) {
  const [activeTab, setActiveTab] = useState<(typeof TAB_IDS)[number]>("definition");

  const headwordDisplay = syllables?.length
    ? syllables.join("\u00B7")
    : headword;

  return (
    <article>
      {/* Headword line */}
      <h1 className="font-display text-[1.85rem] font-semibold text-[var(--ink)]">
        {headwordDisplay}
      </h1>
      {pronunciation && (
        <p
          className="mt-1 font-body italic text-[var(--ink-muted)]"
          aria-label="pronunciation"
        >
          / {pronunciation} /
        </p>
      )}

      {/* Part of speech */}
      {partOfSpeech.length > 0 && (
        <p className="mt-2 inline-block border border-[var(--rule)] px-2 py-0.5 font-body text-[0.78rem] italic text-[var(--ink-muted)]">
          {partOfSpeech.join(", ")}
        </p>
      )}

      {/* Tab list */}
      <div
        className="mt-6 flex flex-wrap gap-6 border-b border-[var(--rule-light)]"
        role="tablist"
        aria-label="Entry sections"
      >
        {TAB_IDS.map((tabId) => {
          const label =
            tabId === "definition"
              ? "Definition"
              : tabId === "etymology"
                ? "Etymology"
                : tabId === "usage"
                  ? "Usage & Style"
                  : "Vernacular";
          const isActive = activeTab === tabId;
          return (
            <button
              key={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tabId}`}
              id={`tab-${tabId}`}
              className="font-body text-[0.9rem] pb-2 -mb-px transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-offset-2"
              style={{
                color: isActive ? "var(--red-accent)" : "var(--ink)",
                borderBottom: isActive ? "2px solid var(--red-accent)" : "2px solid transparent",
              }}
              onClick={() => setActiveTab(tabId)}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Definition panel */}
      <div
        id="panel-definition"
        role="tabpanel"
        aria-labelledby="tab-definition"
        hidden={activeTab !== "definition"}
        className="pt-4"
      >
        {senses.length > 0 && (
          <>
            <SectionLabel>Definition</SectionLabel>
            <ol className="list-decimal list-outside space-y-2 pl-5 text-[var(--ink)]">
              {senses.map((sense, i) => (
                <li key={i} className="pl-1">
                  <span className="sense-num">{i + 1}.</span>{" "}
                  <span className="font-body">{sense.definition}</span>
                  {sense.example && (
                    <span className="mt-1 block pl-5 font-body text-[0.9rem] italic text-[var(--ink-muted)] example-sentence">
                      {sense.example}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </>
        )}
        {(synonyms.length > 0 || antonyms.length > 0) && (
          <div className="mt-6">
            <SectionLabel>Synonyms & Antonyms</SectionLabel>
            <p className="font-body text-[0.85rem]">
              {synonyms.slice(0, 15).map((s, i) => (
                <span key={s}>
                  {i > 0 && " "}
                  <Link
                    href={WordSlug({ word: s })}
                    className="text-[var(--blue-accent)] underline decoration-dotted underline-offset-1 hover:decoration-solid"
                  >
                    {s}
                  </Link>
                </span>
              ))}
              {antonyms.length > 0 && synonyms.length > 0 && " \u2014 "}
              {antonyms.slice(0, 10).map((a, i) => (
                <span key={a}>
                  {i > 0 && " "}
                  <Link
                    href={WordSlug({ word: a })}
                    className="text-[var(--red-accent)] underline decoration-dotted underline-offset-1 hover:decoration-solid"
                  >
                    {a}
                  </Link>
                </span>
              ))}
            </p>
          </div>
        )}
      </div>

      {/* Etymology panel */}
      <div
        id="panel-etymology"
        role="tabpanel"
        aria-labelledby="tab-etymology"
        hidden={activeTab !== "etymology"}
        className="pt-4"
      >
        {etymology ? (
          <>
            <SectionLabel>Etymology</SectionLabel>
            <p className="font-body text-[var(--ink)]">{etymology}</p>
          </>
        ) : (
          <p className="font-body text-[var(--ink-faint)]">No etymology data for this entry.</p>
        )}
      </div>

      {/* Usage & Style panel */}
      <div
        id="panel-usage"
        role="tabpanel"
        aria-labelledby="tab-usage"
        hidden={activeTab !== "usage"}
        className="pt-4"
      >
        <SectionLabel>Usage & Style</SectionLabel>
        {usageNote ? (
          <div
            className="border-l-[2.5px] border-[var(--red-accent)] bg-[var(--color-background-secondary)] py-2 pl-4 pr-3 font-body text-[0.86rem] italic text-[var(--ink)]"
          >
            {usageNote}
          </div>
        ) : (
          <p className="font-body text-[var(--ink-faint)]">No usage note for this entry.</p>
        )}
      </div>

      {/* Vernacular panel */}
      <div
        id="panel-vernacular"
        role="tabpanel"
        aria-labelledby="tab-vernacular"
        hidden={activeTab !== "vernacular"}
        className="pt-4"
      >
        <SectionLabel>Vernacular</SectionLabel>
        {vernacularNotes && (vernacularNotes.culturalNote || vernacularNotes.usageNote || (vernacularNotes.tags?.length ?? 0) > 0 || vernacularNotes.generation) ? (
          <div className="space-y-3 font-body text-[var(--ink)]">
            {vernacularNotes?.generation && (
              <p className="text-[0.9rem]">
                <span className="font-mono text-[0.68rem] uppercase text-[var(--ink-faint)]">Generation</span>{" "}
                {vernacularNotes.generation}
              </p>
            )}
            {vernacularNotes?.culturalNote && (
              <p className="text-[0.9rem]">{vernacularNotes.culturalNote}</p>
            )}
            {vernacularNotes?.usageNote && !usageNote && (
              <p className="text-[0.9rem] italic">{vernacularNotes.usageNote}</p>
            )}
            {vernacularNotes?.tags && vernacularNotes.tags.length > 0 && (
              <p className="flex flex-wrap gap-2">
                {vernacularNotes.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-[var(--rule)] px-2 py-0.5 text-[0.78rem]"
                  >
                    {tag}
                  </span>
                ))}
              </p>
            )}
          </div>
        ) : (
          <p className="font-body text-[var(--ink-faint)]">No vernacular notes for this entry.</p>
        )}
      </div>
    </article>
  );
}
