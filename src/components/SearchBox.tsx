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
    const slug = encodeURIComponent(trimmed.toLowerCase());
    setSuggestions([]);
    setQuery("");
    router.push(`/word/${slug}`);
  };

  const handleSelect = (headword: string) => {
    const slug = encodeURIComponent(headword.toLowerCase());
    setQuery("");
    setSuggestions([]);
    router.push(`/word/${slug}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={handleChange}
          placeholder="Search the dictionary"
          className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
          aria-label="Search the dictionary"
          autoComplete="off"
        />
      </div>
      {suggestions.length > 0 && (
        <ul
          className="absolute left-0 right-0 top-full z-10 mt-1 max-h-60 overflow-auto rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
          role="listbox"
        >
          {suggestions.map((item) => (
            <li key={item.id} role="option">
              <button
                type="button"
                onClick={() => handleSelect(item.headword)}
                className="block w-full px-4 py-2 text-left text-zinc-900 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                <span className="font-medium">{item.headword}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {loading && suggestions.length === 0 && query.trim() && (
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Searching…
        </p>
      )}
    </form>
  );
}
