"use client";

import { useEffect, useState } from "react";
import { useDatasetStore } from "@/store/datasetStore";
import { SPSSRibbon } from "@/components/layout/SPSSRibbon";
import { DataEditor } from "@/components/data-editor/DataEditor";
import { OutputPanel } from "@/components/output/OutputPanel";
import { SplitPane } from "@/components/layout/SplitPane";
import { StatusBar } from "@/components/layout/StatusBar";
import { useUIStore } from "@/store/uiStore";
import { DescriptivesDialog } from "@/components/dialogs/DescriptivesDialog";
import { FrequenciesDialog } from "@/components/dialogs/FrequenciesDialog";
import { CorrelationDialog } from "@/components/dialogs/CorrelationDialog";
import { RegressionDialog } from "@/components/dialogs/RegressionDialog";

export function AppShell() {
  const [mounted, setMounted] = useState(false);
  const loadFromStorage = useDatasetStore((s) => s.loadFromStorage);
  const persistToStorage = useDatasetStore((s) => s.persistToStorage);
  const splitPaneSize = useUIStore((s) => s.splitPaneSize);
  const outputVisible = useUIStore((s) => s.outputVisible);

  // Load persisted data on mount
  useEffect(() => {
    loadFromStorage().then(() => setMounted(true));
  }, [loadFromStorage]);

  // Persist data changes to IndexedDB
  useEffect(() => {
    const interval = setInterval(() => {
      persistToStorage();
    }, 5000); // Auto-save every 5 seconds

    return () => clearInterval(interval);
  }, [persistToStorage]);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-spss-bg">
        <p className="text-spss-text">Loading SPSS Statistics...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-spss-bg">
      {/* SPSS Ribbon Menu */}
      <SPSSRibbon />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {outputVisible ? (
          <SplitPane
            left={<DataEditor />}
            right={<OutputPanel />}
            splitSize={splitPaneSize}
          />
        ) : (
          <div className="flex-1">
            <DataEditor />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <StatusBar />

      {/* Analysis Dialogs */}
      <DescriptivesDialog />
      <FrequenciesDialog />
      <CorrelationDialog />
      <RegressionDialog />
    </div>
  );
}
