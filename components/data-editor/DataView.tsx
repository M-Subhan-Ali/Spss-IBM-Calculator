"use client";

import { useCallback, useRef, useMemo, useState } from "react";
import { useDatasetStore } from "@/store/datasetStore";
import { DataCell } from "./DataCell";
import { Button } from "@/components/ui/Button";
import { parseClipboardText } from "@/lib/utils/clipboardUtils";

export function DataView() {
  const rows = useDatasetStore((s) => s.rows);
  const variables = useDatasetStore((s) => s.variables);
  const setCellValue = useDatasetStore((s) => s.setCellValue);
  const addRow = useDatasetStore((s) => s.addRow);
  const removeRows = useDatasetStore((s) => s.removeRows);
  const addColumn = useDatasetStore((s) => s.addColumn);

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const rowHeight = 24;

  const handlePaste = async (e: ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData?.getData("text/plain");
    if (!text) return;

    try {
      const data = parseClipboardText(text);
      // Find selected cell or use top-left
      let startRow = 0;
      let startColIdx = 1; // Skip row number column

      if (data.length === 0) return;

      // Paste data
      for (let r = 0; r < data.length; r++) {
        const rowIdx = startRow + r;
        if (rowIdx >= rows.length) {
          addRow();
        }

        for (let c = 0; c < data[r].length; c++) {
          const colIdx = startColIdx + c;
          if (colIdx >= variables.length) {
            addColumn();
          }
          if (rowIdx < rows.length && colIdx - 1 < variables.length) {
            const colId = variables[colIdx - 1]?.id;
            if (colId) {
              setCellValue(rowIdx, colId, data[r][c]);
            }
          }
        }
      }
    } catch (error) {
      console.error("Paste error:", error);
    }
  };

  // Column header
  const ColumnHeaderRow = () => {
    return (
      <div className="flex bg-spss-header border-b-2 border-spss-border sticky top-0 z-20">
        <div
          className="bg-spss-header border-r border-spss-border flex items-center justify-center font-semibold text-xs flex-shrink-0"
          style={{ width: 40 }}
        >
          #
        </div>
        {variables.map((v, i) => (
          <div
            key={v.id}
            className="bg-spss-header border-r border-spss-border flex items-center px-2 text-xs font-semibold flex-shrink-0 overflow-hidden"
            style={{ width: Math.max(100, v.width) }}
            title={v.label || v.name}
          >
            {v.name}
          </div>
        ))}
      </div>
    );
  };

  if (rows.length === 0 && variables.length === 0) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">No data yet.</p>
            <div className="space-x-2">
              <Button onClick={addRow} size="sm">
                Add Row
              </Button>
              <Button onClick={addColumn} size="sm">
                Add Column
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-auto">
        <div className="relative">
          <ColumnHeaderRow />
          <div className="flex">
            {/* Row numbers */}
            <div className="flex-shrink-0 bg-white border-r border-spss-border">
              {rows.map((_, idx) => (
                <div
                  key={idx}
                  className="h-6 flex items-center justify-center text-xs font-semibold bg-spss-header border-b border-spss-border flex-shrink-0 w-10"
                  style={{ height: rowHeight }}
                >
                  {idx + 1}
                </div>
              ))}
            </div>

            {/* Data cells */}
            <div className="flex-1 overflow-x-auto">
              <div
                className="inline-flex"
                style={{
                  width: variables.reduce((sum, v) => sum + Math.max(100, v.width), 0),
                }}
              >
                {variables.map((variable, colIdx) => (
                  <div
                    key={variable.id}
                    style={{
                      width: Math.max(100, variable.width),
                      minWidth: Math.max(100, variable.width),
                    }}
                  >
                    {rows.map((row, rowIdx) => (
                      <div
                        key={`${rowIdx}-${variable.id}`}
                        style={{ height: rowHeight }}
                        className="border-b border-r border-spss-border bg-white"
                      >
                        <DataCell
                          rowIndex={rowIdx}
                          colId={variable.id}
                          value={row[variable.id] ?? ""}
                          onPaste={handlePaste}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-spss-border bg-spss-menu-bg flex gap-2">
        <Button onClick={addRow} size="sm">
          Add Row
        </Button>
        <Button onClick={addColumn} size="sm">
          Add Column
        </Button>
      </div>
    </div>
  );
}
