"use client";

import { useEffect, useMemo, useState } from "react";
import { PeriodSelector, Period } from "@/components/PeriodSelector";
import { StatCard } from "@/components/StatCard";
import { ActivityRow } from "@/components/ActivityRow";
import { ActivitySummary } from "@/lib/types";
import {
  formatDurationShort,
  formatDistanceKm,
  formatCalories,
} from "@/lib/format";
import Link from "next/link";

function withinPeriod(dateStr: string, period: Period): boolean {
  if (period === "tumu") return true;
  const date = new Date(dateStr);
  const now = new Date();
  const months = period === "1ay" ? 1 : 3;
  const cutoff = new Date(
    now.getFullYear(),
    now.getMonth() - months,
    now.getDate(),
  );
  return date >= cutoff;
}

export default function DashboardPage() {
  const [period, setPeriodState] = useState<Period>("1ay");

  useEffect(() => {
    const saved = localStorage.getItem("nabiz_period") as Period | null;
    if (saved) setPeriodState(saved);
  }, []);

  function setPeriod(p: Period) {
    setPeriodState(p);
    localStorage.setItem("nabiz_period", p);
  }
  const [activities, setActivities] = useState<ActivitySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [stravaConnected, setStravaConnected] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/activities")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setStravaConnected(false);
        } else {
          setStravaConnected(true);
          setActivities(data.activities || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => activities.filter((a) => withinPeriod(a.start_date_local, period)),
    [activities, period],
  );

  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, a) => {
        acc.distance += a.distance;
        acc.time += a.moving_time;
        acc.calories += a.calories || 0;
        return acc;
      },
      { distance: 0, time: 0, calories: 0 },
    );
  }, [filtered]);

  if (stravaConnected === false) {
    return (
      <div className="max-w-md mx-auto px-5 py-24 text-center flex flex-col items-center gap-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: "var(--pulse-dim)",
            boxShadow: "0 0 40px -8px rgba(255,59,92,0.5)",
          }}
        >
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: "var(--pulse)" }}
          />
        </div>
        <h1 className="text-lg font-medium">Strava bağlı değil</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Koşularını görebilmek için önce Strava hesabını bağlaman gerekiyor.
        </p>
        <a href="/api/strava/auth" className="btn-pill mt-2">
          Strava&apos;ya Bağlan
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-medium">Panel</h1>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {loading ? (
        <div className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Yükleniyor...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatCard
              label="Toplam Mesafe"
              value={formatDistanceKm(totals.distance)}
              unit="km"
            />
            <StatCard
              label="Toplam Süre"
              value={formatDurationShort(totals.time)}
            />
            <StatCard
              label="Toplam Kalori"
              value={formatCalories(totals.calories)}
              unit="kcal"
              accent
            />
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <h2
              className="text-xs uppercase tracking-wider px-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              Koşularım
            </h2>

            {filtered.length === 0 ? (
              <div
                className="card px-4 py-10 text-center text-sm"
                style={{
                  background: "var(--surface)",
                  color: "var(--text-tertiary)",
                }}
              >
                Bu dönemde koşu bulunamadı.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {filtered
                  .sort(
                    (a, b) =>
                      new Date(b.start_date_local).getTime() -
                      new Date(a.start_date_local).getTime(),
                  )
                  .map((activity) => (
                    <ActivityRow key={activity.id} activity={activity} />
                  ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
