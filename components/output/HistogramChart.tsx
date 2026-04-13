"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface HistogramChartProps {
  data: number[];
  title?: string;
  bins?: number;
}

export function HistogramChart({ data, title, bins = 10 }: HistogramChartProps) {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const binWidth = (max - min) / bins;

  const histogram: Record<string, number> = {};
  for (let i = 0; i < bins; i++) {
    const binStart = min + i * binWidth;
    const binEnd = binStart + binWidth;
    const binLabel = `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`;
    histogram[binLabel] = 0;
  }

  for (const value of data) {
    const binIndex = Math.min(
      bins - 1,
      Math.floor((value - min) / binWidth)
    );
    const binStart = min + binIndex * binWidth;
    const binEnd = binStart + binWidth;
    const binLabel = `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`;
    histogram[binLabel]++;
  }

  const chartData = Object.entries(histogram).map(([bin, count]) => ({
    bin,
    count,
  }));

  return (
    <div className="w-full">
      {title && <h3 className="font-semibold text-sm mb-2">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="bin" angle={-45} textAnchor="end" height={80} />
          <YAxis label={{ value: "Frequency", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey="count" fill="#00aa66" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
