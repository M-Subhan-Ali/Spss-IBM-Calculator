"use client";

import { OutputBlock as OutputBlockType } from "@/lib/types";
import { useState } from "react";
import { useOutputStore } from "@/store/outputStore";
import { StatTable } from "./StatTable";
import { FrequencyTable } from "./FrequencyTable";
import { BarChart } from "./BarChart";
import { HistogramChart } from "./HistogramChart";
import { ScatterChart } from "./ScatterChart";

interface OutputBlockProps {
  block: OutputBlockType;
}

export function OutputBlock({ block }: OutputBlockProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const removeBlock = useOutputStore((s) => s.removeBlock);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const renderContent = () => {
    switch (block.type) {
      case "descriptives": {
        const data = block.data as any;
        const headers = ["Variable", "N"];
        if (data.showMean !== false) headers.push("Mean");
        if (data.showMedian !== false) headers.push("Median");
        if (data.showMode !== false) headers.push("Mode");

        const rows = data.stats.map((stat: any) => {
          const row: (string | number)[] = [stat.variable, stat.n];
          if (data.showMean !== false) row.push(stat.mean);
          if (data.showMedian !== false) row.push(stat.median);
          if (data.showMode !== false) {
            const mode = Array.isArray(stat.mode) ? stat.mode[0] : stat.mode;
            row.push(mode);
          }
          return row;
        });

        return (
          <div className="space-y-4">
            <StatTable headers={headers} rows={rows} title="Descriptive Statistics" />

            {/* Histograms for each variable if requested */}
            {data.showHistogram && data.stats.length > 0 && data.rawData && (
              <div className="border-t pt-4">
                <h3 className="font-semibold text-sm mb-4">Distributions</h3>
                <div className="space-y-6">
                  {data.stats.map((stat: any, idx: number) => {
                    const varData = data.rawData[stat.variable];
                    if (!varData) return null;
                    // Sturges' formula: bins = ceil(log2(n) + 1)
                    const bins = Math.ceil(Math.log2(varData.length) + 1);
                    return (
                      <div key={idx} className="border border-spss-border rounded p-3">
                        <HistogramChart
                          data={varData}
                          title={`Distribution: ${stat.variable}`}
                          bins={bins}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      }

      case "frequencies": {
        const data = block.data as any;
        return (
          <FrequencyTable
            entries={data.table}
            title={`Frequencies: ${data.variable}`}
            n={data.n}
            missing={data.missing}
          />
        );
      }

      case "correlation": {
        const data = block.data as any;
        const headers = ["Variables", ...data.variables];
        const rows = data.matrix.map((row: number[], idx: number) => [
          data.variables[idx],
          ...row.map((v: number) => v.toFixed(3)),
        ]);
        return (
          <div className="space-y-4">
            <StatTable headers={headers} rows={rows} title="Correlation Matrix" />
            <div className="text-xs text-gray-600">
              <p>N of observations: {data.n}</p>
            </div>
          </div>
        );
      }

      case "regression": {
        const data = block.data as any;
        const coeffHeaders = ["Variable", "B", "Std Error", "Beta", "t", "p-value"];
        const coeffRows = data.coefficients.map((c: any) => [
          c.variable,
          c.b,
          c.stdError,
          c.beta,
          c.t,
          c.pValue,
        ]);
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded text-xs">
              <div>
                <strong>R:</strong> {data.r.toFixed(4)}
              </div>
              <div>
                <strong>R²:</strong> {data.rSquared.toFixed(4)}
              </div>
              <div>
                <strong>Adjusted R²:</strong> {data.adjustedRSquared.toFixed(4)}
              </div>
              <div>
                <strong>F-statistic:</strong> {data.fStat.toFixed(4)} (p = {data.fPValue.toFixed(4)})
              </div>
            </div>
            <StatTable
              headers={coeffHeaders}
              rows={coeffRows}
              title="Coefficients"
            />
          </div>
        );
      }

      case "t-test": {
        const data = block.data as any;
        return (
          <div className="bg-gray-50 p-3 rounded text-xs space-y-2">
            <div>
              <strong>Variable:</strong> {data.variable}
            </div>
            <div>
              <strong>Test Value:</strong> {data.testValue}
            </div>
            <div>
              <strong>N:</strong> {data.n}
            </div>
            <div>
              <strong>Mean:</strong> {data.mean.toFixed(4)}
            </div>
            <div>
              <strong>Std Dev:</strong> {data.stddev.toFixed(4)}
            </div>
            <div>
              <strong>t-statistic:</strong> {data.t.toFixed(4)}
            </div>
            <div>
              <strong>df:</strong> {data.df}
            </div>
            <div>
              <strong>p-value (2-tailed):</strong> {data.pValue.toFixed(4)}
            </div>
            <div>
              <strong>Mean Difference:</strong> {data.meanDiff.toFixed(4)}
            </div>
            <div>
              <strong>95% CI:</strong> [{data.ciLow.toFixed(4)}, {data.ciHigh.toFixed(4)}]
            </div>
          </div>
        );
      }

      default:
        return (
          <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
            <pre className="whitespace-pre-wrap break-words text-xs">
              {JSON.stringify(block.data, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <div className="bg-white border border-spss-border rounded p-3">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 font-medium text-sm hover:text-spss-selected"
        >
          <span>{isExpanded ? "▼" : "▶"}</span>
          <span>{block.title}</span>
        </button>
        <button
          onClick={() => removeBlock(block.id)}
          className="text-gray-400 hover:text-red-600 text-sm"
        >
          ✕
        </button>
      </div>

      {isExpanded && (
        <div className="text-xs text-gray-500 mb-3">
          {formatTime(block.timestamp)}
        </div>
      )}

      {isExpanded && (
        <div className="text-sm text-gray-700">
          {renderContent()}
        </div>
      )}
    </div>
  );
}
