"use client";

import { useRef } from "react";
import { MenuItem } from "./MenuItem";
import { DropdownMenu } from "./DropdownMenu";
import { useDatasetStore } from "@/store/datasetStore";
import { parseCSV } from "@/lib/io/csvParser";
import { parseExcel } from "@/lib/io/excelParser";

export function FileMenu() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resetDataset = useDatasetStore((s) => s.resetDataset);
  const loadDataset = useDatasetStore((s) => s.loadDataset);

  const handleOpenClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (file.name.endsWith(".csv")) {
        const { rows, variables } = await parseCSV(file);
        if (rows.length === 0 || variables.length === 0) {
          alert("File is empty or contains no data");
          return;
        }
        loadDataset(rows, variables);
        alert(`Loaded ${rows.length} rows and ${variables.length} columns`);
      } else if (file.name.endsWith(".xlsx")) {
        const { rows, variables } = await parseExcel(file);
        if (rows.length === 0 || variables.length === 0) {
          alert("File is empty or contains no data");
          return;
        }
        loadDataset(rows, variables);
        alert(`Loaded ${rows.length} rows and ${variables.length} columns`);
      } else {
        alert("Please select a CSV or Excel (.xlsx) file");
      }
    } catch (error) {
      console.error("Error loading file:", error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to load file: ${errorMsg}`);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset the dataset?")) {
      resetDataset();
    }
  };

  return (
    <>
      <DropdownMenu label="File">
        <MenuItem label="Open CSV/Excel" onClick={handleOpenClick} />
        <MenuItem label="Reset Dataset" onClick={handleReset} />
      </DropdownMenu>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}
