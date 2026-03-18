import { redirect } from "next/navigation";
import { getRandomSlangSlug } from "@/lib/dictionary";

/** Surprise me: redirect to a random slang word. */
export default function SlangRandomPage() {
  const slug = getRandomSlangSlug();
  redirect(`/word/${encodeURIComponent(slug)}`);
}
