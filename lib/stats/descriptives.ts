import * as ss from "simple-statistics";
import type { DataRow, Variable, DescriptivesResult, DescriptivesStat, CellValue } from "@/lib/types";

/**
 * Extract numeric values from a column, excluding nulls and user-defined missing values
 */
export function extractNumeric(
  rows: DataRow[],
  colId: string,
  missingValues: CellValue[] = []
): number[] {
  const values: number[] = [];

  for (const row of rows) {
    const cellValue = row[colId];

    // Skip null/undefined
    if (cellValue === null || cellValue === undefined) continue;

    // Skip user-defined missing values
    if (missingValues.includes(cellValue)) continue;

    // Try to convert to number
    const numValue = Number(cellValue);
    if (isFinite(numValue)) {
      values.push(numValue);
    }
  }

  return values;
}

/**
 * Compute descriptive statistics for numeric variables
 */
export function computeDescriptives(
  rows: DataRow[],
  variables: Variable[],
  selectedColIds: string[]
): DescriptivesResult & { rawData?: Record<string, number[]> } {
  const stats: DescriptivesStat[] = [];
  const rawData: Record<string, number[]> = {};

  for (const colId of selectedColIds) {
    const variable = variables.find((v) => v.id === colId);
    if (!variable) continue;

    const numeric = extractNumeric(rows, colId, variable.missingValues);
    if (numeric.length === 0) continue;

    rawData[variable.name] = numeric;

    stats.push({
      variable: variable.name,
      n: numeric.length,
      mean: ss.mean(numeric),
      median: ss.median(numeric),
      mode: ss.mode(numeric) || 0,
      stddev: ss.sampleStandardDeviation(numeric),
      variance: ss.sampleVariance(numeric),
      min: Math.min(...numeric),
      max: Math.max(...numeric),
      range: Math.max(...numeric) - Math.min(...numeric),
      skewness: ss.sampleSkewness(numeric),
      kurtosis: ss.sampleKurtosis(numeric),
    });
  }

  return {
    variables: selectedColIds.map(
      (id) => variables.find((v) => v.id === id)?.name || id
    ),
    stats,
    rawData,
  };
}
