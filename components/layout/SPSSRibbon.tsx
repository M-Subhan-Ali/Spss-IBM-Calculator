"use client";

import { useState } from "react";
import { useUIStore } from "@/store/uiStore";
import { useDatasetStore } from "@/store/datasetStore";
import { useRef } from "react";

export function SPSSRibbon() {
  const setOpenDialog = useUIStore((s) => s.setOpenDialog);
  const resetDataset = useDatasetStore((s) => s.resetDataset);
  const loadDataset = useDatasetStore((s) => s.loadDataset);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleOpenFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (file.name.endsWith(".csv")) {
        const { parseCSV } = await import("@/lib/io/csvParser");
        const { rows, variables } = await parseCSV(file);
        loadDataset(rows, variables);
        alert(`Loaded ${rows.length} rows and ${variables.length} columns`);
      } else if (file.name.endsWith(".xlsx")) {
        const { parseExcel } = await import("@/lib/io/excelParser");
        const { rows, variables } = await parseExcel(file);
        loadDataset(rows, variables);
        alert(`Loaded ${rows.length} rows and ${variables.length} columns`);
      }
    } catch (error) {
      alert("Error loading file");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full bg-spss-ribbon border-b border-spss-border">
      {/* Title Bar */}
      <div className="px-4 py-2 border-b border-spss-border bg-spss-ribbon">
        <div className="font-bold text-sm">SPSS Statistics Data Editor</div>
      </div>

      {/* Ribbon Tabs */}
      <div className="flex px-2 bg-spss-ribbon border-b border-spss-border-light">
        {[
          { name: "File", id: "file" },
          { name: "Edit", id: "edit" },
          { name: "View", id: "view" },
          { name: "Data", id: "data" },
          { name: "Transform", id: "transform" },
          { name: "Analyze", id: "analyze" },
          { name: "Graphs", id: "graphs" },
          { name: "Tools", id: "tools" },
          { name: "Window", id: "window" },
          { name: "Help", id: "help" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveMenu(activeMenu === tab.id ? null : tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeMenu === tab.id
                ? "bg-white border-b-2 border-spss-selected text-spss-selected"
                : "bg-spss-ribbon text-spss-text hover:bg-spss-ribbon-hover"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Menu Dropdowns */}
      {activeMenu === "file" && (
        <div className="absolute bg-white border border-spss-border shadow-lg z-50 w-48 mt-0">
          <button
            onClick={handleOpenFile}
            className="w-full text-left px-4 py-2 hover:bg-spss-selected-light text-sm"
          >
            Open Data File...
          </button>
          <button
            onClick={() => setOpenDialog(null)}
            className="w-full text-left px-4 py-2 hover:bg-spss-selected-light text-sm"
          >
            New Data
          </button>
          <div className="border-t border-spss-border-light my-1" />
          <button
            onClick={() => {
              if (confirm("Clear all data?")) resetDataset();
            }}
            className="w-full text-left px-4 py-2 hover:bg-spss-selected-light text-sm"
          >
            Reset Dataset
          </button>
          <div className="border-t border-spss-border-light my-1" />
          <button
            onClick={() => setActiveMenu(null)}
            className="w-full text-left px-4 py-2 hover:bg-spss-selected-light text-sm"
          >
            Exit
          </button>
        </div>
      )}

      {activeMenu === "analyze" && (
        <div className="absolute bg-white border border-spss-border shadow-lg z-50 w-56 mt-0">
          <button
            onClick={() => {
              setOpenDialog("descriptives");
              setActiveMenu(null);
            }}
            className="w-full text-left px-4 py-2 hover:bg-spss-selected-light text-sm"
          >
            Descriptive Statistics
          </button>
          <button
            onClick={() => {
              setOpenDialog("frequencies");
              setActiveMenu(null);
            }}
            className="w-full text-left px-4 py-2 hover:bg-spss-selected-light text-sm"
          >
            Frequencies
          </button>
          <button
            onClick={() => {
              setOpenDialog("correlation");
              setActiveMenu(null);
            }}
            className="w-full text-left px-4 py-2 hover:bg-spss-selected-light text-sm"
          >
            Correlations
          </button>
          <button
            onClick={() => {
              setOpenDialog("regression");
              setActiveMenu(null);
            }}
            className="w-full text-left px-4 py-2 hover:bg-spss-selected-light text-sm"
          >
            Regression
          </button>
        </div>
      )}

      {activeMenu === "view" && (
        <div className="absolute bg-white border border-spss-border shadow-lg z-50 w-48 mt-0">
          <button
            onClick={() => setActiveMenu(null)}
            className="w-full text-left px-4 py-2 hover:bg-spss-selected-light text-sm"
          >
            ✓ Data Editor
          </button>
          <button
            onClick={() => setActiveMenu(null)}
            className="w-full text-left px-4 py-2 hover:bg-spss-selected-light text-sm"
          >
            ✓ Variable View
          </button>
          <button
            onClick={() => setActiveMenu(null)}
            className="w-full text-left px-4 py-2 hover:bg-spss-selected-light text-sm"
          >
            ✓ Output Viewer
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
