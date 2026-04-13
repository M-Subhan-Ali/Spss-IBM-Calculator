"use client";

import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ScatterChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string;
  title?: string;
  xLabel?: string;
  yLabel?: string;
}

export function ScatterChart({
  data,
  xKey,
  yKey,
  title,
  xLabel,
  yLabel,
}: ScatterChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full">
      {title && <h3 className="font-semibold text-sm mb-2">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <RechartsScatterChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} label={{ value: xLabel || xKey, position: "insideBottomRight", offset: -5 }} />
          <YAxis label={{ value: yLabel || yKey, angle: -90, position: "insideLeft" }} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter name="Data" dataKey={yKey} fill="#ff6600" />
        </RechartsScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
