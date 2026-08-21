import Link from "next/link";
import { ActivitySummary } from "@/lib/types";
import {
  formatDistanceKm,
  formatDurationShort,
  formatPace,
  formatCalories,
  formatDateShortTr,
  formatTimeTr,
} from "@/lib/format";

export function ActivityRow({ activity }: { activity: ActivitySummary }) {
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
        <span>{formatDistanceKm(activity.distance)} <span style={{ color: "var(--text-tertiary)" }}>km</span></span>
        <span style={{ color: "var(--text-secondary)" }}>{formatDurationShort(activity.moving_time)}</span>
        <span style={{ color: "var(--text-secondary)" }} className="hidden sm:inline">
          {formatPace(activity.distance, activity.moving_time)}
        </span>
        {activity.calories ? (
          <span style={{ color: "var(--pulse)" }}>{formatCalories(activity.calories)} kcal</span>
        ) : (
          <span style={{ color: "var(--text-tertiary)" }}>-</span>
        )}
      </div>
    </Link>
  );
}