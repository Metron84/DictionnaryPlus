import type { DictionaryEntry, DictionaryEntrySummary, DefinitionSense } from "@/types/dictionary";
import type { OverlayStore } from "@/types/overlay";
import overlayData from "@/data/overlay.json";
import commonWordsData from "@/data/commonWords.json";
import etymonlineData from "@/data/etymonline.json";

const API_BASE = "https://api.dictionaryapi.dev/api/v2/entries/en";
const overlay = overlayData as OverlayStore;

const etymonline = etymonlineData as Record<string, string>;

function getEtymologyFromEtymonline(headword: string): string | null {
  const key = headword.trim().toLowerCase();
  if (!key) return null;
  const text = etymonline[key];
  return typeof text === "string" && text.length > 0 ? text : null;
}

/** Free Dictionary API response types (minimal) */
interface ApiPhonetic {
  text?: string;
  audio?: string;
}
interface ApiDefinition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}
interface ApiMeaning {
  partOfSpeech: string;
  definitions: ApiDefinition[];
  synonyms?: string[];
  antonyms?: string[];
}
interface ApiEntry {
  word: string;
  phonetics?: ApiPhonetic[];
  meanings: ApiMeaning[];
}

function normalizeEntry(apiEntries: ApiEntry[], headword: string): DictionaryEntry {
  const definitions: DefinitionSense[] = [];
  const partOfSpeech: string[] = [];
  const synonyms: string[] = [];
  const antonyms: string[] = [];
  const examples: string[] = [];

  for (const entry of apiEntries) {
    for (const meaning of entry.meanings) {
      if (!partOfSpeech.includes(meaning.partOfSpeech)) {
        partOfSpeech.push(meaning.partOfSpeech);
      }
      for (const def of meaning.definitions) {
        definitions.push({
          definition: def.definition,
          example: def.example,
        });
        if (def.example) examples.push(def.example);
      }
      if (meaning.synonyms) synonyms.push(...meaning.synonyms);
      if (meaning.antonyms) antonyms.push(...meaning.antonyms);
    }
  }

  const pronunciation =
    apiEntries[0]?.phonetics?.find((p) => p.text)?.text ?? undefined;

  return {
    id: headword.toLowerCase().trim(),
    headword,
    partOfSpeech,
    definitions,
    etymology: "",
    synonyms: [...new Set(synonyms)],
    antonyms: [...new Set(antonyms)],
    pronunciation,
    examples: examples.length ? [...new Set(examples)] : undefined,
  };
}

function mergeOverlay(entry: DictionaryEntry): DictionaryEntry {
  const key = entry.headword.toLowerCase();
  const over = overlay[key];
  if (!over) return entry;
  return {
    ...entry,
    // Overlay can extend; we don't replace base fields, we add overlay-only in UI
  };
}

/**
 * Fetch a single word from the API, normalize, add etymology from Etymonline dataset, and merge overlay.
 */
export async function getEntry(word: string): Promise<DictionaryEntry | null> {
  const headword = word.trim();
  if (!headword) return null;
  const slug = encodeURIComponent(headword.toLowerCase());

  try {
    const res = await fetch(`${API_BASE}/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = (await res.json()) as ApiEntry[];
    const entry = normalizeEntry(data, headword);
    const etymology = getEtymologyFromEtymonline(entry.headword);
    if (etymology) entry.etymology = etymology;
    return mergeOverlay(entry);
  } catch {
    return null;
  }
}

/**
 * Get overlay for a headword (for UI: usage note, cultural note, tags, slang).
 */
export function getOverlay(headword: string) {
  return overlay[headword.toLowerCase()] ?? null;
}

/** Normalize URL slug to overlay key (e.g. "no-cap" -> "no cap"). */
function slugToOverlayKey(slug: string): string {
  return decodeURIComponent(slug).replace(/-/g, " ").trim().toLowerCase();
}

/**
 * Get overlay by URL slug (supports multi-word headwords like "no cap").
 */
export function getOverlayBySlug(slug: string) {
  const key = slugToOverlayKey(slug);
  return overlay[key] ?? null;
}

/**
 * Search: filter common words by prefix. Returns summaries for type-ahead.
 * Base data is fetched on demand via getEntry when user selects a result.
 */
export async function search(query: string): Promise<DictionaryEntrySummary[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const words = getCommonWords();
  const matches = words.filter((w) => w.startsWith(q)).slice(0, 30);
  return matches.map((headword) => ({
    id: headword,
    headword,
    partOfSpeech: [],
    snippet: "",
  }));
}

function getCommonWords(): string[] {
  return commonWordsData as string[];
}
