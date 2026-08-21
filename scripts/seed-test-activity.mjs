// Bu script gerçek bir Strava isteği yapmadan, sahte ama gerçekçi bir koşu
// verisi üretip data/activities/ klasörüne yazar. Arayüzü test etmek içindir.
//
// Çalıştırmak için proje kök dizininde: node scripts/seed-test-activity.mjs

import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data", "activities");
const TEST_ID = 8888888888; // gerçek Strava ID'leriyle çakışmaması için büyük bir sayı

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// --- Ayarlanabilir parametreler ---
const durationMinutes = 32;
const distanceKm = 5.8;
const restingHrGuess = 130;
// -----------------------------------

const durationSec = durationMinutes * 60;
const sampleEverySec = 3;

const timeStream = [];
const hrStream = [];
const altitudeStream = [];
const latlngStream = [];

const startLat = 40.7569;
const startLng = 30.3781;

let hr = 118;
for (let t = 0; t <= durationSec; t += sampleEverySec) {
  const progress = t / durationSec;

  let target = restingHrGuess;
  if (progress < 0.1) target = 118 + progress * 10 * 20;
  else if (progress < 0.6) target = 140 + Math.sin(progress * 8) * 6;
  else if (progress < 0.8) target = 158 + Math.sin(progress * 10) * 5;
  else target = 145 - (progress - 0.8) * 60;

  hr += (target - hr) * 0.15 + (Math.random() - 0.5) * 3;
  hr = Math.max(105, Math.min(182, hr));

  timeStream.push(t);
  hrStream.push(Math.round(hr));
  altitudeStream.push(102 + Math.sin(progress * Math.PI * 3) * 8 + Math.random());

  const angle = progress * Math.PI * 2.3;
  const radius = 0.012 * Math.sin(progress * Math.PI);
  latlngStream.push([
    startLat + Math.sin(angle) * radius,
    startLng + Math.cos(angle) * radius * 1.3,
  ]);
}

const numSplits = Math.ceil(distanceKm);
const avgSecPerKm = durationSec / distanceKm;
const splits_metric = [];
for (let i = 0; i < numSplits; i++) {
  const isLast = i === numSplits - 1;
  const splitDistance = isLast ? (distanceKm - i) * 1000 : 1000;
  const paceVariation = 1 + (Math.random() - 0.5) * 0.08;
  const splitTime = Math.round((avgSecPerKm * (splitDistance / 1000)) * paceVariation);

  splits_metric.push({
    split: i + 1,
    distance: Math.round(splitDistance),
    elapsed_time: splitTime,
    moving_time: splitTime,
    elevation_difference: Math.round((Math.random() - 0.5) * 6 * 10) / 10,
    average_speed: splitDistance / splitTime,
    average_heartrate: Math.round(125 + i * 4 + Math.random() * 8),
  });
}

const distance = distanceKm * 1000;
const avgHr = Math.round(hrStream.reduce((a, b) => a + b, 0) / hrStream.length);
const maxHr = Math.max(...hrStream);

const activity = {
  id: TEST_ID,
  name: "🧪 Test Koşusu (sahte veri)",
  type: "Run",
  sport_type: "Run",
  start_date_local: new Date().toISOString(),
  distance,
  moving_time: durationSec,
  elapsed_time: durationSec + 40,
  total_elevation_gain: 42,
  elev_high: 118.4,
  elev_low: 96.2,
  average_heartrate: avgHr,
  max_heartrate: maxHr,
  average_cadence: 84.2,
  average_speed: distance / durationSec,
  max_speed: 4.6,
  calories: Math.round(distanceKm * 62 + durationMinutes * 1.5),
  kilojoules: null,
  suffer_score: 71,
  achievement_count: 0,
  kudos_count: 0,
  comment_count: 0,
  pr_count: 0,
  description: "Bu bir test kaydıdır, gerçek sensör verisi değildir.",
  splits_metric,
  streams: {
    time: timeStream,
    heartrate: hrStream,
    altitude: altitudeStream,
    latlng: latlngStream,
    distance: timeStream.map((t) => (t / durationSec) * distance),
  },
  cachedAt: new Date().toISOString(),
};

fs.writeFileSync(
  path.join(DATA_DIR, `${TEST_ID}.json`),
  JSON.stringify(activity, null, 2)
);

console.log(`✅ Test aktivitesi oluşturuldu: data/activities/${TEST_ID}.json`);
console.log(`   Ortalama nabız: ${avgHr} bpm, Maks: ${maxHr} bpm`);
console.log(`   Dashboard'ı yenile, listede "🧪 Test Koşusu" görünecek.`);
console.log(`   Silmek için: rm data/activities/${TEST_ID}.json`);