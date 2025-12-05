import { useCallback, useEffect, useState } from "react";

export function useThemeProvider() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "light";
    } catch (e) {
      return "light";
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}

// default export to keep your earlier import style
export default useThemeProvider;
