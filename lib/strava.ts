import { readTokens, writeTokens, StravaTokens } from "./storage";

const STRAVA_API_BASE = "https://www.strava.com/api/v3";

// Access token süresi dolmuşsa otomatik yeniler, geçerli bir token döner
async function getValidAccessToken(): Promise<string> {
  const tokens = readTokens();
  if (!tokens) {
    throw new Error(
      "Strava bağlantısı yok. Önce /api/strava/auth üzerinden bağlan.",
    );
  }

  const now = Math.floor(Date.now() / 1000);
  // Token'ın süresi dolmuşsa (60 saniye pay bırakarak) yenile
  if (tokens.expires_at > now + 60) {
    return tokens.access_token;
  }

  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;

  const res = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: tokens.refresh_token,
    }),
  });

  if (!res.ok) {
    throw new Error("Strava token yenileme başarısız: " + (await res.text()));
  }

  const data = await res.json();
  const updated: StravaTokens = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: data.expires_at,
    athlete_id: tokens.athlete_id,
  };
  writeTokens(updated);
  return updated.access_token;
}

async function stravaFetch(pathname: string) {
  const accessToken = await getValidAccessToken();
  const res = await fetch(`${STRAVA_API_BASE}${pathname}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    // Strava rate limitine takılmamak için Next.js cache'ini kısa tutuyoruz
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Strava API hatası (${res.status}): ${await res.text()}`);
  }

  return res.json();
}

export interface StravaActivitySummary {
  id: number;
  name: string;
  type: string;
  sport_type: string;
  distance: number; // metre
  moving_time: number; // saniye
  elapsed_time: number; // saniye
  total_elevation_gain: number; // metre
  start_date_local: string;
  average_heartrate?: number;
  max_heartrate?: number;
  calories?: number;
  average_speed: number; // m/s
}

export async function fetchRecentActivities(
  perPage = 30,
): Promise<StravaActivitySummary[]> {
  return stravaFetch(`/athlete/activities?per_page=${perPage}`);
}

export interface StravaSplit {
  distance: number;
  elapsed_time: number;
  moving_time: number;
  elevation_difference: number;
  average_speed: number;
  split: number;
  average_heartrate?: number;
}

export interface StravaActivityDetail extends StravaActivitySummary {
  calories?: number;
  kilojoules?: number;
  description?: string;
  elev_high?: number;
  elev_low?: number;
  average_cadence?: number;
  max_speed?: number;
  suffer_score?: number;
  achievement_count?: number;
  kudos_count?: number;
  comment_count?: number;
  pr_count?: number;
  splits_metric?: StravaSplit[];
}

export async function fetchActivityDetail(
  id: string | number,
): Promise<StravaActivityDetail> {
  return stravaFetch(`/activities/${id}`);
}

export interface StravaStreamSet {
  time?: number[];
  distance?: number[];
  latlng?: [number, number][];
  altitude?: number[];
  heartrate?: number[];
  velocity_smooth?: number[];
}

export async function fetchActivityStreams(
  id: string | number,
): Promise<StravaStreamSet> {
  const keys = "time,distance,latlng,altitude,heartrate,velocity_smooth";
  const raw = await stravaFetch(
    `/activities/${id}/streams?keys=${keys}&key_by_type=true`,
  );

  // Strava key_by_type=true ile { time: {data: [...]}, heartrate: {data: [...]} } döner
  const result: StravaStreamSet = {};
  for (const key of Object.keys(raw)) {
    result[key as keyof StravaStreamSet] = raw[key].data;
  }
  return result;
}

export function isStravaConnected(): boolean {
  return readTokens() !== null;
}
