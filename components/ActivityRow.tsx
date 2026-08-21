import Link from "next/link";
import { ActivitySummary } from "@/lib/types";
import {
  formatDurationShort,
  formatPace,
  formatCalories,
  formatDateShortTr,
  formatTimeTr,
} from "@/lib/format";

export function ActivityRowHeader() {
  return (
    <div className="activity-row-header flex items-center justify-between px-4 pb-1">
      <span
        className="text-[11px] uppercase tracking-wider"
        style={{ color: "var(--text-tertiary)" }}
      >
        Koşu
      </span>
      <div
        className="activity-row__stats"
        style={{ color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: 11 }}
      >
        <span className="activity-row__stat activity-row__weather">Hava</span>
        <span className="activity-row__stat">Mesafe</span>
        <span className="activity-row__stat">Süre</span>
        <span className="activity-row__stat activity-row__pace">Pace</span>
        <span className="activity-row__stat">Kalori</span>
      </div>
    </div>
  );
}

export function ActivityRow({ activity }: { activity: ActivitySummary }) {
  const distanceKm = (activity.distance / 1000).toFixed(2);

  return (
    <Link href={`/kosu/${activity.id}`} className="card card-hover activity-row px-4 py-3.5 group">
      <div className="activity-row__main">
        <span className="text-sm font-medium truncate group-hover:text-white transition-colors">
          {activity.name}
        </span>
        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          {formatDateShortTr(activity.start_date_local)} · {formatTimeTr(activity.start_date_local)}
        </span>
      </div>

      <div className="activity-row__stats">
        {activity.weather ? (
          <span
            className="activity-row__stat activity-row__weather"
            style={{ color: "var(--text-secondary)" }}
          >
            {activity.weather.icon} {activity.weather.temperature}°
          </span>
        ) : (
          <span
            className="activity-row__stat activity-row__weather"
            style={{ color: "var(--text-tertiary)" }}
          >
            -
          </span>
        )}

        <span className="activity-row__stat">
          {distanceKm} <span style={{ color: "var(--text-tertiary)" }}>km</span>
        </span>

        <span className="activity-row__stat" style={{ color: "var(--text-secondary)" }}>
          {formatDurationShort(activity.moving_time)}
        </span>

        <span
          className="activity-row__stat activity-row__pace"
          style={{ color: "var(--text-secondary)" }}
        >
          {formatPace(activity.distance, activity.moving_time)}
        </span>

        {activity.calories ? (
          <span className="activity-row__stat" style={{ color: "var(--pulse)" }}>
            {formatCalories(activity.calories)} kcal
          </span>
        ) : (
          <span className="activity-row__stat" style={{ color: "var(--text-tertiary)" }}>
            -
          </span>
        )}
      </div>
    </Link>
  );
}