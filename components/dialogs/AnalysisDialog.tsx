"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useDatasetStore } from "@/store/datasetStore";
import type { Variable } from "@/lib/types";

interface AnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onApply: (selectedVariables: Variable[]) => void;
  multiSelect?: boolean;
  numericOnly?: boolean;
  children?: React.ReactNode;
}

export function AnalysisDialog({
  isOpen,
  onClose,
  title,
  onApply,
  multiSelect = true,
  numericOnly = false,
  children,
}: AnalysisDialogProps) {
  const variables = useDatasetStore((s) => s.variables);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filteredVariables = numericOnly
    ? variables.filter((v) => v.type === "numeric")
    : variables;

  const handleToggle = (varId: string) => {
    const newSelected = new Set(selected);
    if (multiSelect) {
      if (newSelected.has(varId)) {
        newSelected.delete(varId);
      } else {
        newSelected.add(varId);
      }
    } else {
      newSelected.clear();
      newSelected.add(varId);
    }
    setSelected(newSelected);
  };

  const handleApply = () => {
    const selectedVars = variables.filter((v) => selected.has(v.id));
    onApply(selectedVars);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="space-y-4">
        {/* Variable List */}
        <div>
          <label className="block text-sm font-medium mb-2">Variables</label>
          <div className="border border-spss-border rounded p-2 space-y-1 max-h-64 overflow-y-auto bg-white">
            {filteredVariables.length === 0 ? (
              <p className="text-xs text-gray-500">
                {numericOnly ? "No numeric variables found" : "No variables found"}
              </p>
            ) : (
              filteredVariables.map((variable) => (
                <label key={variable.id} className="flex items-center gap-2 p-1 hover:bg-gray-50 text-sm cursor-pointer">
                  <input
                    type={multiSelect ? "checkbox" : "radio"}
                    name="variable"
                    checked={selected.has(variable.id)}
                    onChange={() => handleToggle(variable.id)}
                    className="cursor-pointer"
                  />
                  <span>{variable.name}</span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Custom children content */}
        {children}

        {/* Buttons */}
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleApply}
            disabled={selected.size === 0}
          >
            OK
          </Button>
        </div>
      </div>
    </Modal>
  );
}
