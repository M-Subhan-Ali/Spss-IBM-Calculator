"use client";

import { ReactNode, useRef, useState, useEffect } from "react";

interface DropdownMenuProps {
  label: string;
  children: ReactNode;
}

export function DropdownMenu({ label, children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 text-sm font-medium text-black bg-spss-menu-bg border border-spss-border rounded hover:bg-spss-menu-hover transition-colors"
      >
        {label}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-0 w-48 bg-white border border-spss-border rounded shadow-lg z-50">
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
}
