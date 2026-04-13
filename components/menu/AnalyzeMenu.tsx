"use client";

import { MenuItem } from "./MenuItem";
import { DropdownMenu } from "./DropdownMenu";
import { useUIStore } from "@/store/uiStore";

export function AnalyzeMenu() {
  const setOpenDialog = useUIStore((s) => s.setOpenDialog);

  return (
    <DropdownMenu label="Analyze">
      <MenuItem
        label="Descriptive Statistics"
        onClick={() => setOpenDialog("descriptives")}
      />
      <MenuItem
        label="Frequencies"
        onClick={() => setOpenDialog("frequencies")}
      />
      <MenuItem
        label="Correlation"
        onClick={() => setOpenDialog("correlation")}
      />
      <MenuItem
        label="Regression"
        onClick={() => setOpenDialog("regression")}
      />
      <MenuItem
        label="T-Test"
        onClick={() => setOpenDialog("t-test")}
      />
    </DropdownMenu>
  );
}
