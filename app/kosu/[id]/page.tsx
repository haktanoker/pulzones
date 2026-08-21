"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ActivityStatsHeader } from "@/components/ActivityStatsHeader";
import { HeartRateZoneChart } from "@/components/HeartRateZoneChart";
import { ZoneDurationBreakdown } from "@/components/ZoneDurationBreakdown";
import { SplitsTable } from "@/components/SplitsTable";
import { RouteMap } from "@/components/RouteMap";
import { CachedActivity } from "@/lib/activityCache";
import { calculateZones, UserProfile } from "@/lib/heartZones";

export default function KosuDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activity, setActivity] = useState<CachedActivity | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/activities/${id}`).then((res) => res.json()),
      fetch("/api/settings").then((res) => res.json()),
    ])
      .then(([activityData, profileData]) => {
        if (activityData.error) {
          setError(activityData.error);
        } else {
          setActivity(activityData.activity);
        }
        setProfile(profileData);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-5 py-24 text-sm" style={{ color: "var(--text-tertiary)" }}>
        Yükleniyor...
      </div>
    );
  }

  if (error || !activity || !profile) {
    return (
      <div className="max-w-4xl mx-auto px-5 py-24 flex flex-col items-center gap-4 text-center">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {error || "Koşu bulunamadı."}
        </p>
        <Link href="/" className="btn-pill">
          <ArrowLeft size={16} />
          Panele Dön
        </Link>
      </div>
    );
  }

  const zones = calculateZones(profile);
  const hrStream = activity.streams?.heartrate || [];
  const timeStream = activity.streams?.time || [];

  return (
    <div className="max-w-4xl mx-auto px-5 py-8 flex flex-col gap-5">
      <Link href="/" className="btn-ghost w-fit">
        <ArrowLeft size={15} />
        Panele Dön
      </Link>

      <ActivityStatsHeader activity={activity} />

      {hrStream.length > 0 ? (
        <>
          <HeartRateZoneChart timeStream={timeStream} hrStream={hrStream} zones={zones} />
          <ZoneDurationBreakdown timeStream={timeStream} hrStream={hrStream} zones={zones} />
        </>
      ) : (
        <div className="card p-8 text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
          Bu koşuda nabız sensörü verisi yok.
        </div>
      )}

      <SplitsTable splits={activity.splits_metric} />

      <RouteMap latlng={activity.streams?.latlng} />
    </div>
  );
}