// src/App.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/HomePage";
import CommunityFeed from "./pages/CommunityFeed";

function App() {
  // theme: 'light'|'dark'
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route
          path="/home"
          element={<Homepage theme={theme} toggleTheme={toggleTheme} />}
        />
        <Route
          path="/community"
          element={<CommunityFeed toggleTheme={toggleTheme} theme={theme} />}
        />
        {/* Add more routes: /add-book, /search, /profile etc. */}
      </Routes>
    </div>
  );
}

export default App;
