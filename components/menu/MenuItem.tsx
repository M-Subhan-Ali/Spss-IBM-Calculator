interface MenuItemProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function MenuItem({ label, onClick, disabled = false }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full px-4 py-2 text-left text-sm text-black hover:bg-spss-menu-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {label}
    </button>
  );
}
