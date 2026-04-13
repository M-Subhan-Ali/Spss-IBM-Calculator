"use client";

import { useDatasetStore } from "@/store/datasetStore";

export function TabBar() {
  const activeTab = useDatasetStore((s) => s.activeTab);
  const setActiveTab = useDatasetStore((s) => s.setActiveTab);

  return (
    <div className="flex border-t border-spss-border bg-spss-menu-bg">
      <button
        onClick={() => setActiveTab("data")}
        className={`px-4 py-2 font-medium text-sm border-r border-spss-border transition-colors ${
          activeTab === "data"
            ? "bg-spss-tab-active text-black"
            : "bg-spss-tab-inactive text-black hover:bg-gray-200"
        }`}
      >
        Data View
      </button>
      <button
        onClick={() => setActiveTab("variable")}
        className={`px-4 py-2 font-medium text-sm transition-colors ${
          activeTab === "variable"
            ? "bg-spss-tab-active text-black"
            : "bg-spss-tab-inactive text-black hover:bg-gray-200"
        }`}
      >
        Variable View
      </button>
    </div>
  );
}
