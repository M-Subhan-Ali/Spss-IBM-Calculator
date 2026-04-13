"use client";

import { useState } from "react";
import { Variable } from "@/lib/types";
import { useDatasetStore } from "@/store/datasetStore";
import { Select } from "@/components/ui/Select";
import { validateVariableName } from "@/lib/utils/columnUtils";

interface VariableRowProps {
  variable: Variable;
  onRemove: () => void;
}

export function VariableRow({ variable, onRemove }: VariableRowProps) {
  const updateVariable = useDatasetStore((s) => s.updateVariable);
  const allVariables = useDatasetStore((s) => s.variables);
  const [error, setError] = useState<string>("");

  const handleChange = (field: keyof Variable, value: unknown) => {
    // Validate name changes
    if (field === "name" && typeof value === "string") {
      const otherNames = allVariables
        .filter((v) => v.id !== variable.id)
        .map((v) => v.name);
      const validation = validateVariableName(value, otherNames);
      if (!validation.valid) {
        setError(validation.error || "Invalid name");
        return;
      }
      setError("");
    }

    updateVariable(variable.id, { [field]: value });
  };

  return (
    <div>
      <div className="grid grid-cols-9 gap-1 p-2 border-b border-spss-border text-xs bg-white hover:bg-gray-50 items-center">
        {/* Name */}
        <div className="flex flex-col gap-1">
          <input
            type="text"
            value={variable.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={`border px-2 py-1 rounded text-xs ${
              error ? "border-red-500" : "border-spss-border"
            }`}
            placeholder="Name"
            title={error || "Variable name"}
          />
        </div>

      {/* Type */}
      <select
        value={variable.type}
        onChange={(e) => handleChange("type", e.target.value)}
        className="border border-spss-border px-2 py-1 rounded text-xs"
      >
        <option value="numeric">Numeric</option>
        <option value="string">String</option>
        <option value="date">Date</option>
      </select>

      {/* Width */}
      <input
        type="number"
        value={variable.width}
        onChange={(e) => handleChange("width", parseInt(e.target.value))}
        className="border border-spss-border px-2 py-1 rounded text-xs"
        min="20"
        max="500"
      />

      {/* Decimals */}
      <input
        type="number"
        value={variable.decimals}
        onChange={(e) => handleChange("decimals", parseInt(e.target.value))}
        className="border border-spss-border px-2 py-1 rounded text-xs"
        min="0"
        max="10"
      />

      {/* Label */}
      <input
        type="text"
        value={variable.label}
        onChange={(e) => handleChange("label", e.target.value)}
        className="border border-spss-border px-2 py-1 rounded text-xs"
        placeholder="Label"
      />

      {/* Missing Values */}
      <input
        type="text"
        value={variable.missingValues.join(",")}
        onChange={(e) => {
          const values = e.target.value
            .split(",")
            .map((v) => v.trim())
            .filter((v) => v);
          handleChange("missingValues", values);
        }}
        className="border border-spss-border px-2 py-1 rounded text-xs"
        placeholder="9,99"
        title="Comma-separated values"
      />

      {/* Default Value */}
      <input
        type="text"
        value={variable.defaultValue ?? ""}
        onChange={(e) => handleChange("defaultValue", e.target.value || null)}
        className="border border-spss-border px-2 py-1 rounded text-xs"
        placeholder="Default"
      />

      {/* Measure Level */}
      <select
        value={variable.measureLevel}
        onChange={(e) => handleChange("measureLevel", e.target.value)}
        className="border border-spss-border px-2 py-1 rounded text-xs"
      >
        <option value="nominal">Nominal</option>
        <option value="ordinal">Ordinal</option>
        <option value="scale">Scale</option>
      </select>

        {/* Delete Button */}
        <button
          onClick={onRemove}
          className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-xs"
        >
          Delete
        </button>
      </div>
      {error && <div className="px-2 py-1 text-red-600 text-xs">{error}</div>}
    </div>
  );
}
