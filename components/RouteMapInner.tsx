"use client";

import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(positions, { padding: [24, 24] });
    }
  }, [positions, map]);

  return null;
}

export default function RouteMapInner({ latlng }: { latlng: [number, number][] }) {
  if (!latlng?.length) return null;

  const center = latlng[Math.floor(latlng.length / 2)];

  return (
    <MapContainer
      center={center}
      zoom={14}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", borderRadius: "0.75rem" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <Polyline positions={latlng} pathOptions={{ color: "#ff4d5e", weight: 3.5, opacity: 0.9 }} />
      <FitBounds positions={latlng} />
    </MapContainer>
  );
}