import { HeartZone, getZoneForHr } from "./heartZones";

export interface ChartPoint {
  timeSec: number;
  minuteLabel: string;
  hr: number;
  zoneKey: string;
  zoneColor: string;
}

export function buildZoneChartData(
  timeStream: number[],
  hrStream: number[],
  zones: HeartZone[],
  intervalMinutes: number
): ChartPoint[] {
  if (!timeStream?.length || !hrStream?.length) return [];

  const totalSeconds = timeStream[timeStream.length - 1];
  const intervalSeconds = intervalMinutes * 60;
  const points: ChartPoint[] = [];

  for (let targetSec = 0; targetSec <= totalSeconds; targetSec += intervalSeconds) {
    let closestIdx = 0;
    let closestDiff = Infinity;
    for (let i = 0; i < timeStream.length; i++) {
      const diff = Math.abs(timeStream[i] - targetSec);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestIdx = i;
      } else {
        break;
      }
    }

    const hr = hrStream[closestIdx];
    if (hr === undefined) continue;

    const zone = getZoneForHr(hr, zones);
    points.push({
      timeSec: targetSec,
      minuteLabel: formatMinuteLabel(targetSec),
      hr,
      zoneKey: zone.key,
      zoneColor: zone.color,
    });
  }

  return points;
}

export function formatMinuteLabel(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}