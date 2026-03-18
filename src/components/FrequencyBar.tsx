export interface FrequencyDatum {
  decade: string;
  value: number;
}

interface FrequencyBarProps {
  data?: FrequencyDatum[] | null;
}

const MAX_BAR_WIDTH = 100;

export function FrequencyBar({ data }: FrequencyBarProps) {
  if (data == null || data.length === 0) {
    return (
      <aside
        className="w-[220px]"
        aria-labelledby="frequency-label"
      >
        <p
          id="frequency-label"
          className="font-mono text-[0.68rem] uppercase tracking-wider text-[var(--ink-faint)] border-b border-[var(--rule-light)] pb-1 mb-2"
        >
          Frequency by decade
        </p>
        <p className="font-mono text-[0.7rem] text-[var(--ink-faint)]">
          Data unavailable
        </p>
      </aside>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <aside
      className="w-[220px]"
      aria-labelledby="frequency-label"
    >
      <p
        id="frequency-label"
        className="font-mono text-[0.68rem] uppercase tracking-wider text-[var(--ink-faint)] border-b border-[var(--rule-light)] pb-1 mb-2"
      >
        Frequency by decade
      </p>
      <div className="space-y-1.5" role="img" aria-label="Bar chart of frequency by decade">
        {data.map((d) => (
          <div key={d.decade} className="flex items-center gap-2">
            <span className="font-mono text-[0.7rem] text-[var(--ink-muted)] w-10 shrink-0">
              {d.decade}
            </span>
            <div
              className="h-2 min-w-[2px] bg-[var(--red-accent)]"
              style={{ width: `${(d.value / maxVal) * MAX_BAR_WIDTH}%` }}
            />
          </div>
        ))}
      </div>
    </aside>
  );
}
