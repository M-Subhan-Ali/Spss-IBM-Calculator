"use client";

import { FileMenu } from "./FileMenu";
import { AnalyzeMenu } from "./AnalyzeMenu";
import { DropdownMenu } from "./DropdownMenu";
import { MenuItem } from "./MenuItem";
import { useUIStore } from "@/store/uiStore";

export function MenuBar() {
  const toggleOutput = useUIStore((s) => s.toggleOutput);
  const outputVisible = useUIStore((s) => s.outputVisible);

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-spss-menu-bg border-b border-spss-border">
      <FileMenu />
      <DropdownMenu label="Edit">
        <MenuItem label="Undo" disabled />
        <MenuItem label="Redo" disabled />
      </DropdownMenu>
      <DropdownMenu label="View">
        <MenuItem
          label={outputVisible ? "Hide Output" : "Show Output"}
          onClick={toggleOutput}
        />
      </DropdownMenu>
      <AnalyzeMenu />
      <DropdownMenu label="Graphs">
        <MenuItem label="Bar Chart" disabled />
        <MenuItem label="Histogram" disabled />
        <MenuItem label="Scatter" disabled />
      </DropdownMenu>
    </div>
  );
}
