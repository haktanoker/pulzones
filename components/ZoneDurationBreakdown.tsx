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
      <div
        className="grid gap-x-3 gap-y-2.5 items-center"
        style={{ gridTemplateColumns: "minmax(0, 20%) 1fr auto auto" }}
      >
        {zones.map((z) => {
          const sec = durations[z.key];
          const pct = totalSec > 0 ? (sec / totalSec) * 100 : 0;
          return (
            <>
              <span
                key={`${z.key}-label`}
                className="text-xs truncate"
                style={{ color: "var(--text-secondary)" }}
                title={`${z.label} (${z.min}-${z.max})`}
              >
                {z.label} ({z.min}-{z.max})
              </span>
              <div
                key={`${z.key}-bar`}
                className="h-2 rounded-full overflow-hidden"
                style={{ background: "var(--bg)" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: z.color }}
                />
              </div>
              <span
                key={`${z.key}-dur`}
                className="font-display text-xs text-right whitespace-nowrap"
                style={{ color: "var(--text-primary)" }}
              >
                {formatDurationShort(sec)}
              </span>
              <span
                key={`${z.key}-pct`}
                className="font-display text-xs text-right whitespace-nowrap"
                style={{ color: "var(--text-tertiary)" }}
              >
                %{Math.round(pct)}
              </span>
            </>
          );
        })}
      </div>
    </div>
  );
}
