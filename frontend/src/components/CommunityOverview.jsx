// src/components/CommunityOverview.jsx
import React from "react";

// Helper function to strip HTML tags and get plain text
const stripHtmlTags = (html) => {
  if (!html) return "";
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
};

// Helper function to truncate text
const truncateText = (text, maxLength = 200) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export default function CommunityOverview({
  feed = [],
  onExpand,
  showViewAll = false,
  onPostClick,
}) {
  if (!feed.length) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Community Feed
        </h3>
        <p className="text-gray-600 dark:text-gray-400">No posts yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Community Feed
      </h3>
      <ul className="space-y-4">
        {feed.map((post) => {
          const plainTextContent = stripHtmlTags(post.content);
          const displayContent = truncateText(plainTextContent, 200);

          return (
            <li
              key={post.id}
              className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              onClick={() => onPostClick && onPostClick(post.clubId)}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {post.user}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {post.time}
                </span>
              </div>
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {displayContent}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {post.action}
              </div>
            </li>
          );
        })}
      </ul>
      {showViewAll && (
        <button
          className="mt-4 w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          onClick={onExpand}
        >
          View All
        </button>
      )}
    </div>
  );
}
