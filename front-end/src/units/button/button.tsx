import React from "react";
import { StyleProps } from "../../constant";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    StyleProps {
  children: React.ReactNode;
  variant?: "default" | "warning" | "outline" | "text";
  size?: "small" | "medium" | "big" | "lg";
  outline?: boolean;
}

export const Button = React.memo(
  ({
    children,
    type = "button",
    textColor,
    className = "",
    animationProps = "hover:animate-jiggle",
    variant = "default",
    size = "medium",
    outline = false,
    ...other
  }: ButtonProps): JSX.Element => {
    // Base classes
    const baseClasses = "rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2";
    
    // Variant classes
    const variantClasses = {
      default: "bg-brand text-white hover:bg-brand-dark",
      warning: "bg-red-600 text-white hover:bg-red-700",
      outline: "border-2 border-brand text-brand bg-transparent hover:bg-brand hover:text-white",
      text: "bg-transparent text-brand hover:bg-gray-100"
    };
    
    // Size classes
    const sizeClasses = {
      small: "px-3 py-1.5 text-sm",
      medium: "px-4 py-2 text-base",
      big: "px-6 py-3 text-lg",
      lg: "px-8 py-4 text-xl"
    };
    
    // Handle outline prop for backward compatibility
    const finalVariant = outline ? "outline" : variant;
    
    // Handle custom text color
    const textColorStyle = textColor ? { color: textColor } : {};
    
    return (
      <button
        className={`
          ${baseClasses}
          ${variantClasses[finalVariant]}
          ${sizeClasses[size]}
          ${animationProps}
          ${className}
        `.trim()}
        style={textColorStyle}
        type={type}
        {...other}
      >
        {children}
      </button>
    );
  }
);