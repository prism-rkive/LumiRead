import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Users, Bookmark, ChevronRight, LayoutGrid, BookOpen } from "lucide-react";
import Sidebar from "../../Sidebar";

const MyBookClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyClubs = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        const token = user?.token;

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.get(
          "http://localhost:5000/api/bookclub/my-clubs",
          config
        );

        setClubs(data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load clubs");
      } finally {
        setLoading(false);
      }
    };

    fetchMyClubs();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
         <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-red-200 border-t-red-700 rounded-full animate-spin"></div>
            <p className="text-gray-500 font-bold tracking-tight">Syncing your clubs...</p>
         </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 p-6">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-2xl border border-red-100 dark:border-red-800 font-semibold">
          {error}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main content - pl-20 provides space for the Sidebar toggle button */}
      <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto pl-20">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              My <span className="text-red-700 dark:text-red-500">Clubs</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
              Manage and browse the communities you are part of.
            </p>
          </div>
          <div className="hidden sm:flex bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
             <LayoutGrid className="text-red-700 w-6 h-6" />
          </div>
        </div>

        {/* Empty State */}
        {clubs.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center border border-dashed border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="bg-red-50 dark:bg-red-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
               <Bookmark className="text-red-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">No clubs yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto">
              You haven't joined any book clubs. Start your journey by exploring public communities.
            </p>
            <Link 
              to="/clubs" 
              className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-red-500/20"
            >
              Browse All Clubs <ChevronRight size={18} />
            </Link>
          </div>
        )}

        {/* Club List Grid */}
        <div className="grid grid-cols-1 gap-4">
          {clubs.map((club) => (
            <Link
              to={`/club/${club._id}`}
              key={club._id}
              className="group flex items-center justify-between p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-red-200 dark:hover:border-red-900/30 transition-all"
            >
              <div className="flex items-center gap-5">
                {/* Avatar / Icon */}
                <div className="relative">
                  {club.avatar ? (
                    <img
                      src={club.avatar}
                      alt={club.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-gray-50 dark:ring-gray-700 group-hover:ring-red-100 transition-all"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-500/10">
                      {club.name[0]}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>

                {/* Club Info */}
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white text-xl group-hover:text-red-700 transition-colors">
                    {club.name}
                  </h2>
                  <div className="flex items-center gap-4 mt-1 text-sm font-semibold text-gray-400">
                    <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                      <Users size={14} className="text-red-600" /> {club.memberCount} members
                    </span>
                    <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                      <BookOpen size={14} className="text-red-600" /> Active Now
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Indicator */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl group-hover:bg-red-700 group-hover:text-white transition-all">
                <ChevronRight size={20} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookClubs;