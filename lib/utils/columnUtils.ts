import { Variable } from "@/lib/types";
import { nanoid } from "nanoid";

/**
 * Validate variable name - no spaces, no empty, no duplicates
 */
export function validateVariableName(
  name: string,
  existingNames: string[],
  excludeId?: string
): { valid: boolean; error?: string } {
  const trimmed = name.trim();

  if (!trimmed) {
    return { valid: false, error: "Variable name cannot be empty" };
  }

  if (/\s/.test(trimmed)) {
    return { valid: false, error: "Variable name cannot contain spaces" };
  }

  if (/^[0-9]/.test(trimmed)) {
    return { valid: false, error: "Variable name cannot start with a number" };
  }

  const duplicate = existingNames.find((n) => n.toLowerCase() === trimmed.toLowerCase());
  if (duplicate) {
    return { valid: false, error: `Variable name '${duplicate}' already exists` };
  }

  return { valid: true };
}

/**
 * Create a new variable with defaults
 */
export function createVariable(name: string): Variable {
  return {
    id: `col_${nanoid()}`,
    name,
    label: name,
    type: "string",
    width: 100,
    decimals: 0,
    missingValues: [],
    defaultValue: null,
    measureLevel: "nominal",
  };
}
