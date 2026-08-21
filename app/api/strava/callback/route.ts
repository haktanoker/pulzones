import { NextRequest, NextResponse } from "next/server";
import { writeTokens } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (error) {
    // Kullanıcı yetkilendirmeyi reddetti
    return NextResponse.redirect(`${appUrl}/ayarlar?strava_error=1`);
  }

  if (!code) {
    return NextResponse.json({ error: "code parametresi eksik" }, { status: 400 });
  }

  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "STRAVA_CLIENT_ID / STRAVA_CLIENT_SECRET .env.local dosyasında tanımlı değil" },
      { status: 500 }
    );
  }

  // Kod'u access token ile değiştir
  const tokenRes = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    return NextResponse.json(
      { error: "Strava token değişimi başarısız", detail: errText },
      { status: 500 }
    );
  }

  const tokenData = await tokenRes.json();

  writeTokens({
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    expires_at: tokenData.expires_at,
    athlete_id: tokenData.athlete?.id,
  });

  // Bağlantı başarılı, ayarlar sayfasına dön
  return NextResponse.redirect(`${appUrl}/ayarlar?strava_connected=1`);
}
