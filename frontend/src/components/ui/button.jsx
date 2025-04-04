export function Button({ children, onClick, variant = "primary", size = "md" }) {
    const baseStyles = "px-4 py-2 font-semibold rounded transition";
    const variants = {
      primary: "bg-blue-500 text-white hover:bg-blue-600",
      secondary: "bg-gray-500 text-white hover:bg-gray-600",
      danger: "bg-red-500 text-white hover:bg-red-600",
      ghost: "bg-transparent hover:bg-gray-700 text-white",
    };
  
    return (
      <button
        className={`${baseStyles} ${variants[variant]}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
  