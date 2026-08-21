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
import { getWeatherForActivity } from "@/lib/weather";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (isCached(id)) {
    const cached = readCachedActivity(id);

    // Weather özelliği eklenmeden önce cache'lenmiş eski koşularda
    // weather alanı yok. Böyle bir durumda Strava'ya tekrar gitmeden
    // sadece hava durumunu tamamlayıp cache'e geri yazıyoruz.
    if (cached && cached.weather === undefined) {
      const firstPoint = cached.streams?.latlng?.[0];
      if (firstPoint) {
        try {
          const weather = await getWeatherForActivity(
            firstPoint[0],
            firstPoint[1],
            cached.start_date_local,
          );
          cached.weather = weather;
          writeCachedActivity(cached);
        } catch (err) {
          console.error("Weather backfill hatası:", err);
        }
      } else {
        // latlng verisi yoksa weather'ı null olarak işaretle ki
        // her seferinde tekrar tekrar denemeye çalışmasın
        cached.weather = null;
        writeCachedActivity(cached);
      }
    }

    return NextResponse.json({ activity: cached });
  }

  if (!isStravaConnected()) {
    return NextResponse.json({ error: "Strava bağlı değil" }, { status: 401 });
  }

  try {
    const detail = await fetchActivityDetail(id);
    const streams = await fetchActivityStreams(id);

    const firstPoint = streams.latlng?.[0];
    const weather = firstPoint
      ? await getWeatherForActivity(
          firstPoint[0],
          firstPoint[1],
          detail.start_date_local,
        )
      : null;

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
      weather,
      cachedAt: new Date().toISOString(),
    };

    writeCachedActivity(cached);
    return NextResponse.json({ activity: cached });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Bilinmeyen hata" },
      { status: 500 },
    );
  }
}