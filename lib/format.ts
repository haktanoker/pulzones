export function formatDistanceKm(meters: number): string {
  return (meters / 1000).toLocaleString("tr-TR", { maximumFractionDigits: 2 });
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h} sa ${m} dk`;
  if (m > 0) return `${m} dk ${s} sn`;
  return `${s} sn`;
}

export function formatDurationShort(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  if (h > 0) return `${h}:${mm}:${ss}`;
  return `${m}:${ss}`;
}

// pace: dakika/km cinsinden string ("5:32 /km")
export function formatPace(distanceMeters: number, seconds: number): string {
  if (distanceMeters <= 0) return "-";
  const paceSecPerKm = seconds / (distanceMeters / 1000);
  const min = Math.floor(paceSecPerKm / 60);
  const sec = Math.round(paceSecPerKm % 60);
  return `${min}:${String(sec).padStart(2, "0")} /km`;
}

export function formatCalories(cal: number | undefined | null): string {
  if (!cal) return "-";
  return Math.round(cal).toLocaleString("tr-TR");
}

export function formatDateTr(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShortTr(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
  });
}

export function formatTimeTr(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}
