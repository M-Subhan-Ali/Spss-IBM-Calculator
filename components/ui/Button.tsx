import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles =
      "font-semibold rounded border transition-colors cursor-pointer inline-flex items-center justify-center gap-2";

    const variantStyles = {
      primary: "bg-spss-selected text-white border-spss-selected hover:bg-opacity-90",
      secondary:
        "bg-spss-menu-bg text-black border-spss-border hover:bg-spss-menu-hover",
      danger: "bg-red-600 text-white border-red-600 hover:bg-red-700",
    };

    const sizeStyles = {
      sm: "px-2 py-1 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ""}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
