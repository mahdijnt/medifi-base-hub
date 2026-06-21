export function IdentityHubHeader() {
  return (
    <div className="flex items-center gap-3">
      <span
        className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-surface/60 font-mono text-[10px] font-medium text-muted"
        aria-hidden="true"
      >
        ID
      </span>
      <p className="text-xs font-medium uppercase tracking-widest text-muted">
        Builder Identity Hub
      </p>
    </div>
  );
}
