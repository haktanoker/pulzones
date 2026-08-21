"use client";

import { useEffect, useState } from "react";
import { calculateZones, getEffectiveMaxHr, UserProfile } from "@/lib/heartZones";

const EMPTY: UserProfile = {
  age: 25,
  restingHr: 50,
  maxHr: null,
  weightKg: null,
  heightCm: null,
};

export default function AyarlarPage() {
  const [profile, setProfile] = useState<UserProfile>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const zones = calculateZones(profile);
  const effectiveMaxHr = getEffectiveMaxHr(profile);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-5 py-24 text-sm" style={{ color: "var(--text-tertiary)" }}>
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-5 py-8 flex flex-col gap-6">
      <h1 className="text-xl font-semibold tracking-tight">Ayarlar</h1>

      <section className="card p-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-medium">Strava Bağlantısı</h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
            Koşularının otomatik çekilmesi için gerekli
          </p>
        </div>
        <a href="/api/strava/auth" className="btn-pill shrink-0">
          Bağlan
        </a>
      </section>

      <section className="card p-5 flex flex-col gap-4">
        <h2 className="text-sm font-medium">Profil Bilgileri</h2>

        <Field label="Yaş">
          <input
            type="number"
            value={profile.age}
            onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
            className="input"
          />
        </Field>

        <Field label="Dinlenik Nabız (bpm)" hint="Sabah uyanır uyanmaz ölçülen nabız">
          <input
            type="number"
            value={profile.restingHr}
            onChange={(e) => setProfile({ ...profile, restingHr: Number(e.target.value) })}
            className="input"
          />
        </Field>

        <Field label="Maksimum Nabız (bpm)" hint={`Boş bırakılırsa 220-yaş formülü kullanılır (şu an: ${effectiveMaxHr})`}>
          <input
            type="number"
            value={profile.maxHr ?? ""}
            placeholder={String(effectiveMaxHr)}
            onChange={(e) =>
              setProfile({ ...profile, maxHr: e.target.value ? Number(e.target.value) : null })
            }
            className="input"
          />
        </Field>

        <Field label="Kilo (kg)" optional>
          <input
            type="number"
            value={profile.weightKg ?? ""}
            onChange={(e) =>
              setProfile({ ...profile, weightKg: e.target.value ? Number(e.target.value) : null })
            }
            className="input"
          />
        </Field>

        <Field label="Boy (cm)" optional>
          <input
            type="number"
            value={profile.heightCm ?? ""}
            onChange={(e) =>
              setProfile({ ...profile, heightCm: e.target.value ? Number(e.target.value) : null })
            }
            className="input"
          />
        </Field>

        <button onClick={handleSave} disabled={saving} className="btn-pill self-start mt-1">
          {saved ? "Kaydedildi ✓" : saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </section>

      <section className="card p-5 flex flex-col gap-3">
        <h2 className="text-sm font-medium">Nabız Bölgelerin</h2>
        <div className="flex flex-col gap-2">
          {zones.map((z) => (
            <div key={z.key} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: z.color, boxShadow: `0 0 8px ${z.color}` }}
                />
                <span>{z.label}</span>
              </div>
              <span className="font-display" style={{ color: "var(--text-secondary)" }}>
                {z.min}–{z.max} bpm
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  hint,
  optional,
  children,
}: {
  label: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
        {label} {optional && <span style={{ color: "var(--text-tertiary)" }}>(opsiyonel)</span>}
      </span>
      {children}
      {hint && (
        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          {hint}
        </span>
      )}
    </label>
  );
}