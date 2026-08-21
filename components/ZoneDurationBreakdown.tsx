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
      <div className="flex flex-col gap-2.5">
        {zones.map((z) => {
          const sec = durations[z.key];
          const pct = totalSec > 0 ? (sec / totalSec) * 100 : 0;
          return (
            <div key={z.key} className="flex items-center gap-3">
              <span
                className="text-xs w-32 shrink-0"
                style={{ color: "var(--text-secondary)" }}
              >
                {z.label}
              </span>
              <div
                className="flex-1 h-2 rounded-full overflow-hidden"
                style={{ background: "var(--bg)" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: z.color }}
                />
              </div>
              <span
                className="font-display text-xs w-16 text-right shrink-0"
                style={{ color: "var(--text-primary)" }}
              >
                {formatDurationShort(sec)}
              </span>
              <span
                className="font-display text-xs w-10 text-right shrink-0"
                style={{ color: "var(--text-tertiary)" }}
              >
                %{Math.round(pct)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
