"use client";

import { useState, useRef, useEffect } from "react";
import { useDatasetStore } from "@/store/datasetStore";
import type { CellValue } from "@/lib/types";

interface DataCellProps {
  rowIndex: number;
  colId: string;
  value: CellValue;
  onPaste?: (e: ClipboardEvent) => void;
}

export function DataCell({ rowIndex, colId, value, onPaste }: DataCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value ?? ""));
  const inputRef = useRef<HTMLInputElement>(null);
  const setCellValue = useDatasetStore((s) => s.setCellValue);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setCellValue(rowIndex, colId, editValue || null);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setCellValue(rowIndex, colId, editValue || null);
      setIsEditing(false);
    } else if (e.key === "Escape") {
      setIsEditing(false);
    } else if (e.key === "Tab") {
      e.preventDefault();
      handleBlur();
      // Move to next cell (simplified)
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full h-full px-2 border-none outline-none text-xs"
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      onDoubleClick={() => setIsEditing(true)}
      className="w-full h-full px-2 py-1 cursor-text text-xs flex items-center overflow-hidden whitespace-nowrap"
    >
      {value}
    </div>
  );
}
