import Link from "next/link";
import { ActivitySummary } from "@/lib/types";
import {
  formatDurationShort,
  formatPace,
  formatCalories,
  formatDateShortTr,
  formatTimeTr,
} from "@/lib/format";

// Sağdaki istatistik sütunlarının genişlikleri — header (ActivityRowHeader)
// ile senkron kalması için tek yerden yönetiliyor. Birini değiştirirsen
// diğerini de burada değiştir, ikisi otomatik hizalı kalır.
const W_WEATHER = "w-14";
const W_DISTANCE = "w-18";
const W_TIME = "w-16";
const W_PACE = "hidden sm:inline-block w-14";
const W_CALORIES = "w-24 whitespace-nowrap";

export function ActivityRowHeader() {
  return (
    <div className="flex items-center justify-between px-4 pb-1">
      <span
        className="text-[11px] uppercase tracking-wider"
        style={{ color: "var(--text-tertiary)" }}
      >
        Koşu
      </span>
      <div
        className="flex items-center gap-5 font-display text-[11px] uppercase tracking-wider"
        style={{ color: "var(--text-tertiary)" }}
      >
        <span className={`${W_WEATHER} text-center`}>Hava</span>
        <span className={`${W_DISTANCE} text-center`}>Mesafe</span>
        <span className={`${W_TIME} text-center`}>Süre</span>
        <span className={`${W_PACE} text-center`}>Pace</span>
        <span className={`${W_CALORIES} text-center`}>Kalori</span>
      </div>
    </div>
  );
}

export function ActivityRow({ activity }: { activity: ActivitySummary }) {
  const distanceKm = (activity.distance / 1000).toFixed(2);

  return (
    <Link
      href={`/kosu/${activity.id}`}
      className="card card-hover flex items-center justify-between px-4 py-3.5 group"
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium truncate group-hover:text-white transition-colors">
          {activity.name}
        </span>
        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          {formatDateShortTr(activity.start_date_local)} · {formatTimeTr(activity.start_date_local)}
        </span>
      </div>

      <div className="flex items-center gap-5 shrink-0 font-display text-sm">
        {activity.weather ? (
          <span className={`${W_WEATHER} text-left`} style={{ color: "var(--text-secondary)" }}>
            {activity.weather.icon} {activity.weather.temperature}°
          </span>
        ) : (
          <span className={`${W_WEATHER} text-left`} style={{ color: "var(--text-tertiary)" }}>
            -
          </span>
        )}
        <span className={`${W_DISTANCE} text-left`}>
          {distanceKm} <span style={{ color: "var(--text-tertiary)" }}>km</span>
        </span>
        <span className={`${W_TIME} text-left`} style={{ color: "var(--text-secondary)" }}>
          {formatDurationShort(activity.moving_time)}
        </span>
        <span className={`${W_PACE} text-left`} style={{ color: "var(--text-secondary)" }}>
          {formatPace(activity.distance, activity.moving_time)}
        </span>
        {activity.calories ? (
          <span className={`${W_CALORIES} text-left`} style={{ color: "var(--pulse)" }}>
            {formatCalories(activity.calories)} kcal
          </span>
        ) : (
          <span className={`${W_CALORIES} text-left`} style={{ color: "var(--text-tertiary)" }}>
            -
          </span>
        )}
      </div>
    </Link>
  );
}