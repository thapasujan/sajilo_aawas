interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  title?: string;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
}

const Button = ({
  variant = "primary",
  title,
  className,
  size = "sm",
  type = "button", // ✅ Set default type here
  ...rest
}: ButtonProps) => {
  const sizes = {
    xs: "px-3 py-1.5 text-sm",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base ",
    lg: "px-6 py-3 text-lg",
  };

  const variants = {
    primary: "bg-primary text-white hover:bg-light_primary",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    outline: "border border-primary text-primary hover:bg-primary/10",
  };

  return (
    <button
      type={type} // ✅ Make sure to pass the type here
      className={`
        ${variants[variant]} 
        ${sizes[size]}
        ${className || ""}
        rounded-md transition
      `}
      {...rest}
    >
      {title || "Add"}
    </button>
  );
};

export default Button;
