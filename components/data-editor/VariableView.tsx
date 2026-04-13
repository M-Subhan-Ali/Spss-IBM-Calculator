"use client";

import { useDatasetStore } from "@/store/datasetStore";
import { VariableRow } from "./VariableRow";
import { Button } from "@/components/ui/Button";

export function VariableView() {
  const variables = useDatasetStore((s) => s.variables);
  const addColumn = useDatasetStore((s) => s.addColumn);
  const removeColumn = useDatasetStore((s) => s.removeColumn);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="grid grid-cols-9 gap-1 p-2 bg-spss-header border-b border-spss-border font-semibold text-xs text-black sticky top-0">
        <div className="truncate">Name</div>
        <div className="truncate">Type</div>
        <div className="truncate">Width</div>
        <div className="truncate">Decimals</div>
        <div className="truncate">Label</div>
        <div className="truncate">Missing</div>
        <div className="truncate">Default</div>
        <div className="truncate">Measure</div>
        <div className="truncate">Action</div>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto">
        {variables.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No variables. Add a column in Data View.
          </div>
        ) : (
          variables.map((variable) => (
            <VariableRow
              key={variable.id}
              variable={variable}
              onRemove={() => removeColumn(variable.id)}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-spss-border bg-spss-menu-bg">
        <Button variant="secondary" size="sm" onClick={addColumn}>
          Add Variable
        </Button>
      </div>
    </div>
  );
}
