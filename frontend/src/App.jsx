import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Homepage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import Filter from "./components/main/filter";
import Header from "./components/main/header";
import UserComponent from "./components/user";
import AddBookPage from "./components/main/pages/addBook/index";
import SearchPage from "./components/main/pages/search/index";
import BookDetails from "./components/main/pages/book/index";
import Shelf from "./components/main/pages/Shelf";
import ClubPage from "./components/main/pages/clubpage";
import MyBookClubs from "./components/main/pages/MyBookClubs";
import CreateClub from "./components/main/pages/CreateClub";
import AllBookClubs from "./components/main/pages/AllBookClubs";
import ProfilePage from "./pages/ProfilePage";
import DiscoverAuthors from "./components/main/pages/authors/DiscoverAuthors";
import AuthorProfile from "./components/main/pages/authors/AuthorProfile";

// Protected Route - only accessible if logged in
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("currentUser");
  return user ? children : <Navigate to="/" />;
};

// Public Route - redirects to /home if already logged in
const PublicRoute = ({ children }) => {
  const user = localStorage.getItem("currentUser");
  return user ? <Navigate to="/home" /> : children;
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
          {/* Public Landing Page */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />

          {/* Login/Register page */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <UserComponent />
              </PublicRoute>
            }
          />

          {/* Homepage - PROTECTED */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Homepage theme={theme} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />

          {/* Profile Page */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Add Book page */}
          <Route
            path="/addbook"
            element={
              <ProtectedRoute>
                <AddBookPage />
              </ProtectedRoute>
            }
          />

          {/* Search page */}
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />

          {/* Bookshelf */}
          <Route
            path="/bookshelf"
            element={
              <ProtectedRoute>
                <Shelf />
              </ProtectedRoute>
            }
          />

          {/* Book Details page */}
          <Route
            path="/book/:isbn"
            element={
              <ProtectedRoute>
                <BookDetails />
              </ProtectedRoute>
            }
          />

          {/* Create Club */}
          <Route
            path="/create-club"
            element={
              <ProtectedRoute>
                <CreateClub />
              </ProtectedRoute>
            }
          />

          {/* My Book Clubs */}
          <Route
            path="/my-clubs"
            element={
              <ProtectedRoute>
                <MyBookClubs />
              </ProtectedRoute>
            }
          />

          {/* All Book Clubs */}
          <Route
            path="/clubs"
            element={
              <ProtectedRoute>
                <AllBookClubs />
              </ProtectedRoute>
            }
          />

          {/* Club Page */}
          <Route
            path="/club/:id"
            element={
              <ProtectedRoute>
                <ClubPage />
              </ProtectedRoute>
            }
          />

          {/* Discover Authors */}
          <Route
            path="/discover-authors"
            element={
              <ProtectedRoute>
                <DiscoverAuthors />
              </ProtectedRoute>
            }
          />

          {/* Author Profile */}
          <Route
            path="/author/:name"
            element={
              <ProtectedRoute>
                <AuthorProfile />
              </ProtectedRoute>
            }
          />

          {/* Redirect any unknown route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter >
  );
}

export default App;
