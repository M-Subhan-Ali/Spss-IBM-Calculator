"use client";

import { useDatasetStore } from "@/store/datasetStore";

export function StatusBar() {
  const rows = useDatasetStore((s) => s.rows);
  const variables = useDatasetStore((s) => s.variables);

  return (
    <div className="w-full bg-spss-ribbon border-t border-spss-border px-4 py-1 flex items-center justify-between text-xs">
      <div className="text-spss-text-secondary">
        {rows.length} cases, {variables.length} variables
      </div>
      <div className="text-spss-text-secondary">
        Ready
      </div>
    </div>
  );
}
