/**
 * Overlay schema for curated content (slang, cultural notes, etc.).
 * Keyed by headword; merged with base entry when present.
 */

export interface OverlayEntry {
  headword: string;
  slang?: boolean;
  tags?: string[];
  usageNote?: string;
  culturalNote?: string;
  relatedWordIds?: string[];
  imageUrl?: string;
  etymologyJourney?: string | { steps: { era?: string; text: string }[] };
}

export type OverlayStore = Record<string, OverlayEntry>;
