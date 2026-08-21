import {
  formatDistanceKm,
  formatDurationShort,
  formatPace,
  formatCalories,
  formatDateTr,
  formatTimeTr,
} from "@/lib/format";
import { CachedActivity } from "@/lib/activityCache";

export function ActivityStatsHeader({
  activity,
}: {
  activity: CachedActivity;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {activity.name}
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {formatDateTr(activity.start_date_local)} ·{" "}
            {formatTimeTr(activity.start_date_local)}
          </p>
          {activity.weather && (
            <span
              className="inline-flex items-center gap-1 text-sm px-2 py-0.5 rounded-full"
              style={{
                background: "var(--surface-2, rgba(255,255,255,0.06))",
                color: "var(--text-secondary)",
              }}
            >
              <span className="text-base leading-none">
                {activity.weather.icon}
              </span>
              <span>{activity.weather.description}</span>
              <span style={{ color: "var(--text-primary)" }}>
                {activity.weather.temperature}°C
              </span>
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <BigStat
          label="Mesafe"
          value={formatDistanceKm(activity.distance)}
          unit="km"
        />
        <BigStat
          label="Süre"
          value={formatDurationShort(activity.moving_time)}
        />
        <BigStat
          label="Kalori"
          value={formatCalories(activity.calories)}
          unit="kcal"
          accent
        />
        <BigStat
          label="Ort. Pace"
          value={formatPace(activity.distance, activity.moving_time).replace(
            " /km",
            "",
          )}
          unit="/km"
        />
      </div>

      <div
        className="card grid grid-cols-2 sm:grid-cols-4 divide-x"
        style={{ borderColor: "var(--border)" }}
      >
        <SmallStat
          label="Ort. Nabız"
          value={
            activity.average_heartrate
              ? `${Math.round(activity.average_heartrate)}`
              : "-"
          }
          unit="bpm"
        />
        <SmallStat
          label="Maks. Nabız"
          value={
            activity.max_heartrate
              ? `${Math.round(activity.max_heartrate)}`
              : "-"
          }
          unit="bpm"
        />
        <SmallStat
          label="Toplam Tırmanış"
          value={
            activity.total_elevation_gain
              ? `${Math.round(activity.total_elevation_gain)}`
              : "-"
          }
          unit="m"
        />
        <SmallStat
          label="Geçen Süre"
          value={formatDurationShort(activity.elapsed_time)}
        />
      </div>

      <div
        className="card grid grid-cols-2 sm:grid-cols-4 divide-x"
        style={{ borderColor: "var(--border)" }}
      >
        <SmallStat
          label="En Yüksek Nokta"
          value={activity.elev_high ? `${Math.round(activity.elev_high)}` : "-"}
          unit="m"
        />
        <SmallStat
          label="En Düşük Nokta"
          value={activity.elev_low ? `${Math.round(activity.elev_low)}` : "-"}
          unit="m"
        />
        <SmallStat
          label="Maks. Hız"
          value={
            activity.max_speed ? (activity.max_speed * 3.6).toFixed(1) : "-"
          }
          unit="km/s"
        />
        <SmallStat
          label="Efor Skoru"
          value={activity.suffer_score ? `${activity.suffer_score}` : "-"}
        />
      </div>

      {activity.description && (
        <p className="text-sm px-1" style={{ color: "var(--text-secondary)" }}>
          {activity.description}
        </p>
      )}
    </div>
  );
}

function BigStat({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string;
  unit?: string;
  accent?: boolean;
}) {
  return (
    <div className="card card-hover p-4 flex flex-col gap-1">
      <span
        className="text-[11px] uppercase tracking-wider font-medium"
        style={{ color: "var(--text-tertiary)" }}
      >
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span
          className="font-display text-2xl sm:text-3xl font-semibold"
          style={{
            color: accent ? "var(--pulse)" : "var(--text-primary)",
            textShadow: accent ? "0 0 24px rgba(255,59,92,0.35)" : "none",
          }}
        >
          {value}
        </span>
        {unit && (
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function SmallStat({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div className="p-4 flex flex-col gap-1">
      <span
        className="text-[11px] uppercase tracking-wider"
        style={{ color: "var(--text-tertiary)" }}
      >
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span className="font-display text-sm font-medium">{value}</span>
        {unit && (
          <span
            className="text-[11px]"
            style={{ color: "var(--text-secondary)" }}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
