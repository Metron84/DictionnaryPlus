import Link from "next/link";

export interface RelatedWord {
  word: string;
  pos?: string;
  /** Optional slug for multi-word headwords (e.g. "no-cap"). */
  slug?: string;
}

interface RelatedWordsProps {
  words: RelatedWord[];
  /** Override label (default "Related words"). */
  label?: string;
}

function wordToSlug(word: string) {
  return encodeURIComponent(word.toLowerCase().trim());
}

export function RelatedWords({ words, label = "Related words" }: RelatedWordsProps) {
  if (words.length === 0) return null;

  const labelId = "related-words-label";

  return (
    <aside
      className="w-[220px]"
      aria-labelledby={labelId}
    >
      <p
        id={labelId}
        className="font-mono text-[0.68rem] uppercase tracking-wider text-[var(--ink-faint)] border-b border-[var(--rule-light)] pb-1 mb-2"
      >
        {label}
      </p>
      <ul className="space-y-1.5 font-body text-[0.85rem]">
        {words.map((item, i) => (
          <li
            key={`${item.word}-${i}`}
            className="border-b border-dotted border-[var(--rule-light)] pb-1.5 last:border-0 last:pb-0"
          >
            <Link
              href={`/word/${item.slug != null ? encodeURIComponent(item.slug) : wordToSlug(item.word)}`}
              className="text-[var(--blue-accent)] underline decoration-dotted underline-offset-1 hover:decoration-solid focus:outline-none focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-offset-1"
            >
              {item.word}
            </Link>
            {item.pos != null && item.pos !== "" && (
              <span className="ml-1.5 italic text-[var(--ink-faint)]">
                {item.pos}
              </span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
