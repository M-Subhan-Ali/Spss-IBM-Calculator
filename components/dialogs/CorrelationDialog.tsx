"use client";

import { useUIStore } from "@/store/uiStore";
import { useDatasetStore } from "@/store/datasetStore";
import { useOutputStore } from "@/store/outputStore";
import { AnalysisDialog } from "./AnalysisDialog";
import type { Variable } from "@/lib/types";
import { computeCorrelation } from "@/lib/stats/inferential";

export function CorrelationDialog() {
  const openDialog = useUIStore((s) => s.openDialog);
  const setOpenDialog = useUIStore((s) => s.setOpenDialog);
  const rows = useDatasetStore((s) => s.rows);
  const variables = useDatasetStore((s) => s.variables);
  const addBlock = useOutputStore((s) => s.addBlock);

  const handleApply = (selectedVariables: Variable[]) => {
    if (selectedVariables.length < 2) {
      alert("Please select at least 2 variables");
      return;
    }

    if (rows.length === 0) {
      alert("Please load or create data first");
      return;
    }

    try {
      const result = computeCorrelation(
        rows,
        variables,
        selectedVariables.map((v) => v.id)
      );

      addBlock({
        type: "correlation",
        title: `Correlations (${selectedVariables.map((v) => v.name).join(", ")})`,
        timestamp: Date.now(),
        data: result,
      });
    } catch (error) {
      console.error("Correlation error:", error);
      const msg = error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to compute correlations: ${msg}`);
    }
  };

  return (
    <AnalysisDialog
      isOpen={openDialog === "correlation"}
      onClose={() => setOpenDialog(null)}
      title="Bivariate Correlations"
      onApply={handleApply}
      numericOnly={true}
    />
  );
}
