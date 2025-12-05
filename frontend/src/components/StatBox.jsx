// src/components/StatBox.jsx
import React from "react";

const StatBox = ({
  value,
  label,
  valueClassName = "text-red-700 dark:text-red-400",
  labelClassName = "text-gray-500 dark:text-gray-400",
  containerClassName = "p-4 rounded-lg bg-white dark:bg-gray-700",
}) => {
  return (
    <div className={`p-4 rounded-xl shadow-md ${containerClassName}`}>
      <p className={`text-3xl font-bold mb-1 ${valueClassName}`}>{value}</p>
      <p className={`text-sm ${labelClassName}`}>{label}</p>
    </div>
  );
};

export default StatBox;
