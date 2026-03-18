export default function WordLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-[780px] px-4 py-6">
        <header className="masthead-border">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="h-10 w-48 animate-pulse rounded bg-[var(--rule-light)]" />
            <div className="h-5 w-24 animate-pulse rounded bg-[var(--rule-light)]" />
          </div>
        </header>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[1fr_220px]">
          <div className="min-w-0 space-y-4">
            <div className="h-8 w-1/2 animate-pulse rounded bg-[var(--rule-light)]" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-[var(--rule-light)]" />
            <div className="mt-6 flex gap-6 border-b border-[var(--rule-light)] pb-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-5 w-20 animate-pulse rounded bg-[var(--rule-light)]"
                />
              ))}
            </div>
            <div className="space-y-2 pt-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-5 w-full animate-pulse rounded bg-[var(--rule-light)]"
                />
              ))}
            </div>
          </div>
          <aside className="hidden md:block">
            <div className="h-24 w-full animate-pulse rounded bg-[var(--rule-light)]" />
            <div className="mt-6 h-32 w-full animate-pulse rounded bg-[var(--rule-light)]" />
          </aside>
        </div>
      </div>
    </div>
  );
}
