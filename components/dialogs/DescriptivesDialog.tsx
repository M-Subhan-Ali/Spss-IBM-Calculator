"use client";

import { useState, useMemo } from "react";
import { useUIStore } from "@/store/uiStore";
import { useDatasetStore } from "@/store/datasetStore";
import { useOutputStore } from "@/store/outputStore";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import type { Variable } from "@/lib/types";
import { computeDescriptives } from "@/lib/stats/descriptives";

export function DescriptivesDialog() {
  const openDialog = useUIStore((s) => s.openDialog);
  const setOpenDialog = useUIStore((s) => s.setOpenDialog);
  const rows = useDatasetStore((s) => s.rows);
  const variables = useDatasetStore((s) => s.variables);
  const addBlock = useOutputStore((s) => s.addBlock);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showMean, setShowMean] = useState(true);
  const [showMedian, setShowMedian] = useState(true);
  const [showMode, setShowMode] = useState(true);
  const [showHistogram, setShowHistogram] = useState(false);

  // Only numeric variables
  const numericVariables = useMemo(
    () => variables.filter((v) => v.type === "numeric"),
    [variables]
  );

  const availableVariables = useMemo(
    () => numericVariables.filter((v) => !selected.has(v.id)),
    [numericVariables, selected]
  );

  const selectedVariables = useMemo(
    () => numericVariables.filter((v) => selected.has(v.id)),
    [numericVariables, selected]
  );

  const handleAddVariable = (varId: string) => {
    const newSelected = new Set(selected);
    newSelected.add(varId);
    setSelected(newSelected);
  };

  const handleRemoveVariable = (varId: string) => {
    const newSelected = new Set(selected);
    newSelected.delete(varId);
    setSelected(newSelected);
  };

  const handleRun = () => {
    if (selected.size === 0) {
      alert("Please select at least one variable");
      return;
    }

    if (rows.length === 0) {
      alert("Please load or create data first");
      return;
    }

    // At least one statistic must be selected
    if (!showMean && !showMedian && !showMode) {
      alert("Please select at least one statistic (Mean, Median, or Mode)");
      return;
    }

    try {
      const selectedVars = numericVariables.filter((v) => selected.has(v.id));

      const result = computeDescriptives(
        rows,
        variables,
        selectedVars.map((v) => v.id)
      );

      if (result.stats.length === 0) {
        alert("No valid data found for selected variables");
        return;
      }

      // Add metadata about which statistics to show
      const dataWithMetadata = {
        ...result,
        showMean,
        showMedian,
        showMode,
        showHistogram,
      };

      addBlock({
        type: "descriptives",
        title: `Descriptive Statistics (${selectedVars.map((v) => v.name).join(", ")})`,
        timestamp: Date.now(),
        data: dataWithMetadata,
      });

      // Reset and close
      setSelected(new Set());
      setOpenDialog(null);
    } catch (error) {
      console.error("Descriptives error:", error);
      const msg = error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to compute descriptive statistics: ${msg}`);
    }
  };

  if (openDialog !== "descriptives") return null;

  return (
    <Modal
      isOpen={true}
      onClose={() => setOpenDialog(null)}
      title="Descriptive Statistics"
      size="lg"
    >
      <div className="space-y-4">
        {/* Variable Selection - SPSS Style */}
        <div className="grid grid-cols-2 gap-4">
          {/* Available Variables */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Available Variables
            </label>
            <div className="border border-spss-border rounded p-3 bg-white space-y-1 h-48 overflow-y-auto">
              {availableVariables.length === 0 ? (
                <p className="text-xs text-gray-500">All variables selected</p>
              ) : (
                availableVariables.map((variable) => (
                  <button
                    key={variable.id}
                    onClick={() => handleAddVariable(variable.id)}
                    className="w-full text-left px-2 py-1 text-sm hover:bg-spss-selected-bg hover:text-spss-selected rounded transition-colors"
                  >
                    {variable.name}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Selected Variables */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Selected Variables
            </label>
            <div className="border border-spss-border rounded p-3 bg-white space-y-1 h-48 overflow-y-auto">
              {selectedVariables.length === 0 ? (
                <p className="text-xs text-gray-500">
                  Select variables from left
                </p>
              ) : (
                selectedVariables.map((variable) => (
                  <button
                    key={variable.id}
                    onClick={() => handleRemoveVariable(variable.id)}
                    className="w-full text-left px-2 py-1 text-sm bg-spss-selected-bg text-spss-selected hover:bg-spss-selected hover:text-white rounded transition-colors"
                  >
                    {variable.name} ✕
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Statistics Options */}
        <div className="border-t pt-4">
          <label className="block text-sm font-semibold mb-3">
            Statistics to Calculate
          </label>
          <div className="space-y-2 pl-2">
            <Checkbox
              label="Mean"
              checked={showMean}
              onChange={(e) => setShowMean(e.target.checked)}
            />
            <Checkbox
              label="Median"
              checked={showMedian}
              onChange={(e) => setShowMedian(e.target.checked)}
            />
            <Checkbox
              label="Mode"
              checked={showMode}
              onChange={(e) => setShowMode(e.target.checked)}
            />
          </div>
        </div>

        {/* Visualization Options */}
        <div className="border-t pt-4">
          <label className="block text-sm font-semibold mb-3">
            Visualizations
          </label>
          <div className="space-y-2 pl-2">
            <Checkbox
              label="Show Histogram"
              checked={showHistogram}
              onChange={(e) => setShowHistogram(e.target.checked)}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2 pl-2">
            (Histogram shows distribution of values)
          </p>
        </div>

        {/* Buttons */}
        <div className="border-t pt-4 flex gap-2 justify-end">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelected(new Set());
              setOpenDialog(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleRun}
            disabled={selected.size === 0}
          >
            Run
          </Button>
        </div>
      </div>
    </Modal>
  );
}
