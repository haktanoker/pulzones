export function StatCard({
  label,
  value,
  unit,
  accent = false,
}: {
  label: string;
  value: string;
  unit?: string;
  accent?: boolean;
}) {
  return (
    <div className="card card-hover p-5 flex flex-col gap-1.5">
      <span
        className="text-[11px] uppercase tracking-wider font-medium"
        style={{ color: "var(--text-tertiary)" }}
      >
        {label}
      </span>
      <div className="flex items-baseline gap-1.5">
        <span
          className="font-display text-3xl font-semibold"
          style={{
            color: accent ? "var(--pulse)" : "var(--text-primary)",
            textShadow: accent ? "0 0 24px rgba(255,59,92,0.35)" : "none",
          }}
        >
          {value}
        </span>
        {unit && (
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}