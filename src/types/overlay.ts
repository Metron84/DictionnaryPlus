/**
 * Overlay schema for curated content (slang, cultural notes, etc.).
 * Keyed by headword; merged with base entry when present.
 */

export type Generation =
  | "Gen Alpha"
  | "Gen Z"
  | "Millennial"
  | "Gen X"
  | "Boomer";

export interface OverlayEntry {
  headword: string;
  slang?: boolean;
  generation?: Generation;
  tags?: string[];
  usageNote?: string;
  culturalNote?: string;
  relatedWordIds?: string[];
  imageUrl?: string;
  etymologyJourney?: string | { steps: { era?: string; text: string }[] };
}

export type OverlayStore = Record<string, OverlayEntry>;

/** URL slug for each generation directory */
export const GENERATION_SLUGS: Record<string, Generation> = {
  "gen-alpha": "Gen Alpha",
  "gen-z": "Gen Z",
  millennial: "Millennial",
  "gen-x": "Gen X",
  boomer: "Boomer",
} as const;

export const ALL_GENERATIONS: Generation[] = [
  "Gen Alpha",
  "Gen Z",
  "Millennial",
  "Gen X",
  "Boomer",
];
