// src/components/ActionButton.jsx
import React from "react";

const ActionButton = ({ icon: Icon, label, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center p-3 sm:p-4 text-sm font-semibold rounded-xl transition-all duration-200 shadow-xl
      bg-red-700 hover:bg-red-800 text-white dark:bg-red-600 dark:hover:bg-red-700 ${className}`}
  >
    {Icon && <Icon className="w-5 h-5 sm:mr-2" />}
    <span className="sm:inline">{label}</span>
  </button>
);

export default ActionButton;
