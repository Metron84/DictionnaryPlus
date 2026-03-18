import type { DictionaryEntry, DictionaryEntrySummary, DefinitionSense } from "@/types/dictionary";
import type { OverlayStore } from "@/types/overlay";
import overlayData from "@/data/overlay.json";
import commonWordsData from "@/data/commonWords.json";
import etymonlineData from "@/data/etymonline.json";

const API_BASE = "https://api.dictionaryapi.dev/api/v2/entries/en";
const MW_API_BASE = "https://www.dictionaryapi.com/api/v3/references/collegiate/json";
const overlay = overlayData as OverlayStore;

const etymonline = etymonlineData as Record<string, string>;

function getEtymologyFromEtymonline(headword: string): string | null {
  const key = headword.trim().toLowerCase();
  if (!key) return null;
  const text = etymonline[key];
  return typeof text === "string" && text.length > 0 ? text : null;
}

/** Strip Merriam-Webster inline markup for plain-text display. */
function stripMwMarkup(text: string): string {
  return text
    .replace(/\{bc\}/g, ": ")
    .replace(/\{sx\|[^|]*\|\|[^}]*\}/g, "")
    .replace(/\{a_link\|[^}]*\}/g, (m) => m.replace(/\{a_link\|/, "").replace(/\}/, ""))
    .replace(/\{it\}([\s\S]*?)\{\\/it\}/g, "$1")
    .replace(/\{wi\}([\s\S]*?)\{\\/wi\}/g, "$1")
    .replace(/\{ds\|[^}]*\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Merriam-Webster Collegiate API entry (minimal). */
interface MWEntry {
  meta?: { id?: string };
  hwi?: { hw?: string; prs?: { mw?: string }[] };
  fl?: string;
  shortdef?: string[];
  et?: [string, string][];
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

function normalizeMerriamWebsterEntry(mw: MWEntry, headword: string): DictionaryEntry {
  const id = headword.toLowerCase().trim();
  const partOfSpeech = mw.fl ? [mw.fl] : [];
  const definitions: DefinitionSense[] = (mw.shortdef ?? []).map((s) => ({
    definition: stripMwMarkup(s),
  }));
  let etymology = "";
  if (Array.isArray(mw.et) && mw.et.length > 0) {
    const parts = mw.et.map((pair) => (Array.isArray(pair) && pair[1] ? stripMwMarkup(String(pair[1])) : "")).filter(Boolean);
    etymology = parts.join(" ");
  }
  const pronunciation = mw.hwi?.prs?.[0]?.mw;
  return {
    id,
    headword,
    partOfSpeech,
    definitions,
    etymology,
    synonyms: [],
    antonyms: [],
    pronunciation,
  };
}

async function fetchMerriamWebster(headword: string): Promise<DictionaryEntry | null> {
  const key = process.env.MERRIAM_WEBSTER_API_KEY;
  if (!key?.trim()) return null;
  const q = encodeURIComponent(headword.trim().toLowerCase().replace(/\s+/g, "-"));
  try {
    const res = await fetch(`${MW_API_BASE}/${q}?key=${encodeURIComponent(key)}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as (MWEntry | string)[];
    if (!Array.isArray(data) || data.length === 0) return null;
    const first = data[0];
    if (typeof first === "string" || !first || !("meta" in first) || !("shortdef" in first)) return null;
    const displayHeadword = (first as MWEntry).meta?.id ?? headword;
    return normalizeMerriamWebsterEntry(first as MWEntry, displayHeadword);
  } catch {
    return null;
  }
}

/**
 * Fetch a single word from the API, normalize, add etymology from Etymonline dataset, and merge overlay.
 * Tries Free Dictionary API first; falls back to Merriam-Webster if configured and first returns no result.
 */
export async function getEntry(word: string): Promise<DictionaryEntry | null> {
  const headword = word.trim();
  if (!headword) return null;
  const slug = encodeURIComponent(headword.toLowerCase());

  try {
    const res = await fetch(`${API_BASE}/${slug}`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = (await res.json()) as ApiEntry[];
      const entry = normalizeEntry(data, headword);
      const etymology = getEtymologyFromEtymonline(entry.headword);
      if (etymology) entry.etymology = etymology;
      return mergeOverlay(entry);
    }
  } catch {
    // fall through to MW
  }

  const mwEntry = await fetchMerriamWebster(headword);
  if (!mwEntry) return null;
  const etymology = getEtymologyFromEtymonline(mwEntry.headword);
  if (etymology) mwEntry.etymology = etymology;
  return mergeOverlay(mwEntry);
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
 * Search: common words + overlay (slang) by prefix. Returns summaries for type-ahead.
 * Base data is fetched on demand via getEntry / getOverlayBySlug when user selects.
 */
export async function search(query: string): Promise<DictionaryEntrySummary[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const words = getCommonWords();
  const commonMatches = words.filter((w) => w.startsWith(q)).slice(0, 30);
  const overlayMatches = Object.entries(overlay)
    .filter(
      ([key, v]) =>
        v.slang &&
        (key.startsWith(q) || (v.headword && v.headword.toLowerCase().startsWith(q)))
    )
    .map(([, v]) => v.headword)
    .slice(0, 20);
  const seen = new Set<string>();
  const merged: string[] = [];
  for (const h of [...overlayMatches, ...commonMatches]) {
    const norm = h.toLowerCase().trim();
    if (!seen.has(norm)) {
      seen.add(norm);
      merged.push(h);
    }
  }
  return merged.slice(0, 30).map((headword) => ({
    id: headword.toLowerCase().replace(/\s+/g, "-"),
    headword,
    partOfSpeech: [],
    snippet: "",
  }));
}

function getCommonWords(): string[] {
  return commonWordsData as string[];
}

/** All slang headwords with slugs for random / related. */
export function getSlangHeadwords(): { headword: string; slug: string; generation?: string }[] {
  return Object.entries(overlay)
    .filter(([, v]) => v.slang)
    .map(([key, v]) => ({
      headword: v.headword,
      slug: key.toLowerCase().replace(/\s+/g, "-"),
      generation: v.generation,
    }));
}

/** Pick a random slang entry and return its slug (for Surprise me). */
export function getRandomSlangSlug(): string {
  const list = getSlangHeadwords();
  if (list.length === 0) return "hello";
  const i = Math.floor(Math.random() * list.length);
  return list[i].slug;
}

/** Deterministic word of the day by calendar date (UTC). Returns slug, headword, and short blurb. */
export function getWordOfTheDay(
  date: Date = new Date()
): { slug: string; headword: string; blurb: string } {
  const slangList = getSlangHeadwords();
  const common = getCommonWords();
  const daySeed =
    date.getUTCFullYear() * 366 + date.getUTCMonth() * 31 + date.getUTCDate();

  if (slangList.length > 0) {
    const i = Math.abs(daySeed) % slangList.length;
    const { headword, slug } = slangList[i];
    const ov = getOverlay(headword);
    const blurb =
      ov?.usageNote ??
      ov?.culturalNote ??
      (ov?.example ? `e.g. ${ov.example}` : null) ??
      "Explore this entry for definitions and more.";
    return { slug, headword, blurb };
  }

  if (common.length > 0) {
    const i = Math.abs(daySeed) % common.length;
    const headword = common[i];
    const slug = headword.toLowerCase().replace(/\s+/g, "-");
    return {
      slug,
      headword,
      blurb: "Explore this entry for definitions and more.",
    };
  }

  return {
    slug: "hello",
    headword: "hello",
    blurb: "a greeting when meeting someone or answering the phone.",
  };
}

/** Same-generation slang headwords for "Related slang" (exclude current, limit count). */
export function getRelatedSlang(
  generation: string,
  excludeHeadword: string,
  limit: number = 8
): { headword: string; slug: string }[] {
  const key = excludeHeadword.toLowerCase().trim();
  return Object.entries(overlay)
    .filter(
      ([k, v]) =>
        v.slang &&
        v.generation === generation &&
        k !== key &&
        v.headword.toLowerCase() !== key
    )
    .map(([k, v]) => ({
      headword: v.headword,
      slug: k.toLowerCase().replace(/\s+/g, "-"),
    }))
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);
}

/** All generations that have an overlay entry for this headword (for "Also in" note). */
export function getGenerationsForHeadword(headword: string): string[] {
  const norm = headword.toLowerCase().trim();
  const gens = new Set<string>();
  for (const v of Object.values(overlay)) {
    if (v.slang && v.generation && v.headword.toLowerCase().trim() === norm) {
      gens.add(v.generation);
    }
  }
  return Array.from(gens);
}
