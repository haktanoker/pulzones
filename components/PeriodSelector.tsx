export type Period = "1ay" | "3ay" | "tumu";

const OPTIONS: { key: Period; label: string }[] = [
  { key: "1ay", label: "Son 1 Ay" },
  { key: "3ay", label: "Son 3 Ay" },
  { key: "tumu", label: "Tüm Zamanlar" },
];

export function PeriodSelector({
  value,
  onChange,
}: {
  value: Period;
  onChange: (p: Period) => void;
}) {
  return (
    <div className="segmented">
      {OPTIONS.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={`segmented-btn ${opt.key === value ? "active" : ""}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}