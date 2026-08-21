import { NextRequest, NextResponse } from "next/server";
import {
  fetchActivityDetail,
  fetchActivityStreams,
  isStravaConnected,
} from "@/lib/strava";
import {
  isCached,
  readCachedActivity,
  writeCachedActivity,
  CachedActivity,
} from "@/lib/activityCache";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (isCached(id)) {
    const cached = readCachedActivity(id);
    return NextResponse.json({ activity: cached });
  }

  if (!isStravaConnected()) {
    return NextResponse.json({ error: "Strava bağlı değil" }, { status: 401 });
  }

  try {
    const detail = await fetchActivityDetail(id);
    const streams = await fetchActivityStreams(id);

    const cached: CachedActivity = {
      id: detail.id,
      name: detail.name,
      type: detail.type,
      sport_type: detail.sport_type,
      start_date_local: detail.start_date_local,
      distance: detail.distance,
      moving_time: detail.moving_time,
      elapsed_time: detail.elapsed_time,
      total_elevation_gain: detail.total_elevation_gain,
      elev_high: detail.elev_high,
      elev_low: detail.elev_low,
      average_heartrate: detail.average_heartrate,
      max_heartrate: detail.max_heartrate,
      average_cadence: detail.average_cadence,
      average_speed: detail.average_speed,
      max_speed: detail.max_speed,
      calories: detail.calories,
      kilojoules: detail.kilojoules,
      suffer_score: detail.suffer_score,
      achievement_count: detail.achievement_count,
      kudos_count: detail.kudos_count,
      comment_count: detail.comment_count,
      pr_count: detail.pr_count,
      description: detail.description,
      splits_metric: detail.splits_metric,
      streams,
      cachedAt: new Date().toISOString(),
    };

    writeCachedActivity(cached);
    return NextResponse.json({ activity: cached });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Bilinmeyen hata" },
      { status: 500 }
    );
  }
}