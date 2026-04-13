"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BarChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string;
  title?: string;
  xLabel?: string;
  yLabel?: string;
}

export function BarChart({
  data,
  xKey,
  yKey,
  title,
  xLabel,
  yLabel,
}: BarChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full">
      {title && <h3 className="font-semibold text-sm mb-2">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis label={{ value: yLabel || yKey, angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Bar dataKey={yKey} fill="#0066cc" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
