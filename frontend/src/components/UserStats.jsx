// src/components/UserStats.jsx
import React from "react";
import StatBox from "./StatBox";

const UserStats = ({ stats = { year: 12, completed: 0, pagesRead: 0 } }) => (
  <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-xl transition-colors">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Reading Stats
    </h2>
    <div className="grid grid-cols-1 gap-4 text-center">
      {" "}
      {/* Changed to grid-cols-1 for vertical alignment */}
      <StatBox
        value={stats.completed}
        label={`${stats.year} of Goal`}
        valueClassName="text-red-500 dark:text-red-400" // Example: Muted red for value
        labelClassName="text-gray-600 dark:text-gray-400" // Muted white for label
        containerClassName="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-sm" // Better contrast for container
      />
      <StatBox
        value={(stats.pagesRead || 0).toLocaleString()}
        label="Total Pages Read"
        valueClassName="text-red-500 dark:text-red-400"
        labelClassName="text-gray-600 dark:text-gray-400"
        containerClassName="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-sm"
      />
      <StatBox
        value={`${Math.round(
          ((stats.completed || 0) / (stats.year || 1)) * 100
        )}%`}
        label="Goal Progress"
        valueClassName="text-red-500 dark:text-red-400"
        labelClassName="text-gray-600 dark:text-gray-400"
        containerClassName="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-sm"
      />
    </div>
  </div>
);

export default UserStats;
