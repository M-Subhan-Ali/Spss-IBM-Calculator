import { DataRow, Variable } from "@/lib/types";
import { nanoid } from "nanoid";

/**
 * Create a new empty row with defaults for all variables
 */
export function createRow(variables: Variable[]): DataRow {
  const row: DataRow = { _id: nanoid() };

  variables.forEach((v) => {
    row[v.id] = v.defaultValue ?? null;
  });

  return row;
}

/**
 * Check if a row is completely empty (all cells null)
 */
export function isRowEmpty(row: DataRow, variables: Variable[]): boolean {
  return variables.every((v) => {
    const value = row[v.id];
    return value === null || value === undefined || value === "";
  });
}
