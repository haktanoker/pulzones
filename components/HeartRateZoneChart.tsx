"use client";

import { useMemo, useState } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { HeartZone } from "@/lib/heartZones";
import { buildZoneChartData, ChartPoint } from "@/lib/zoneChart";

const INTERVAL_OPTIONS = [
  { label: "1 dk", value: 1 },
  { label: "2 dk", value: 2 },
  { label: "5 dk", value: 5 },
];

export function HeartRateZoneChart({
  timeStream,
  hrStream,
  zones,
}: {
  timeStream: number[];
  hrStream: number[];
  zones: HeartZone[];
}) {
  const [interval, setInterval] = useState(2);

  const data = useMemo(
    () => buildZoneChartData(timeStream, hrStream, zones, interval),
    [timeStream, hrStream, zones, interval],
  );

  if (!data.length) {
    return (
      <div
        className="card p-8 text-center text-sm"
        style={{ color: "var(--text-tertiary)" }}
      >
        Bu koşu için nabız verisi bulunamadı.
      </div>
    );
  }

  const yMin = zones[0].min - 5;
  const yMax = zones[zones.length - 1].max + 5;

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-sm font-medium">Nabız Bölgesi Grafiği</h2>
        <div className="segmented">
          {INTERVAL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setInterval(opt.value)}
              className={`segmented-btn ${opt.value === interval ? "active" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 12, left: -12, bottom: 0 }}
          >
            {zones.map((z) => (
              <ReferenceArea
                key={z.key}
                y1={z.min}
                y2={z.max}
                fill={z.color}
                fillOpacity={0.12}
                strokeOpacity={0}
              />
            ))}

            <XAxis
              dataKey="minuteLabel"
              tick={{ fill: "var(--text-tertiary)", fontSize: 11 }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
              interval={"preserveStartEnd"}
            />
            <YAxis
              domain={[yMin, yMax]}
              tick={{ fill: "var(--text-tertiary)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={36}
            />

            <Tooltip content={<ZoneTooltip zones={zones} />} />

            <Line
              type="monotone"
              dataKey="hr"
              stroke="var(--pulse)"
              strokeWidth={2}
              dot={{ r: 2, fill: "var(--pulse)", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-3 pt-1">
        {zones.map((z) => (
          <div
            key={z.key}
            className="flex items-center gap-1.5 text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: z.color }}
            />
            {z.label.split("·")[1]?.trim() || z.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function ZoneTooltip({
  active,
  payload,
  zones,
}: {
  active?: boolean;
  payload?: { payload: ChartPoint }[];
  zones: HeartZone[];
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  const zone = zones.find((z) => z.key === point.zoneKey);

  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs"
      style={{ background: "var(--bg)", borderColor: "var(--border)" }}
    >
      <div className="font-display" style={{ color: "var(--text-primary)" }}>
        {point.minuteLabel} · {point.hr} bpm
      </div>
      {zone && (
        <div
          className="flex items-center gap-1.5 mt-1"
          style={{ color: "var(--text-secondary)" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: zone.color }}
          />
          {zone.label}
        </div>
      )}
    </div>
  );
}
