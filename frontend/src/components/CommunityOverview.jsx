// src/components/CommunityOverview.jsx (Corrected)
import React from "react";
import { User } from "lucide-react";

const CommunityOverview = ({ feed = [], onExpand }) => (
  <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-xl transition-colors">
    {" "}
    {/* Removed h-full */}   {" "}
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <User className="w-6 h-6 mr-2 text-red-700" /> Community Snap    {" "}
    </h2>
       {" "}
    <ul className="space-y-3">
           {" "}
      {feed.slice(0, 3).map((item) => (
        <li
          key={item.id}
          className="flex items-start p-3 bg-white dark:bg-gray-700 rounded-xl hover:bg-red-50 dark:hover:bg-gray-700/70 transition-colors border border-gray-200 dark:border-gray-700/50"
        >
                   {" "}
          <User className="w-5 h-5 mr-3 text-red-600 flex-shrink-0 mt-1" />     
             {" "}
          <div>
                       {" "}
            <span className="font-semibold text-gray-900 dark:text-white">
                            {item.user}           {" "}
            </span>{" "}
                       {" "}
            <span className="text-sm text-gray-700 dark:text-gray-300">
                            {item.action}           {" "}
            </span>
                       {" "}
            <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">
                            {item.time}           {" "}
            </p>
                     {" "}
          </div>
                 {" "}
        </li>
      ))}
         {" "}
    </ul>
       {" "}
    <button
      onClick={onExpand}
      className="w-full py-3 border border-red-400 text-red-700 dark:text-red-400 dark:border-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-gray-700 transition-colors font-semibold mt-6"
    >
            View Full Community Feed    {" "}
    </button>
     {" "}
  </div>
);

export default CommunityOverview;
