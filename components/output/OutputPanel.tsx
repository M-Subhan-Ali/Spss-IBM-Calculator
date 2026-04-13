"use client";

import { useOutputStore } from "@/store/outputStore";
import { OutputBlock } from "./OutputBlock";
import { Button } from "@/components/ui/Button";

export function OutputPanel() {
  const blocks = useOutputStore((s) => s.blocks);
  const clearOutput = useOutputStore((s) => s.clearOutput);

  return (
    <div className="flex flex-col h-full bg-spss-output-bg border-l border-spss-border">
      <div className="flex items-center justify-between p-3 border-b border-spss-border">
        <h2 className="font-semibold text-sm">Output</h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={clearOutput}
          disabled={blocks.length === 0}
        >
          Clear
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {blocks.length === 0 ? (
          <p className="text-gray-500 text-sm">No output yet. Run an analysis.</p>
        ) : (
          <div className="space-y-4">
            {blocks.map((block) => (
              <OutputBlock key={block.id} block={block} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
