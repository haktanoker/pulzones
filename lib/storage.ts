import fs from "fs";
import path from "path";
import type { UserProfile } from "./heartZones";

const DATA_DIR = path.join(process.cwd(), "data");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const TOKENS_FILE = path.join(DATA_DIR, "strava-tokens.json");

const DEFAULT_PROFILE: UserProfile = {
  age: 25,
  restingHr: 50,
  maxHr: null, // null -> 220-yaş otomatik hesaplanır
  weightKg: null,
  heightCm: null,
};

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function readProfile(): UserProfile {
  ensureDataDir();
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_PROFILE, null, 2));
    return DEFAULT_PROFILE;
  }
  const raw = fs.readFileSync(SETTINGS_FILE, "utf-8");
  return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
}

export function writeProfile(profile: Partial<UserProfile>): UserProfile {
  ensureDataDir();
  const current = readProfile();
  const updated = { ...current, ...profile };
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2));
  return updated;
}

export interface StravaTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number; // unix timestamp (saniye)
  athlete_id?: number;
}

export function readTokens(): StravaTokens | null {
  ensureDataDir();
  if (!fs.existsSync(TOKENS_FILE)) return null;
  const raw = fs.readFileSync(TOKENS_FILE, "utf-8");
  return JSON.parse(raw);
}

export function writeTokens(tokens: StravaTokens) {
  ensureDataDir();
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
}
