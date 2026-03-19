import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex items-center w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none ${
        theme === "dark" ? "bg-primary" : "bg-gray-300"
      }`}
    >
      {/* Circle */}
      <span
        className={`inline-block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          theme === "dark" ? "translate-x-8" : "translate-x-1"
        }`}
      />

      {/* Icons */}
      <span className="absolute left-1.5 text-xs">
        {theme === "dark" ? "🌙" : ""}
      </span>
      <span className="absolute right-1.5 text-xs">
        {theme === "light" ? "☀️" : ""}
      </span>
    </button>
  );
};

export default ThemeToggle;