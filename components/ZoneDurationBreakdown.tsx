import { HeartZone, calculateZoneDurations } from "@/lib/heartZones";
import { formatDurationShort } from "@/lib/format";

export function ZoneDurationBreakdown({
  timeStream,
  hrStream,
  zones,
}: {
  timeStream: number[];
  hrStream: number[];
  zones: HeartZone[];
}) {
  if (!timeStream?.length || !hrStream?.length) return null;

  const durations = calculateZoneDurations(hrStream, timeStream, zones);
  const totalSec = Object.values(durations).reduce((a, b) => a + b, 0);

  return (
    <div className="card p-5 flex flex-col gap-3">
      <h2 className="text-sm font-medium">Bölge Dağılımı</h2>
      <div className="flex flex-col gap-3">
        {zones.map((z) => {
          const sec = durations[z.key];
          const pct = totalSec > 0 ? (sec / totalSec) * 100 : 0;
          return (
            <div key={z.key} className="zone-row">
              <span
                className="zone-row__label text-xs truncate"
                style={{ color: "var(--text-secondary)", gridArea: "label" }}
                title={`${z.label} (${z.min}-${z.max})`}
              >
                {z.label} ({z.min}-{z.max})
              </span>
              <span
                className="zone-row__dur text-xs text-right whitespace-nowrap"
                style={{ color: "var(--text-primary)", gridArea: "dur" }}
              >
                {formatDurationShort(sec)}
              </span>
              <span
                className="zone-row__pct text-xs text-right whitespace-nowrap"
                style={{ color: "var(--text-tertiary)", gridArea: "pct" }}
              >
                %{Math.round(pct)}
              </span>
              <div
                className="zone-row__bar h-2 rounded-full overflow-hidden"
                style={{ background: "var(--bg)", gridArea: "bar" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: z.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}