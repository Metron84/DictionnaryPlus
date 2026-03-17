interface DidYouKnowProps {
  title: string;
  children?: React.ReactNode;
  text?: string;
}

export function DidYouKnow({ title, children, text }: DidYouKnowProps) {
  return (
    <aside
      className="w-[220px] border border-[var(--rule)] p-3"
      aria-labelledby="did-you-know-label"
    >
      <p
        id="did-you-know-label"
        className="font-mono text-[0.68rem] uppercase tracking-wider text-[var(--ink-faint)]"
      >
        {title}
      </p>
      <div className="mt-2 font-body text-[0.9rem] text-[var(--ink)]">
        {children ?? text}
      </div>
    </aside>
  );
}
