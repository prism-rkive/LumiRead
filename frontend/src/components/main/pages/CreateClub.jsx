import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Users, 
  Lock, 
  Globe, 
  Image as ImageIcon, 
  FileText, 
  PlusCircle, 
  AlertCircle,
  ArrowRight
} from "lucide-react";
import Sidebar from "../../Sidebar";

const CreateClub = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name.trim()) {
      setError("Club name is required");
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      const token = user?.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/bookclub",
        { name, description, privacy, avatar },
        config
      );

      navigate(`/club/${data.data._id}`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar />

      {/* Main content - pl-20 to accommodate the floating sidebar button */}
      <div className="flex-1 flex justify-center items-start py-12 px-4 pl-20">
        <div className="w-full max-w-2xl">
          
          {/* Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
              Start a new <span className="text-red-700 dark:text-red-500">Chapter</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Create a community for your favorite genre, author, or series.
            </p>
          </div>

          <form
            className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all"
            onSubmit={handleSubmit}
          >
            {error && (
              <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 mb-6 rounded-2xl border border-red-100 dark:border-red-800 animate-shake">
                <AlertCircle size={20} />
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Details */}
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 font-bold mb-2 text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">
                    <PlusCircle size={16} className="text-red-600" /> Club Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. The Sci-Fi Collective"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 font-bold mb-2 text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">
                    <FileText size={16} className="text-red-600" /> Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What is this club about?"
                    rows="4"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all dark:text-white resize-none"
                  />
                </div>
              </div>

              {/* Right Column: Settings & Preview */}
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 font-bold mb-2 text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">
                    {privacy === "public" ? <Globe size={16} className="text-red-600" /> : <Lock size={16} className="text-red-600" />} Privacy Setting *
                  </label>
                  <select
                    value={privacy}
                    onChange={(e) => setPrivacy(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all dark:text-white appearance-none cursor-pointer"
                    required
                  >
                    <option value="public">Public (Anyone can join)</option>
                    <option value="private">Private (Invite only)</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 font-bold mb-2 text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">
                    <ImageIcon size={16} className="text-red-600" /> Avatar URL
                  </label>
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all dark:text-white"
                    placeholder="https://image-link.com/photo.jpg"
                  />
                </div>

                {/* Live Preview Card */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Preview</p>
                  <div className="flex items-center gap-3">
                    {avatar ? (
                       <img src={avatar} className="w-12 h-12 rounded-xl object-cover" alt="Preview" />
                    ) : (
                       <div className="w-12 h-12 rounded-xl bg-red-700 flex items-center justify-center text-white font-bold text-xl">
                         {name ? name[0] : "?"}
                       </div>
                    )}
                    <div>
                      <p className="text-sm font-bold dark:text-white">{name || "Club Name"}</p>
                      <p className="text-[10px] text-gray-500 uppercase">{privacy}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-10 bg-red-700 hover:bg-red-800 disabled:bg-gray-400 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-red-500/20 hover:-translate-y-1 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Community <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateClub;