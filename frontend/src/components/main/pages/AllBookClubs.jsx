import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Search, Users, Lock, Globe, ArrowRight, BookOpen } from "lucide-react";
import Sidebar from "../../Sidebar";

const AllBookClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("currentUser"));
  const token = user?.token;

  useEffect(() => {
    if (!token) return;
    const fetchClubs = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/bookclub/all",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setClubs(data.data);
      } catch (err) {
        console.error("Failed to load clubs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, [token]);

  const handleJoin = async (clubId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/bookclub/${clubId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClubs((prev) =>
        prev.map((club) =>
          club._id === clubId
            ? { ...club, isMember: true, memberCount: club.memberCount + 1 }
            : club
        )
      );
    } catch (err) {
      console.error("Join failed", err);
    }
  };

  const handleRequest = async (clubId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/bookclub/${clubId}/request`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClubs((prev) =>
        prev.map((club) =>
          club._id === clubId ? { ...club, isInvited: true } : club
        )
      );
    } catch (err) {
      console.error("Request failed", err);
    }
  };

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
         <div className="animate-pulse flex flex-col items-center gap-4">
            <BookOpen className="w-12 h-12 text-red-600 animate-bounce" />
            <p className="text-gray-500 font-bold">Discovering communities...</p>
         </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar />

      {/* Main content - pl-20 provides space for the Sidebar toggle */}
      <div className="flex-1 p-6 md:p-10 max-w-6xl mx-auto pl-20">
        
        {/* Header Section */}
        <div className="flex flex-col mb-12">
          <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            Explore <span className="text-red-700 dark:text-red-500">Clubs</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mb-8">
            Join thousands of readers. Find a community that shares your passion for storytelling and knowledge.
          </p>

          {/* Professional Search Bar */}
          <div className="relative max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors w-5 h-5" />
            <input
              type="text"
              placeholder="Search by club name or genre..."
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all dark:text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Club Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredClubs.map((club) => {
            const canEnter = club.isMember || club.privacy === "public";

            return (
              <div
                key={club._id}
                className="group bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-red-200 dark:hover:border-red-900/30 transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    {club.avatar ? (
                      <img
                        src={club.avatar}
                        alt={club.name}
                        className="w-16 h-16 rounded-2xl object-cover ring-4 ring-gray-50 dark:ring-gray-700"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-red-500/20">
                        {club.name[0]}
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-red-700 transition-colors">
                        {club.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                         <span className="flex items-center gap-1 text-xs font-bold text-gray-400 uppercase tracking-widest">
                           <Users size={14} /> {club.memberCount} Members
                         </span>
                         <span className="text-gray-300">•</span>
                         <span className={`flex items-center gap-1 text-xs font-bold uppercase tracking-widest ${club.privacy === 'public' ? 'text-green-500' : 'text-amber-500'}`}>
                           {club.privacy === "public" ? <Globe size={14} /> : <Lock size={14} />} {club.privacy}
                         </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer of Card */}
                <div className="flex items-center justify-between mt-4">
                  {canEnter ? (
                    <Link
                      to={`/club/${club._id}`}
                      className="flex items-center gap-2 text-sm font-bold text-red-700 dark:text-red-400 hover:underline"
                    >
                      Visit Club <ArrowRight size={16} />
                    </Link>
                  ) : (
                    <span className="text-xs font-medium text-gray-400 italic">Join to see discussions</span>
                  )}

                  {!club.isMember && (
                    <button
                      onClick={() => (club.privacy === "public" ? handleJoin(club._id) : handleRequest(club._id))}
                      disabled={club.isInvited}
                      className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
                        club.isInvited
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                          : "bg-red-700 hover:bg-red-800 text-white shadow-red-500/20 hover:-translate-y-0.5"
                      }`}
                    >
                      {club.privacy === "public" ? "Join Now" : club.isInvited ? "Requested" : "Request Access"}
                    </button>
                  )}
                  {club.isMember && (
                    <span className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl text-xs font-black uppercase">
                        Member
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredClubs.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
               <Search className="text-gray-400 w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">No clubs found</h3>
            <p className="text-gray-500">Try searching for a different name or keyword.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBookClubs;