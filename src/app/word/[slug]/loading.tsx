export default function WordLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div className="h-7 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-5 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="h-12 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="mt-8 space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-5 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"
            />
          ))}
        </div>
      </main>
    </div>
  );
}
