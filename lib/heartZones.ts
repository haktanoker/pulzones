// Karvonen formülü ile nabız zone hesaplama
// Hedef Nabız = ((Maks Nabız - Dinlenik Nabız) * Yoğunluk%) + Dinlenik Nabız

export type ZoneKey = "z1" | "z2" | "z3" | "z4" | "z5";

export interface HeartZone {
  key: ZoneKey;
  label: string;
  description: string;
  color: string;      // grafikte kullanılacak renk
  minPercent: number; // yoğunluk aralığı başlangıç (%)
  maxPercent: number; // yoğunluk aralığı bitiş (%)
  min: number;         // gerçek bpm değeri (Karvonen'e göre hesaplanmış)
  max: number;
}

export interface UserProfile {
  age: number;
  restingHr: number;
  maxHr: number | null; // null ise 220-yaş kullanılır
  weightKg: number | null;
  heightCm: number | null;
}

export function getEffectiveMaxHr(profile: UserProfile): number {
  if (profile.maxHr && profile.maxHr > 0) return profile.maxHr;
  return 220 - profile.age;
}

const ZONE_DEFINITIONS: Omit<HeartZone, "min" | "max">[] = [
  {
    key: "z1",
    label: "Bölge 1 · Isınma",
    description: "Çok hafif tempo, toparlanma ve ısınma için",
    color: "#6b7280", // gri
    minPercent: 50,
    maxPercent: 60,
  },
  {
    key: "z2",
    label: "Bölge 2 · Yağ Yakım",
    description: "Uzun süreli, düşük-orta tempo — enerjinin büyük kısmı yağdan karşılanır",
    color: "#3b82f6", // mavi
    minPercent: 60,
    maxPercent: 70,
  },
  {
    key: "z3",
    label: "Bölge 3 · Kardiyo",
    description: "Orta-yüksek tempo, dayanıklılık gelişimi, karışık yakıt kullanımı",
    color: "#22c55e", // yeşil
    minPercent: 70,
    maxPercent: 80,
  },
  {
    key: "z4",
    label: "Bölge 4 · Zorlayıcı",
    description: "Yüksek tempo, anaerobik eşiğe yakın, ağırlıklı karbonhidrat yakımı",
    color: "#f59e0b", // turuncu
    minPercent: 80,
    maxPercent: 90,
  },
  {
    key: "z5",
    label: "Bölge 5 · Maksimum",
    description: "Maksimuma yakın efor, kısa süreli sürdürülebilir",
    color: "#ef4444", // kırmızı
    minPercent: 90,
    maxPercent: 100,
  },
];

export function calculateZones(profile: UserProfile): HeartZone[] {
  const maxHr = getEffectiveMaxHr(profile);
  const hrReserve = maxHr - profile.restingHr;

  return ZONE_DEFINITIONS.map((def) => ({
    ...def,
    min: Math.round(hrReserve * (def.minPercent / 100) + profile.restingHr),
    max: Math.round(hrReserve * (def.maxPercent / 100) + profile.restingHr),
  }));
}

export function getZoneForHr(hr: number, zones: HeartZone[]): HeartZone {
  // En üst zone'dan aşağı doğru kontrol et (sınırların üstünde kalanlar son zone'a girsin)
  for (let i = zones.length - 1; i >= 0; i--) {
    if (hr >= zones[i].min) return zones[i];
  }
  return zones[0];
}

// Bir aktivite boyunca her zone'da geçirilen süreyi hesaplar (saniye cinsinden)
export function calculateZoneDurations(
  hrStream: number[],
  timeStream: number[], // saniye cinsinden zaman damgaları, hrStream ile aynı uzunlukta
  zones: HeartZone[]
): Record<ZoneKey, number> {
  const durations: Record<ZoneKey, number> = { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 };

  for (let i = 0; i < hrStream.length - 1; i++) {
    const dt = timeStream[i + 1] - timeStream[i];
    const zone = getZoneForHr(hrStream[i], zones);
    durations[zone.key] += dt;
  }

  return durations;
}
