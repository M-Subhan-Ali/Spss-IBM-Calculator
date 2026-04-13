import type { DataRow, Variable, FrequenciesResult, FrequencyEntry, CellValue } from "@/lib/types";

/**
 * Compute frequency table for a variable
 */
export function computeFrequencies(
  rows: DataRow[],
  variable: Variable
): FrequenciesResult {
  const counts = new Map<string, number>();
  let missingCount = 0;

  // Count occurrences
  for (const row of rows) {
    const value = row[variable.id];

    if (value === null || value === undefined) {
      missingCount++;
      continue;
    }

    // Check if missing value
    if (variable.missingValues.includes(value)) {
      missingCount++;
      continue;
    }

    const key = String(value);
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  // Build table
  const validCount = rows.length - missingCount;
  const entries: FrequencyEntry[] = Array.from(counts.entries())
    .sort(([a], [b]) => {
      // Try numeric sort first
      const aNum = Number(a);
      const bNum = Number(b);
      if (isFinite(aNum) && isFinite(bNum)) {
        return aNum - bNum;
      }
      return a.localeCompare(b);
    })
    .map(([value, count]) => {
      const percent = ((count / rows.length) * 100).toFixed(2);
      const validPercent = ((count / validCount) * 100).toFixed(2);

      return {
        value,
        count,
        percent: parseFloat(percent),
        validPercent: parseFloat(validPercent),
        cumulativePercent: 0, // Will be calculated below
      };
    });

  // Add cumulative percentages
  let cumulative = 0;
  for (const entry of entries) {
    cumulative += entry.validPercent;
    entry.cumulativePercent = parseFloat(cumulative.toFixed(2));
  }

  return {
    variable: variable.name,
    n: validCount,
    missing: missingCount,
    table: entries,
  };
}
