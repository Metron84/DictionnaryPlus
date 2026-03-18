import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 px-4 dark:bg-zinc-950">
      <h1 className="font-display text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        Word not found
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        We don&apos;t have an entry for that yet. Try another search.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Back to search
      </Link>
    </div>
  );
}
