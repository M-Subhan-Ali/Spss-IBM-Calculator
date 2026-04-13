"use client";

import { create } from "zustand";
import { nanoid } from "nanoid";
import type { OutputBlock } from "@/lib/types";

interface OutputState {
  blocks: OutputBlock[];
  addBlock: (block: Omit<OutputBlock, "id">) => void;
  clearOutput: () => void;
  removeBlock: (id: string) => void;
}

export const useOutputStore = create<OutputState>((set) => ({
  blocks: [],

  addBlock: (block) => {
    set((state) => ({
      blocks: [
        ...state.blocks,
        {
          ...block,
          id: nanoid(),
        },
      ],
    }));
  },

  clearOutput: () => set({ blocks: [] }),

  removeBlock: (id) => {
    set((state) => ({
      blocks: state.blocks.filter((b) => b.id !== id),
    }));
  },
}));
