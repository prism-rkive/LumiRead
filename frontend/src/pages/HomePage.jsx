// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookPlus,
  Search,
  BookMarked,
  Users,
  LogOut,
  Moon,
  Sun,
  LibraryBig,
  Club,
  List,
} from "lucide-react";
import ReadingOverview from "../components/ReadingOverview";
import UserStats from "../components/UserStats";
import CommunityOverview from "../components/CommunityOverview";
import ActionButton from "../components/ActionButton";
import Footer from "../components/Footer"; // ✅ Import your Footer component
import useTheme from "../hooks/useTheme";
import { getUser, getCurrentBooks, getCommunityFeed } from "../services/api";

export default function HomePage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadAll() {
      setLoading(true);
      try {
        // Fetch user, bookshelf (5 books), community feed using API functions
        const [uRes, bRes, fRes] = await Promise.all([
          getUser(),
          getCurrentBooks(5),
          getCommunityFeed(),
        ]);

        if (!mounted) return;

        if (!uRes || uRes.status === false) {
          throw new Error(uRes?.message || "Failed to fetch user");
        }
        if (!bRes || bRes.status === false) {
          throw new Error(bRes?.message || "Failed to fetch bookshelf");
        }
        if (!fRes || fRes.status === false) {
          throw new Error(fRes?.message || "Failed to fetch community feed");
        }

        setUser(uRes.data);
        setBooks(bRes.data || []);

        // Map feed for CommunityOverview - keep raw data, let component handle rendering
        const fMapped = (fRes.data || []).map((post) => ({
          id: post._id,
          user: post.user?.name || "Unknown",
          avatar: post.user?.avatar,
          action: `posted in ${post.club?.name || "a club"}`,
          content: post.content, // ✅ Pass raw content
          clubName: post.club?.name,
          time: post.createdAt
            ? new Date(post.createdAt).toLocaleString()
            : "Unknown time",
        }));
        setFeed(fMapped);
      } catch (err) {
        console.error("Error in loadAll:", err);
        setError(err.message || "Failed to load data");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAll();
    return () => {
      mounted = false;
    };
  }, []);

  const handleNavigation = (path) => navigate(path);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 text-gray-700 dark:text-white">
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto text-center p-6 bg-red-50 dark:bg-red-900 rounded-xl">
          <h2 className="text-2xl font-bold mb-2 text-red-700 dark:text-red-300">
            Something went wrong
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const userName = user?.name || "User";

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors font-sans">
      {/* Header */}
      <header className="flex justify-between items-center max-w-7xl mx-auto py-2 px-4 sm:px-8 mb-8">
        <h1 className="text-3xl font-extrabold text-red-700 dark:text-red-400">
          LumiRead
        </h1>
        <div className="flex space-x-2 sm:space-x-4 items-center">
          <button
            onClick={toggleTheme}
            className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-gray-800 dark:text-white shadow-md"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-400" />
            )}
          </button>
          <button
            onClick={() => handleNavigation("/profile")}
            className="p-1 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 shadow-md transition-colors overflow-hidden flex items-center justify-center"
            title="User Profile"
            style={{ width: "44px", height: "44px" }}
          >
            {user?.avatar ? (
              <img
                src={
                  user.avatar.startsWith("http")
                    ? user.avatar
                    : `http://localhost:5000${user.avatar}`
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <Users className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600"
          >
            <LogOut className="w-5 h-5 mr-1" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
          Welcome back, {userName}!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-10 text-xl">
          Thanks for returning. Let's find your next read.
        </p>

        {/* Quick Actions */}
        <div className="mb-12 p-8 bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 border-l-4 border-l-red-500 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none transition-all">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center tracking-tight">
              <BookMarked className="w-6 h-6 mr-3 text-red-600" />
              Quick Actions
            </h3>
            <span className="hidden sm:block text-sm text-gray-400 font-medium">
              Frequently used tools
            </span>
          </div>

          {/* Grid layout for better alignment than flex-wrap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionButton
              className="w-full justify-center py-4 bg-red-50 hover:bg-red-100 dark:bg-gray-700 dark:hover:bg-gray-600 border-none transition-transform active:scale-95"
              icon={BookPlus}
              label="Add New Book"
              onClick={() => handleNavigation("/addbook")}
            />
            <ActionButton
              className="w-full justify-center py-4 bg-red-50 hover:bg-red-100 dark:bg-gray-700 dark:hover:bg-gray-600 border-none transition-transform active:scale-95"
              icon={Search}
              label="Search Catalog"
              onClick={() => handleNavigation("/search")}
            />
            <ActionButton
              className="w-full justify-center py-4 bg-red-50 hover:bg-red-100 dark:bg-gray-700 dark:hover:bg-gray-600 border-none transition-transform active:scale-95"
              icon={LibraryBig}
              label="My BookShelf"
              onClick={() => handleNavigation("/bookshelf")}
            />
            <ActionButton
              className="w-full justify-center py-4 bg-red-50 hover:bg-red-100 dark:bg-gray-700 dark:hover:bg-gray-600 border-none transition-transform active:scale-95"
              icon={Club}
              label="My Book Clubs"
              onClick={() => handleNavigation("/my-clubs")}
            />
          </div>
        </div>
        {/* Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          <div className="lg:col-span-2 space-y-8">
            <ReadingOverview books={books} />
            <CommunityOverview
              feed={feed}
              onExpand={() => handleNavigation("/my-clubs")}
              showViewAll={true}
            />
          </div>
          <div className="lg:col-span-1 space-y-8">
            <UserStats
              stats={
                user?.readingGoals || { year: 0, completed: 0, pagesRead: 0 }
              }
            />
          </div>
        </div>
      </main>

      {/* Footer - Using your existing Footer component */}
      <Footer />
    </div>
  );
}
