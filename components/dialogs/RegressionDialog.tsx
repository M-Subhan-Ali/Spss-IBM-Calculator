"use client";

import { useState } from "react";
import { useUIStore } from "@/store/uiStore";
import { useDatasetStore } from "@/store/datasetStore";
import { useOutputStore } from "@/store/outputStore";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { Variable } from "@/lib/types";
import { computeLinearRegression } from "@/lib/stats/inferential";

export function RegressionDialog() {
  const openDialog = useUIStore((s) => s.openDialog);
  const setOpenDialog = useUIStore((s) => s.setOpenDialog);
  const rows = useDatasetStore((s) => s.rows);
  const variables = useDatasetStore((s) => s.variables);
  const addBlock = useOutputStore((s) => s.addBlock);

  const [dependent, setDependent] = useState<string>("");
  const [independent, setIndependent] = useState<Set<string>>(new Set());

  const numericVariables = variables.filter((v) => v.type === "numeric");

  const handleToggleIndependent = (varId: string) => {
    const newSet = new Set(independent);
    if (newSet.has(varId)) {
      newSet.delete(varId);
    } else {
      newSet.add(varId);
    }
    setIndependent(newSet);
  };

  const handleApply = () => {
    if (!dependent || independent.size === 0) {
      alert("Please select a dependent variable and at least one independent variable");
      return;
    }

    if (rows.length === 0) {
      alert("Please load or create data first");
      return;
    }

    try {
      const result = computeLinearRegression(
        rows,
        variables,
        dependent,
        Array.from(independent)
      );

      addBlock({
        type: "regression",
        title: `Linear Regression (${variables.find((v) => v.id === dependent)?.name} ~ ${Array.from(independent)
          .map((id) => variables.find((v) => v.id === id)?.name)
          .join(" + ")})`,
        timestamp: Date.now(),
        data: result,
      });

      setOpenDialog(null);
    } catch (error) {
      console.error("Regression error:", error);
      const msg = error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to compute regression: ${msg}`);
    }
  };

  return (
    <Modal
      isOpen={openDialog === "regression"}
      onClose={() => setOpenDialog(null)}
      title="Linear Regression"
      size="md"
    >
      <div className="space-y-4">
        {/* Dependent Variable */}
        <div>
          <label className="block text-sm font-medium mb-2">Dependent Variable</label>
          <select
            value={dependent}
            onChange={(e) => setDependent(e.target.value)}
            className="w-full border border-spss-border rounded px-3 py-2 text-sm"
          >
            <option value="">-- Select --</option>
            {numericVariables.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        {/* Independent Variables */}
        <div>
          <label className="block text-sm font-medium mb-2">Independent Variables</label>
          <div className="border border-spss-border rounded p-2 space-y-1 max-h-48 overflow-y-auto bg-white">
            {numericVariables.map((variable) => (
              <label
                key={variable.id}
                className="flex items-center gap-2 p-1 hover:bg-gray-50 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={independent.has(variable.id)}
                  onChange={() => handleToggleIndependent(variable.id)}
                  disabled={variable.id === dependent}
                  className="cursor-pointer"
                />
                <span>{variable.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" size="sm" onClick={() => setOpenDialog(null)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleApply}
            disabled={!dependent || independent.size === 0}
          >
            OK
          </Button>
        </div>
      </div>
    </Modal>
  );
}
