// src/components/ReadingOverview.jsx (Corrected)
import React from "react";

const ReadingOverview = ({ books = [] }) => (
  <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-xl transition-colors">
    {" "}
    {/* Removed h-full */}   {" "}
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            Currently Reading       {/*  */}   {" "}
    </h2>
       {" "}
    {books.filter((b) => b.progress < 100).length === 0 ? (
      <p className="text-gray-500 dark:text-gray-400">
                Time to add a new book! Your shelves are waiting.      {" "}
      </p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {" "}
        {books
          .filter((b) => b.progress < 100)
          .map((book) => (
            <div
              key={book.id}
              className="p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-shadow"
            >
                           {" "}
              <div className="flex items-center mb-3">
                               {" "}
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-12 h-16 object-cover rounded-md mr-4 shadow-md"
                />
                               {" "}
                <div>
                                   {" "}
                  <h3 className="font-semibold text-gray-800 dark:text-white truncate">
                                        {book.title}                 {" "}
                  </h3>
                                   {" "}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {book.author}                 {" "}
                  </p>
                                 {" "}
                </div>
                             {" "}
              </div>
                           {" "}
              <div className="mt-2">
                               {" "}
                <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2.5">
                                   {" "}
                  <div
                    className="bg-red-600 h-2.5 rounded-full"
                    style={{ width: `${book.progress}%` }}
                  />
                                 {" "}
                </div>
                               {" "}
                <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
                                    {book.progress}% Completed                {" "}
                </p>
                             {" "}
              </div>
                         {" "}
            </div>
          ))}
             {" "}
      </div>
    )}
     {" "}
  </div>
);

export default ReadingOverview;
