"use client";

import dynamic from "next/dynamic";

const RouteMapInner = dynamic(() => import("./RouteMapInner"), {
  ssr: false,
  loading: () => (
    <div
      className="card flex items-center justify-center text-sm"
      style={{ color: "var(--text-tertiary)", height: 320 }}
    >
      Harita yükleniyor...
    </div>
  ),
});

export function RouteMap({ latlng }: { latlng: [number, number][] | undefined }) {
  if (!latlng?.length) {
    return (
      <div className="card p-8 text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
        Bu koşu için konum verisi bulunamadı.
      </div>
    );
  }

  return (
    <div className="card overflow-hidden p-5 flex flex-col gap-3">
      <h2 className="text-sm font-medium">Rota</h2>
      <div style={{ height: 320, borderRadius: "0.75rem", overflow: "hidden" }}>
        <RouteMapInner latlng={latlng} />
      </div>
    </div>
  );
}