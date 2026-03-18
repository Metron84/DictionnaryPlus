"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const linkClassName =
  "font-body text-[var(--blue-accent)] underline decoration-dotted hover:decoration-solid focus:outline-none focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-offset-2";

export function SurpriseMeLink() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      if (loading) return;
      setLoading(true);
      try {
        const res = await fetch("/api/random-word");
        const data = (await res.json()) as { slug: string };
        const slug = data?.slug ?? "hello";
        router.push(`/word/${encodeURIComponent(slug)}`);
      } catch {
        router.push("/word/hello");
      } finally {
        setLoading(false);
      }
    },
    [loading, router]
  );

  return (
    <button
      type="button"
      onClick={handleClick}
      className={linkClassName}
      disabled={loading}
      aria-busy={loading}
    >
      {loading ? "…" : "Surprise me"}
    </button>
  );
}
