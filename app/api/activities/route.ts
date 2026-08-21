import { NextResponse } from "next/server";
import {
  fetchRecentActivities,
  fetchActivityDetail,
  fetchActivityStreams,
  isStravaConnected,
} from "@/lib/strava";
import {
  isCached,
  writeCachedActivity,
  readAllCachedActivities,
  CachedActivity,
} from "@/lib/activityCache";
import { getWeatherForActivity } from "@/lib/weather";

export async function GET() {
  if (!isStravaConnected()) {
    return NextResponse.json({ error: "Strava bağlı değil", activities: [] });
  }

  try {
    const summaries = await fetchRecentActivities(100);
    const runs = summaries.filter((a) => a.type === "Run" || a.sport_type === "Run");

    for (const run of runs) {
      if (isCached(run.id)) continue; // zaten çekilmiş, Strava'ya tekrar gitme

      const detail = await fetchActivityDetail(run.id);
      const streams = await fetchActivityStreams(run.id);

      const firstPoint = streams.latlng?.[0];
      const weather = firstPoint
        ? await getWeatherForActivity(
            firstPoint[0],
            firstPoint[1],
            detail.start_date_local,
          )
        : null;

      const cached: CachedActivity = {
        id: run.id,
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
        weather,
        cachedAt: new Date().toISOString(),
      };

      writeCachedActivity(cached);
    }

    const all = readAllCachedActivities().sort(
      (a, b) =>
        new Date(b.start_date_local).getTime() - new Date(a.start_date_local).getTime()
    );

    return NextResponse.json({ activities: all });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Bilinmeyen hata", activities: [] },
      { status: 500 }
    );
  }
}