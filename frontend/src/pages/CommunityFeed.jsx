import React, { useEffect, useState } from "react";
import { ArrowLeft, Users, Zap } from "lucide-react";
// 1. IMPORT useNavigate
import { useNavigate } from "react-router-dom";
import { getCommunityFeed } from "../services/api";

// 2. REMOVE { onBack } from the function signature
export default function CommunityFeedPage() {
  // 3. INITIALIZE the navigate hook
  const navigate = useNavigate();

  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to handle navigation back to the dashboard (root path)
  const handleBack = () => {
    navigate("/"); // Navigate to the root path
  };

  useEffect(() => {
    let mounted = true;
    getCommunityFeed()
      .then((data) => {
        if (mounted) {
          setFeed(data);
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen p-6 sm:p-10 bg-gray-50 dark:bg-gray-900 transition-colors font-sans">
      <div className="max-w-4xl mx-auto">
        <button
          // 4. Update onClick to use the handleBack function
          onClick={handleBack}
          className="flex items-center text-red-700 dark:text-red-400 font-semibold mb-8 hover:underline"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Go back to Dashboard
        </button>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 flex items-center">
          <Users className="w-8 h-8 mr-3 text-red-700" /> LumiRead Community
          Feed
        </h1>

        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow-xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Latest Activity
          </h2>
          {loading ? (
            <p className="text-gray-700 dark:text-gray-300">Loading…</p>
          ) : (
            <ul className="space-y-4">
              {feed.map((item) => (
                <li
                  key={item.id}
                  className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-start hover:shadow-md transition-shadow"
                >
                  <Zap
                    className={`w-5 h-5 mr-4 flex-shrink-0 mt-1 ${
                      item.type === "review"
                        ? "text-yellow-500"
                        : item.type === "progress"
                        ? "text-green-500"
                        : "text-blue-500"
                    }`}
                  />
                  <div>
                    <p className="text-base text-gray-700 dark:text-gray-300">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {item.user}
                      </span>{" "}
                      {item.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item.time}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6 text-center text-gray-500 dark:text-gray-400">
            <p>
              This is the complete feed. Future features: Filter by groups,
              friends, and trending topics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
