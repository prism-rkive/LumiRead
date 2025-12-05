// src/components/Footer.jsx
import React from "react";

const Footer = () => (
  <footer className="mt-20 p-8 bg-gray-100 dark:bg-gray-800 rounded-t-2xl shadow-xl transition-colors border-t border-gray-300 dark:border-gray-700">
    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-sm">
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
      &copy; {new Date().getFullYear()} LumiRead. Built using React and Tailwind
      CSS.
    </div>
  </footer>
);

export default Footer;
