import { CachedSplit } from "@/lib/activityCache";
import { formatPace, formatDurationShort } from "@/lib/format";

function formatKmRange(splitNumber: number, distanceMeters: number) {
  const start = splitNumber - 1;
  const end = start + distanceMeters / 1000;
  const endRounded = Math.round(end * 10) / 10;
  const endLabel = Number.isInteger(endRounded)
    ? String(endRounded)
    : endRounded.toFixed(1);
  return `${start}-${endLabel}`;
}

export function SplitsTable({ splits }: { splits: CachedSplit[] | undefined }) {
  if (!splits?.length) return null;

  return (
    <div className="card p-5 flex flex-col gap-3">
      <h2 className="text-sm font-medium">Kilometre Kırılımı</h2>

      <div className="flex flex-col">
        {/* Başlık satırı */}
        <div
          className="grid grid-cols-4 gap-2 text-[11px] uppercase tracking-wider px-2 pb-2 border-b"
          style={{ color: "var(--text-tertiary)" }}
        >
          <span>Km</span>
          <span>Pace</span>
          <span>Süre</span>
          <span>Ort. Nabız</span>
        </div>

        {splits.map((s) => (
          <div
            key={s.split}
            className="grid grid-cols-4 gap-2 px-2 py-2.5 text-sm border-b last:border-0"
            style={{ borderColor: "var(--border)" }}
          >
            <span className="font-display">
              {formatKmRange(s.split, s.distance)}
            </span>
            <span className="font-display" style={{ color: "var(--pulse)" }}>
              {formatPace(s.distance, s.moving_time)}
            </span>
            <span
              className="font-display"
              style={{ color: "var(--text-secondary)" }}
            >
              {formatDurationShort(s.moving_time)}
            </span>
            <span
              className="font-display"
              style={{ color: "var(--text-secondary)" }}
            >
              {s.average_heartrate
                ? `${Math.round(s.average_heartrate)} bpm`
                : "-"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
