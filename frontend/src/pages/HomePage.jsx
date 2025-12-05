import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookPlus,
  Search,
  BookMarked,
  Settings,
  LogOut,
  Moon,
  Sun,
  Users,
} from "lucide-react";
import ReadingOverview from "../components/ReadingOverview";
import UserStats from "../components/UserStats";
import CommunityOverview from "../components/CommunityOverview";
import ActionButton from "../components/ActionButton";
import { getUser, getCurrentBooks, getCommunityFeed } from "../services/api";
import useTheme from "../hooks/useTheme";

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
        const [u, b, f] = await Promise.all([
          getUser(),
          getCurrentBooks(),
          getCommunityFeed(),
        ]);
        if (!mounted) return;
        setUser(u);
        setBooks(b);
        setFeed(f);
      } catch (err) {
        console.error(err);
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

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate("/login");
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
          <p className="text-sm text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  const userName = user?.name || "User";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors font-sans">
      {/* Header: Centered and Padded */}
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
            onClick={() => handleNavigation("/settings")}
            className="p-3 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 shadow-md transition-colors"
          >
            <Settings className="w-5 h-5" />
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

      {/* Main Content: Constrained, Centered, and Padded */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
          Welcome back, {userName}!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-10 text-xl">
          Thanks for returning. Let's find your next read.
        </p>

        {/* Quick Actions Block (Full Width) */}
        <div className="mb-12 p-6 bg-red-50 dark:bg-gray-800 border-l-4 border-red-500 rounded-xl shadow-lg transition-colors">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <BookMarked className="w-5 h-5 mr-2 text-red-700" /> Quick Actions
          </h3>
          <div className="flex flex-wrap gap-4">
            <ActionButton
              icon={BookPlus}
              label="Add New Book"
              onClick={() => handleNavigation("/books/add")}
              className="flex-grow sm:flex-grow-0 min-w-[180px]"
            />
            <ActionButton
              icon={Search}
              label="Search Catalog"
              onClick={() => handleNavigation("/catalog/search")}
              className="flex-grow sm:flex-grow-0 min-w-[180px] bg-gray-500 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
            />
            <ActionButton
              icon={Users}
              label="View Discussions"
              onClick={() => handleNavigation("/community/feed")}
              className="flex-grow sm:flex-grow-0 min-w-[180px] bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600"
            />
          </div>
        </div>

        {/* Overview and Stats Grid (The two-column structure) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {/* ⬅️ LEFT COLUMN: Reading Overview & Community Snap (2/3rds width) */}
          <div className="lg:col-span-2 space-y-8">
            <ReadingOverview books={books} />
            <CommunityOverview
              feed={feed}
              onExpand={() => handleNavigation("/community/feed")}
            />
          </div>

          {/* ➡️ RIGHT COLUMN: User Stats (1/3rd width) */}
          <div className="lg:col-span-1 space-y-8">
            <UserStats
              stats={
                user?.readingGoals || { year: 0, completed: 0, pagesRead: 0 }
              }
            />
          </div>
        </div>
      </main>

      {/* Footer: Full Width Background, Inner Content Constrained and Padded */}
      <footer className="bg-gray-100 dark:bg-gray-800 rounded-t-2xl shadow-xl transition-colors border-t border-gray-300 dark:border-gray-700 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-sm">
            <div>
              <h4 className="font-extrabold text-lg text-red-700 dark:text-red-400 mb-4">
                LumiRead
              </h4>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="hover:text-red-600 cursor-pointer transition-colors">
                  About Us
                </li>
                <li className="hover:text-red-600 cursor-pointer transition-colors">
                  Careers
                </li>
                <li className="hover:text-red-600 cursor-pointer transition-colors">
                  Terms & Privacy
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-lg text-gray-800 dark:text-white mb-4">
                Discover
              </h4>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="hover:text-red-600 cursor-pointer transition-colors">
                  Genres
                </li>
                <li className="hover:text-red-600 cursor-pointer transition-colors">
                  Trending
                </li>
                <li className="hover:text-red-600 cursor-pointer transition-colors">
                  AI Recommendations
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-lg text-gray-800 dark:text-white mb-4">
                Connect
              </h4>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="hover:text-red-600 cursor-pointer transition-colors">
                  Community Forum
                </li>
                <li className="hover:text-red-600 cursor-pointer transition-colors">
                  Book Clubs
                </li>
                <li className="hover:text-red-600 cursor-pointer transition-colors">
                  Follow Friends
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-lg text-gray-800 dark:text-white mb-4">
                Support
              </h4>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="hover:text-red-600 cursor-pointer transition-colors">
                  Help Center
                </li>
                <li className="hover:text-red-600 cursor-pointer transition-colors">
                  Feedback
                </li>
                <li className="hover:text-red-600 cursor-pointer transition-colors">
                  Report a Bug
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 text-center text-xs text-gray-500 dark:text-gray-600 border-t pt-6 border-gray-300 dark:border-gray-700">
            &copy; {new Date().getFullYear()} LumiRead. Built using React and
            Tailwind CSS.
          </div>
        </div>
      </footer>
    </div>
  );
}
