import { NextResponse } from "next/server";

// Bu route kullanıcıyı Strava'nın yetkilendirme sayfasına yönlendirir.
// .env.local dosyasında STRAVA_CLIENT_ID ve NEXT_PUBLIC_APP_URL tanımlı olmalı.
export async function GET() {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!clientId) {
    return NextResponse.json(
      { error: "STRAVA_CLIENT_ID .env.local dosyasında tanımlı değil" },
      { status: 500 }
    );
  }

  const redirectUri = `${appUrl}/api/strava/callback`;
  const scope = "activity:read_all,profile:read_all";

  const authUrl =
    `https://www.strava.com/oauth/authorize` +
    `?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&approval_prompt=auto` +
    `&scope=${encodeURIComponent(scope)}`;

  return NextResponse.redirect(authUrl);
}
