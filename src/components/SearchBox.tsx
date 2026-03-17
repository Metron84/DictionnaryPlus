"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { DictionaryEntrySummary } from "@/types/dictionary";

export function SearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<DictionaryEntrySummary[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSuggestions(Array.isArray(data) ? data : []);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim()) fetchSuggestions(value);
    else setSuggestions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    const slug = encodeURIComponent(trimmed.toLowerCase().replace(/\s+/g, "-"));
    setSuggestions([]);
    setQuery("");
    router.push(`/word/${slug}`);
  };

  const handleSelect = (headword: string) => {
    const slug = encodeURIComponent(headword.toLowerCase().replace(/\s+/g, "-"));
    setQuery("");
    setSuggestions([]);
    router.push(`/word/${slug}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="flex border border-[var(--rule)]">
        <input
          type="search"
          value={query}
          onChange={handleChange}
          placeholder="Search the dictionary"
          className="flex-1 border-0 bg-transparent py-3 pl-4 pr-2 font-body text-[1.1rem] text-[var(--ink)] placeholder:italic placeholder:text-[var(--ink-faint)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--blue-accent)]"
          aria-label="Search the dictionary"
          autoComplete="off"
        />
        <button
          type="submit"
          className="bg-[var(--ink)] px-4 py-3 font-body text-[1rem] text-white hover:bg-[var(--red-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-offset-2"
        >
          Search
        </button>
      </div>
      {suggestions.length > 0 && (
        <ul
          className="absolute left-0 right-0 top-full z-10 mt-0 max-h-60 overflow-auto border border-t-0 border-[var(--rule)] bg-[var(--background)]"
          role="listbox"
        >
          {suggestions.map((item) => (
            <li key={item.id} role="option">
              <button
                type="button"
                onClick={() => handleSelect(item.headword)}
                className="block w-full px-4 py-2 text-left font-body text-[var(--ink)] hover:bg-[var(--rule-light)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--blue-accent)]"
              >
                {item.headword}
              </button>
            </li>
          ))}
        </ul>
      )}
      {loading && suggestions.length === 0 && query.trim() && (
        <p className="mt-2 font-body text-[0.9rem] text-[var(--ink-faint)]">
          Searching…
        </p>
      )}
    </form>
  );
}
