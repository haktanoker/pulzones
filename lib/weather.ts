export interface WeatherInfo {
  temperature: number; // °C
  weatherCode: number;
  description: string;
  icon: string;
}

const WEATHER_CODE_MAP: Record<number, { description: string; icon: string }> = {
  0: { description: "Açık", icon: "☀️" },
  1: { description: "Az Bulutlu", icon: "🌤️" },
  2: { description: "Parçalı Bulutlu", icon: "⛅" },
  3: { description: "Kapalı", icon: "☁️" },
  45: { description: "Sisli", icon: "🌫️" },
  48: { description: "Kırağı Sisi", icon: "🌫️" },
  51: { description: "Hafif Çisenti", icon: "🌦️" },
  53: { description: "Çisenti", icon: "🌦️" },
  55: { description: "Yoğun Çisenti", icon: "🌧️" },
  56: { description: "Dondurucu Çisenti", icon: "🌧️" },
  57: { description: "Yoğun Dondurucu Çisenti", icon: "🌧️" },
  61: { description: "Hafif Yağmur", icon: "🌧️" },
  63: { description: "Yağmur", icon: "🌧️" },
  65: { description: "Şiddetli Yağmur", icon: "🌧️" },
  66: { description: "Dondurucu Yağmur", icon: "🌧️" },
  67: { description: "Şiddetli Dondurucu Yağmur", icon: "🌧️" },
  71: { description: "Hafif Kar", icon: "🌨️" },
  73: { description: "Kar", icon: "🌨️" },
  75: { description: "Yoğun Kar", icon: "❄️" },
  77: { description: "Kar Taneleri", icon: "❄️" },
  80: { description: "Hafif Sağanak", icon: "🌦️" },
  81: { description: "Sağanak", icon: "🌧️" },
  82: { description: "Şiddetli Sağanak", icon: "⛈️" },
  85: { description: "Hafif Kar Sağanağı", icon: "🌨️" },
  86: { description: "Yoğun Kar Sağanağı", icon: "❄️" },
  95: { description: "Gök Gürültülü Fırtına", icon: "⛈️" },
  96: { description: "Dolu ile Fırtına", icon: "⛈️" },
  99: { description: "Şiddetli Dolulu Fırtına", icon: "⛈️" },
};

/**
 * @param startDateLocal Strava'nın "start_date_local" alanı — sonundaki Z'ye
 *   rağmen bu aslında UTC değil, koşunun yapıldığı yerin yerel (duvar) saatidir.
 */
export async function getWeatherForActivity(
  lat: number,
  lon: number,
  startDateLocal: string
): Promise<WeatherInfo | null> {
  const dateStr = startDateLocal.slice(0, 10); // "2026-06-21"
  const hourKey = startDateLocal.slice(0, 13) + ":00"; // "2026-06-21T17:00"

  const daysAgo =
    (Date.now() - new Date(dateStr + "T00:00:00Z").getTime()) / 86_400_000;

  // Open-Meteo'nun archive (geçmiş) API'si ~5-6 gün gecikmeli veri sağlıyor.
  // Yakın tarihli koşularda forecast endpoint'i (past_days destekli) kullanıyoruz.
  const useForecast = daysAgo < 6;
  const base = useForecast
    ? "https://api.open-meteo.com/v1/forecast"
    : "https://archive-api.open-meteo.com/v1/archive";

  const params = new URLSearchParams({
    latitude: lat.toFixed(4),
    longitude: lon.toFixed(4),
    hourly: "temperature_2m,weathercode",
    // timezone=UTC diyerek Open-Meteo'nun saatleri offsetsiz ("çıplak") döndürmesini
    // sağlıyoruz, böylece start_date_local'daki yerel saatle direkt string eşleşmesi yapabiliyoruz.
    timezone: "UTC",
    start_date: dateStr,
    end_date: dateStr,
  });

  try {
    const res = await fetch(`${base}?${params.toString()}`, {
      // Geçmiş hava durumu hiç değişmeyeceği için sonsuza kadar cache'lenebilir
      next: { revalidate: useForecast ? 3600 : false },
    });
    if (!res.ok) return null;

    const data = await res.json();
    const times: string[] = data.hourly?.time ?? [];
    const temps: number[] = data.hourly?.temperature_2m ?? [];
    const codes: number[] = data.hourly?.weathercode ?? [];
    if (!times.length) return null;

    const idx = Math.max(times.indexOf(hourKey), 0);
    const code = codes[idx];
    const info = WEATHER_CODE_MAP[code] ?? { description: "Bilinmiyor", icon: "🌡️" };

    return {
      temperature: Math.round(temps[idx]),
      weatherCode: code,
      description: info.description,
      icon: info.icon,
    };
  } catch {
    return null;
  }
}