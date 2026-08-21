import fs from "fs";
import path from "path";

const ACTIVITIES_DIR = path.join(process.cwd(), "data", "activities");

function ensureDir() {
  if (!fs.existsSync(ACTIVITIES_DIR)) {
    fs.mkdirSync(ACTIVITIES_DIR, { recursive: true });
  }
}

export interface CachedStreams {
  time?: number[];
  distance?: number[];
  latlng?: [number, number][];
  altitude?: number[];
  heartrate?: number[];
  velocity_smooth?: number[];
}

export interface CachedSplit {
  distance: number;
  elapsed_time: number;
  moving_time: number;
  elevation_difference: number;
  average_speed: number;
  split: number;
  average_heartrate?: number;
}

export interface CachedActivity {
  id: number;
  name: string;
  type: string;
  sport_type: string;
  start_date_local: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  elev_high?: number;
  elev_low?: number;
  average_heartrate?: number;
  max_heartrate?: number;
  average_cadence?: number;
  average_speed: number;
  max_speed?: number;
  calories?: number;
  kilojoules?: number;
  suffer_score?: number;
  achievement_count?: number;
  kudos_count?: number;
  comment_count?: number;
  pr_count?: number;
  description?: string;
  splits_metric?: CachedSplit[];
  streams: CachedStreams;
  cachedAt: string;
}

function filePath(id: number | string) {
  return path.join(ACTIVITIES_DIR, `${id}.json`);
}

export function isCached(id: number | string): boolean {
  return fs.existsSync(filePath(id));
}

export function readCachedActivity(id: number | string): CachedActivity | null {
  const fp = filePath(id);
  if (!fs.existsSync(fp)) return null;
  return JSON.parse(fs.readFileSync(fp, "utf-8"));
}

export function writeCachedActivity(activity: CachedActivity) {
  ensureDir();
  fs.writeFileSync(filePath(activity.id), JSON.stringify(activity, null, 2));
}

export function readAllCachedActivities(): CachedActivity[] {
  ensureDir();
  const files = fs.readdirSync(ACTIVITIES_DIR).filter((f) => f.endsWith(".json"));
  return files.map((f) =>
    JSON.parse(fs.readFileSync(path.join(ACTIVITIES_DIR, f), "utf-8"))
  );
}