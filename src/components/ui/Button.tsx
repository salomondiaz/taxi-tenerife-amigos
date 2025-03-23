
import React, { forwardRef, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "link" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Configurar las clases basadas en la variante
    const variantClasses = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      ghost: "btn-ghost",
      link: "text-tenerife-blue underline hover:text-tenerife-blue-dark p-0 shadow-none",
      danger: "bg-red-500 text-white hover:bg-red-600 active:scale-95 rounded-full px-6 py-3 font-medium shadow-md",
    };

    // Configurar las clases basadas en el tamaño
    const sizeClasses = {
      sm: "text-xs py-2 px-4",
      md: "text-sm py-3 px-6",
      lg: "text-base py-4 px-8",
      xl: "text-lg py-5 px-10",
    };

    return (
      <button
        ref={ref}
        className={`
          ${variantClasses[variant]} 
          ${sizeClasses[size]} 
          ${fullWidth ? "w-full" : ""} 
          ${
            disabled || isLoading
              ? "opacity-70 cursor-not-allowed"
              : ""
          }
          flex items-center justify-center gap-2 transition-all
          duration-300 focus:outline-none
          ${className}
        `}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
