"use client";

import { FrequencyEntry } from "@/lib/types";

interface FrequencyTableProps {
  entries: FrequencyEntry[];
  title?: string;
  n: number;
  missing: number;
}

export function FrequencyTable({
  entries,
  title,
  n,
  missing,
}: FrequencyTableProps) {
  return (
    <div className="overflow-x-auto">
      {title && <h3 className="font-semibold text-sm mb-2">{title}</h3>}
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="bg-spss-header border border-spss-border">
            <th className="border border-spss-border px-2 py-1 text-left font-semibold">
              Value
            </th>
            <th className="border border-spss-border px-2 py-1 text-right font-semibold">
              Frequency
            </th>
            <th className="border border-spss-border px-2 py-1 text-right font-semibold">
              Percent
            </th>
            <th className="border border-spss-border px-2 py-1 text-right font-semibold">
              Valid Percent
            </th>
            <th className="border border-spss-border px-2 py-1 text-right font-semibold">
              Cumulative %
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, idx) => (
            <tr
              key={idx}
              className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="border border-spss-border px-2 py-1 text-left">
                {String(entry.value)}
              </td>
              <td className="border border-spss-border px-2 py-1 text-right">
                {entry.count}
              </td>
              <td className="border border-spss-border px-2 py-1 text-right">
                {entry.percent.toFixed(2)}%
              </td>
              <td className="border border-spss-border px-2 py-1 text-right">
                {entry.validPercent.toFixed(2)}%
              </td>
              <td className="border border-spss-border px-2 py-1 text-right">
                {entry.cumulativePercent.toFixed(2)}%
              </td>
            </tr>
          ))}
          {missing > 0 && (
            <tr className="bg-gray-100 font-semibold">
              <td className="border border-spss-border px-2 py-1">Missing</td>
              <td className="border border-spss-border px-2 py-1 text-right">
                {missing}
              </td>
              <td className="border border-spss-border px-2 py-1 text-right">
                {(((missing) / (n + missing)) * 100).toFixed(2)}%
              </td>
              <td className="border border-spss-border px-2 py-1 text-right">
                -
              </td>
              <td className="border border-spss-border px-2 py-1 text-right">
                -
              </td>
            </tr>
          )}
          <tr className="bg-gray-100 font-semibold">
            <td className="border border-spss-border px-2 py-1">Total</td>
            <td className="border border-spss-border px-2 py-1 text-right">
              {n + missing}
            </td>
            <td className="border border-spss-border px-2 py-1 text-right">
              100.00%
            </td>
            <td className="border border-spss-border px-2 py-1 text-right">
              100.00%
            </td>
            <td className="border border-spss-border px-2 py-1 text-right">
              -
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
