"use client";

import { create } from "zustand";
import type { DialogType } from "@/lib/types";

interface UIState {
  openDialog: DialogType;
  splitPaneSize: number; // % width given to data editor (0-100)
  outputVisible: boolean;

  setOpenDialog: (dialog: DialogType) => void;
  setSplitPaneSize: (size: number) => void;
  toggleOutput: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  openDialog: null,
  splitPaneSize: 60,
  outputVisible: true,

  setOpenDialog: (dialog) => set({ openDialog: dialog }),

  setSplitPaneSize: (size) =>
    set({ splitPaneSize: Math.max(20, Math.min(80, size)) }),

  toggleOutput: () =>
    set((state) => ({ outputVisible: !state.outputVisible })),
}));
