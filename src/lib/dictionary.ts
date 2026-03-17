import type { DictionaryEntry, DictionaryEntrySummary, DefinitionSense } from "@/types/dictionary";
import type { OverlayStore } from "@/types/overlay";
import overlayData from "@/data/overlay.json";
import commonWordsData from "@/data/commonWords.json";

const API_BASE = "https://api.dictionaryapi.dev/api/v2/entries/en";
const overlay = overlayData as OverlayStore;

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
 * Fetch a single word from the API, normalize, and merge overlay.
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
