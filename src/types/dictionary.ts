/**
 * Base dictionary entry schema.
 * Normalized from external API (e.g. Free Dictionary API) and merged with overlay.
 */

export interface DefinitionSense {
  definition: string;
  example?: string;
}

export interface DictionaryEntry {
  id: string;
  headword: string;
  partOfSpeech: string[];
  definitions: DefinitionSense[];
  etymology: string;
  synonyms: string[];
  antonyms: string[];
  pronunciation?: string;
  examples?: string[];
}

/** Minimal entry for search results list */
export interface DictionaryEntrySummary {
  id: string;
  headword: string;
  partOfSpeech: string[];
  snippet: string;
}
