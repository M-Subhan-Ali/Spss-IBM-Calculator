"use client";

import { useRef, useState, ReactNode } from "react";
import { useUIStore } from "@/store/uiStore";

interface SplitPaneProps {
  left: ReactNode;
  right: ReactNode;
  splitSize: number; // percentage width for left panel
}

export function SplitPane({ left, right, splitSize }: SplitPaneProps) {
  const setSplitPaneSize = useUIStore((s) => s.setSplitPaneSize);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const newSize = ((e.clientX - rect.left) / rect.width) * 100;
    setSplitPaneSize(newSize);
  };

  return (
    <div
      ref={containerRef}
      className="flex w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Left Panel */}
      <div style={{ width: `${splitSize}%` }} className="overflow-hidden">
        {left}
      </div>

      {/* Divider */}
      <div
        onMouseDown={handleMouseDown}
        className={`w-1 bg-spss-border cursor-col-resize hover:bg-spss-header transition-colors ${
          isDragging ? "bg-spss-header" : ""
        }`}
        role="separator"
        aria-label="Split pane divider"
      />

      {/* Right Panel */}
      <div style={{ width: `${100 - splitSize}%` }} className="overflow-hidden">
        {right}
      </div>
    </div>
  );
}
