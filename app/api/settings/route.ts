import { NextRequest, NextResponse } from "next/server";
import { readProfile, writeProfile } from "@/lib/storage";

export async function GET() {
  const profile = readProfile();
  return NextResponse.json(profile);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // basit doğrulama
  if (body.age !== undefined && (body.age < 5 || body.age > 100)) {
    return NextResponse.json({ error: "Geçersiz yaş" }, { status: 400 });
  }
  if (body.restingHr !== undefined && (body.restingHr < 20 || body.restingHr > 150)) {
    return NextResponse.json({ error: "Geçersiz dinlenik nabız" }, { status: 400 });
  }

  const updated = writeProfile(body);
  return NextResponse.json(updated);
}
