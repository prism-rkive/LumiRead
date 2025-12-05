import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Homepage from "./pages/HomePage";
import CommunityFeed from "./pages/CommunityFeed";
import Filter from "./components/main/filter";
import Header from "./components/main/header";
import UserComponent from "./components/user";
import AddBookPage from "./components/main/pages/addBook/index";
import SearchPage from "./components/main/pages/search/index";
import BookDetails from "./components/main/pages/book/index";

// Protected Route
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('currentUser');
  return user ? children : <Navigate to="/" />;
};

// Public Route
const PublicRoute = ({ children }) => {
  const user = localStorage.getItem('currentUser');
  return user ? <Navigate to="/addbook" /> : children;
};

function App() {
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
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors App">
        <Routes>
          {/* Login/Register page */}
          <Route path="/" element={
            <PublicRoute>
              <UserComponent />
            </PublicRoute>
          } />

          {/* Homepage and community feed */}
          <Route path="/home" element={<Homepage theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="/community" element={<CommunityFeed theme={theme} toggleTheme={toggleTheme} />} />

          {/* Add Book page */}
          <Route path="/addbook" element={
            <ProtectedRoute>
              <AddBookPage />
            </ProtectedRoute>
          } />

          {/* Search page */}
          <Route path="/search" element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          } />

          {/* Book Details page */}
          <Route path="/book/:ibn" element={
            <ProtectedRoute>
              <BookDetails />
            </ProtectedRoute>
          } />

          {/* Redirect any unknown route */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
