function Button({
  children,
  className,
  variant = "primary",
  disabled = false,
  type = "button",
  onClick,
}) {
  const variants = {
    primary: "px-4 py-2 mr-1 bg-brand hover:bg-brand-hover",
    danger: "px-4 py-2 mr-1 bg-red-600 hover:bg-red-700",
    navbar: "px-4 py-2 mr-1 bg-navbar hover:bg-navbar-hover font-bold",
    icon: "p-2 bg-surface hover:bg-surface-hover",
  };

  const disabledStyles = "cursor-not-allowed bg-gray-600 text-gray-400";

  return (
    <button
      className={`cursor-pointer rounded-md text-text-primary transition-colors focus-visible:outline-2 focus-visible:outline-white ${disabled ? disabledStyles : variants[variant]} ${className}`}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
