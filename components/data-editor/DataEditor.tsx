"use client";

import { useDatasetStore } from "@/store/datasetStore";
import { DataView } from "./DataView";
import { VariableView } from "./VariableView";
import { TabBar } from "./TabBar";

export function DataEditor() {
  const activeTab = useDatasetStore((s) => s.activeTab);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-hidden">
        {activeTab === "data" ? <DataView /> : <VariableView />}
      </div>
      <TabBar />
    </div>
  );
}
