"use client";

import { create } from "zustand";
import { nanoid } from "nanoid";
import type { DataRow, Variable, CellPosition, CellValue } from "@/lib/types";

interface DatasetState {
  // Core data
  rows: DataRow[];
  variables: Variable[];
  activeTab: "data" | "variable";

  // Selection state
  selectedCell: CellPosition | null;
  selectedRows: Set<number>;

  // Actions - data manipulation
  setRows: (rows: DataRow[]) => void;
  setCellValue: (rowIndex: number, colId: string, value: CellValue) => void;
  addRow: () => void;
  removeRows: (indices: number[]) => void;
  addColumn: () => void;
  removeColumn: (colId: string) => void;

  // Actions - variable metadata
  setVariables: (variables: Variable[]) => void;
  updateVariable: (colId: string, patch: Partial<Variable>) => void;

  // Actions - tab + selection
  setActiveTab: (tab: "data" | "variable") => void;
  setSelectedCell: (pos: CellPosition | null) => void;
  setSelectedRows: (indices: Set<number>) => void;

  // Actions - dataset lifecycle
  loadDataset: (rows: DataRow[], variables: Variable[]) => void;
  resetDataset: () => void;

  // Persistence
  persistToStorage: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

export const useDatasetStore = create<DatasetState>((set, get) => ({
  rows: [],
  variables: [],
  activeTab: "data",
  selectedCell: null,
  selectedRows: new Set(),

  setRows: (rows) => set({ rows }),

  setCellValue: (rowIndex, colId, value) => {
    const state = get();
    const row = state.rows[rowIndex];
    if (!row) return;
    const updatedRow = { ...row, [colId]: value };
    const newRows = [...state.rows];
    newRows[rowIndex] = updatedRow;
    set({ rows: newRows });
  },

  addRow: () => {
    const state = get();
    const newRow: DataRow = { _id: nanoid() };
    state.variables.forEach((v) => {
      newRow[v.id] = v.defaultValue ?? null;
    });
    set({ rows: [...state.rows, newRow] });
  },

  removeRows: (indices) => {
    const state = get();
    const newRows = state.rows.filter((_, i) => !indices.includes(i));
    set({ rows: newRows });
  },

  addColumn: () => {
    const state = get();
    const newColId = `col_${nanoid()}`;
    const newVariable: Variable = {
      id: newColId,
      name: `var${state.variables.length + 1}`,
      label: "",
      type: "string",
      width: 100,
      decimals: 0,
      missingValues: [],
      defaultValue: null,
      measureLevel: "nominal",
    };
    set({ variables: [...state.variables, newVariable] });
  },

  removeColumn: (colId) => {
    const state = get();
    const newVariables = state.variables.filter((v) => v.id !== colId);
    const newRows = state.rows.map((row) => {
      const newRow = { ...row };
      delete newRow[colId];
      return newRow;
    });
    set({ variables: newVariables, rows: newRows });
  },

  setVariables: (variables) => set({ variables }),

  updateVariable: (colId, patch) => {
    const state = get();
    const newVariables = state.variables.map((v) =>
      v.id === colId ? { ...v, ...patch } : v
    );
    set({ variables: newVariables });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSelectedCell: (pos) => set({ selectedCell: pos }),

  setSelectedRows: (indices) => set({ selectedRows: indices }),

  loadDataset: (rows, variables) => {
    set({ rows, variables });
  },

  resetDataset: () => {
    set({ rows: [], variables: [], selectedCell: null, selectedRows: new Set() });
  },

  persistToStorage: async () => {
    try {
      const state = get();
      const data = {
        rows: state.rows,
        variables: state.variables,
      };
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const req = indexedDB.open("spss-app", 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains("dataset")) {
            db.createObjectStore("dataset");
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });

      const tx = db.transaction(["dataset"], "readwrite");
      const store = tx.objectStore("dataset");
      await new Promise<void>((resolve, reject) => {
        const req = store.put(data, "current");
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
      db.close();
    } catch (error) {
      console.error("Failed to persist dataset:", error);
    }
  },

  loadFromStorage: async () => {
    try {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const req = indexedDB.open("spss-app", 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains("dataset")) {
            db.createObjectStore("dataset");
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });

      const tx = db.transaction(["dataset"], "readonly");
      const store = tx.objectStore("dataset");
      const data = await new Promise<{
        rows: DataRow[];
        variables: Variable[];
      } | null>((resolve, reject) => {
        const req = store.get("current");
        req.onsuccess = () => resolve(req.result ?? null);
        req.onerror = () => reject(req.error);
      });
      db.close();

      if (data) {
        set({
          rows: data.rows || [],
          variables: data.variables || [],
        });
      }
    } catch (error) {
      console.error("Failed to load dataset from storage:", error);
    }
  },
}));
