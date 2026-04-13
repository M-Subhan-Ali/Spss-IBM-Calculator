"use client";

import { useUIStore } from "@/store/uiStore";
import { useDatasetStore } from "@/store/datasetStore";
import { useOutputStore } from "@/store/outputStore";
import { AnalysisDialog } from "./AnalysisDialog";
import type { Variable } from "@/lib/types";
import { computeFrequencies } from "@/lib/stats/frequencies";

export function FrequenciesDialog() {
  const openDialog = useUIStore((s) => s.openDialog);
  const setOpenDialog = useUIStore((s) => s.setOpenDialog);
  const rows = useDatasetStore((s) => s.rows);
  const variables = useDatasetStore((s) => s.variables);
  const addBlock = useOutputStore((s) => s.addBlock);

  const handleApply = (selectedVariables: Variable[]) => {
    if (selectedVariables.length === 0) {
      alert("Please select at least one variable");
      return;
    }

    if (rows.length === 0) {
      alert("Please load or create data first");
      return;
    }

    try {
      selectedVariables.forEach((variable) => {
        const result = computeFrequencies(rows, variable);

        addBlock({
          type: "frequencies",
          title: `Frequencies (${variable.name})`,
          timestamp: Date.now(),
          data: result,
        });
      });
    } catch (error) {
      console.error("Frequencies error:", error);
      const msg = error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to compute frequencies: ${msg}`);
    }
  };

  return (
    <AnalysisDialog
      isOpen={openDialog === "frequencies"}
      onClose={() => setOpenDialog(null)}
      title="Frequencies"
      onApply={handleApply}
      multiSelect={true}
    />
  );
}
